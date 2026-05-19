import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { contentType, topic, tone, instructions } = await request.json();

    const prompt = `
      Generează un conținut de tip "${contentType}" pe tema "${topic}".
      Tonul: ${tone}.
      Instrucțiuni suplimentare: ${instructions || 'nimic'}.
      Textul trebuie să fie bine structurat, profesional și gata de utilizare.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const generatedText = completion.choices[0].message.content;
    return NextResponse.json({ text: generatedText });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Eroare la generare' }, { status: 500 });
  }
}