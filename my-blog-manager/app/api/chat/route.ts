import { siteConfig } from '../../../siteConfig';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (typeof message !== 'string' || !message.trim()) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY?.trim();

    if (!apiKey) {
      return Response.json(
        { error: 'DEEPSEEK_API_KEY is not configured on the server' },
        { status: 500 }
      );
    }

    const aiConfig = siteConfig.geminiConfig;
    const modelId = process.env.DEEPSEEK_MODEL?.trim() || aiConfig.modelId || 'deepseek-v4-flash';

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          {
            role: 'system',
            content: aiConfig.systemPrompt,
          },
          {
            role: 'user',
            content: message.trim(),
          },
        ],
        temperature: aiConfig.temperature,
        max_tokens: aiConfig.maxOutputTokens,
        stream: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          error: `DeepSeek API error: ${response.status}`,
          details: data.error?.message || data,
        },
        { status: response.status }
      );
    }

    const reply =
      data.choices?.[0]?.message?.content ||
      '本喵暂时没有想到合适的回答……';

    return Response.json({ reply });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    status: 'Ready',
    provider: 'DeepSeek',
    model: process.env.DEEPSEEK_MODEL?.trim() || siteConfig.geminiConfig.modelId || 'deepseek-v4-flash',
  });
}
