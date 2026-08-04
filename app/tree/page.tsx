import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock3, FileText, Sparkles, Tags } from 'lucide-react';

import Navbar from '../../components/Navbar';
import PageTransition from '../../components/PageTransition';
import { siteConfig } from '../../siteConfig';

type KnowledgeItem = {
  title: string;
  description: string;
  date: string;
  href: string;
  type: '文章' | '说说';
  cover?: string;
  tags: string[];
  pdfCount: number;
};

const POSTS_DIR = path.join(process.cwd(), 'posts');
const MOMENTS_DIR = path.join(process.cwd(), 'moments');

export const metadata = {
  title: `知识地图 | ${siteConfig.title}`,
  description: '把文章、说说与 PDF 资料整理成一张轻量的学习地图。',
};

function normalizeDate(date: unknown) {
  if (!date) return '';
  if (date instanceof Date) return date.toISOString();
  return String(date);
}

function formatDate(date: string) {
  if (!date) return '未标注日期';
  const clean = date.replace('T', ' ').slice(0, 10);
  return clean || date;
}

function excerptFromContent(content: string) {
  return content
    .replace(/[#>*_\-[\]()`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 110);
}

function readMarkdownItems(
  directoryPath: string,
  type: KnowledgeItem['type'],
  hrefPrefix: '/posts' | '/moments'
) {
  if (!fs.existsSync(directoryPath)) return [];

  return fs
    .readdirSync(directoryPath)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(directoryPath, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
      const fallbackTitle = excerptFromContent(content) || `${type}记录`;
      const pdfCount = (content.match(/\.pdf/gi) || []).length;

      return {
        title: String(data.title || fallbackTitle),
        description: String(data.description || excerptFromContent(content) || '暂无摘要'),
        date: normalizeDate(data.date),
        href: hrefPrefix === '/moments' ? '/moments' : `${hrefPrefix}/${slug}`,
        type,
        cover: data.cover || data.image,
        tags,
        pdfCount,
      } satisfies KnowledgeItem;
    });
}

function sortByDate(items: KnowledgeItem[]) {
  return items.sort((a, b) => {
    const timeA = new Date(a.date.replace(' ', 'T')).getTime();
    const timeB = new Date(b.date.replace(' ', 'T')).getTime();
    return (Number.isFinite(timeB) ? timeB : 0) - (Number.isFinite(timeA) ? timeA : 0);
  });
}

export default function KnowledgeMapPage() {
  const posts = readMarkdownItems(POSTS_DIR, '文章', '/posts');
  const moments = readMarkdownItems(MOMENTS_DIR, '说说', '/moments');
  const allItems = sortByDate([...posts, ...moments]);
  const recentItems = allItems.slice(0, 6);
  const pdfTotal = allItems.reduce((sum, item) => sum + item.pdfCount, 0);

  const tagCounts = allItems.reduce<Record<string, number>>((acc, item) => {
    item.tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  const sections = [
    {
      title: '课程与研究文章',
      count: posts.length,
      href: '/',
      icon: BookOpen,
      description: '集中整理课程笔记、PDF 资料、研究阅读和技术实践。',
    },
    {
      title: '日常说说',
      count: moments.length,
      href: '/moments',
      icon: Sparkles,
      description: '轻量记录当日进展、灵感和待整理素材。',
    },
    {
      title: 'PDF 资料',
      count: pdfTotal,
      href: '/',
      icon: FileText,
      description: '文章中已接入的课程讲义、实验报告与笔记文件。',
    },
  ];

  return (
    <div className="min-h-screen pb-24">
      <Navbar />
      <PageTransition>
        <main className="w-full max-w-7xl mx-auto mt-28 px-4 sm:px-10 relative z-10">
          <section className="animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-widest mb-2 transition-colors duration-700">
                  知识地图
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wider transition-colors duration-700">
                  把文章、说说与 PDF 资料整理成一张轻量的学习地图。
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,2fr)]">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.title}
                  href={section.href}
                  className="group rounded-3xl border border-white/50 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                      <Icon size={22} />
                    </div>
                    <ArrowRight size={18} className="text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="mt-5 text-3xl font-black text-slate-950 dark:text-white">{section.count}</div>
                  <h2 className="mt-2 font-black text-slate-800 dark:text-slate-100">{section.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{section.description}</p>
                </Link>
              );
            })}

            <div className="rounded-3xl border border-white/50 bg-white/60 p-6 shadow-lg backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-slate-900/50">
              <h2 className="flex items-center gap-2 text-lg font-black text-slate-950 dark:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                  <Tags size={20} />
                </span>
                常用标签
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {topTags.length > 0 ? (
                  topTags.map(([tag, count]) => (
                    <span key={tag} className="rounded-full border border-indigo-300/30 bg-indigo-500/10 px-3 py-1.5 text-sm font-bold text-indigo-700 dark:text-indigo-200">
                      {tag} · {count}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">还没有标签。给文章 frontmatter 添加 tags 后会自动显示。</p>
                )}
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="rounded-[2rem] border border-white/50 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 md:p-8 shadow-xl">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-950 dark:text-white flex items-center gap-2">
                    <Clock3 size={22} className="text-indigo-500" />
                    最近更新
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">按发布时间自动排序，优先看到最新内容。</p>
                </div>
              </div>

              <div className="relative ml-2 space-y-5 border-l-2 border-indigo-200/80 pl-6 dark:border-indigo-400/25 md:pl-8">
                {recentItems.map((item) => (
                  <div
                    key={`${item.type}-${item.href}-${item.date}`}
                    className="group relative"
                  >
                    <span className="absolute -left-[33px] top-2 h-4 w-4 rounded-full border-[3px] border-white bg-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.16)] transition-transform duration-300 group-hover:scale-125 dark:border-slate-900 dark:bg-indigo-400 md:-left-[41px]" />
                    <time
                      dateTime={item.date}
                      className="mb-2 inline-flex rounded-full bg-indigo-500/10 px-3 py-1.5 text-sm font-black tracking-wide text-indigo-700 ring-1 ring-inset ring-indigo-500/15 dark:bg-indigo-400/10 dark:text-indigo-200 dark:ring-indigo-300/15"
                    >
                      {formatDate(item.date)}
                    </time>
                    <Link
                      href={item.href}
                      className="block rounded-3xl border border-slate-200/70 bg-white/65 p-5 transition-all hover:border-indigo-300/70 hover:bg-white/90 dark:border-white/10 dark:bg-slate-800/45 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                            <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-indigo-600 dark:text-indigo-300">{item.type}</span>
                            {item.pdfCount > 0 && <span>{item.pdfCount} 个 PDF</span>}
                          </div>
                          <h3 className="mt-3 text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                            {item.title}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.description}</p>
                        </div>
                        <ArrowRight size={18} className="mt-1 shrink-0 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </PageTransition>
    </div>
  );
}
