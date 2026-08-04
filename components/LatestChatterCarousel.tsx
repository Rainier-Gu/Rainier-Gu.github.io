// components/LatestChatterCarousel.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function LatestChatterCarousel({ chatters }: { chatters: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (chatters.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % chatters.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [chatters.length]);

  if (!chatters || chatters.length === 0) return null;

  const currentChatter = chatters[currentIndex];

  const holoVariants = {
    initial: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 1.05, filter: "blur(10px)" },
  };

  return (
    // 🌟 注意这里：去掉了 md:col-span-8，变成一个纯粹填满父容器的组件
    <div className="w-full h-full rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-xl overflow-hidden relative group min-h-[220px] flex flex-col">
      <Link href={currentChatter.slug === 'none' ? '/chatter' : `/chatter/${currentChatter.slug}`} className="absolute inset-0 z-20" aria-label={`查看杂谈: ${currentChatter.title}`} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentChatter.slug}
          variants={holoVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <img src={currentChatter.cover} className="w-full h-full object-cover opacity-45 dark:opacity-60 transition-transform duration-1000 group-hover:scale-105" alt="Chatter Cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-white/20 dark:hidden"></div>
          <div className="absolute inset-0 hidden bg-gradient-to-r from-black/80 via-black/40 to-black/10 dark:block"></div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex flex-col justify-center p-6 md:p-8 h-full pointer-events-none w-full md:w-[85%]">
        <div className="flex items-end gap-2 mb-2">
          <span className="type-label text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase bg-white/70 dark:bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md border border-white/60 dark:border-white/10 shadow-sm">
            Records
          </span>
          {currentChatter.formattedDate && (
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-300 drop-shadow-sm">
              {currentChatter.formattedDate}
            </span>
          )}
        </div>

        <h3 className="type-card-title text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-1 drop-shadow-sm">
          {currentChatter.title}
        </h3>
        <p className="type-summary text-sm text-slate-600 dark:text-slate-300 font-medium drop-shadow-sm line-clamp-2">
          {currentChatter.description}
        </p>
      </div>

      {chatters.length > 1 && (
        <div className="absolute bottom-5 right-6 z-30 flex gap-2">
          {chatters.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
              className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${i === currentIndex ? 'w-6 bg-indigo-500 dark:bg-indigo-400' : 'w-2 bg-slate-900/25 hover:bg-slate-900/55 dark:bg-white/40 dark:hover:bg-white/80'}`}
              aria-label={`跳转`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
