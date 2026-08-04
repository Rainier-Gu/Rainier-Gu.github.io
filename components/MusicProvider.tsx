"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { siteConfig } from "../siteConfig";

type PlayMode = "loop" | "single" | "random";
type MusicSource = "local" | "netease";

type LyricLine = {
  time: number;
  text: string;
};

type MusicTrack = {
  id: string;
  title: string;
  name?: string;
  artist: string;
  author?: string;
  album?: string;
  cover: string;
  pic?: string;
  src: string;
  lrc?: string;
  lyric?: string;
  lrcUrl?: string;
  lyrics?: LyricLine[] | string;
  source: MusicSource;
};

interface MusicContextType {
  playlist: MusicTrack[];
  currentIndex: number;
  currentSong?: MusicTrack;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  currentLyric: string;
  isLoading: boolean;
  volume: number;
  isMuted: boolean;
  playMode: PlayMode;

  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  playSong: (index: number) => void;
  selectSong: (index: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  togglePlayMode: () => void;
}

const DEFAULT_COVER = "/assets/img/posts/research-writing-cover.svg";
const DEFAULT_LYRIC = "♪ 纯享音乐 ♪";

function parseLrc(lrcText: string): LyricLine[] {
  if (!lrcText || lrcText.length > 30000) return [];

  const lines = lrcText.split(/\r?\n/);
  const result: LyricLine[] = [];

  for (const line of lines) {
    const matches = [...line.matchAll(/\[(\d{2,}):(\d{2})(?:[.:](\d{2,3}))?\]/g)];
    if (matches.length === 0) continue;

    const cleanText = line
      .replace(/\[\d{2,}:\d{2}(?:[.:]\d{2,3})?\]/g, "")
      .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, "")
      .trim();

    if (!cleanText) continue;

    for (const match of matches) {
      const min = Number.parseInt(match[1], 10);
      const sec = Number.parseInt(match[2], 10);
      const fraction = match[3] || "0";
      const divisor = fraction.length === 3 ? 1000 : 100;
      const time = min * 60 + sec + Number.parseInt(fraction, 10) / divisor;
      result.push({ time, text: cleanText });
    }
  }

  return result.sort((a, b) => a.time - b.time);
}

function normalizeLyrics(track: Partial<MusicTrack>): LyricLine[] {
  if (Array.isArray(track.lyrics)) return track.lyrics;
  if (typeof track.lyrics === "string") return parseLrc(track.lyrics);
  if (track.lrc) return parseLrc(track.lrc);
  if (track.lyric) return parseLrc(track.lyric);
  return [];
}

function normalizeLocalTracks(): MusicTrack[] {
  const localTracks: Array<Record<string, any>> = Array.isArray(siteConfig.localMusicTracks)
    ? siteConfig.localMusicTracks
    : [];

  return localTracks
    .filter((track) => track && (track.src || track.url))
    .map((track, index) => ({
      id: String(track.id || `local-${index + 1}`),
      title: track.title || track.name || `本地音乐 ${index + 1}`,
      name: track.title || track.name || `本地音乐 ${index + 1}`,
      artist: track.artist || track.author || "未知歌手",
      author: track.artist || track.author || "未知歌手",
      album: track.album,
      cover: track.cover || track.pic || DEFAULT_COVER,
      pic: track.cover || track.pic || DEFAULT_COVER,
      src: track.src || track.url,
      lrc: track.lrc || track.lyric,
      lrcUrl: track.lrcUrl,
      lyrics: normalizeLyrics(track),
      source: "local" as const,
    }));
}

