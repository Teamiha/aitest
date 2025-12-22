import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.SECOND_API_KEY,
    });

    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: question is required and must be a string' },
        { status: 400 }
      );
    }

    const messages = [
      { role: 'system' as const, content: 'Отвечай на русском языке' },
      { role: 'user' as const, content: question },
    ];

    const params: any = {
      model: 'gpt-4o-mini',
      messages,
      temperature: 1.0, // Default temperature
    };

    // Add random seed
    params.seed = Math.floor(Math.random() * 1_000_000_000);

    const completion = await openai.chat.completions.create(params);

    const response = completion.choices[0]?.message?.content || 'No response generated';

    return NextResponse.json({ response });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
