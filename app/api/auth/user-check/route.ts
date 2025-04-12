import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_USER_CHECK_FUNCTION_URL!, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('❌ Proxy API error:', err);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}
