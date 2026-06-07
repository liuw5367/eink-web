import { useEffect, useRef, useCallback } from 'react';
import { useConfigStore } from '../hooks/useConfig';
import { useWeatherStore } from '../hooks/useWeather';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const cfg = useConfigStore((s) => s.cfg);
  const refresh = useWeatherStore((s) => s.refresh);
  const pageRefresh = useWeatherStore((s) => s.pageRefresh);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lastWeatherRef = useRef(0);
  const stoppedRef = useRef(false);

  const isNightTime = useCallback(() => {
    if (!cfg.night) return false;
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    const [sh, sm] = cfg.nightStart.split(':').map(Number);
    const [eh, em] = cfg.nightEnd.split(':').map(Number);
    const st = sh * 60 + sm;
    const en = eh * 60 + em;
    return st > en ? cur >= st || cur < en : cur >= st && cur < en;
  }, [cfg.night, cfg.nightStart, cfg.nightEnd]);

  const doWeatherRefresh = useCallback(async () => {
    if (isNightTime()) return;
    if (cfg.apiKey && cfg.city) {
      await refresh(cfg.city, cfg.apiKey);
      lastWeatherRef.current = Date.now();
    }
  }, [cfg.city, cfg.apiKey, refresh, isNightTime]);

  const doPageRefresh = useCallback(() => {
    if (isNightTime()) return;
    pageRefresh();
  }, [isNightTime, pageRefresh]);

  // Unified refresh: weather first, then page — single screen refresh
  const doRefresh = useCallback(async (forceWeather = false) => {
    if (isNightTime()) return;
    const now = Date.now();
    const weatherAge = now - lastWeatherRef.current;
    const weatherDue = forceWeather || weatherAge >= cfg.weatherInterval * 60 * 1000;

    if (weatherDue && cfg.apiKey && cfg.city) {
      await doWeatherRefresh();
    }
    doPageRefresh();
  }, [isNightTime, cfg.weatherInterval, cfg.apiKey, cfg.city, doWeatherRefresh, doPageRefresh]);

  useEffect(() => {
    // Clear previous timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    stoppedRef.current = false;

    if (cfg.topHour) {
      // Top-hour mode: weather pre-fetch → page refresh at :00
      const scheduleNext = () => {
        if (stoppedRef.current) return;
        const now = new Date();
        const msToNextHour =
          (60 - now.getMinutes() - 1) * 60 * 1000 +
          (60 - now.getSeconds()) * 1000 -
          now.getMilliseconds();

        const preFetchMs = Math.max(msToNextHour - 10_000, 0);
        const t1 = setTimeout(async () => {
          if (stoppedRef.current) return;
          // Await weather so data is ready before page refresh
          await doWeatherRefresh();
          if (stoppedRef.current) return;
          const t2 = setTimeout(() => {
            doPageRefresh();
            scheduleNext();
          }, Math.max(Math.min(10_000, msToNextHour), 500));
          timersRef.current.push(t2);
        }, preFetchMs);
        timersRef.current.push(t1);
      };
      scheduleNext();
    } else if (cfg.interval > 0) {
      // Initial load: weather first, then page — one screen refresh
      doRefresh(true);

      // Single coordinated interval: weather before page
      const intervalId = setInterval(() => doRefresh(false), cfg.interval * 60 * 1000);
      return () => clearInterval(intervalId);
    } else if (cfg.weatherInterval > 0) {
      // Manual page refresh, but still auto-fetch weather in background
      doWeatherRefresh();
      const weatherId = setInterval(doWeatherRefresh, cfg.weatherInterval * 60 * 1000);
      return () => clearInterval(weatherId);
    }

    return () => {
      stoppedRef.current = true;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [cfg.interval, cfg.weatherInterval, cfg.topHour, doWeatherRefresh, doPageRefresh, doRefresh]);

  return <>{children}</>;
}
