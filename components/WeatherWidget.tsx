// components/WeatherWidget.tsx
"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Cloud,
  CloudRain,
  Loader2,
  LocateFixed,
  MapPin,
  RefreshCcw,
  Search,
  Snowflake,
  Sun,
  Wind,
  Droplets,
  ThermometerSun,
} from 'lucide-react';

type WeatherNow = {
  temp: string;
  feelsLike?: string;
  text: string;
  icon: string;
  humidity?: string;
  windSpeed?: string;
  windDir?: string;
};

type WeatherDaily = {
  tempMax?: string;
  tempMin?: string;
  textDay?: string;
  textNight?: string;
};

type WeatherHourly = {
  fxTime: string;
  temp: string;
  text: string;
  icon: string;
  pop?: string;
};

type WeatherData = {
  code: string;
  city: string;
  locationId?: string;
  isMock?: boolean;
  message?: string;
  now: WeatherNow;
  daily?: WeatherDaily[];
  hourly?: WeatherHourly[];
};

const SAVED_LOCATION_KEY = 'rainier-weather-location';

function getWeatherIcon(iconCode: string, size = 42) {
  const code = Number.parseInt(iconCode, 10);

  if (code === 100 || (code >= 150 && code <= 153)) {
    return <Sun className="text-amber-400 drop-shadow-sm" size={size} />;
  }

  if (code >= 300 && code <= 399) {
    return <CloudRain className="text-blue-400 drop-shadow-sm" size={size} />;
  }

  if (code >= 400 && code <= 499) {
    return <Snowflake className="text-indigo-200 drop-shadow-sm" size={size} />;
  }

  return <Cloud className="text-slate-400 drop-shadow-sm" size={size} />;
}

