import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_LOCATION = '101010100'; // 北京
const DEFAULT_CITY = '北京市';

type QWeatherLocation = {
  id?: string;
  name?: string;
  adm1?: string;
  adm2?: string;
  country?: string;
};

function isCoordinateLocation(value: string) {
  return /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(value);
}

function isLocationId(value: string) {
  return /^\d{6,12}$/.test(value);
}

function parseCoordinateLocation(value: string) {
  if (!isCoordinateLocation(value)) return null;

  const [longitude, latitude] = value.split(',').map((item) => Number.parseFloat(item.trim()));

  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return null;

  return { longitude, latitude };
}

function weatherCodeToText(code: number) {
  if (code === 0) return '晴';
  if ([1, 2].includes(code)) return '少云';
  if (code === 3) return '阴天';
  if ([45, 48].includes(code)) return '雾';
  if (code >= 51 && code <= 67) return '小雨';
  if (code >= 71 && code <= 77) return '雪';
  if (code >= 80 && code <= 82) return '阵雨';
  if (code >= 85 && code <= 86) return '阵雪';
  if (code >= 95) return '雷雨';
  return '多云';
}

function weatherCodeToIcon(code: number) {
  if (code === 0) return '100';
  if (code >= 51 && code <= 67) return '300';
  if (code >= 71 && code <= 86) return '400';
  if (code >= 95) return '302';
  return '101';
}

function windDirectionText(degree?: number) {
  if (typeof degree !== 'number' || Number.isNaN(degree)) return '未知风向';

  const directions = ['北风', '东北风', '东风', '东南风', '南风', '西南风', '西风', '西北风'];
  const index = Math.round(degree / 45) % directions.length;
  return directions[index];
}

function createMockWeather(message = '天气服务暂时不可用') {
  return {
    code: '200',
    isMock: true,
    message,
    city: DEFAULT_CITY,
    locationId: DEFAULT_LOCATION,
    now: {
      temp: '22',
      feelsLike: '24',
      text: '气候模拟',
      icon: '101',
      humidity: '56',
      windSpeed: '8',
      windDir: '东北风',
    },
    daily: [
      {
        tempMax: '27',
        tempMin: '19',
        textDay: '多云',
        textNight: '多云',
      },
    ],
    hourly: [
      { fxTime: new Date().toISOString(), temp: '22', icon: '101', text: '多云', pop: '20' },
      { fxTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), temp: '23', icon: '101', text: '多云', pop: '24' },
      { fxTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), temp: '24', icon: '100', text: '晴', pop: '18' },
      { fxTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), temp: '24', icon: '100', text: '晴', pop: '15' },
      { fxTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), temp: '23', icon: '101', text: '多云', pop: '20' },
    ],
  };
}

