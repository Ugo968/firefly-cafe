import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Serves uploaded gallery photos straight from the database, so they
// survive rebuilds and work identically in dev and production.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const image = await db.galleryImage.findUnique({
      where: { id },
      select: { mime: true, data: true },
    });
    if (!image) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }
    return new NextResponse(new Uint8Array(image.data), {
      headers: {
        'Content-Type': image.mime,
        'Content-Length': String(image.data.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e) {
    console.error('GET /api/gallery-media/[id] failed', e);
    return NextResponse.json({ error: 'Could not serve photo' }, { status: 500 });
  }
}
