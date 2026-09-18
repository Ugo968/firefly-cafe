import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    if (!body.status || !['pending', 'confirmed', 'declined'].includes(String(body.status))) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    const cel = await db.celebration.update({ where: { id }, data: { status: String(body.status) } });
    return NextResponse.json(cel);
  } catch (e) {
    console.error('PATCH /api/celebrations/[id] failed', e);
    return NextResponse.json({ error: 'Could not update celebration' }, { status: 500 });
  }
}
