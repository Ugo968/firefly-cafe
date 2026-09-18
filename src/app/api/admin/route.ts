import { NextRequest, NextResponse } from 'next/server';

// Lightweight shared-passcode gate for the staff dashboard demo.
const PASSCODE = process.env.ADMIN_PASSCODE || 'firefly2026';

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();
    if (String(passcode) === PASSCODE) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: 'Incorrect passcode.' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
