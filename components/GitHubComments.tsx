'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getGitalkIssueId } from './gitalkConfig';

type Viewer = {
  login: string;
  avatarUrl: string;
  url: string;
};

type CommentItem = {
  id: number;
  body: string;
  createdAt: string;
  url: string;
  author: Viewer;
};

type CommentsResponse = {
  configured: boolean;
  authEnabled: boolean;
  viewer: Viewer | null;
  issue: { number: number; url: string } | null;
  comments: CommentItem[];
  error?: string;
};

type GitHubCommentsProps = {
  id?: string;
  compact?: boolean;
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
}

function currentReturnTo() {
  const url = new URL(window.location.href);
  url.searchParams.delete('code');
  url.searchParams.delete('state');
  return `${url.pathname}${url.search}`;
}

export default function GitHubComments({ id, compact = false }: GitHubCommentsProps) {
  const pathname = usePathname();
  const issueId = getGitalkIssueId(id || pathname);
  const [data, setData] = useState<CommentsResponse | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/github?id=${encodeURIComponent(issueId)}`, {
        cache: 'no-store',
        credentials: 'same-origin',
      });
      const result = await response.json() as CommentsResponse;
      if (!response.ok) throw new Error(result.error || '评论加载失败');
      setData(result);
      setMessage('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '评论加载失败');
    } finally {
      setLoading(false);
    }
  }, [issueId]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  const logout = async () => {
    await fetch('/api/github', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ action: 'logout' }),
    });
    await loadComments();
  };

  const submitComment = async (event: FormEvent) => {
    event.preventDefault();
    if (!comment.trim() || submitting) return;

    setSubmitting(true);
    setMessage('');
    try {
      const response = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          action: 'comment',
          id: issueId,
          comment: comment.trim(),
          pageTitle: document.title,
          pagePath: currentReturnTo(),
        }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || '评论提交失败');
      setComment('');
      await loadComments();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '评论提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={compact ? 'w-full' : 'w-full mt-16 relative'} aria-label="GitHub 评论">
      {!compact && (
        <div className="pointer-events-none absolute -top-10 left-1/2 h-32 w-3/4 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/20" />
      )}

      <div className={`relative rounded-2xl border border-white/40 bg-white/45 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-slate-900/45 ${compact ? 'p-3' : 'p-5 md:p-7'}`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className={`${compact ? 'text-sm' : 'text-lg'} font-black text-slate-800 dark:text-white`}>评论</h2>
            {!compact && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">评论安全地存储在 GitHub Issues 中。</p>}
          </div>

          <div className="flex items-center gap-2 text-xs">
            {data?.issue?.url && (
              <a href={data.issue.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline dark:text-indigo-300">
                在 GitHub 查看
              </a>
            )}
            {data?.viewer ? (
              <button type="button" onClick={() => void logout()} className="rounded-full border border-slate-300/70 px-3 py-1.5 hover:bg-white/70 dark:border-white/15 dark:hover:bg-white/10">
                退出 {data.viewer.login}
              </button>
            ) : data?.authEnabled ? (
              <a href={`/api/github?action=login&returnTo=${encodeURIComponent(pathname)}`} className="rounded-full bg-slate-900 px-3 py-1.5 font-bold text-white hover:bg-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400">
                使用 GitHub 登录
              </a>
            ) : null}
          </div>
        </div>

        {message && (
          <p role="status" className="mb-3 rounded-xl border border-amber-300/50 bg-amber-50/70 px-3 py-2 text-xs text-amber-800 dark:border-amber-400/20 dark:bg-amber-950/30 dark:text-amber-200">
            {message}
          </p>
        )}

        {loading ? (
          <p className="py-4 text-center text-sm text-slate-500">正在加载评论…</p>
        ) : (
          <div className="space-y-3">
            {data?.comments.length ? data.comments.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200/60 bg-white/55 p-3 dark:border-white/10 dark:bg-slate-950/35">
                <header className="mb-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  {item.author.avatarUrl ? (
                    <img src={item.author.avatarUrl} alt="" className="h-7 w-7 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700" />
                  )}
                  {item.author.url ? (
                    <a href={item.author.url} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-700 hover:text-indigo-600 dark:text-slate-200">
                      {item.author.login}
                    </a>
                  ) : <span className="font-bold">{item.author.login}</span>}
                  <span>·</span>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{formatDate(item.createdAt)}</a>
                  ) : <span>{formatDate(item.createdAt)}</span>}
                </header>
                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 dark:text-slate-200">{item.body}</p>
              </article>
            )) : (
              <p className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">还没有评论。</p>
            )}
          </div>
        )}

        {data?.viewer ? (
          <form onSubmit={submitComment} className="mt-4">
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={5_000}
              rows={compact ? 2 : 4}
              placeholder="写下你的评论（支持纯文本）…"
              className="w-full resize-y rounded-xl border border-slate-300/70 bg-white/70 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-slate-950/50"
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">{comment.length}/5000</span>
              <button disabled={!comment.trim() || submitting} className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
                {submitting ? '提交中…' : '发表评论'}
              </button>
            </div>
          </form>
        ) : data && !data.authEnabled ? (
          <p className="mt-4 rounded-xl border border-dashed border-slate-300/70 px-3 py-2 text-center text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
            评论只读：请在服务端配置 GITALK_CLIENT_SECRET 后启用登录。
          </p>
        ) : null}
      </div>
    </section>
  );
}