function formatHour(value: string, index: number) {
  if (index === 0) return '现在';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return `${index}h`;

  return `${date.getHours().toString().padStart(2, '0')}时`;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const fetchWeather = useCallback(async (location?: string, options?: { remember?: boolean }) => {
    setLoading(true);
    setError('');

    try {
      const query = location ? `?location=${encodeURIComponent(location)}` : '';
      const res = await fetch(`/api/weather${query}`);
      const data = await res.json();

      if (!res.ok || data.code !== '200') {
        throw new Error(data.message || '天气同步失败');
      }

      setWeather(data);

      if (location && options?.remember) {
        localStorage.setItem(SAVED_LOCATION_KEY, location);
      }
    } catch (err: any) {
      setError(err?.message || '天气同步失败');
      const fallbackRes = await fetch('/api/weather').catch(() => null);
      const fallback = await fallbackRes?.json().catch(() => null);
      if (fallback?.code === '200') setWeather(fallback);
    } finally {
      setLoading(false);
    }
  }, []);

  const locateAndFetch = useCallback(() => {
    if (!navigator.geolocation) {
      setError('当前浏览器不支持定位，请手动输入城市');
      fetchWeather();
      return;
    }

    setLocating(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        fetchWeather(`${longitude.toFixed(4)},${latitude.toFixed(4)}`)
          .finally(() => setLocating(false));
      },
      () => {
        setLocating(false);
        setError('定位未授权，已切换为默认城市');
        fetchWeather();
      },
      {
        enableHighAccuracy: true,
        timeout: 7000,
        maximumAge: 10 * 60 * 1000,
      }
    );
  }, [fetchWeather]);

  useEffect(() => {
    const savedLocation = localStorage.getItem(SAVED_LOCATION_KEY);

    if (savedLocation) {
      fetchWeather(savedLocation);
      return;
    }

    locateAndFetch();
  }, [fetchWeather, locateAndFetch]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextLocation = searchQuery.trim();
    if (!nextLocation) return;

    fetchWeather(nextLocation, { remember: true });
    setSearchQuery('');
  };

  const daily = weather?.daily?.[0];
  const hourly = useMemo(() => weather?.hourly?.slice(0, 5) || [], [weather?.hourly]);

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-white/50 p-5 shadow-xl backdrop-blur-xl border border-white/50 transition-all duration-700 dark:bg-slate-800/60 dark:border-white/10">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-300/25 blur-3xl dark:bg-indigo-500/20" />
      <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-sky-300/25 blur-3xl dark:bg-cyan-500/10" />

      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 dark:text-amber-300">
              Weather
            </p>
            <div className="mt-2 flex items-center gap-2">
              <MapPin size={15} className="text-indigo-500" />
              <h3 className="line-clamp-1 text-base font-black text-slate-900 dark:text-white">
                {weather?.city || '同步天气中'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={locateAndFetch}
            disabled={locating || loading}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/70 px-3 py-2 text-[11px] font-black text-slate-600 shadow-sm transition hover:bg-indigo-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-900/50 dark:text-slate-300"
            title="使用浏览器定位"
          >
            {locating ? <Loader2 size={13} className="animate-spin" /> : <LocateFixed size={13} />}
            定位
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-5 flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="输入城市，如 北京 / 上海"
              className="h-10 w-full rounded-2xl border border-white/50 bg-white/60 pl-9 pr-3 text-xs font-bold text-slate-700 outline-none transition focus:ring-2 focus:ring-indigo-400 dark:border-white/10 dark:bg-slate-950/35 dark:text-slate-100"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="h-10 rounded-2xl bg-indigo-500 px-3 text-xs font-black text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            查询
          </button>
        </form>

        {loading && !weather ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="animate-spin text-indigo-400" size={30} />
            <span className="text-[10px] font-black uppercase tracking-[0.24em]">同步气象云...</span>
          </div>
        ) : weather ? (
          <>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-start gap-1">
                  <span className="text-6xl font-black leading-none tracking-tighter text-slate-900 dark:text-white">
                    {weather.now.temp}
                  </span>
                  <span className="mt-1 text-xl font-bold text-slate-500 dark:text-slate-300">°</span>
                </div>
                <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">{weather.now.text}</p>
                {daily && (
                  <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                    最高 {daily.tempMax ?? '--'}° · 最低 {daily.tempMin ?? '--'}°
                  </p>
                )}
              </div>

              <div className="flex flex-col items-center gap-2">
                {getWeatherIcon(weather.now.icon, 58)}
                <span className="rounded-full bg-white/60 px-3 py-1 text-[10px] font-black text-slate-500 dark:bg-slate-900/40 dark:text-slate-300">
                  {weather.isMock ? '模拟' : '实时'}
                </span>
              </div>
            </div>

            {hourly.length > 0 && (
              <div className="mb-4 rounded-[24px] bg-white/45 p-3 shadow-inner dark:bg-slate-950/25">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700 dark:text-slate-200">逐小时预报</span>
                  <RefreshCcw size={13} className="text-slate-400" />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {hourly.map((item, index) => (
                    <div key={`${item.fxTime}-${index}`} className="rounded-2xl bg-white/55 px-2 py-3 text-center dark:bg-slate-900/35">
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{formatHour(item.fxTime, index)}</p>
                      <div className="my-2 flex justify-center">{getWeatherIcon(item.icon, 24)}</div>
                      <p className="text-sm font-black text-slate-900 dark:text-white">{item.temp}°</p>
                      <p className="mt-1 text-[10px] font-bold text-sky-500">{item.pop || '0'}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <Metric icon={<ThermometerSun size={15} />} label="体感" value={`${weather.now.feelsLike || weather.now.temp}°`} />
              <Metric icon={<Droplets size={15} />} label="湿度" value={`${weather.now.humidity || '--'}%`} />
              <Metric icon={<Wind size={15} />} label="风速" value={`${weather.now.windSpeed || '--'} km/h`} />
            </div>

            {(error || weather.message) && (
              <p className="mt-3 text-[11px] font-medium text-amber-600 dark:text-amber-300">
                {error || weather.message}
              </p>
            )}
          </>
        ) : (
          <div className="min-h-[260px] rounded-3xl bg-white/45 p-6 text-sm font-bold text-slate-500 dark:bg-slate-950/25">
            天气暂时不可用，请稍后重试。
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[20px] bg-white/50 p-3 text-center shadow-sm dark:bg-slate-950/25">
      <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-300">
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-xs font-black text-slate-800 dark:text-white">{value}</p>
    </div>
  );
}
