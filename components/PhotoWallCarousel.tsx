"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

type Photo = {
  url: string;
  caption?: string;
};

type Album = {
  id: string;
  title: string;
  description: string;
  cover: string;
  date: string;
  photos: Photo[];
};

export default function PhotoWallCarousel({ albums }: { albums: Album[] }) {
  const slides = useMemo(() => {
    return albums.flatMap((album) => {
      const albumPhotos = album.photos?.length
        ? album.photos.slice(0, 5)
        : [{ url: album.cover, caption: album.description }];

      return albumPhotos.map((photo) => ({
        ...photo,
        albumId: album.id,
        albumTitle: album.title,
        albumDate: album.date,
      }));
    }).slice(0, 12);
  }, [albums]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) {
    return (
      <Link
        href="/photowall"
        className="block rounded-[32px] bg-white/45 p-6 shadow-xl backdrop-blur-xl border border-white/50 dark:bg-slate-800/55 dark:border-white/10"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-pink-500">Photo Wall</p>
        <h2 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">照片墙</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">还没有照片，去添加第一张吧。</p>
      </Link>
    );
  }

  const current = slides[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-white/45 shadow-xl backdrop-blur-xl border border-white/50 dark:bg-slate-800/55 dark:border-white/10 min-h-[310px] group">
      <Link href="/photowall" className="absolute inset-0 z-20" aria-label="打开照片墙" />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${current.url}-${currentIndex}`}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={current.url}
            alt={current.caption || current.albumTitle}
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/55 to-white/10 dark:hidden" />
          <div className="absolute inset-0 hidden bg-gradient-to-t from-black/85 via-black/25 to-white/10 dark:block" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex min-h-[310px] flex-col justify-end p-6 text-slate-900 pointer-events-none dark:text-white">
        <div className="mb-auto flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/60 bg-white/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-slate-700 backdrop-blur-md dark:border-white/25 dark:bg-white/20 dark:text-white">
            Photo Wall
          </span>
          <span className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-bold tracking-widest text-slate-600 backdrop-blur-md dark:bg-black/25 dark:text-white">
            {current.albumDate}
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-wide drop-shadow-sm">{current.albumTitle}</h2>
          <p className="mt-2 line-clamp-2 text-sm font-medium leading-relaxed text-slate-700 dark:text-white/85">
            {current.caption || '定格时间，保存学习与生活里的每一次闪光'}
          </p>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-5 right-6 z-30 flex gap-2">
          {slides.slice(0, 6).map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIndex(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentIndex % 6 ? 'w-6 bg-slate-900 dark:bg-white' : 'w-2 bg-slate-900/30 hover:bg-slate-900/60 dark:bg-white/45 dark:hover:bg-white/80'
              }`}
              aria-label={`切换照片 ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
