type RateLimitOptions = {
  keyPrefix: string;
  limit: number;
  windowMs: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

export class RequestBodyError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

function getClientAddress(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  return forwardedFor?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

export function checkRateLimit(request: Request, options: RateLimitOptions) {
  const now = Date.now();
  const key = `${options.keyPrefix}:${getClientAddress(request)}`;
  const current = rateLimitStore.get(key);
  const entry = !current || current.resetAt <= now
    ? { count: 0, resetAt: now + options.windowMs }
    : current;

  entry.count += 1;
  rateLimitStore.set(key, entry);

  if (rateLimitStore.size > 2_000) {
    for (const [storedKey, storedEntry] of rateLimitStore) {
      if (storedEntry.resetAt <= now) rateLimitStore.delete(storedKey);
    }
  }

  const remaining = Math.max(0, options.limit - entry.count);
  const headers = {
    'RateLimit-Limit': String(options.limit),
    'RateLimit-Remaining': String(remaining),
    'RateLimit-Reset': String(Math.ceil(entry.resetAt / 1000)),
  };

  return {
    allowed: entry.count <= options.limit,
    headers,
    retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function readJsonBody<T>(request: Request, maxBytes: number): Promise<T> {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    throw new RequestBodyError('Content-Type must be application/json', 415);
  }

  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new RequestBodyError('Request body is too large', 413);
  }

  if (!request.body) {
    throw new RequestBodyError('Request body is required', 400);
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let totalBytes = 0;
  let text = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      await reader.cancel();
      throw new RequestBodyError('Request body is too large', 413);
    }
    text += decoder.decode(value, { stream: true });
  }

  text += decoder.decode();

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new RequestBodyError('Request body must be valid JSON', 400);
  }
}
