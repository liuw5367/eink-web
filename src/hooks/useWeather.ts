import { create } from 'zustand';
import {
  searchCity,
  getWeatherNow,
  getHourlyForecast,
  getDailyForecast,
  getAirNow,
  type WeatherNow,
  type HourlyForecast,
  type DailyForecast,
  type AirNow,
  type GeoLocation,
} from '../services/qweather';

interface WeatherStore {
  locationId: string;
  lat: string;
  lon: string;
  cityName: string;
  now: WeatherNow | null;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  air: AirNow | null;
  loading: boolean;
  lastUpdate: number;

  /** Resolve city name to locationId, then fetch all weather data */
  refresh: (city: string, apiKey: string) => Promise<void>;
}

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  locationId: '',
  lat: '',
  lon: '',
  cityName: '',
  now: null,
  hourly: [],
  daily: [],
  air: null,
  loading: false,
  lastUpdate: 0,

  refresh: async (city: string, apiKey: string) => {
    if (!apiKey || !city) return;

    set({ loading: true });

    let { locationId, lat, lon } = get();

    // Resolve city → locationId if needed
    if (!locationId || get().cityName !== city) {
      const locations = await searchCity(city, apiKey);
      if (locations.length === 0) {
        set({ loading: false });
        return;
      }
      const loc = locations[0];
      locationId = loc.id;
      lat = loc.lat;
      lon = loc.lon;
      set({ locationId, lat, lon, cityName: city });
    }

    // Fetch all in parallel
    const [now, hourly, daily, air] = await Promise.all([
      getWeatherNow(locationId, apiKey),
      getHourlyForecast(locationId, apiKey),
      getDailyForecast(locationId, apiKey),
      getAirNow(lat, lon, apiKey),
    ]);

    set({
      now: now ?? get().now,
      hourly: hourly.length > 0 ? hourly : get().hourly,
      daily: daily.length > 0 ? daily : get().daily,
      air: air ?? get().air,
      loading: false,
      lastUpdate: Date.now(),
    });
  },
}));
