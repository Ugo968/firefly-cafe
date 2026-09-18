import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [items, photos] = await Promise.all([
      db.menuItem.findMany({
        orderBy: [{ sortOrder: 'asc' }],
      }),
      db.menuItemPhoto.findMany({ select: { id: true, itemId: true } }),
    ]);
    // Admin-uploaded photos take precedence over the seeded house image.
    const override = new Map(photos.map((p) => [p.itemId, `/api/menu-media/${p.id}`]));
    return NextResponse.json(
      items.map((it) => ({ ...it, image: override.get(it.id) ?? it.image })),
    );
  } catch (e) {
    console.error('GET /api/menu failed', e);
    return NextResponse.json({ error: 'Could not load menu' }, { status: 500 });
  }
}
