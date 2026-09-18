import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Serves admin-uploaded menu item photos straight from the database, so they
// survive rebuilds and work identically in dev and production.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const photo = await db.menuItemPhoto.findUnique({
      where: { id },
      select: { mime: true, data: true },
    });
    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }
    return new NextResponse(new Uint8Array(photo.data), {
      headers: {
        'Content-Type': photo.mime,
        'Content-Length': String(photo.data.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e) {
    console.error('GET /api/menu-media/[id] failed', e);
    return NextResponse.json({ error: 'Could not serve photo' }, { status: 500 });
  }
}
