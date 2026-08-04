"use client";

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import {
  ArrowDownAZ,
  ArrowUpZA,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Ghost,
  MapPin,
  MessageSquare,
  Search,
  X,
} from 'lucide-react';

import MomentComments from '../../components/MomentComments';

type Moment = {
  id: string;
  date: string;
  location?: string;
  images?: string[];
  content: string;
};

type MomentListProps = {
  moments: Moment[];
  authorName: string;
  avatarUrl: string;
};

const PAPER_STYLES = [
  {
    paper: 'bg-[#e1f4ff] dark:bg-[#173548]',
    border: 'border-sky-200/80 dark:border-sky-300/15',
    pin: 'bg-sky-400',
    accent: 'text-sky-700 dark:text-sky-200',
  },
  {
    paper: 'bg-[#eee6ff] dark:bg-[#30294a]',
    border: 'border-violet-200/80 dark:border-violet-300/15',
    pin: 'bg-violet-500',
    accent: 'text-violet-700 dark:text-violet-200',
  },
  {
    paper: 'bg-[#fff3cf] dark:bg-[#473a22]',
    border: 'border-amber-200/80 dark:border-amber-300/15',
    pin: 'bg-amber-400',
    accent: 'text-amber-700 dark:text-amber-200',
  },
  {
    paper: 'bg-[#ffe3ea] dark:bg-[#472a36]',
    border: 'border-rose-200/80 dark:border-rose-300/15',
    pin: 'bg-rose-400',
    accent: 'text-rose-700 dark:text-rose-200',
  },
  {
    paper: 'bg-[#e4f7eb] dark:bg-[#203d34]',
    border: 'border-emerald-200/80 dark:border-emerald-300/15',
    pin: 'bg-emerald-400',
    accent: 'text-emerald-700 dark:text-emerald-200',
  },
];

const NOTE_ROTATIONS = [-1.4, 1.1, -0.7, 1.6, -1, 0.8];

function stableNumber(value: string) {
  return Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0);
}

function parseMomentDate(value: string) {
  const normalized = String(value || '').trim().replace('T', ' ');
  const [rawDate = '', rawTime = ''] = normalized.split(/\s+/);
  const dateLabel = /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? rawDate.replace(/-/g, '.') : rawDate;
  const timeLabel = /^\d{2}:\d{2}/.test(rawTime) ? rawTime.slice(0, 5) : '';

  return { dateLabel: dateLabel || '日期待补充', timeLabel };
}

