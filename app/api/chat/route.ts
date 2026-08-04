import { siteConfig } from '../../../siteConfig';
import {
  checkRateLimit,
  isSameOriginRequest,
  readJsonBody,
  RequestBodyError,
} from '../../../utils/apiSecurity';

const MAX_MESSAGE_LENGTH = 1_000;

function jsonError(message: string, status: number, headers?: Record<string, string>) {
  return Response.json(
    { error: message },
    { status, headers: { 'Cache-Control': 'no-store', ...headers } },
  );
}

export async function POST(req: Request) {
  if (!isSameOriginRequest(req)) return jsonError('Forbidden', 403);

  const rateLimit = checkRateLimit(req, {
    keyPrefix: 'chat',
    limit: 12,
    windowMs: 10 * 60 * 1_000,
  });
  if (!rateLimit.allowed) {
    return jsonError('请求过于频繁，请稍后再试', 429, {
      ...rateLimit.headers,
      'Retry-After': String(rateLimit.retryAfter),
    });
  }

  let payload: { message?: unknown };
  try {
    payload = await readJsonBody<{ message?: unknown }>(req, 4_096);
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return jsonError(error.message, error.status, rateLimit.headers);
    }
    return jsonError('请求内容无效', 400, rateLimit.headers);
  }

  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return jsonError(`消息长度应为 1–${MAX_MESSAGE_LENGTH} 个字符`, 400, rateLimit.headers);
  }

  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) return jsonError('AI 服务暂时不可用', 503, rateLimit.headers);

  const aiConfig = siteConfig.geminiConfig;
  const modelId = process.env.DEEPSEEK_MODEL?.trim()
    || aiConfig.modelId
    || 'deepseek-v4-flash';

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: 'system', content: aiConfig.systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: Math.min(1, Math.max(0, aiConfig.temperature)),
        max_tokens: Math.min(512, Math.max(64, aiConfig.maxOutputTokens)),
        stream: false,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    const data = await response.json().catch(() => null) as {
      choices?: Array<{ message?: { content?: string } }>;
    } | null;

    if (!response.ok) {
      console.error('[api/chat] DeepSeek request failed:', response.status);
      return jsonError('AI 服务请求失败，请稍后再试', 502, rateLimit.headers);
    }

    const reply = data?.choices?.[0]?.message?.content?.trim()
      || '本喵暂时没有想到合适的回答……';

    return Response.json(
      { reply: reply.slice(0, 4_000) },
      { headers: { 'Cache-Control': 'no-store', ...rateLimit.headers } },
    );
  } catch (error) {
    console.error('[api/chat] Request failed:', error instanceof Error ? error.name : 'unknown');
    return jsonError('AI 服务暂时不可用', 502, rateLimit.headers);
  }
}

export async function GET() {
  return Response.json(
    { status: 'Ready' },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
