"use client";

import Link from 'next/link';
import { Pin } from 'lucide-react';
import { useRef, useState } from 'react';

const POSTS_PER_PAGE = 5;

export default function HomePostStream({ posts }: { posts: any[] }) {
  const safePosts = posts || [];
  const sectionRef = useRef<HTMLElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(safePosts.length / POSTS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const pageStart = (activePage - 1) * POSTS_PER_PAGE;
  const pagePosts = safePosts.slice(pageStart, pageStart + POSTS_PER_PAGE);
  const featuredPost = activePage === 1 ? pagePosts[0] : null;
  const restPosts = activePage === 1 ? pagePosts.slice(1) : pagePosts;
  const realPostCount = safePosts.filter((post) => post.slug !== 'none').length;

  const changePage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    if (nextPage === activePage) return;

    setCurrentPage(nextPage);
    window.requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  if (safePosts.length === 0) return null;

  return (
    <section id="all-posts" ref={sectionRef} className="scroll-mt-24">
      <div className="mb-5 flex items-end justify-between gap-4 px-1">
        <div>
          <p className="type-kicker text-[12px] text-indigo-500 dark:text-indigo-300">
            All Notes
          </p>
          <h2 className="type-section-title mt-2 text-2xl text-slate-900 dark:text-white">
            所有文章
          </h2>
        </div>
        <span className="rounded-full bg-white/60 px-3 py-1.5 text-[11px] font-black text-slate-500 shadow-sm dark:bg-slate-900/40 dark:text-slate-300">
          共 {realPostCount} 篇
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {featuredPost && (
          <Link
            href={featuredPost.slug === 'none' ? '#' : `/posts/${featuredPost.slug}`}
            className="group relative min-h-[270px] overflow-hidden rounded-[30px] border border-white/55 bg-white/65 shadow-lg backdrop-blur-xl transition-colors duration-700 dark:border-white/10 dark:bg-slate-900"
          >
            {featuredPost.pinned && (
              <span
                aria-label="置顶文章"
                title="置顶文章"
                className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-amber-400/90 text-white shadow-lg shadow-amber-950/20 backdrop-blur-sm"
              >
                <Pin size={22} strokeWidth={2.7} className="-rotate-12" aria-hidden="true" />
              </span>
            )}
            <img
              src={featuredPost.coverThumbnail || featuredPost.cover}
              alt={featuredPost.title}
              className="absolute inset-0 h-full w-full object-cover opacity-75 transition-transform duration-1000 group-hover:scale-105 dark:opacity-90"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/55 to-transparent dark:hidden" />
            <div className="absolute inset-0 hidden bg-gradient-to-t from-black/90 via-black/35 to-transparent dark:block" />
            <div className="relative z-10 flex min-h-[270px] flex-col justify-end p-6 text-slate-900 dark:text-white">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {!featuredPost.pinned && (
                  <span className="type-label rounded-full bg-indigo-500/90 px-3 py-1 text-[10px] font-black uppercase shadow-lg">
                    Featured
                  </span>
                )}
                {featuredPost.formattedDate && (
                  <time className="type-meta rounded-full border border-indigo-200/80 bg-white/90 px-3 py-1.5 text-xs font-black text-indigo-700 shadow-sm backdrop-blur-md dark:border-white/30 dark:bg-black/45 dark:text-indigo-100">
                    {featuredPost.formattedDate}
                  </time>
                )}
              </div>
              <h3 className="type-card-title text-2xl font-black drop-shadow-sm md:text-3xl">
                {featuredPost.title}
              </h3>
              {featuredPost.description && (
                <p className="type-summary mt-3 line-clamp-2 text-sm font-medium text-slate-700 dark:text-white/80">
                  {featuredPost.description}
                </p>
              )}
            </div>
          </Link>
        )}

        {restPosts.map((post, index) => {
          const imageOnRight = index % 2 === 1;

          return (
            <Link
              key={post.slug}
              href={post.slug === 'none' ? '#' : `/posts/${post.slug}`}
              className={`group relative grid overflow-hidden rounded-[28px] border border-white/55 bg-white/60 shadow-md backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/40 sm:h-[156px] ${
                imageOnRight ? 'sm:grid-cols-[1fr_196px]' : 'sm:grid-cols-[196px_1fr]'
              }`}
            >
              {post.pinned && (
                <span
                  aria-label="置顶文章"
                  title="置顶文章"
                  className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-amber-200/80 bg-amber-400/95 text-white shadow-md shadow-amber-950/15"
                >
                  <Pin size={16} strokeWidth={2.8} className="-rotate-12" aria-hidden="true" />
                </span>
              )}
              <div className={`${imageOnRight ? 'sm:order-2' : ''} relative min-h-[132px] overflow-hidden bg-slate-200 dark:bg-slate-700`}>
                <img
                  src={post.coverThumbnail || post.cover}
                  alt={post.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className={`flex min-w-0 flex-col justify-center p-4 sm:px-6 ${
                imageOnRight
                  ? 'sm:order-1 sm:border-r sm:border-slate-200/70 dark:sm:border-white/10'
                  : 'sm:border-l sm:border-slate-200/70 dark:sm:border-white/10'
              }`}>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {post.formattedDate && (
                    <time className="type-meta rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-black text-indigo-700 ring-1 ring-inset ring-indigo-500/10 dark:bg-indigo-400/10 dark:text-indigo-200 dark:ring-indigo-300/10">
                      {post.formattedDate}
                    </time>
                  )}
                  {(post.tags || []).slice(0, 2).map((tag: string) => (
                    <span
                      key={tag}
                      className="type-label rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="type-card-title line-clamp-2 text-lg font-black text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
                  {post.title}
                </h3>
                {post.description && (
                  <p className="type-summary mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                    {post.description}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <nav className="mt-6 flex flex-wrap items-center justify-center gap-2 rounded-[24px] border border-white/50 bg-white/45 p-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/35" aria-label="文章分页">
          <button
            type="button"
            onClick={() => changePage(activePage - 1)}
            disabled={activePage === 1}
            className="rounded-xl px-3 py-2 text-xs font-black text-slate-600 transition hover:bg-indigo-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 dark:text-slate-300"
          >
            上一页
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => changePage(page)}
              aria-current={page === activePage ? 'page' : undefined}
              className={`h-9 min-w-9 rounded-xl px-2 text-xs font-black transition ${
                page === activePage
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white/55 text-slate-600 hover:bg-indigo-500 hover:text-white dark:bg-slate-800/60 dark:text-slate-300'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => changePage(activePage + 1)}
            disabled={activePage === totalPages}
            className="rounded-xl px-3 py-2 text-xs font-black text-slate-600 transition hover:bg-indigo-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 dark:text-slate-300"
          >
            下一页
          </button>
        </nav>
      )}
    </section>
  );
}