function normalizeCloudTrack(song: any, index: number): MusicTrack | null {
  if (!song || song.error || !song.url) return null;

  const artist = song.artist || song.author || "未知歌手";

  return {
    id: String(song.id || `netease-${index + 1}`),
    title: song.name || song.title || `云端音乐 ${index + 1}`,
    name: song.name || song.title || `云端音乐 ${index + 1}`,
    artist,
    author: artist,
    cover: song.cover || song.pic || DEFAULT_COVER,
    pic: song.cover || song.pic || DEFAULT_COVER,
    src: song.url,
    lrc: song.lrc,
    lrcUrl: song.lrcUrl,
    lyrics: song.lrc ? parseLrc(song.lrc) : [],
    source: "netease",
  };
}

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [playlist, setPlaylist] = useState<MusicTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [currentLyric, setCurrentLyric] = useState("正在加载播放列表...");
  const [isLoading, setIsLoading] = useState(true);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>("loop");

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentSong = playlist[currentIndex];

  useEffect(() => {
    let isMounted = true;

    async function loadPlaylist() {
      setIsLoading(true);

      const localPlaylist = normalizeLocalTracks();
      let cloudPlaylist: MusicTrack[] = [];
      const cloudIds = Array.isArray(siteConfig.cloudMusicIds)
        ? siteConfig.cloudMusicIds.map((id) => String(id).trim()).filter(Boolean)
        : [];

      if (cloudIds.length > 0) {
        try {
          const res = await fetch(`/api/music?ids=${cloudIds.join(",")}`);
          const rawResults = await res.json();

          if (Array.isArray(rawResults)) {
            cloudPlaylist = rawResults
              .map((song, index) => normalizeCloudTrack(song, index))
              .filter((song): song is MusicTrack => Boolean(song));
          }
        } catch (error) {
          console.error("[MusicProvider] 网易云音乐列表获取失败，已继续使用本地音乐：", error);
        }
      }

      if (!isMounted) return;

      const mergedPlaylist = [...localPlaylist, ...cloudPlaylist];
      setPlaylist(mergedPlaylist);
      setCurrentIndex(0);
      setCurrentLyric(
        mergedPlaylist.length > 0
          ? "♪ 播放列表已准备好 ♪"
          : "请在 siteConfig.ts 配置 localMusicTracks 或 cloudMusicIds",
      );
      setIsLoading(false);
    }

    loadPlaylist();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!currentSong) {
      setLyrics([]);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    let isMounted = true;

    async function loadLyrics() {
      setLyrics([]);
      setCurrentLyric("♪ 正在缓冲 ♪");

      const builtInLyrics = normalizeLyrics(currentSong);
      if (builtInLyrics.length > 0) {
        setLyrics(builtInLyrics);
        setCurrentLyric(builtInLyrics[0]?.text || DEFAULT_LYRIC);
        return;
      }

      if (!currentSong.lrcUrl) {
        setCurrentLyric(DEFAULT_LYRIC);
        return;
      }

      try {
        const res = await fetch(currentSong.lrcUrl);
        const text = await res.text();
        const parsed = parseLrc(text);

        if (!isMounted) return;

        setLyrics(parsed);
        setCurrentLyric(parsed[0]?.text || DEFAULT_LYRIC);
        setPlaylist((prev) =>
          prev.map((song, index) => (index === currentIndex ? { ...song, lyrics: parsed } : song)),
        );
      } catch (error) {
        console.error(`[MusicProvider] 歌词文件加载失败：${currentSong.lrcUrl}`, error);
        if (isMounted) setCurrentLyric(DEFAULT_LYRIC);
      }
    }

    loadLyrics();

    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }

    return () => {
      isMounted = false;
    };
  }, [currentIndex, playlist.length]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        setIsPlaying(false);
        setCurrentLyric("当前音频暂时无法播放，请检查文件路径或外链");
      });
  };

  const nextSong = () => {
    if (playlist.length === 0) return;

    if (playMode === "random") {
      setCurrentIndex(Math.floor(Math.random() * playlist.length));
      return;
    }

    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  };

  const prevSong = () => {
    if (playlist.length === 0) return;

    if (playMode === "random") {
      setCurrentIndex(Math.floor(Math.random() * playlist.length));
      return;
    }

    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const playSong = (index: number) => {
    if (index < 0 || index >= playlist.length) return;

    setCurrentIndex(index);
    setIsPlaying(true);

    if (index === currentIndex && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    const { currentTime: audioCurrentTime, duration: audioDuration } = audioRef.current;
    const safeDuration = Number.isFinite(audioDuration) ? audioDuration : 0;

    setCurrentTime(audioCurrentTime);
    setDuration(safeDuration);
    setProgress(safeDuration > 0 ? (audioCurrentTime / safeDuration) * 100 : 0);

    if (lyrics.length > 0) {
      const activeLyric = lyrics.slice().reverse().find((line) => audioCurrentTime >= line.time);
      if (activeLyric && activeLyric.text !== currentLyric) {
        setCurrentLyric(activeLyric.text);
      }
    }
  };

  const handleEnded = () => {
    if (playMode === "single" && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setIsPlaying(false));
      return;
    }

    nextSong();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(e.target.value);
    setProgress(newProgress);

    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    }
  };

  const setVolume = (value: number) => {
    setVolumeState(value);
    if (isMuted && value > 0) setIsMuted(false);
  };

  const toggleMute = () => setIsMuted((prev) => !prev);

  const togglePlayMode = () => {
    setPlayMode((prev) => {
      if (prev === "loop") return "single";
      if (prev === "single") return "random";
      return "loop";
    });
  };

  return (
    <MusicContext.Provider
      value={{
        playlist,
        currentIndex,
        currentSong,
        isPlaying,
        progress,
        currentTime,
        duration,
        currentLyric,
        isLoading,
        volume,
        isMuted,
        playMode,
        togglePlay,
        nextSong,
        prevSong,
        handleSeek,
        playSong,
        selectSong: playSong,
        setVolume,
        toggleMute,
        togglePlayMode,
      }}
    >
      {children}
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.src}
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onLoadedMetadata={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            setIsPlaying(false);
            setCurrentLyric("当前音频暂时无法播放，请检查文件路径或外链");
          }}
        />
      )}
    </MusicContext.Provider>
  );
}

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within MusicProvider");
  return context;
};
