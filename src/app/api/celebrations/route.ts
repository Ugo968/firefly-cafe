import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const PHONE_RE = /^\+?[\d\s-]{7,18}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OCCASIONS = ['birthday', 'proposal', 'anniversary', 'private-gathering', 'other'];
const ADDONS = ['cake', 'decor', 'photography', 'custom-menu', 'surprise-setup'];

export async function GET() {
  try {
    const cels = await db.celebration.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(cels);
  } catch (e) {
    console.error('GET /api/celebrations failed', e);
    return NextResponse.json({ error: 'Could not load celebrations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const errors: string[] = [];
    if (!body.name || String(body.name).trim().length < 2) errors.push('Please tell us your name.');
    if (!body.phone || !PHONE_RE.test(String(body.phone))) errors.push('A reachable phone number is required.');
    if (body.email && !EMAIL_RE.test(body.email)) errors.push('That email address does not look right.');
    if (!body.date) errors.push('Please choose a date.');
    if (!body.time) errors.push('Please choose a time.');
    if (!OCCASIONS.includes(String(body.occasion))) errors.push('Please tell us the occasion.');
    const guests = Number(body.guestCount);
    if (!Number.isInteger(guests) || guests < 2 || guests > 120) errors.push('Guest count must be between 2 and 120.');
    const addOns = Array.isArray(body.addOns) ? body.addOns.filter((a: string) => ADDONS.includes(a)) : [];
    if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 });

    const cel = await db.celebration.create({
      data: {
        name: String(body.name).trim(),
        phone: String(body.phone).trim(),
        email: body.email ? String(body.email).trim() : '',
        date: String(body.date),
        time: String(body.time),
        occasion: String(body.occasion),
        guestCount: guests,
        addOns: addOns.join(','),
        notes: body.notes ? String(body.notes).slice(0, 600) : '',
      },
    });
    return NextResponse.json(cel, { status: 201 });
  } catch (e) {
    console.error('POST /api/celebrations failed', e);
    return NextResponse.json({ error: 'Could not send your request. Please try again.' }, { status: 500 });
  }
}
