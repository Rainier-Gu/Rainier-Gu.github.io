import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getGitalkConfig, getGitalkIssueId } from '../../../components/gitalkConfig';
import {
  checkRateLimit,
  isSameOriginRequest,
  readJsonBody,
  RequestBodyError,
} from '../../../utils/apiSecurity';

const OAUTH_STATE_COOKIE = 'rainier_github_oauth_state';
const SESSION_COOKIE = 'rainier_github_session';
const GITHUB_API_VERSION = '2022-11-28';
const MAX_COMMENT_LENGTH = 5_000;

type SessionPayload = {
  token: string;
  expiresAt: number;
};

type OAuthStatePayload = {
  state: string;
  returnTo: string;
  expiresAt: number;
};

type GitHubIssue = {
  number: number;
  html_url: string;
  comments: number;
  pull_request?: unknown;
};

type GitHubUser = {
  login: string;
  avatar_url?: string;
  html_url?: string;
};

function getServerSecret() {
  return process.env.GITALK_CLIENT_SECRET?.trim() || '';
}

function getServerConfig() {
  const config = getGitalkConfig();
  if (
    !/^[A-Za-z0-9_.-]+$/.test(config.owner)
    || !/^[A-Za-z0-9_.-]+$/.test(config.repo)
  ) {
    return null;
  }

  return {
    ...config,
    clientSecret: getServerSecret(),
  };
}

function encryptionKey(secret: string) {
  return createHash('sha256').update(secret).digest();
}

function encryptCookie(payload: object, secret: string, purpose: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(secret), iv);
  cipher.setAAD(Buffer.from(purpose));
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), 'utf8'),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url');
}

