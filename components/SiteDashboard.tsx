"use client";

import { useEffect, useState } from 'react';
import { siteConfig } from '../siteConfig';

type SiteDashboardProps = {
  latestUpdatedAt?: string;
};

function formatDuration(diff: number, suffix = '') {
  const safeDiff = Math.max(0, diff);
  const days = Math.floor(safeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((safeDiff / (1000 * 60 * 60)) % 24);

  return `${days}天 ${hours}小时${suffix}`;
}

export default function SiteDashboard({ latestUpdatedAt }: SiteDashboardProps) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [uptimeStr, setUptimeStr] = useState('');
  const [latestUpdateStr, setLatestUpdateStr] = useState('');

  useEffect(() => {
    const startTime = new Date(siteConfig.buildDate || '2026-03-23T00:00:00').getTime();
    const latestUpdateTime = new Date(latestUpdatedAt || siteConfig.buildDate || Date.now()).getTime();

    const updateTime = () => {
      const now = new Date();

      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }));

      setUptimeStr(formatDuration(now.getTime() - startTime));
      setLatestUpdateStr(formatDuration(now.getTime() - latestUpdateTime, '前'));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [latestUpdatedAt]);

  const [hour = '00', minute = '00', second = '00'] = (timeStr || '00:00:00').split(':');

  return (
    <div className="group overflow-hidden rounded-[32px] border border-white/50 bg-white/45 shadow-xl backdrop-blur-xl transition-colors duration-700 dark:border-white/10 dark:bg-slate-800/55">
      <div className="bg-white/70 px-4 py-5 text-slate-900 shadow-inner transition-colors duration-700 dark:bg-black dark:text-white">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.32em] text-indigo-500 dark:text-indigo-300">
          Local Time
        </p>

        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 font-mono">
          <ClockUnit value={hour} />
          <span className="pb-1 text-xl font-black text-slate-300 dark:text-white/45">:</span>
          <ClockUnit value={minute} />
          <span className="pb-1 text-xl font-black text-slate-300 dark:text-white/45">:</span>
          <ClockUnit value={second} isMuted />
        </div>

        <p className="mt-3 text-xs font-bold text-slate-500 dark:text-white/55">{dateStr || '同步时间中'}</p>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.28em] text-indigo-500 dark:text-indigo-300">
            Site Status
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-black text-emerald-600 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Online
          </span>
        </div>

        <div className="space-y-3 text-xs font-bold text-slate-600 dark:text-slate-300">
          <div className="flex items-baseline justify-between gap-3">
            <span>正常运行时间</span>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-300">{uptimeStr || '计算中'}</span>
          </div>
          <div className="flex items-baseline justify-between gap-3 border-t border-slate-200/70 pt-3 dark:border-white/10">
            <span>最近更新时间</span>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-300">{latestUpdateStr || '计算中'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClockUnit({ value, isMuted = false }: { value: string; isMuted?: boolean }) {
  return (
    <span
      className={`relative overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/85 px-2 py-2 text-center text-xl font-black leading-none shadow-inner dark:border-white/10 dark:bg-white/10 ${
        isMuted ? 'text-slate-500 dark:text-white/70' : 'text-slate-900 dark:text-white'
      }`}
    >
      {value}
    </span>
  );
}
