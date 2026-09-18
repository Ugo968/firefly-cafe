import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const allowed = ['status'];
    const data: Record<string, string> = {};
    for (const k of allowed) if (k in body) data[k] = String(body[k]);
    if (!Object.keys(data).length) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    const booking = await db.booking.update({ where: { id }, data });
    return NextResponse.json(booking);
  } catch (e) {
    console.error('PATCH /api/bookings/[id] failed', e);
    return NextResponse.json({ error: 'Could not update booking' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.booking.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /api/bookings/[id] failed', e);
    return NextResponse.json({ error: 'Could not delete booking' }, { status: 500 });
  }
}