function decryptCookie<T extends { expiresAt: number }>(
  value: string | undefined,
  secret: string,
  purpose: string,
) {
  if (!value || !secret) return null;

  try {
    const decoded = Buffer.from(value, 'base64url');
    if (decoded.length < 29) return null;
    const iv = decoded.subarray(0, 12);
    const authTag = decoded.subarray(12, 28);
    const encrypted = decoded.subarray(28);
    const decipher = createDecipheriv('aes-256-gcm', encryptionKey(secret), iv);
    decipher.setAAD(Buffer.from(purpose));
    decipher.setAuthTag(authTag);
    const plaintext = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString('utf8');
    const payload = JSON.parse(plaintext) as T;
    if (!Number.isFinite(payload.expiresAt) || payload.expiresAt <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function safeReturnTo(value: string | null | undefined) {
  if (!value || value.length > 1_500 || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return '/';
  }

  try {
    const parsed = new URL(value, 'https://local.invalid');
    parsed.searchParams.delete('code');
    parsed.searchParams.delete('state');
    return `${parsed.pathname}${parsed.search}`.slice(0, 1_500);
  } catch {
    return '/';
  }
}

function safeIssueId(rawId: string | null) {
  if (
    !rawId
    || rawId.length > 200
    || !/^[\p{L}\p{N}/_.% -]+$/u.test(rawId)
  ) return null;
  const id = getGitalkIssueId(rawId.trim());
  return id && id.length <= 49 ? id : null;
}

function safeExternalUrl(value: unknown, expectedHost: 'github.com' | 'githubusercontent.com') {
  if (typeof value !== 'string') return '';

  try {
    const url = new URL(value);
    const hostAllowed = expectedHost === 'github.com'
      ? url.hostname === 'github.com'
      : url.hostname === 'avatars.githubusercontent.com'
        || url.hostname.endsWith('.githubusercontent.com');
    return url.protocol === 'https:' && hostAllowed ? url.toString() : '';
  } catch {
    return '';
  }
}

async function githubFetch(pathname: string, token?: string, init: RequestInit = {}) {
  if (!pathname.startsWith('/')) throw new Error('Invalid GitHub API path');

  return fetch(`https://api.github.com${pathname}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': GITHUB_API_VERSION,
      'User-Agent': 'RainierGu-Comments/1.0',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(8_000),
  });
}

async function getIssue(
  owner: string,
  repo: string,
  issueId: string,
  token?: string,
) {
  const labels = new URLSearchParams({
    state: 'all',
    labels: `Gitalk,${issueId}`,
    per_page: '10',
  });
  const response = await githubFetch(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues?${labels}`,
    token,
  );

  if (!response.ok) throw new Error(`GitHub issue lookup failed: ${response.status}`);
  const issues = await response.json() as GitHubIssue[];
  return issues.find((issue) => !issue.pull_request) || null;
}

async function getViewer(token: string | undefined) {
  if (!token) return null;
  const response = await githubFetch('/user', token);
  if (!response.ok) return null;
  const user = await response.json() as GitHubUser;
  if (!user.login) return null;
  return user;
}

function readSession(request: NextRequest, secret: string) {
  return decryptCookie<SessionPayload>(
    request.cookies.get(SESSION_COOKIE)?.value,
    secret,
    SESSION_COOKIE,
  );
}

function errorResponse(message: string, status: number, headers?: HeadersInit) {
  return NextResponse.json(
    { error: message },
    { status, headers: { 'Cache-Control': 'no-store', ...headers } },
  );
}

async function startLogin(request: NextRequest) {
  const config = getServerConfig();
  if (!config?.clientID || !config.clientSecret) {
    return errorResponse('GitHub 登录尚未在服务端完成配置', 503);
  }

  const rateLimit = checkRateLimit(request, {
    keyPrefix: 'github-login',
    limit: 10,
    windowMs: 10 * 60 * 1_000,
  });
  if (!rateLimit.allowed) {
    return errorResponse('登录请求过于频繁，请稍后再试', 429, {
      ...rateLimit.headers,
      'Retry-After': String(rateLimit.retryAfter),
    });
  }

  const returnTo = safeReturnTo(request.nextUrl.searchParams.get('returnTo'));
  const state = randomBytes(32).toString('base64url');
  const redirectUri = new URL(returnTo, request.nextUrl.origin).toString();
  const authorizationUrl = new URL('https://github.com/login/oauth/authorize');
  authorizationUrl.searchParams.set('client_id', config.clientID);
  authorizationUrl.searchParams.set('redirect_uri', redirectUri);
  authorizationUrl.searchParams.set('scope', 'public_repo');
  authorizationUrl.searchParams.set('state', state);

  const response = NextResponse.redirect(authorizationUrl);
  response.headers.set('Cache-Control', 'no-store');
  response.cookies.set(
    OAUTH_STATE_COOKIE,
    encryptCookie(
      { state, returnTo, expiresAt: Date.now() + 10 * 60 * 1_000 } satisfies OAuthStatePayload,
      config.clientSecret,
      OAUTH_STATE_COOKIE,
    ),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 10 * 60,
    },
  );
  return response;
}

async function listComments(request: NextRequest) {
  const config = getServerConfig();
  if (!config) return errorResponse('评论配置无效', 503);
  const issueId = safeIssueId(request.nextUrl.searchParams.get('id'));
  if (!issueId) return errorResponse('评论标识无效', 400);

  const rateLimit = checkRateLimit(request, {
    keyPrefix: 'github-comments-read',
    limit: 60,
    windowMs: 60 * 1_000,
  });
  if (!rateLimit.allowed) {
    return errorResponse('请求过于频繁，请稍后再试', 429, {
      ...rateLimit.headers,
      'Retry-After': String(rateLimit.retryAfter),
    });
  }

  const session = config.clientSecret ? readSession(request, config.clientSecret) : null;
  const viewerToken = session?.token;
  const apiToken = viewerToken || process.env.GITHUB_COMMENTS_TOKEN?.trim();

  try {
    const [issue, viewer] = await Promise.all([
      getIssue(config.owner, config.repo, issueId, apiToken),
      getViewer(viewerToken),
    ]);

    let comments: Array<{
      id: number;
      body: string;
      createdAt: string;
      url: string;
      author: { login: string; avatarUrl: string; url: string };
    }> = [];

    if (issue) {
      const response = await githubFetch(
        `/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/issues/${issue.number}/comments?per_page=100`,
        apiToken,
      );
      if (!response.ok) throw new Error(`GitHub comment lookup failed: ${response.status}`);
      const data = await response.json() as Array<{
        id: number;
        body?: string;
        created_at?: string;
        html_url?: string;
        user?: GitHubUser;
      }>;
      comments = data.map((comment) => ({
        id: comment.id,
        body: String(comment.body || '').slice(0, 20_000),
        createdAt: String(comment.created_at || ''),
        url: safeExternalUrl(comment.html_url, 'github.com'),
        author: {
          login: String(comment.user?.login || 'github-user'),
          avatarUrl: safeExternalUrl(comment.user?.avatar_url, 'githubusercontent.com'),
          url: safeExternalUrl(comment.user?.html_url, 'github.com'),
        },
      }));
    }

    const response = NextResponse.json({
      configured: Boolean(config.clientID && config.owner && config.repo),
      authEnabled: Boolean(config.clientID && config.clientSecret),
      viewer: viewer ? {
        login: viewer.login,
        avatarUrl: safeExternalUrl(viewer.avatar_url, 'githubusercontent.com'),
        url: safeExternalUrl(viewer.html_url, 'github.com'),
      } : null,
      issue: issue ? {
        number: issue.number,
        url: safeExternalUrl(issue.html_url, 'github.com'),
      } : null,
      comments,
    });
    response.headers.set('Cache-Control', 'private, no-store');
    for (const [key, value] of Object.entries(rateLimit.headers)) response.headers.set(key, value);
    return response;
  } catch (error) {
    console.error('[api/github] Failed to load comments:', error);
    return errorResponse('GitHub 评论暂时不可用', 502, rateLimit.headers);
  }
}

async function exchangeCode(request: NextRequest, body: Record<string, unknown>) {
  const config = getServerConfig();
  if (!config?.clientID || !config.clientSecret) {
    return errorResponse('GitHub 登录尚未在服务端完成配置', 503);
  }

  const code = typeof body.code === 'string' ? body.code.trim() : '';
  const state = typeof body.state === 'string' ? body.state.trim() : '';
  if (!/^[A-Za-z0-9_-]{10,255}$/.test(code) || !/^[A-Za-z0-9_-]{20,255}$/.test(state)) {
    return errorResponse('OAuth 回调参数无效', 400);
  }

  const savedState = decryptCookie<OAuthStatePayload>(
    request.cookies.get(OAUTH_STATE_COOKIE)?.value,
    config.clientSecret,
    OAUTH_STATE_COOKIE,
  );
  if (!savedState || savedState.state !== state) {
    return errorResponse('OAuth state 校验失败，请重新登录', 400);
  }

  const rateLimit = checkRateLimit(request, {
    keyPrefix: 'github-oauth-exchange',
    limit: 10,
    windowMs: 10 * 60 * 1_000,
  });
  if (!rateLimit.allowed) {
    return errorResponse('登录请求过于频繁，请稍后再试', 429, {
      ...rateLimit.headers,
      'Retry-After': String(rateLimit.retryAfter),
    });
  }

  const redirectUri = new URL(savedState.returnTo, request.nextUrl.origin).toString();
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'RainierGu-Comments/1.0',
    },
    body: new URLSearchParams({
      client_id: config.clientID,
      client_secret: config.clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(8_000),
  });
  const tokenData = await tokenResponse.json().catch(() => null) as {
    access_token?: string;
  } | null;
  const token = tokenData?.access_token?.trim() || '';
  if (!tokenResponse.ok || token.length < 20 || token.length > 255) {
    return errorResponse('GitHub 登录失败，请重试', 502);
  }

  const sessionExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1_000;
  const response = NextResponse.json({ ok: true, returnTo: savedState.returnTo });
  response.headers.set('Cache-Control', 'no-store');
  response.cookies.set(OAUTH_STATE_COOKIE, '', { path: '/', maxAge: 0 });
  response.cookies.set(
    SESSION_COOKIE,
    encryptCookie(
      { token, expiresAt: sessionExpiresAt } satisfies SessionPayload,
      config.clientSecret,
      SESSION_COOKIE,
    ),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    },
  );
  return response;
}

