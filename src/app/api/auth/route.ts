import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const correctPassword = process.env.PASSWORD;

    if (!correctPassword) {
      return NextResponse.json(
        { error: 'Password not configured' },
        { status: 500 }
      );
    }

    const isValid = password === correctPassword;

    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error('Auth Error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
