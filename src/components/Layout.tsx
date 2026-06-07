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
    }
  }, [cfg.city, cfg.apiKey, refresh, isNightTime]);

  const doPageRefresh = useCallback(() => {
    if (isNightTime()) return;
    pageRefresh();
  }, [isNightTime, pageRefresh]);

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

        // Pre-fetch weather 10s before :00
        const preFetchMs = Math.max(msToNextHour - 10_000, 0);
        const t1 = setTimeout(async () => {
          if (stoppedRef.current) return;
          await doWeatherRefresh();
          if (stoppedRef.current) return;
          // Page refresh at :00
          const t2 = setTimeout(() => {
            doPageRefresh();
            scheduleNext();
          }, Math.max(Math.min(10_000, msToNextHour), 500));
          timersRef.current.push(t2);
        }, preFetchMs);
        timersRef.current.push(t1);
      };
      scheduleNext();
    } else {
      // Initial load: fetch weather, then page refresh
      doWeatherRefresh().then(() => {
        if (!stoppedRef.current) doPageRefresh();
      });

      // Weather timer — independent, refreshes page on completion
      if (cfg.weatherInterval > 0) {
        const weatherId = setInterval(doWeatherRefresh, cfg.weatherInterval * 60 * 1000);
        timersRef.current.push(weatherId as unknown as ReturnType<typeof setTimeout>);
      }

      // Page timer — independent, refreshes page on tick
      if (cfg.interval > 0) {
        const pageId = setInterval(doPageRefresh, cfg.interval * 60 * 1000);
        timersRef.current.push(pageId as unknown as ReturnType<typeof setTimeout>);
      }
    }

    return () => {
      stoppedRef.current = true;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [cfg.interval, cfg.weatherInterval, cfg.topHour, doWeatherRefresh, doPageRefresh]);

  return <>{children}</>;
}
