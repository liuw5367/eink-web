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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const doRefresh = useCallback(() => {
    if (isNightTime()) return;
    if (cfg.apiKey && cfg.city) {
      refresh(cfg.city, cfg.apiKey);
    }
  }, [cfg.city, cfg.apiKey, refresh, isNightTime]);

  // Initial fetch + interval-based refresh
  useEffect(() => {
    doRefresh();

    if (intervalRef.current) clearInterval(intervalRef.current);

    if (cfg.interval > 0) {
      intervalRef.current = setInterval(doRefresh, cfg.interval * 60 * 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [cfg.interval, doRefresh]);

  return <>{children}</>;
}
