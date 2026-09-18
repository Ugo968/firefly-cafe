import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const PICKUP_FLOW = ['received', 'preparing', 'ready', 'completed'];
const DELIVERY_FLOW = ['received', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
const PAYMENT_STATUSES = ['pending', 'paid', 'on_delivery', 'cancelled'];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const order = await db.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const flow = order.fulfil === 'delivery' ? DELIVERY_FLOW : PICKUP_FLOW;
    const data: { status?: string; paymentStatus?: string } = {};

    if (body.status !== undefined) {
      if (!flow.includes(String(body.status))) {
        return NextResponse.json({ error: `Invalid status for a ${order.fulfil} order` }, { status: 400 });
      }
      data.status = String(body.status);
    }
    if (body.paymentStatus !== undefined) {
      if (!PAYMENT_STATUSES.includes(String(body.paymentStatus))) {
        return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 });
      }
      data.paymentStatus = String(body.paymentStatus);
      // keep the payment ledger in sync when staff confirms funds in hand
      if (String(body.paymentStatus) === 'paid' && order.paymentRef) {
        await db.payment.updateMany({
          where: { orderId: order.id, ref: order.paymentRef },
          data: { status: 'paid', note: 'Funds confirmed by staff. Settlement still PENDING — merchant account not configured.' },
        });
      }
    }
    if (!Object.keys(data).length) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }
    const updated = await db.order.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (e) {
    console.error('PATCH /api/orders/[id] failed', e);
    return NextResponse.json({ error: 'Could not update order' }, { status: 500 });
  }
}
