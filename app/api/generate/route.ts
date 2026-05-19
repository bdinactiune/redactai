import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { contentType, topic, tone, instructions, language = 'ro' } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const prompt = language === 'en'
      ? `Generate a ${contentType} on the topic "${topic}". Tone: ${tone}. Instructions: ${instructions || 'none'}.
Format rules:
- Use ## for main headings and ### for subheadings (never use **text** for titles)
- Use - for bullet points (never use * for bullets)
- The text must be well-structured, professional, and ready to use.`
      : `Genereaza un continut de tip "${contentType}" pe tema "${topic}". Tonul: ${tone}. Instructiuni: ${instructions || 'nimic'}.
Reguli de formatare:
- Foloseste ## pentru titluri principale si ### pentru subtitluri (nu folosi **text** pentru titluri)
- Foloseste - pentru bullet points (nu folosi * pentru liste)
- Textul trebuie sa fie bine structurat, profesional si gata de utilizare.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://redactai.ro',
        'X-Title': 'RedactAI',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Eroare OpenRouter');
    }

    const generatedText = data.choices[0]?.message?.content || '';
    return NextResponse.json({ text: generatedText });
  } catch (error: any) {
    console.error('Generate error:', error);
    return NextResponse.json({ error: error.message || 'Eroare la generare' }, { status: 500 });
  }
}
