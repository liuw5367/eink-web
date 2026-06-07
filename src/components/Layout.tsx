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
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

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

  const doWeatherRefresh = useCallback(() => {
    if (isNightTime()) return;
    if (cfg.apiKey && cfg.city) {
      return refresh(cfg.city, cfg.apiKey);
    }
  }, [cfg.city, cfg.apiKey, refresh, isNightTime]);

  const doPageRefresh = useCallback(() => {
    if (isNightTime()) return;
    pageRefresh();
  }, [isNightTime, pageRefresh]);

  // Cleanup helper
  const clearTimers = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  }, []);

  useEffect(() => {
    clearTimers();

    if (cfg.topHour) {
      // Top-hour mode: both refreshes at :00
      // Weather pre-fetch 10s before, page refresh at :00
      const scheduleNext = () => {
        const now = new Date();
        const msToNextHour =
          (60 - now.getMinutes() - 1) * 60 * 1000 +
          (60 - now.getSeconds()) * 1000 -
          now.getMilliseconds();

        // Pre-fetch weather 10s before the hour
        const preFetchMs = Math.max(msToNextHour - 10_000, 0);
        const t1 = setTimeout(() => {
          doWeatherRefresh();
          // Page refresh at :00
          const t2 = setTimeout(() => {
            doPageRefresh();
            scheduleNext(); // schedule the following hour
          }, Math.min(10_000, msToNextHour));
          timerRef.current.push(t2);
        }, preFetchMs);
        timerRef.current.push(t1);
      };
      scheduleNext();
    } else {
      // Independent loops
      const timers: ReturnType<typeof setInterval>[] = [];

      if (cfg.weatherInterval > 0) {
        // Initial fetch
        doWeatherRefresh();
        timers.push(setInterval(doWeatherRefresh, cfg.weatherInterval * 60 * 1000));
      }

      if (cfg.interval > 0) {
        timers.push(
          setInterval(async () => {
            await doWeatherRefresh();
            doPageRefresh();
          }, cfg.interval * 60 * 1000)
        );
      }

      return () => {
        timers.forEach(clearInterval);
      };
    }

    return clearTimers;
  }, [cfg.interval, cfg.weatherInterval, cfg.topHour, doWeatherRefresh, doPageRefresh, clearTimers]);

  return <>{children}</>;
}
