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
  /** Raw weather data from last API fetch (updated in background, no re-render) */
  now: WeatherNow | null;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  air: AirNow | null;
  /** Display snapshot: copied from raw data on pageRefresh() */
  displayNow: WeatherNow | null;
  displayHourly: HourlyForecast[];
  displayDaily: DailyForecast[];
  displayAir: AirNow | null;
  loading: boolean;
  lastUpdate: number;
  refreshTick: number;

  /** Fetch weather data in background (does NOT trigger screen refresh) */
  refresh: (city: string, apiKey: string) => Promise<void>;
  /** Copy latest weather to display state + trigger screen refresh */
  pageRefresh: () => void;
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
  displayNow: null,
  displayHourly: [],
  displayDaily: [],
  displayAir: null,
  loading: false,
  lastUpdate: 0,
  refreshTick: 0,

  pageRefresh: () =>
    set((s) => ({
      displayNow: s.now,
      displayHourly: s.hourly,
      displayDaily: s.daily,
      displayAir: s.air,
      refreshTick: s.refreshTick + 1,
    })),

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

    // Update raw data only — no screen refresh, pageRefresh() handles that
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
