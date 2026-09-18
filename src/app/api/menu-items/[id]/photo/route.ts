import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import sharp from 'sharp';

const PASSCODE = process.env.ADMIN_PASSCODE || 'firefly2026';
const MAX_BYTES = 5 * 1024 * 1024; // 5MB upload cap
const MAX_EDGE = 1600; // menu photos display small — no need for anything larger

function authed(req: NextRequest) {
  return (req.headers.get('x-admin-passcode') || '') === PASSCODE;
}

// Upload/replace the photo attached to a menu item. The house (seeded) image
// is never touched — an uploaded photo simply takes display precedence.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!authed(req)) {
    return NextResponse.json({ error: 'Unauthorized — passcode required.' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const item = await db.menuItem.findUnique({ where: { id }, select: { id: true } });
    if (!item) {
      return NextResponse.json({ error: 'Menu item not found.' }, { status: 404 });
    }

    const form = await req.formData();
    const file = form.get('photo');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No photo attached.' }, { status: 400 });
    }
    if (!file.type.startsWith('image/') || file.type === 'image/gif') {
      return NextResponse.json({ error: 'Only JPG, PNG or WebP images are accepted.' }, { status: 415 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Photo is too large — 5MB maximum.' }, { status: 413 });
    }

    // Same treatment as gallery uploads: honour EXIF rotation, cap the edge,
    // compress, strip metadata (incl. GPS) before storing.
    let data = new Uint8Array(await file.arrayBuffer());
    let mime = file.type;
    let size = data.byteLength;
    try {
      const out = await sharp(Buffer.from(data))
        .rotate()
        .flatten({ background: '#1C1410' })
        .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true, mozjpeg: true })
        .toBuffer();
      data = new Uint8Array(out);
      mime = 'image/jpeg';
      size = out.byteLength;
    } catch {
      // Undecodable file — keep original bytes.
    }

    const photo = await db.menuItemPhoto.upsert({
      where: { itemId: id },
      create: { itemId: id, mime, size, data },
      update: { mime, size, data },
      select: { id: true },
    });
    return NextResponse.json({ ok: true, photoId: photo.id, image: `/api/menu-media/${photo.id}` }, { status: 201 });
  } catch (e) {
    console.error('POST /api/menu-items/[id]/photo failed', e);
    return NextResponse.json({ error: 'Upload failed — please try again.' }, { status: 500 });
  }
}

// Remove the uploaded photo — the item falls back to its house image.
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!authed(req)) {
    return NextResponse.json({ error: 'Unauthorized — passcode required.' }, { status: 401 });
  }
  try {
    const { id } = await params;
    await db.menuItemPhoto.deleteMany({ where: { itemId: id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /api/menu-items/[id]/photo failed', e);
    return NextResponse.json({ error: 'Could not remove photo' }, { status: 500 });
  }
}
