'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

type ExchangeResponse = {
  error?: string;
  returnTo?: string;
};

export default function GitHubOAuthCallback() {
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (!code || !state) {
      setError('GitHub 没有返回完整的登录信息，请返回评论区重新登录。');
      return;
    }

    const exchange = async () => {
      try {
        const response = await fetch('/api/github', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ action: 'exchange', code, state }),
        });
        const result = await response.json() as ExchangeResponse;
        if (!response.ok) throw new Error(result.error || 'GitHub 登录失败');

        window.location.replace(result.returnTo || '/');
      } catch (exchangeError) {
        setError(exchangeError instanceof Error ? exchangeError.message : 'GitHub 登录失败，请重新尝试。');
      }
    };

    void exchange();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <section className="w-full max-w-md rounded-[32px] border border-white/50 bg-white/70 p-8 text-center shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/75">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg dark:bg-indigo-500">
          {error ? <AlertCircle size={28} /> : <Loader2 size={30} className="animate-spin" />}
        </div>

        <h1 className="type-section-title text-2xl text-slate-900 dark:text-white">
          {error ? 'GitHub 登录未完成' : '正在完成 GitHub 登录'}
        </h1>

        {error ? (
          <>
            <p role="alert" className="mt-4 text-sm leading-6 text-amber-700 dark:text-amber-200">
              {error}
            </p>
            <Link href="/" className="mt-6 inline-flex rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-500">
              返回首页
            </Link>
          </>
        ) : (
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-300">
            <Loader2 size={17} className="animate-spin text-indigo-500" />
            验证完成后会自动返回原评论页面
          </div>
        )}
      </section>
    </main>
  );
}
