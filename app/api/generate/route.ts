import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(request: Request) {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
  try {
    const { contentType, topic, tone, instructions, language = 'ro' } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const prompt = language === 'en'
  ? `Generate a ${contentType} on the topic "${topic}". Tone: ${tone}. Additional instructions: ${instructions || 'none'}. 
Format the text with clear sections separated by blank lines. Use ## for section headings. Do not use asterisks for bullet points, use - instead. The text must be well-structured, professional, and ready to use.`
  : `Generează un conținut de tip "${contentType}" pe tema "${topic}". Tonul: ${tone}. Instrucțiuni suplimentare: ${instructions || 'nimic'}. 
Formatează textul cu secțiuni clare separate prin linii goale. Folosește ## pentru titlurile secțiunilor. Nu folosi asteriscuri pentru liste, folosește - în schimb. Textul trebuie să fie bine structurat, profesional și gata de utilizare.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const generatedText = completion.choices[0]?.message?.content || '';
    return NextResponse.json({ text: generatedText });
  } catch (error: any) {
    console.error('Public API error:', error);
    return NextResponse.json({ error: error.message || 'Eroare la generare' }, { status: 500 });
  }
}