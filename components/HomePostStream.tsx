import Link from 'next/link';

export default function HomePostStream({ posts }: { posts: any[] }) {
  if (!posts || posts.length === 0) return null;

  const [featuredPost, ...restPosts] = posts;

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4 px-1">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-indigo-500 dark:text-indigo-300">
            Latest Notes
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-wide text-slate-900 dark:text-white">
            最新文章
          </h2>
        </div>
        <Link
          href="/timeline"
          className="rounded-full bg-white/60 px-4 py-2 text-xs font-black text-slate-600 shadow-sm transition hover:bg-indigo-500 hover:text-white dark:bg-slate-900/40 dark:text-slate-300"
        >
          查看归档
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {featuredPost && (
          <Link
            href={featuredPost.slug === 'none' ? '#' : `/posts/${featuredPost.slug}`}
            className="group relative min-h-[270px] overflow-hidden rounded-[30px] border border-white/55 bg-white/65 shadow-lg backdrop-blur-xl transition-colors duration-700 dark:border-white/10 dark:bg-slate-900"
          >
            <img
              src={featuredPost.cover}
              alt={featuredPost.title}
              className="absolute inset-0 h-full w-full object-cover opacity-75 transition-transform duration-1000 group-hover:scale-105 dark:opacity-90"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/55 to-transparent dark:hidden" />
            <div className="absolute inset-0 hidden bg-gradient-to-t from-black/90 via-black/35 to-transparent dark:block" />
            <div className="relative z-10 flex min-h-[270px] flex-col justify-end p-6 text-slate-900 dark:text-white">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-500/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] shadow-lg">
                  Featured
                </span>
                {featuredPost.formattedDate && (
                  <span className="rounded-full border border-white/60 bg-white/75 px-3 py-1 text-[10px] font-mono text-slate-700 backdrop-blur-md dark:border-white/20 dark:bg-black/30 dark:text-white/90">
                    {featuredPost.formattedDate}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-black leading-tight drop-shadow-sm md:text-3xl">
                {featuredPost.title}
              </h3>
              {featuredPost.description && (
                <p className="mt-3 line-clamp-2 text-sm font-medium leading-relaxed text-slate-700 dark:text-white/80">
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
              className={`group grid overflow-hidden rounded-[28px] border border-white/55 bg-white/60 shadow-md backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/40 ${
                imageOnRight ? 'sm:grid-cols-[1fr_168px]' : 'sm:grid-cols-[168px_1fr]'
              }`}
            >
              <div className={`${imageOnRight ? 'sm:order-2' : ''} relative min-h-[132px] overflow-hidden bg-slate-200 dark:bg-slate-700`}>
                <img
                  src={post.cover}
                  alt={post.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className={`flex min-w-0 flex-col justify-center p-4 ${
                imageOnRight
                  ? 'sm:order-1 sm:border-r sm:border-slate-200/70 dark:sm:border-white/10'
                  : 'sm:border-l sm:border-slate-200/70 dark:sm:border-white/10'
              }`}>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {post.formattedDate && (
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      {post.formattedDate}
                    </span>
                  )}
                  {(post.tags || []).slice(0, 2).map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="line-clamp-2 text-lg font-black leading-snug text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
                  {post.title}
                </h3>
                {post.description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {post.description}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
