import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '../../../utils/apiSecurity';

const NET_EASE_HEADERS = {
  'User-Agent': 'RainierGu-Music-Proxy/1.0',
  Referer: 'https://music.163.com/',
};
const MAX_SONGS = 12;
const SONG_ID_PATTERN = /^\d{1,20}$/;

type SongResult = {
  id: string;
  name?: string;
  artist?: string;
  author?: string;
  cover?: string;
  pic?: string;
  url?: string;
  lrc?: string;
  error?: string;
};

function safeText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.slice(0, maxLength) : '';
}

export async function GET(request: NextRequest) {
  const rateLimit = checkRateLimit(request, {
    keyPrefix: 'music',
    limit: 60,
    windowMs: 60 * 1_000,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          ...rateLimit.headers,
          'Retry-After': String(rateLimit.retryAfter),
          'Cache-Control': 'no-store',
        },
      },
    );
  }

  const rawIds = request.nextUrl.searchParams.get('ids') || '';
  if (!rawIds || rawIds.length > 300) {
    return NextResponse.json(
      { error: 'Invalid ids parameter' },
      { status: 400, headers: { 'Cache-Control': 'no-store', ...rateLimit.headers } },
    );
  }

  const songIds = [...new Set(rawIds.split(',').map((id) => id.trim()).filter(Boolean))];
  if (
    songIds.length === 0
    || songIds.length > MAX_SONGS
    || songIds.some((id) => !SONG_ID_PATTERN.test(id))
  ) {
    return NextResponse.json(
      { error: `ids must contain 1–${MAX_SONGS} numeric song IDs` },
      { status: 400, headers: { 'Cache-Control': 'no-store', ...rateLimit.headers } },
    );
  }

  const results: SongResult[] = await Promise.all(
    songIds.map(async (songId): Promise<SongResult> => {
      try {
        const [detailRes, lrcRes] = await Promise.all([
          fetch(
            `https://music.163.com/api/song/detail/?id=${songId}&ids=[${songId}]`,
            {
              headers: NET_EASE_HEADERS,
              signal: AbortSignal.timeout(6_000),
              next: { revalidate: 3_600 },
            },
          ),
          fetch(
            `https://music.163.com/api/song/lyric?id=${songId}&lv=-1&kv=-1&tv=-1`,
            {
              headers: NET_EASE_HEADERS,
              signal: AbortSignal.timeout(6_000),
              next: { revalidate: 3_600 },
            },
          ).catch(() => null),
        ]);

        if (!detailRes.ok) return { id: songId, error: 'upstream_error' };
        const detail = await detailRes.json().catch(() => null);
        const song = detail?.songs?.[0];
        if (!song) return { id: songId, error: 'not_found' };

        let lrcText = '';
        if (lrcRes?.ok) {
          const lrcData = await lrcRes.json().catch(() => null);
          lrcText = safeText(lrcData?.lrc?.lyric, 100_000);
        }

        const artistName = safeText(song.artists?.[0]?.name, 200) || '未知歌手';
        const cover = safeText(song.album?.picUrl, 1_000);

        return {
          id: songId,
          name: safeText(song.name, 300),
          artist: artistName,
          author: artistName,
          cover,
          pic: cover,
          url: `https://music.163.com/song/media/outer/url?id=${songId}.mp3`,
          lrc: lrcText,
        };
      } catch (error) {
        console.error(`[api/music] Upstream request failed for ${songId}:`, error instanceof Error ? error.name : 'unknown');
        return { id: songId, error: 'upstream_error' };
      }
    }),
  );

  return NextResponse.json(results, {
    headers: {
      ...rateLimit.headers,
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
