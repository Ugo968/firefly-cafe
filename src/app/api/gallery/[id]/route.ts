import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const PASSCODE = process.env.ADMIN_PASSCODE || 'firefly2026';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if ((req.headers.get('x-admin-passcode') || '') !== PASSCODE) {
    return NextResponse.json({ error: 'Unauthorized — passcode required.' }, { status: 401 });
  }
  try {
    const { id } = await params;
    await db.galleryImage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /api/gallery/[id] failed', e);
    return NextResponse.json({ error: 'Could not delete photo' }, { status: 500 });
  }
}