function momentTimestamp(value: string) {
  const timestamp = new Date(String(value || '').replace(' ', 'T')).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export default function MomentList({ moments, authorName, avatarUrl }: MomentListProps) {
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  const processedMoments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const result = (moments || []).filter((moment) => {
      if (!query) return true;
      return (
        (moment.content || '').toLowerCase().includes(query) ||
        (moment.location || '').toLowerCase().includes(query)
      );
    });

    return result.sort((a, b) => {
      const difference = momentTimestamp(b.date) - momentTimestamp(a.date);
      return sortOrder === 'desc' ? difference : -difference;
    });
  }, [moments, searchQuery, sortOrder]);

  const activeCommentMoment = useMemo(
    () => moments.find((moment) => moment.id === openCommentId) || null,
    [moments, openCommentId]
  );

  useEffect(() => {
    if (!lightbox && !openCommentId) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox, openCommentId]);

  useEffect(() => {
    const closeOverlay = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setLightbox(null);
      setOpenCommentId(null);
    };

    window.addEventListener('keydown', closeOverlay);
    return () => window.removeEventListener('keydown', closeOverlay);
  }, []);

  const showNextImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!lightbox) return;
    setLightbox({ ...lightbox, index: (lightbox.index + 1) % lightbox.images.length });
  };

  const showPreviousImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!lightbox) return;
    setLightbox({
      ...lightbox,
      index: (lightbox.index - 1 + lightbox.images.length) % lightbox.images.length,
    });
  };

  const renderImages = (images: string[] = []) => {
    if (images.length === 0) return null;

    if (images.length === 1) {
      return (
        <button
          type="button"
          onClick={() => setLightbox({ images, index: 0 })}
          className="group/image relative z-10 mt-5 block w-full overflow-hidden rounded-xl border-4 border-white/65 bg-white/40 shadow-md"
          aria-label="查看说说图片"
        >
          <img
            src={images[0]}
            alt="说说图片"
            className="max-h-72 w-full object-cover transition duration-500 group-hover/image:scale-105"
          />
        </button>
      );
    }

    const columns = images.length === 4 ? 2 : 3;

    return (
      <div
        className="relative z-10 mt-5 grid gap-1.5 overflow-hidden rounded-xl border-4 border-white/65 bg-white/55 p-1 shadow-md"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {images.slice(0, 9).map((src, index) => {
          const hasMore = index === 8 && images.length > 9;
          return (
            <button
              type="button"
              key={`${src}-${index}`}
              onClick={() => setLightbox({ images, index })}
              className="group/image relative aspect-square overflow-hidden rounded-md bg-slate-200/50"
              aria-label={`查看第 ${index + 1} 张说说图片`}
            >
              <img
                src={src}
                alt={`说说图片 ${index + 1}`}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover/image:scale-110"
              />
              {hasMore && (
                <span className="absolute inset-0 flex items-center justify-center bg-slate-950/65 text-sm font-black text-white">
                  +{images.length - 9}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const renderMomentCard = (moment: Moment, animationIndex: number) => {
    const styleSeed = stableNumber(moment.id);
    const paperStyle = PAPER_STYLES[styleSeed % PAPER_STYLES.length];
    const noteRotation = NOTE_ROTATIONS[styleSeed % NOTE_ROTATIONS.length];
    const { dateLabel, timeLabel } = parseMomentDate(moment.date);

    return (
      <motion.article
        key={moment.id}
        layout
        initial={{ opacity: 0, y: 28, rotate: noteRotation * 1.8 }}
        animate={{ opacity: 1, y: 0, rotate: noteRotation }}
        exit={{ opacity: 0, y: 20, scale: 0.92 }}
        whileHover={{ y: -8, rotate: 0, scale: 1.015 }}
        transition={{ duration: 0.38, delay: Math.min(animationIndex * 0.04, 0.28) }}
        className="relative mb-8 inline-flex w-full break-inside-avoid flex-col align-top drop-shadow-[0_18px_18px_rgba(15,23,42,0.15)]"
      >
        <span aria-hidden="true" className="absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-1/2">
          <span className={`block h-5 w-5 rounded-full border-2 border-white/70 shadow-[0_4px_7px_rgba(15,23,42,0.28)] ${paperStyle.pin}`} />
          <span className="mx-auto -mt-0.5 block h-3 w-0.5 bg-slate-500/45" />
        </span>

        <div className={`relative flex min-h-[260px] flex-col overflow-hidden rounded-[4px] border px-5 pb-5 pt-10 ${paperStyle.paper} ${paperStyle.border}`}>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-75"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(100, 116, 139, 0.16) 32px)',
            }}
          />
          <span aria-hidden="true" className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/20 blur-xl" />

          <p className="relative z-10 whitespace-pre-wrap break-words text-[15px] font-semibold leading-8 tracking-wide text-slate-800 dark:text-slate-100">
            {moment.content}
          </p>

          {renderImages(moment.images)}

          <div className="relative z-10 mt-auto pt-7">
            <div className="border-t border-slate-500/15 pt-3 text-[10px] font-bold text-slate-600/75 dark:text-slate-200/65">
              <div className="flex items-center gap-2">
                <img src={avatarUrl} alt="" className="h-5 w-5 rounded-full border border-white/70 object-cover shadow-sm" />
                <span className={`truncate text-xs font-black ${paperStyle.accent}`}>{authorName}</span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays size={12} aria-hidden="true" />
                  {dateLabel}
                </span>
                {timeLabel && (
                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={12} aria-hidden="true" />
                    {timeLabel}
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="min-w-0 truncate">
                  {moment.location && (
                    <span className="inline-flex max-w-full items-center gap-1 truncate">
                      <MapPin size={12} className="shrink-0" aria-hidden="true" />
                      <span className="truncate">{moment.location}</span>
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => setOpenCommentId(moment.id)}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/55 text-slate-600 shadow-sm ring-1 ring-inset ring-white/65 transition hover:-translate-y-0.5 hover:bg-white hover:text-indigo-600 dark:bg-black/15 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-black/30"
                  aria-label="查看或发表留言"
                  title="查看或发表留言"
                >
                  <MessageSquare size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    );
  };

  return (
    <div className="relative z-10 mx-auto mt-28 flex min-h-[85vh] w-full max-w-7xl flex-1 flex-col px-4 sm:px-10">
      <div className="animate-fade-in-up">
        <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 text-4xl font-black tracking-widest text-slate-900 transition-colors duration-700 dark:text-white md:text-5xl"
            >
              说说
            </motion.h1>
            <p className="font-medium tracking-wider text-slate-600 transition-colors duration-700 dark:text-slate-400">
              把一闪而过的心情，钉在生活的软木板上。
            </p>
          </div>

          <div className="group relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-indigo-500 dark:text-slate-400" />
            <input
              type="search"
              placeholder="搜索说说内容或地点..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-12 w-full rounded-full border border-white/50 bg-white/40 pl-12 pr-4 text-sm text-slate-800 shadow-sm backdrop-blur-md transition-all duration-700 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:border-white/10 dark:bg-slate-800/40 dark:text-white dark:placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <section className="relative mb-24 min-h-[430px] overflow-hidden rounded-[38px] border border-white/60 bg-white/45 p-5 shadow-[0_28px_70px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/55 sm:p-8 md:p-10">
        <div className="relative z-10 mb-8 flex justify-end">
          <div className="flex w-fit rounded-xl border border-white/60 bg-white/55 p-1 shadow-sm dark:border-white/10 dark:bg-slate-800/60">
            <button
              type="button"
              onClick={() => setSortOrder('desc')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-black transition ${
                sortOrder === 'desc'
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300'
              }`}
            >
              <ArrowDownAZ size={13} aria-hidden="true" />
              最新
            </button>
            <button
              type="button"
              onClick={() => setSortOrder('asc')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-black transition ${
                sortOrder === 'asc'
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300'
              }`}
            >
              <ArrowUpZA size={13} aria-hidden="true" />
              最早
            </button>
          </div>
        </div>

        <LayoutGroup>
          {processedMoments.length > 0 ? (
            <div className="relative z-10 columns-1 gap-7 sm:columns-2 lg:columns-3 xl:columns-4">
              <AnimatePresence mode="popLayout">
                {processedMoments.map((moment, index) => renderMomentCard(moment, index))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 flex min-h-[280px] flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300/70 bg-white/30 px-6 text-center dark:border-white/10 dark:bg-slate-800/25"
            >
              <span className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-500">
                <Ghost size={38} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {searchQuery ? '没有找到相关便利贴' : '便利贴墙还是空的'}
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {searchQuery ? '换一个关键词再试试吧。' : '在 moments 目录中新建 Markdown 文件即可添加说说。'}
              </p>
            </motion.div>
          )}
        </LayoutGroup>
      </section>

      <AnimatePresence>
        {activeCommentMoment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9990] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
            onClick={() => setOpenCommentId(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="说说留言"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              onClick={(event) => event.stopPropagation()}
              className="max-h-[86vh] w-full max-w-3xl overflow-y-auto rounded-[30px] border border-white/60 bg-slate-50 p-5 shadow-2xl dark:border-white/10 dark:bg-slate-900 sm:p-7"
            >
              <div className="mb-5 flex items-start justify-between gap-5 border-b border-slate-200 pb-5 dark:border-white/10">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-indigo-500">Moment Comments</p>
                  <p className="mt-2 line-clamp-2 text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">
                    {activeCommentMoment.content}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenCommentId(null)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200/70 text-slate-600 transition hover:bg-indigo-500 hover:text-white dark:bg-white/10 dark:text-white"
                  aria-label="关闭留言面板"
                >
                  <X size={17} aria-hidden="true" />
                </button>
              </div>
              <MomentComments id={`/moments/${activeCommentMoment.id}`} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex cursor-pointer items-center justify-center overflow-hidden bg-slate-950/95 backdrop-blur-xl"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute right-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="关闭图片预览"
            >
              <X size={20} aria-hidden="true" />
            </button>

            {lightbox.images.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/20 md:left-12 md:h-14 md:w-14"
                  onClick={showPreviousImage}
                  aria-label="上一张图片"
                >
                  <ChevronLeft size={28} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="absolute right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/20 md:right-12 md:h-14 md:w-14"
                  onClick={showNextImage}
                  aria-label="下一张图片"
                >
                  <ChevronRight size={28} aria-hidden="true" />
                </button>
              </>
            )}

            <motion.div
              key={lightbox.index}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="pointer-events-none flex h-full w-full flex-col items-center justify-center p-5 md:p-14"
            >
              <img
                src={lightbox.images[lightbox.index]}
                className="pointer-events-auto max-h-[84vh] max-w-full rounded-2xl border border-white/10 object-contain shadow-[0_0_80px_rgba(0,0,0,0.55)]"
                alt="说说图片预览"
              />
              <span className="absolute bottom-8 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black tracking-widest text-white/90 backdrop-blur-md">
                {lightbox.index + 1} / {lightbox.images.length}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
