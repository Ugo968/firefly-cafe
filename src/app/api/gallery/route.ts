import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import sharp from 'sharp';

const PASSCODE = process.env.ADMIN_PASSCODE || 'firefly2026';
const TABS = ['room', 'kitchen', 'bar', 'moments', 'celebrate'];
const MAX_BYTES = 5 * 1024 * 1024; // 5MB upload cap
const MAX_EDGE = 2000; // longest edge after server-side processing

const PUBLIC_FIELDS = {
  id: true, tab: true, caption: true, alt: true,
  mime: true, width: true, height: true, size: true, createdAt: true,
};

function authed(req: NextRequest) {
  return (req.headers.get('x-admin-passcode') || '') === PASSCODE;
}

export async function GET() {
  try {
    const images = await db.galleryImage.findMany({
      orderBy: { createdAt: 'desc' },
      select: PUBLIC_FIELDS,
    });
    return NextResponse.json(images);
  } catch (e) {
    console.error('GET /api/gallery failed', e);
    return NextResponse.json({ error: 'Could not load gallery uploads' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!authed(req)) {
    return NextResponse.json({ error: 'Unauthorized — passcode required.' }, { status: 401 });
  }
  try {
    const form = await req.formData();
    const file = form.get('photo');
    const tab = String(form.get('tab') || 'moments');
    const caption = String(form.get('caption') || '').slice(0, 120);
    const alt = String(form.get('alt') || caption).slice(0, 200);
    const width = parseInt(String(form.get('width') || '0'), 10) || 0;
    const height = parseInt(String(form.get('height') || '0'), 10) || 0;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No photo attached.' }, { status: 400 });
    }
    if (!TABS.includes(tab)) {
      return NextResponse.json({ error: 'Unknown gallery collection.' }, { status: 400 });
    }
    if (!file.type.startsWith('image/') || file.type === 'image/gif') {
      return NextResponse.json({ error: 'Only JPG, PNG or WebP images are accepted.' }, { status: 415 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Photo is too large — 5MB maximum.' }, { status: 413 });
    }

    // Process server-side so owner uploads from any phone look right:
    // honour EXIF rotation, cap the longest edge, compress, strip metadata.
    let data = new Uint8Array(await file.arrayBuffer());
    let mime = file.type;
    let w = width;
    let h = height;
    try {
      const out = await sharp(Buffer.from(data))
        .rotate() // auto-orient from EXIF, then drop the rotation tag
        .flatten({ background: '#1C1410' }) // JPEG has no alpha — flatten onto espresso
        .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true, mozjpeg: true })
        .toBuffer({ resolveWithObject: true });
      data = new Uint8Array(out.data);
      mime = 'image/jpeg';
      w = out.info.width;
      h = out.info.height;
    } catch {
      // If sharp cannot decode the file, keep the original bytes untouched.
    }

    const created = await db.galleryImage.create({
      data: {
        tab,
        caption: caption || 'From the café',
        alt: alt || 'Firefly Café — guest photo',
        mime,
        width: w,
        height: h,
        size: data.byteLength,
        data,
      },
      select: PUBLIC_FIELDS,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error('POST /api/gallery failed', e);
    return NextResponse.json({ error: 'Upload failed — please try again.' }, { status: 500 });
  }
}
