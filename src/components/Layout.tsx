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

  const doRefresh = useCallback(() => {
    if (cfg.apiKey && cfg.city) {
      refresh(cfg.city, cfg.apiKey);
    }
  }, [cfg.city, cfg.apiKey, refresh]);

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
