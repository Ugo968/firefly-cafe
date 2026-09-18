import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { computeDeliveryFee, getZone, FREE_DELIVERY_THRESHOLD } from '@/lib/delivery-zones';

const PHONE_RE = /^\+?[\d\s-]{7,18}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function makeRef() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `FF-${s}`;
}

export function makePaymentRef() {
  return `PAY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export async function GET() {
  try {
    const orders = await db.order.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(orders);
  } catch (e) {
    console.error('GET /api/orders failed', e);
    return NextResponse.json({ error: 'Could not load orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const errors: string[] = [];
    if (!body.name || String(body.name).trim().length < 2) errors.push('Please tell us your name.');
    if (!body.phone || !PHONE_RE.test(String(body.phone))) errors.push('A reachable phone number is required.');
    if (body.email && !EMAIL_RE.test(body.email)) errors.push('That email address does not look right.');
    const fulfil = body.fulfil === 'delivery' ? 'delivery' : 'pickup';
    const items = Array.isArray(body.items) ? body.items : null;
    if (!items || items.length === 0) errors.push('Your cart is empty.');

    /* ---- delivery fields: zone is mandatory and must exist in our coverage ---- */
    let zone = undefined as ReturnType<typeof getZone>;
    let detail = '';
    let landmark = '';
    if (fulfil === 'delivery') {
      zone = getZone(String(body.zoneId || ''));
      if (!zone) errors.push('Please choose a delivery area — we cover all of Awka, UNIZIK campus terminals, hostels and the surrounding axis.');
      detail = String(body.address || '').trim();
      landmark = String(body.landmark || '').trim();
      if (detail.length < 5) errors.push('Please describe exactly where the rider should bring your order (block, room, street or floor).');
    }
    if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 });

    // Validate items and price server-side against the DB menu
    const menu = await db.menuItem.findMany();
    const menuById = new Map(menu.map((m) => [m.id, m]));
    let subtotal = 0;
    const clean = [];
    for (const line of items) {
      const m = menuById.get(String(line.id));
      if (!m || !m.available) { errors.push('One of the items in your cart is no longer available.'); continue; }
      const qty = Math.max(1, Math.min(30, Number(line.qty) || 1));
      subtotal += m.price * qty;
      clean.push({ id: m.id, name: m.name, price: m.price, qty });
    }
    if (errors.length || !clean.length) return NextResponse.json({ error: errors.join(' ') || 'Cart is empty.' }, { status: 400 });

    /* ---- payment method & fee (server-computed only) ---- */
    const method = ['card', 'transfer', 'cash'].includes(String(body.payment)) ? String(body.payment) : 'card';
    const { fee, zone: z } = computeDeliveryFee(String(body.zoneId || ''), subtotal);
    const deliveryFee = fulfil === 'delivery' ? fee : 0;
    const total = subtotal + deliveryFee;

    const paymentStatus = method === 'cash' ? 'on_delivery' : 'pending';
    const paymentRef = method === 'cash' ? '' : makePaymentRef();

    const fullAddress = fulfil === 'delivery' && z
      ? `${z.name}${detail ? ` — ${detail}` : ''}${landmark ? ` (near ${landmark})` : ''}`
      : '';

    const order = await db.order.create({
      data: {
        ref: makeRef(),
        name: String(body.name).trim(),
        phone: String(body.phone).trim(),
        fulfil,
        address: fullAddress,
        zoneId: fulfil === 'delivery' ? z!.id : '',
        zone: fulfil === 'delivery' ? z!.name : '',
        landmark,
        items: JSON.stringify(clean),
        subtotal,
        fee: deliveryFee,
        total,
        payment: method,
        paymentStatus,
        paymentRef,
        status: 'received',
      },
    });

    /* ---- payment intent ledger: settlement destination deliberately PENDING ---- */
    let payment = null;
    if (method !== 'cash') {
      payment = await db.payment.create({
        data: {
          orderId: order.id,
          ref: paymentRef,
          provider: 'firefly-pay/sandbox',
          method,
          amount: total,
          status: 'initialized',
          settlement: 'PENDING — merchant account not configured',
          note: `Funds held in pending state until the café's settlement account is set up. ${subtotal >= FREE_DELIVERY_THRESHOLD && fulfil === 'delivery' ? 'Free delivery applied.' : ''}`.trim(),
        },
      });
    }

    return NextResponse.json({ ...order, payment }, { status: 201 });
  } catch (e) {
    console.error('POST /api/orders failed', e);
    return NextResponse.json({ error: 'Could not place your order. Please try again.' }, { status: 500 });
  }
}
