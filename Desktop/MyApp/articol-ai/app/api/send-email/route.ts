import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, topic, content } = await request.json();

    // Momentan doar simulăm trimiterea
    console.log(`Trimitere email catre: ${email}`);
    console.log(`Subiect: ${topic}`);
    console.log(`Continut: ${content.substring(0, 100)}...`);

    return NextResponse.json({ success: true, message: 'Email trimis cu succes!' });
  } catch (error) {
    return NextResponse.json({ error: 'Eroare la trimiterea emailului' }, { status: 500 });
  }
}