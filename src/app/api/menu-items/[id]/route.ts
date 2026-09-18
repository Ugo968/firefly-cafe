import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const PASSCODE = process.env.ADMIN_PASSCODE || 'firefly2026';
const MAX_PRICE = 100_000_000;

function authed(req: NextRequest) {
  return (req.headers.get('x-admin-passcode') || '') === PASSCODE;
}

// PATCH /api/menu-items/[id] — admin menu management.
// Body: { price?: number, available?: boolean } — at least one field required.
// `price` is what the menu charges; `basePrice` (the seeded house price) is
// never touched here, so "restore house price" is always possible.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!authed(req)) {
    return NextResponse.json({ error: 'Unauthorized — passcode required.' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const item = await db.menuItem.findUnique({ where: { id }, select: { id: true } });
    if (!item) {
      return NextResponse.json({ error: 'Menu item not found.' }, { status: 404 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Send a JSON body with price and/or available.' }, { status: 400 });
    }

    const data: { price?: number; available?: boolean } = {};

    if (body.price !== undefined) {
      const price = Number(body.price);
      if (!Number.isFinite(price) || price < 0 || price > MAX_PRICE) {
        return NextResponse.json(
          { error: 'Price must be a number between 0 and 100,000,000.' },
          { status: 400 },
        );
      }
      data.price = Math.round(price);
    }

    if (body.available !== undefined) {
      if (typeof body.available !== 'boolean') {
        return NextResponse.json({ error: 'available must be true or false.' }, { status: 400 });
      }
      data.available = body.available;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Nothing to update — send price and/or available.' }, { status: 400 });
    }

    const updated = await db.menuItem.update({
      where: { id },
      data,
      select: {
        id: true, name: true, category: true,
        price: true, basePrice: true, available: true, image: true,
      },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error('PATCH /api/menu-items/[id] failed', e);
    return NextResponse.json({ error: 'Could not update the menu item.' }, { status: 500 });
  }
}
