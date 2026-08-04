"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '../siteConfig';

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    try {
      const hasSeenSplash = sessionStorage.getItem('hasSeenSplash') === 'true';

      if (hasSeenSplash) {
        document.documentElement.classList.add('splash-seen', 'splash-skip');
        setShow(false);
        return;
      }
    } catch {
      // 无痕模式或浏览器禁用存储时，仍正常播放一次启动画面。
    }

    const timer = window.setTimeout(() => {
      document.documentElement.classList.add('splash-seen');
      setShow(false);

      try {
        sessionStorage.setItem('hasSeenSplash', 'true');
      } catch {
        // 存储失败不影响页面进入。
      }
    }, 950);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          id="splash-screen"
          key="splash-screen-container"
          exit={{ opacity: 0, scale: 1.04, filter: "blur(12px)" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-white dark:bg-slate-950"
        >
          <div className="relative z-10 flex flex-col items-center">
            {/* 头像光环 */}
            <div className="relative w-24 h-24 mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60 blur-[3px]"
              />
              <div className="relative w-full h-full rounded-full p-1.5 bg-white dark:bg-slate-900 shadow-xl">
                <img src={siteConfig.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              </div>
            </div>

            <h1 className="type-page-title text-2xl text-slate-800 dark:text-white mb-2 uppercase">
              {siteConfig.authorName}
            </h1>
            <p className="type-kicker text-[12px] text-slate-400 mb-12">INITIALIZING SYSTEM</p>

            <div className="w-40 h-[1.5px] bg-slate-200 dark:bg-slate-800 relative">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
