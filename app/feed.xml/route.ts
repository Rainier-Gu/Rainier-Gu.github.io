import fs from 'fs';
import path from 'path';
import { siteConfig } from '../../siteConfig';
import { parseFrontMatter } from '../../utils/frontMatter';

export const dynamic = 'force-static';

const SITE_URL = 'https://www.rainiergu.cn';
const FEED_URL = `${SITE_URL}/feed.xml`;

type FeedPost = {
  slug: string;
  title: string;
  description: string;
  date: Date;
  tags: string[];
};

function escapeXml(value: unknown) {
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  };

  return String(value ?? '').replace(/[&<>"']/g, (character) => entities[character]);
}

function parsePostDate(value: unknown) {
  const rawDate = String(value ?? '').trim();
  if (!rawDate) return new Date(0);

  let normalizedDate = rawDate;
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
    normalizedDate = `${normalizedDate}T00:00:00+08:00`;
  } else {
    normalizedDate = normalizedDate.replace(' ', 'T');
    if (!/(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalizedDate)) {
      normalizedDate = `${normalizedDate}+08:00`;
    }
  }

  const date = new Date(normalizedDate);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

function getFeedPosts(): FeedPost[] {
  const postsDirectory = path.join(process.cwd(), 'posts');
  if (!fs.existsSync(postsDirectory)) return [];

  return fs.readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const source = fs.readFileSync(path.join(postsDirectory, fileName), 'utf8');
      const { data } = parseFrontMatter(source);

      return {
        slug,
        title: String(data.title || slug),
        description: String(data.description || ''),
        date: parsePostDate(data.date),
        tags: Array.isArray(data.tags) ? data.tags.map((tag) => String(tag)) : [],
        isDraft: data.draft === true || data.published === false,
      };
    })
    .filter((post) => !post.isDraft)
    .sort((first, second) => second.date.getTime() - first.date.getTime())
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      tags: post.tags,
    }));
}

export async function GET() {
  const posts = getFeedPosts();
  const lastBuildDate = posts[0]?.date ?? new Date();
  const items = posts.map((post) => {
    const postUrl = `${SITE_URL}/posts/${encodeURIComponent(post.slug)}`;
    const categories = post.tags
      .map((tag) => `      <category>${escapeXml(tag)}</category>`)
      .join('\n');

    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${post.date.toUTCString()}</pubDate>
${categories ? `${categories}\n` : ''}    </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(siteConfig.bio)}</description>
    <language>zh-CN</language>
    <generator>Next.js</generator>
    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