async function ensureLabel(
  owner: string,
  repo: string,
  name: string,
  token: string,
  color: string,
) {
  const response = await githubFetch(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/labels`,
    token,
    { method: 'POST', body: JSON.stringify({ name, color }) },
  );
  if (!response.ok && response.status !== 422) {
    throw new Error(`GitHub label creation failed: ${response.status}`);
  }
}

async function postComment(request: NextRequest, body: Record<string, unknown>) {
  const config = getServerConfig();
  if (!config?.clientSecret) return errorResponse('GitHub 登录尚未配置', 503);
  const session = readSession(request, config.clientSecret);
  if (!session) return errorResponse('请先使用 GitHub 登录', 401);

  const issueId = safeIssueId(typeof body.id === 'string' ? body.id : null);
  const comment = typeof body.comment === 'string' ? body.comment.trim() : '';
  if (!issueId || !comment || comment.length > MAX_COMMENT_LENGTH) {
    return errorResponse(`评论内容应为 1–${MAX_COMMENT_LENGTH} 个字符`, 400);
  }

  const rateLimit = checkRateLimit(request, {
    keyPrefix: 'github-comment-write',
    limit: 8,
    windowMs: 10 * 60 * 1_000,
  });
  if (!rateLimit.allowed) {
    return errorResponse('评论提交过于频繁，请稍后再试', 429, {
      ...rateLimit.headers,
      'Retry-After': String(rateLimit.retryAfter),
    });
  }

  const viewer = await getViewer(session.token);
  if (!viewer) return errorResponse('GitHub 登录已失效，请重新登录', 401);

  try {
    let issue = await getIssue(config.owner, config.repo, issueId, session.token);
    if (!issue) {
      const isAdmin = config.admin.some((admin) => admin.toLowerCase() === viewer.login.toLowerCase());
      if (!isAdmin) return errorResponse('讨论尚未初始化，请联系站点管理员', 409);

      await Promise.all([
        ensureLabel(config.owner, config.repo, 'Gitalk', session.token, '3b82f6'),
        ensureLabel(config.owner, config.repo, issueId, session.token, 'cbd5e1'),
      ]);

      const pageTitle = typeof body.pageTitle === 'string'
        ? body.pageTitle.replace(/[\r\n]+/g, ' ').trim().slice(0, 120)
        : '站点讨论';
      const returnTo = safeReturnTo(typeof body.pagePath === 'string' ? body.pagePath : '/');
      const createResponse = await githubFetch(
        `/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/issues`,
        session.token,
        {
          method: 'POST',
          body: JSON.stringify({
            title: pageTitle || '站点讨论',
            body: new URL(returnTo, request.nextUrl.origin).toString(),
            labels: ['Gitalk', issueId],
          }),
        },
      );
      if (!createResponse.ok) throw new Error(`GitHub issue creation failed: ${createResponse.status}`);
      issue = await createResponse.json() as GitHubIssue;
    }

    const response = await githubFetch(
      `/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/issues/${issue.number}/comments`,
      session.token,
      { method: 'POST', body: JSON.stringify({ body: comment }) },
    );
    if (!response.ok) throw new Error(`GitHub comment creation failed: ${response.status}`);

    return NextResponse.json(
      { ok: true },
      { headers: { 'Cache-Control': 'no-store', ...rateLimit.headers } },
    );
  } catch (error) {
    console.error('[api/github] Failed to post comment:', error);
    return errorResponse('评论提交失败，请稍后重试', 502, rateLimit.headers);
  }
}

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get('action') === 'login') {
    return startLogin(request);
  }
  return listComments(request);
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return errorResponse('Forbidden', 403);

  let body: Record<string, unknown>;
  try {
    body = await readJsonBody<Record<string, unknown>>(request, 32_000);
  } catch (error) {
    if (error instanceof RequestBodyError) return errorResponse(error.message, error.status);
    return errorResponse('请求内容无效', 400);
  }

  const action = typeof body.action === 'string' ? body.action : '';
  if (action === 'exchange') return exchangeCode(request, body);
  if (action === 'comment') return postComment(request, body);
  if (action === 'logout') {
    const response = NextResponse.json({ ok: true });
    response.headers.set('Cache-Control', 'no-store');
    response.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
    return response;
  }
  return errorResponse('Unsupported action', 400);
}
