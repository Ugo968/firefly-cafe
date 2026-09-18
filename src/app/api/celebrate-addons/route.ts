import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CELEBRATION_ADDONS } from '@/lib/firefly-data';

const PASSCODE = process.env.ADMIN_PASSCODE || 'firefly2026';
const MAX_PRICE = 100_000_000;

// Static house config + live admin overrides, merged into one public list.
async function merged() {
  const rows = await db.addonPrice.findMany();
  const byId = new Map(rows.map((r) => [r.addonId, r.price]));
  return CELEBRATION_ADDONS.map((a) => ({
    id: a.id,
    label: a.label,
    unit: a.unit ?? null,
    hint: a.hint ?? null,
    price: a.price !== undefined ? (byId.get(a.id) ?? a.price) : null,
  }));
}

function authed(req: NextRequest) {
  return (req.headers.get('x-admin-passcode') || '') === PASSCODE;
}

export async function GET() {
  try {
    return NextResponse.json(await merged());
  } catch (e) {
    console.error('GET /api/celebrate-addons failed', e);
    return NextResponse.json({ error: 'Could not load add-ons' }, { status: 500 });
  }
}

// Body: { prices: { [addonId]: number } } — only priced add-ons accepted.
export async function PATCH(req: NextRequest) {
  if (!authed(req)) {
    return NextResponse.json({ error: 'Unauthorized — passcode required.' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const incoming: Record<string, unknown> = body?.prices ?? {};
    const valid = new Map(
      CELEBRATION_ADDONS.filter((a) => a.price !== undefined).map((a) => [a.id, true]),
    );
    const updates: { addonId: string; price: number }[] = [];
    for (const [id, raw] of Object.entries(incoming)) {
      if (!valid.has(id)) {
        return NextResponse.json({ error: `Unknown add-on: ${id}` }, { status: 400 });
      }
      const price = Number(raw);
      if (!Number.isFinite(price) || price < 0 || price > MAX_PRICE) {
        return NextResponse.json({ error: `Invalid price for ${id}.` }, { status: 400 });
      }
      updates.push({ addonId: id, price: Math.round(price) });
    }
    await db.$transaction(
      updates.map((u) =>
        db.addonPrice.upsert({
          where: { addonId: u.addonId },
          create: u,
          update: { price: u.price },
        }),
      ),
    );
    return NextResponse.json(await merged());
  } catch (e) {
    console.error('PATCH /api/celebrate-addons failed', e);
    return NextResponse.json({ error: 'Could not save prices' }, { status: 500 });
  }
}

// ?id=<addonId> clears one override; no id clears all (back to house prices).
export async function DELETE(req: NextRequest) {
  if (!authed(req)) {
    return NextResponse.json({ error: 'Unauthorized — passcode required.' }, { status: 401 });
  }
  try {
    const id = req.nextUrl.searchParams.get('id');
    await db.addonPrice.deleteMany({ where: id ? { addonId: id } : {} });
    return NextResponse.json(await merged());
  } catch (e) {
    console.error('DELETE /api/celebrate-addons failed', e);
    return NextResponse.json({ error: 'Could not restore prices' }, { status: 500 });
  }
}
