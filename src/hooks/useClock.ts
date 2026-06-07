import { useState, useEffect } from 'react';

export const WD_FULL = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

export function zp(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

export function useClock(autoUpdate = false) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!autoUpdate) return;
    const tick = () => setNow(new Date());
    const ms = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    const timeout = setTimeout(() => {
      tick();
      const interval = setInterval(tick, 60000);
      return () => clearInterval(interval);
    }, ms);
    return () => clearTimeout(timeout);
  }, [autoUpdate]);

  const time = zp(now.getHours()) + ':' + zp(now.getMinutes());
  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${WD_FULL[now.getDay()]}`;
  const shortDate = `${WD_FULL[now.getDay()]} · ${now.getMonth() + 1}月${now.getDate()}日`;

  return { now, time, dateStr, shortDate, WD_FULL };
}
