import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { GenerateRequest, GenerateResponse, ResponseItem } from '@/lib/types';

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

const MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'] as const;

async function generateResponse(
  model: string,
  prompt: string,
  temperature: number,
  seedUsed: boolean
): Promise<ResponseItem> {
  const messages = [
    { role: 'system' as const, content: 'Отвечай на русском языке' },
    { role: 'user' as const, content: prompt },
  ];

  const params: any = {
    model,
    messages,
    temperature,
  };

  if (seedUsed) {
    params.seed = Math.floor(Math.random() * 1_000_000_000);
  }

  const completion = await openai.chat.completions.create(params);

  return {
    model,
    seedUsed,
    response: completion.choices[0]?.message?.content || 'No response generated',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt, temperature } = body;

    if (!prompt || typeof temperature !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request: prompt and temperature are required' },
        { status: 400 }
      );
    }

    // Generate all 6 responses in parallel
    const promises: Promise<ResponseItem>[] = [];

    MODELS.forEach(model => {
      // Without seed
      promises.push(generateResponse(model, prompt, temperature, false));
      // With seed
      promises.push(generateResponse(model, prompt, temperature, true));
    });

    // Add the Andrey API response
    const andreyApiPromise = (async () => {
      const messages = [
        { role: 'system' as const, content: 'Отвечай на русском языке' },
        { role: 'user' as const, content: prompt },
      ];

      const params: any = {
        model: 'gpt-4o-mini',
        messages,
        temperature: 1.0,
      };

      // Add random seed
      params.seed = Math.floor(Math.random() * 1_000_000_000);

      const completion = await openai.chat.completions.create(params);

      return {
        model: 'Andrey API',
        seedUsed: true, // Always uses seed for Andrey API
        response: completion.choices[0]?.message?.content || 'No response generated',
      };
    })();

    promises.push(andreyApiPromise);

    const responses = await Promise.all(promises);

    const result: GenerateResponse = {
      responses,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate responses' },
      { status: 500 }
    );
  }
}
