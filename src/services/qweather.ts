const BASE_URL = import.meta.env.PUBLIC_QWEATHER_BASE_URL;
const GEO_URL = import.meta.env.PUBLIC_QWEATHER_GEO_URL || BASE_URL + "/geo";

export interface WeatherNow {
  temp: string;
  feelsLike: string;
  text: string;
  icon: string;
  windDir: string;
  windScale: string;
  windSpeed: string;
  humidity: string;
  precip: string;
  pressure: string;
  vis: string;
}

export interface HourlyForecast {
  fxTime: string;
  temp: string;
  icon: string;
  text: string;
  windDir: string;
  windScale: string;
  humidity: string;
  pop: string;
}

export interface DailyForecast {
  fxDate: string;
  sunrise: string;
  sunset: string;
  tempMax: string;
  tempMin: string;
  iconDay: string;
  textDay: string;
  iconNight: string;
  textNight: string;
  windDirDay: string;
  windScaleDay: string;
  humidity: string;
  uvIndex: string;
  precip: string;
}

export interface AirNow {
  aqi: string;
  category: string;
  primary: string;
  pm2p5: string;
  pm10: string;
  no2: string;
  so2: string;
  co: string;
  o3: string;
}

export interface GeoLocation {
  id: string;
  name: string;
  adm1: string;
  adm2: string;
  country: string;
  lat: string;
  lon: string;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function searchCity(
  name: string,
  key: string,
): Promise<GeoLocation[]> {
  const data = await fetchJson<{ location?: GeoLocation[] }>(
    `${GEO_URL}/v2/city/lookup?location=${encodeURIComponent(name)}&key=${key}&lang=zh&number=5`,
  );
  return data?.location ?? [];
}

export async function getWeatherNow(
  locationId: string,
  key: string,
): Promise<WeatherNow | null> {
  const data = await fetchJson<{ now?: WeatherNow; code: string }>(
    `${BASE_URL}/v7/weather/now?location=${locationId}&key=${key}&lang=zh`,
  );
  if (data?.code !== "200" || !data.now) return null;
  return data.now;
}

export async function getHourlyForecast(
  locationId: string,
  key: string,
): Promise<HourlyForecast[]> {
  const data = await fetchJson<{ hourly?: HourlyForecast[]; code: string }>(
    `${BASE_URL}/v7/weather/24h?location=${locationId}&key=${key}&lang=zh`,
  );
  if (data?.code !== "200") return [];
  return data.hourly ?? [];
}

export async function getDailyForecast(
  locationId: string,
  key: string,
): Promise<DailyForecast[]> {
  const data = await fetchJson<{ daily?: DailyForecast[]; code: string }>(
    `${BASE_URL}/v7/weather/7d?location=${locationId}&key=${key}&lang=zh`,
  );
  if (data?.code !== "200") return [];
  return data.daily ?? [];
}

export async function getAirNow(
  lat: string,
  lon: string,
  key: string,
): Promise<AirNow | null> {
  const data = await fetchJson<{ now?: AirNow; code: string }>(
    `${BASE_URL}/airquality/v1/current/${lat}/${lon}?key=${key}&lang=zh`,
  );
  if (data?.code !== "200" || !data.now) return null;
  return data.now;
}
