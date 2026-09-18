import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  try {
    const bookings = await db.booking.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(bookings);
  } catch (e) {
    console.error('GET /api/bookings failed', e);
    return NextResponse.json({ error: 'Could not load bookings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const errors: string[] = [];
    if (!body.name || String(body.name).trim().length < 2) errors.push('Please tell us your name.');
    if (!body.phone || String(body.phone).replace(/\D/g, '').length < 7) errors.push('A reachable phone number is required.');
    if (body.email && !EMAIL_RE.test(body.email)) errors.push('That email address does not look right.');
    if (!body.date) errors.push('Please choose a date.');
    if (!body.time) errors.push('Please choose a time.');
    const size = Number(body.partySize);
    if (!Number.isInteger(size) || size < 1 || size > 40) errors.push('Party size must be between 1 and 40.');

    // Date must not be in the past (compare date-only)
    if (body.date) {
      const chosen = new Date(`${body.date}T23:59:59`);
      if (Number.isNaN(chosen.getTime()) || chosen < new Date()) errors.push('Please choose a date from today onwards.');
    }

    if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 });

    const booking = await db.booking.create({
      data: {
        name: String(body.name).trim(),
        phone: String(body.phone).trim(),
        email: body.email ? String(body.email).trim() : '',
        date: String(body.date),
        time: String(body.time),
        partySize: size,
        occasion: body.occasion ? String(body.occasion) : 'casual',
        notes: body.notes ? String(body.notes).slice(0, 500) : '',
      },
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (e) {
    console.error('POST /api/bookings failed', e);
    return NextResponse.json({ error: 'Could not place your reservation. Please try again.' }, { status: 500 });
  }
}
