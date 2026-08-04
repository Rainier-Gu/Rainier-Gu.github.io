export type DetailedLocation = {
  weatherLocation: string;
  city?: string;
  address?: string;
  district?: string;
  landmark?: string;
  provider: 'Amap';
};

type JsonRecord = Record<string, any>;

function stringValue(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function uniqueParts(parts: string[]) {
  return parts.filter(Boolean).filter((part, index, all) => all.indexOf(part) === index);
}

function coordinateValue(value: string) {
  const match = value.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;

  const longitude = Number.parseFloat(match[1]);
  const latitude = Number.parseFloat(match[2]);
  if (
    !Number.isFinite(longitude)
    || !Number.isFinite(latitude)
    || longitude < -180
    || longitude > 180
    || latitude < -90
    || latitude > 90
  ) return null;

  return `${longitude.toFixed(6)},${latitude.toFixed(6)}`;
}

function shouldGeocodeDetailedAddress(value: string) {
  if (coordinateValue(value)) return true;

  return /大学|学院|医院|机场|车站|公园|广场|大厦|小区|园区/.test(value)
    || (value.length >= 6 && /路|街|道|巷|号|楼/.test(value));
}

async function fetchAmap(url: string) {
  const response = await fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.timeout(7000),
  });
  const data = await response.json().catch(() => null);

  if (!response.ok || !data || data.status !== '1') {
    throw new Error(data?.info || `高德地理编码请求失败（HTTP ${response.status}）`);
  }

  return data as JsonRecord;
}

async function convertGpsToAmap(coordinate: string, key: string) {
  const params = new URLSearchParams({
    key,
    locations: coordinate,
    coordsys: 'gps',
    output: 'JSON',
  });

  const data = await fetchAmap(`https://restapi.amap.com/v3/assistant/coordinate/convert?${params.toString()}`);
  return stringValue(data.locations).split(';')[0] || coordinate;
}

function locationFromReverseGeocode(data: JsonRecord, weatherLocation: string): DetailedLocation | null {
  const regeocode = data.regeocode;
  if (!regeocode) return null;

  const component = regeocode.addressComponent || {};
  const province = stringValue(component.province);
  const city = stringValue(component.city);
  const district = stringValue(component.district);
  const township = stringValue(component.township);
  const street = stringValue(component.streetNumber?.street);
  const number = stringValue(component.streetNumber?.number);
  const neighborhood = stringValue(component.neighborhood?.name);
  const building = stringValue(component.building?.name);
  const aoi = stringValue(regeocode.aois?.[0]?.name);
  const poi = stringValue(regeocode.pois?.[0]?.name);
  const landmark = neighborhood || building || aoi || poi;
  const formattedAddress = stringValue(regeocode.formatted_address)
    || uniqueParts([province, city, district, township, street, number]).join('');
  const address = formattedAddress && landmark && !formattedAddress.includes(landmark)
    ? `${formattedAddress} · ${landmark}`
    : formattedAddress || landmark;

  return {
    provider: 'Amap',
    weatherLocation,
    city: uniqueParts([province, city, district]).join(' · ') || district || city || province,
    address,
    district,
    landmark,
  };
}

async function reverseGeocode(coordinate: string, key: string, weatherLocation: string) {
  const params = new URLSearchParams({
    key,
    location: coordinate,
    radius: '500',
    extensions: 'all',
    output: 'JSON',
  });
  const data = await fetchAmap(`https://restapi.amap.com/v3/geocode/regeo?${params.toString()}`);
  return locationFromReverseGeocode(data, weatherLocation);
}

async function geocodeAddress(address: string, key: string) {
  const params = new URLSearchParams({ key, address, output: 'JSON' });
  const data = await fetchAmap(`https://restapi.amap.com/v3/geocode/geo?${params.toString()}`);
  const geocode = data.geocodes?.[0];
  const coordinate = stringValue(geocode?.location);

  if (!coordinate) return null;

  try {
    return await reverseGeocode(coordinate, key, coordinate);
  } catch {
    return {
      provider: 'Amap' as const,
      weatherLocation: coordinate,
      city: uniqueParts([
        stringValue(geocode?.province),
        stringValue(geocode?.city),
        stringValue(geocode?.district),
      ]).join(' · '),
      address,
      district: stringValue(geocode?.district),
    };
  }
}

export async function resolveDetailedLocation(rawLocation: string, key?: string) {
  const normalizedKey = key?.trim();
  const normalizedLocation = rawLocation.trim();
  if (!normalizedKey || !normalizedLocation || !shouldGeocodeDetailedAddress(normalizedLocation)) return null;

  const gpsCoordinate = coordinateValue(normalizedLocation);
  if (!gpsCoordinate) return geocodeAddress(normalizedLocation, normalizedKey);

  let amapCoordinate = gpsCoordinate;
  try {
    amapCoordinate = await convertGpsToAmap(gpsCoordinate, normalizedKey);
  } catch {
    // 坐标转换不可用时仍尝试逆地理编码，天气查询继续使用原始 GPS 坐标。
  }

  return reverseGeocode(amapCoordinate, normalizedKey, gpsCoordinate);
}