async function lookupOpenMeteoLocation(rawLocation: string) {
  const coordinate = parseCoordinateLocation(rawLocation);

  if (coordinate) {
    return {
      city: '当前位置',
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      timezone: 'auto',
    };
  }

  if (isLocationId(rawLocation) || rawLocation === DEFAULT_LOCATION) {
    return {
      city: DEFAULT_CITY,
      latitude: 39.9042,
      longitude: 116.4074,
      timezone: 'Asia/Shanghai',
    };
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(rawLocation)}&count=1&language=zh&format=json`;
  const res = await fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.timeout(7000),
  });
  const data = await res.json().catch(() => null);
  const location = data?.results?.[0];

  if (!res.ok || !location) {
    throw new Error(`没有找到地点：${rawLocation}`);
  }

  const city = [location.admin1, location.name]
    .filter(Boolean)
    .filter((item, index, arr) => arr.indexOf(item) === index)
    .join(' · ');

  return {
    city: city || location.name || rawLocation,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone || 'auto',
  };
}

async function fetchOpenMeteoWeather(rawLocation: string) {
  const location = await lookupOpenMeteoLocation(rawLocation);
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m',
    hourly: 'temperature_2m,precipitation_probability,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code',
    timezone: location.timezone || 'auto',
    forecast_days: '3',
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(7000),
  });
  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.current) {
    throw new Error(data?.reason || 'Open-Meteo 天气数据获取失败');
  }

  const currentCode = Number(data.current.weather_code ?? 3);
  const hourlyTimes: string[] = data.hourly?.time || [];
  const currentHour = typeof data.current.time === 'string' ? data.current.time.slice(0, 13) : '';
  let hourlyStartIndex = currentHour
    ? hourlyTimes.findIndex((time) => time.slice(0, 13) >= currentHour)
    : 0;

  if (hourlyStartIndex < 0) {
    hourlyStartIndex = 0;
  }

  return {
    code: '200',
    isMock: false,
    provider: 'Open-Meteo',
    city: location.city,
    locationId: `${location.longitude},${location.latitude}`,
    now: {
      temp: Math.round(data.current.temperature_2m).toString(),
      feelsLike: Math.round(data.current.apparent_temperature).toString(),
      text: weatherCodeToText(currentCode),
      icon: weatherCodeToIcon(currentCode),
      humidity: Math.round(data.current.relative_humidity_2m).toString(),
      windSpeed: Math.round(data.current.wind_speed_10m).toString(),
      windDir: windDirectionText(data.current.wind_direction_10m),
    },
    daily: (data.daily?.time || []).slice(0, 3).map((time: string, index: number) => ({
      fxDate: time,
      tempMax: Math.round(data.daily.temperature_2m_max?.[index] ?? 0).toString(),
      tempMin: Math.round(data.daily.temperature_2m_min?.[index] ?? 0).toString(),
      textDay: weatherCodeToText(Number(data.daily.weather_code?.[index] ?? currentCode)),
      textNight: weatherCodeToText(Number(data.daily.weather_code?.[index] ?? currentCode)),
    })),
    hourly: hourlyTimes.slice(hourlyStartIndex, hourlyStartIndex + 6).map((time: string, index: number) => {
      const sourceIndex = hourlyStartIndex + index;
      const hourlyCode = Number(data.hourly.weather_code?.[sourceIndex] ?? currentCode);

      return {
        fxTime: time,
        temp: Math.round(data.hourly.temperature_2m?.[sourceIndex] ?? data.current.temperature_2m).toString(),
        icon: weatherCodeToIcon(hourlyCode),
        text: weatherCodeToText(hourlyCode),
        pop: Math.round(data.hourly.precipitation_probability?.[sourceIndex] ?? 0).toString(),
      };
    }),
  };
}

async function fetchJson(url: string, token: string) {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Accept-Encoding': 'gzip',
      'User-Agent': 'RainierGu-Weather-Proxy/1.0',
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(7000),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data || data.code !== '200') {
    throw new Error(data?.message || data?.code || `HTTP ${res.status}`);
  }

  return data;
}

async function tryUrls(urls: string[], token: string) {
  let lastError: unknown = null;

  for (const url of urls) {
    try {
      return await fetchJson(url, token);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('QWeather request failed');
}

async function lookupLocation(rawLocation: string, token: string) {
  const location = rawLocation.trim();
  const encodedLocation = encodeURIComponent(location);

  const geoUrls = [
    `https://geoapi.qweather.com/v2/city/lookup?location=${encodedLocation}`,
    `https://api.qweather.com/geo/v2/city/lookup?location=${encodedLocation}`,
    `https://devapi.qweather.com/geo/v2/city/lookup?location=${encodedLocation}`,
  ];

  const data = await tryUrls(geoUrls, token);
  const firstLocation = data.location?.[0] as QWeatherLocation | undefined;

  if (!firstLocation) {
    throw new Error('Location not found');
  }

  return firstLocation;
}

async function fetchWeatherBundle(locationId: string, token: string) {
  const encodedLocation = encodeURIComponent(locationId);
  const weatherHosts = ['https://api.qweather.com', 'https://devapi.qweather.com'];

  const urlsFor = (path: string) => weatherHosts.map((host) => `${host}${path}?location=${encodedLocation}`);

  const now = await tryUrls(urlsFor('/v7/weather/now'), token);

  const [daily, hourly] = await Promise.all([
    tryUrls(urlsFor('/v7/weather/3d'), token).catch(() => null),
    tryUrls(urlsFor('/v7/weather/24h'), token).catch(() => null),
  ]);

  return {
    now: now.now,
    daily: daily?.daily?.slice(0, 3) || [],
    hourly: hourly?.hourly?.slice(0, 6) || [],
  };
}

export async function GET(request: NextRequest) {
  const token = process.env.QWEATHER_KEY?.trim();
  const rawLocation = request.nextUrl.searchParams.get('location')?.trim() || DEFAULT_LOCATION;

  if (!token) {
    try {
      return NextResponse.json(await fetchOpenMeteoWeather(rawLocation));
    } catch (error: any) {
      return NextResponse.json(createMockWeather(error?.message || '天气服务暂时不可用'));
    }
  }

  try {
    let locationId = rawLocation;
    let city = DEFAULT_CITY;

    try {
      const location = await lookupLocation(rawLocation, token);
      locationId = location.id || rawLocation;
      city = [location.adm2, location.name]
        .filter(Boolean)
        .filter((item, index, arr) => arr.indexOf(item) === index)
        .join(' · ') || location.name || DEFAULT_CITY;
    } catch {
      if (isLocationId(rawLocation) || isCoordinateLocation(rawLocation)) {
        locationId = rawLocation;
      } else {
        throw new Error(`没有找到地点：${rawLocation}`);
      }
    }

    const weather = await fetchWeatherBundle(locationId, token);

    return NextResponse.json({
      code: '200',
      isMock: false,
      provider: 'QWeather',
      city,
      locationId,
      now: weather.now,
      daily: weather.daily,
      hourly: weather.hourly,
    });
  } catch (error: any) {
    try {
      return NextResponse.json(await fetchOpenMeteoWeather(rawLocation));
    } catch {
      return NextResponse.json(
        {
          code: '500',
          message: error?.message || '天气数据获取失败',
        },
        { status: 502 }
      );
    }
  }
}
