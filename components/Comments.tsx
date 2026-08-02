"use client";

import { useEffect, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
import 'gitalk/dist/gitalk.css';
import Gitalk from 'gitalk';
import { getGitalkConfig, getGitalkIssueId, isGitalkConfigured } from './gitalkConfig';

export default function Comments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const gitalkConfig = useMemo(() => getGitalkConfig(), []);
  const isConfigured = isGitalkConfigured(gitalkConfig);

  useEffect(() => {
    if (!containerRef.current || !isConfigured) return;

    // 清空之前的评论区（防止 Next.js 路由切换时重复渲染）
    containerRef.current.innerHTML = '';

    const gitalk = new Gitalk({
      clientID: gitalkConfig.clientID,
      clientSecret: gitalkConfig.clientSecret,
      repo: gitalkConfig.repo,
      owner: gitalkConfig.owner,
      admin: gitalkConfig.admin,

      // 👇 指向我们自己的同源 API，彻底告别跨域和第三方拦截！
      proxy: gitalkConfig.proxy,

      id: getGitalkIssueId(pathname),
      distractionFreeMode: false,
    });

    gitalk.render(containerRef.current);

    // 👇 🌟 核心修复：擦除 URL 中的 OAuth 凭证，防止注销后二次登录失败
    const url = new URL(window.location.href);
    if (url.searchParams.has('code')) {
      url.searchParams.delete('code');
      // 使用 replaceState 无痕修改地址栏，页面不会刷新，也不会留下历史记录
      window.history.replaceState({}, document.title, url.toString());
    }

  }, [pathname, isConfigured, gitalkConfig]);

  if (!isConfigured) {
    return (
      <div className="w-full mt-16 rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl p-6 text-center text-slate-600 dark:text-slate-300">
        <p className="font-bold text-slate-800 dark:text-white mb-2">评论系统尚未配置</p>
        <p className="text-sm">
          已接入 GitHub Issues / Gitalk。创建 GitHub OAuth App，并在 Vercel 配置
          <code className="mx-1 rounded bg-slate-200/70 px-1.5 py-0.5 dark:bg-slate-700">NEXT_PUBLIC_GITALK_CLIENT_ID</code>
          和
          <code className="mx-1 rounded bg-slate-200/70 px-1.5 py-0.5 dark:bg-slate-700">NEXT_PUBLIC_GITALK_CLIENT_SECRET</code>
          后，这里会自动变成评论区。
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mt-16 relative">
      {/* 🌟 视觉特效：底部环境光晕（保留氛围感） */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl rounded-full pointer-events-none z-0"></div>

      {/* 🌟 Gitalk 容器：加入了优雅的顶部细边框，配合 custom-gitalk-glass 类名渲染毛玻璃 */}
      <div ref={containerRef} className="relative z-10 custom-gitalk-glass pt-6 border-t border-slate-200/50 dark:border-slate-700/50" />

      {/* 🌟 毛玻璃样式魔改核心 (覆盖 Gitalk 默认样式) */}
      <style jsx global>{`
        .custom-gitalk-glass .gt-container .gt-header-textarea {
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 16px !important;
          color: inherit !important;
          transition: all 0.3s ease;
        }
        .custom-gitalk-glass .gt-container .gt-header-textarea:focus {
          background: rgba(255, 255, 255, 0.2) !important;
          border-color: #6366f1 !important; /* Indigo 500 */
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.3) !important;
        }
        .custom-gitalk-glass .gt-container .gt-header-preview {
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(12px) !important;
          border-radius: 16px !important;
        }
        .custom-gitalk-glass .gt-container .gt-btn {
          background: #6366f1 !important;
          border: none !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4) !important;
          transition: transform 0.2s, box-shadow 0.2s;
          color: white !important;
        }
        .custom-gitalk-glass .gt-container .gt-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6) !important;
        }
        .custom-gitalk-glass .gt-container .gt-comment-content {
          background: rgba(255, 255, 255, 0.05) !important;
          backdrop-filter: blur(8px) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 16px !important;
        }
        .custom-gitalk-glass .gt-container .gt-comment-admin .gt-comment-content {
          border-color: rgba(99, 102, 241, 0.3) !important;
        }
        .custom-gitalk-glass .gt-container .gt-avatar {
          border-radius: 50% !important;
          overflow: hidden;
        }
        .custom-gitalk-glass .gt-container .gt-comment-body {
          color: inherit !important;
        }
        .custom-gitalk-glass .gt-container a {
          color: #6366f1 !important;
        }
      `}</style>
    </div>
  );
}
