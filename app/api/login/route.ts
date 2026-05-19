import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email invalid' }, { status: 400 });
    }

    const secret = process.env.JWT_SECRET || 'fallback-dev-secret-change-in-prod';
    const token = jwt.sign({ email }, secret, { expiresIn: '30d' });

    return NextResponse.json({ token, user: { email } });
  } catch (error) {
    return NextResponse.json({ error: 'Eroare la login' }, { status: 500 });
  }
}