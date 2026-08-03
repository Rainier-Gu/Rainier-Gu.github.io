import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import SearchBar from '../components/SearchBar';
import { siteConfig } from '../siteConfig';
import CloudPlayer from '../components/CloudPlayer';
import ProfileCard from '../components/ProfileCard';
import SiteDashboard from '../components/SiteDashboard';
import { albums } from '../data/albums';
import { ToastProvider } from '../components/ToastProvider';
import LatestChatterCarousel from '../components/LatestChatterCarousel';
import HomePostStream from '../components/HomePostStream';
import PhotoWallCarousel from '../components/PhotoWallCarousel';
import WeatherWidget from '../components/WeatherWidget';

function formatUpdateTime(dateString: string) {
  if (!dateString || dateString === '1970-01-01') return '刚刚更新';

  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');

    if (hours === '00' && mins === '00') return `${year}.${month}.${day}`;
    return `${year}.${month}.${day} ${hours}:${mins}`;
  } catch {
    return dateString;
  }
}

export default function Home() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  let allPosts: any[] = [];

  try {
    if (fs.existsSync(postsDirectory)) {
      const fileNames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'));

      allPosts = fileNames.map(fileName => {
        const fullPath = path.join(postsDirectory, fileName);
        const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
        const rawDate = data.date || '1970-01-01';

        return {
          slug: fileName.replace(/\.md$/, ''),
          ...data,
          title: data.title || '',
          description: data.description || '',
          cover: data.cover || siteConfig.defaultPostCover,
          content: content || '',
          date: rawDate,
          formattedDate: formatUpdateTime(rawDate)
        };
      }).sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateB !== dateA) return dateB - dateA;
        return b.slug.localeCompare(a.slug);
      });
    }
  } catch {}

  const topPosts = allPosts.length > 0
    ? allPosts.slice(0, 5)
    : [{
        slug: 'none',
        title: '暂无文章',
        description: '快去写第一篇吧！',
        cover: siteConfig.defaultPostCover,
        date: '',
        formattedDate: ''
      }];

  const chattersDirectory = path.join(process.cwd(), 'chatters');
  let allChatters: any[] = [];

  try {
    if (fs.existsSync(chattersDirectory)) {
      const chatterFiles = fs.readdirSync(chattersDirectory).filter(f => f.endsWith('.md'));

      allChatters = chatterFiles.map(fileName => {
        const fullPath = path.join(chattersDirectory, fileName);
        const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
        const rawDate = data.date || '1970-01-01';
        const cover = data.cover || siteConfig.defaultPostCover;

        return {
          slug: fileName.replace(/\.md$/, ''),
          title: data.title || '碎片记录',
          description: data.description || content.substring(0, 60),
          cover,
          date: rawDate,
          formattedDate: formatUpdateTime(rawDate)
        };
      }).sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateB !== dateA) return dateB - dateA;
        return b.slug.localeCompare(a.slug);
      });
    }
  } catch {}

  const top5Chatters = allChatters.length > 0
    ? allChatters.slice(0, 5)
    : [{
        slug: 'none',
        title: '暂无记录',
        description: '记录一段思绪...',
        cover: siteConfig.defaultPostCover,
        date: '',
        formattedDate: ''
      }];

  const chatterCount = allChatters.length;
  const realPhotoCount = albums.reduce((total, album) => total + album.photos.length, 0);
  const heroImage = siteConfig.bgImages?.[0] || siteConfig.defaultPostCover;
  const heroEyebrow = siteConfig.heroEyebrow || siteConfig.navAfter || 'Learning Archive';
  const heroTitle = siteConfig.heroTitle || siteConfig.title;
  const heroSubtitle = siteConfig.heroSubtitle || siteConfig.bio;
  const latestUpdateTimestamps = [
    siteConfig.buildDate,
    ...allPosts.map((post) => post.date),
    ...allChatters.map((chatter) => chatter.date),
  ]
    .map((date) => new Date(date).getTime())
    .filter((time) => Number.isFinite(time));
  const latestUpdatedAt = latestUpdateTimestamps.length
    ? new Date(Math.max(...latestUpdateTimestamps)).toISOString()
    : siteConfig.buildDate;

  return (
    <ToastProvider>
      <div className="min-h-screen relative pb-16">
        <Navbar />
        <PageTransition>
          <section className="relative flex min-h-[72vh] w-full items-center justify-center overflow-hidden md:min-h-[86vh]">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.55),rgba(49,46,129,0.20),rgba(255,255,255,0.12))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_32%,rgba(255,255,255,0.32),transparent_34%)]" />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-50 via-slate-50/75 to-transparent dark:from-slate-950 dark:via-slate-950/75" />

            <div className="relative z-10 mx-auto flex w-[90%] max-w-5xl flex-col items-center px-4 text-center text-white">
              <p className="mb-5 rounded-full border border-white/25 bg-white/15 px-5 py-2 text-[11px] font-black uppercase tracking-[0.36em] shadow-lg backdrop-blur-md">
                {heroEyebrow}
              </p>
              <h1 className="text-5xl font-black tracking-tight drop-shadow-2xl md:text-7xl">
                {heroTitle}
              </h1>
              <p className="mt-6 max-w-3xl text-base font-medium leading-relaxed text-white/90 drop-shadow md:text-xl">
                {heroSubtitle}
              </p>
            </div>
          </section>

          <div className="relative z-20 mx-auto -mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-10">
            <SearchBar posts={allPosts} />

            <main className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
              <aside className="flex flex-col gap-6 lg:col-span-3">
                <ProfileCard
                  postCount={allPosts.length}
                  chatterCount={chatterCount}
                  photoCount={realPhotoCount}
                />
                <PhotoWallCarousel albums={albums} />
                <SiteDashboard latestUpdatedAt={latestUpdatedAt} />
              </aside>

              <section className="flex flex-col gap-6 lg:col-span-6">
                <HomePostStream posts={topPosts} />
                <LatestChatterCarousel chatters={top5Chatters} />
              </section>

              <aside className="flex flex-col gap-6 lg:col-span-3">
                <CloudPlayer />
                <WeatherWidget />
              </aside>
            </main>
          </div>
        </PageTransition>
      </div>
    </ToastProvider>
  );
}
