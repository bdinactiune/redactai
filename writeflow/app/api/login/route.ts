import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = 'my-secret-key-123';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const token = jwt.sign({ email }, SECRET, { expiresIn: '7d' });
    return NextResponse.json({ token, user: { email } });
  } catch (error) {
    return NextResponse.json({ error: 'Eroare la login' }, { status: 500 });
  }
}