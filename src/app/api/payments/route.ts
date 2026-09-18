/**
 * Firefly Café — payment gateway layer.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ SETTLEMENT DESTINATION IS DELIBERATELY PENDING.                          │
 * │ Until the café's merchant account is finalised, every transaction is     │
 * │ recorded in the Payment ledger with settlement = "PENDING — merchant     │
 * │ account not configured". No funds are released anywhere.                 │
 * │                                                                          │
 * │ TO GO LIVE LATER:                                                        │
 * │   1. Set PAYMENT_PROVIDER=paystack (or flutterwave) in .env              │
 * │   2. Set PAYSTACK_SECRET_KEY / FLW_SECRET_KEY accordingly                │
 * │   3. Set SETTLEMENT_ACCOUNT="Firefly Café · 0123456789 · Zenith Bank"    │
 * │   4. Replace the sandbox confirm step with the provider's                │
 * │      transaction/verify + webhook call. The Order.paymentRef and         │
 * │      Payment ledger fields below already match what both providers       │
 * │      return (reference, amount, status), so nothing else moves.          │
 * └─────────────────────────────────────────────────────────────────────────┘
 */
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const PAYMENT_PROVIDER = process.env.PAYMENT_PROVIDER || 'sandbox';
export const SETTLEMENT_ACCOUNT = process.env.SETTLEMENT_ACCOUNT || 'PENDING — merchant account not configured';

async function orderById(id: string) {
  return db.order.findUnique({ where: { id }, include: { payments: true } });
}

/** POST /api/payments — initialize a gateway transaction for an order. */
export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    const order = await orderById(String(orderId || ''));
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (order.payment === 'cash') {
      return NextResponse.json({ error: 'This order is set to pay on delivery — no gateway transaction needed.' }, { status: 400 });
    }
    if (order.paymentStatus === 'paid') {
      return NextResponse.json({ error: 'This order is already paid.' }, { status: 400 });
    }

    let payment = order.payments.find((p) => p.ref === order.paymentRef);
    if (!payment) {
      payment = await db.payment.create({
        data: {
          orderId: order.id,
          ref: order.paymentRef || `PAY-${Date.now().toString(36).toUpperCase()}`,
          provider: `firefly-pay/${PAYMENT_PROVIDER}`,
          method: order.payment,
          amount: order.total,
          status: 'initialized',
          settlement: SETTLEMENT_ACCOUNT,
          note: 'Funds held in pending state until settlement account is configured.',
        },
      });
      await db.order.update({ where: { id: order.id }, data: { paymentRef: payment.ref } });
    }

    return NextResponse.json({
      paymentRef: payment.ref,
      provider: payment.provider,
      method: payment.method,
      amount: payment.amount,
      status: payment.status,
      settlement: payment.settlement,
      // In live mode this is the provider checkout URL (Paystack authorization_url etc.)
      checkoutUrl: null,
      message: 'Sandbox gateway — transaction initialized, awaiting customer confirmation.',
    });
  } catch (e) {
    console.error('POST /api/payments failed', e);
    return NextResponse.json({ error: 'Could not initialize payment. Please try again.' }, { status: 500 });
  }
}

/** PATCH /api/payments — gateway callback (sandbox: customer confirms in-sheet). */
export async function PATCH(req: NextRequest) {
  try {
    const { paymentRef, outcome } = await req.json();
    const payment = await db.payment.findUnique({ where: { ref: String(paymentRef || '') } });
    if (!payment) return NextResponse.json({ error: 'Payment reference not found' }, { status: 404 });

    if (outcome === 'failed') {
      const [updatedPayment, order] = await Promise.all([
        db.payment.update({ where: { ref: payment.ref }, data: { status: 'failed', note: 'Transaction not completed — customer cancelled in the gateway sheet.' } }),
        db.order.update({ where: { id: payment.orderId }, data: { paymentStatus: 'pending' } }),
      ]);
      return NextResponse.json({ payment: updatedPayment, order });
    }

    // success — record funds as received into the pending pool
    const [updatedPayment, order] = await Promise.all([
      db.payment.update({
        where: { ref: payment.ref },
        data: {
          status: 'paid',
          settlement: SETTLEMENT_ACCOUNT,
          note: `Paid via ${payment.method === 'card' ? 'card' : 'bank transfer'} (sandbox). Funds recorded; release awaits settlement account.`,
        },
      }),
      db.order.update({ where: { id: payment.orderId }, data: { paymentStatus: 'paid' } }),
    ]);
    return NextResponse.json({ payment: updatedPayment, order });
  } catch (e) {
    console.error('PATCH /api/payments failed', e);
    return NextResponse.json({ error: 'Could not confirm payment. Please try again.' }, { status: 500 });
  }
}

/** GET /api/payments?ref=PAY-XXX — verify a transaction (webhook-safe). */
export async function GET(req: NextRequest) {
  try {
    const ref = req.nextUrl.searchParams.get('ref') || '';
    const payment = await db.payment.findUnique({ where: { ref } });
    if (!payment) return NextResponse.json({ error: 'Payment reference not found' }, { status: 404 });
    return NextResponse.json(payment);
  } catch (e) {
    console.error('GET /api/payments failed', e);
    return NextResponse.json({ error: 'Could not verify payment' }, { status: 500 });
  }
}
