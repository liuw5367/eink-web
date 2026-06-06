import { useState, useEffect } from 'react';

const WD = ['日', '一', '二', '三', '四', '五', '六'];
const WD_FULL = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

// ── Lunar calendar (approximate) ──────────
const LUNAR_DAYS = '初一初二初三初四初五初六初七初八初九初十十一十二十三十四十五十六十七十八十九二十廿一廿二廿三廿四廿五廿六廿七廿八廿九三十'.match(/.{2}/g)!;
const LUNAR_MONTHS = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
const LU_BASE = new Date(2026, 0, 17);
const HEAVENLY = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

function lunarCalc(date: Date) {
  try {
    const diff = Math.floor((date.getTime() - LU_BASE.getTime()) / 86400000);
    const sign = diff < 0 ? -1 : 1;
    const absd = Math.abs(diff);
    const yearOff = Math.floor(absd / 354) * sign;
    const rem = ((diff % 354) + 354) % 354;
    const mIdx = Math.floor(rem / 29.53);
    const dayNum = Math.max(1, Math.min(30, Math.round(rem % 29.53) + 1));
    const sIdx = (2 + ((yearOff * 2) % 10) + 10) % 10;
    const bIdx = (6 + (yearOff % 12) + 12) % 12;
    return {
      year: HEAVENLY[sIdx] + EARTHLY[bIdx],
      month: LUNAR_MONTHS[mIdx % 12],
      day: LUNAR_DAYS[dayNum - 1],
      dayNum,
    };
  } catch {
    return null;
  }
}

export function getLunar(date: Date): string {
  const inf = lunarCalc(date);
  return inf ? `${inf.year}年 ${inf.month}${inf.day}` : '';
}

export function getLunarShort(date: Date): string {
  const inf = lunarCalc(date);
  if (!inf) return '';
  return inf.dayNum === 1 ? inf.month : inf.day;
}

export function zp(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

export function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    const ms = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    const timeout = setTimeout(() => {
      tick();
      const interval = setInterval(tick, 60000);
      return () => clearInterval(interval);
    }, ms);
    return () => clearTimeout(timeout);
  }, []);

  const time = zp(now.getHours()) + ':' + zp(now.getMinutes());
  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${WD_FULL[now.getDay()]}`;
  const shortDate = `${WD_FULL[now.getDay()]} · ${now.getMonth() + 1}月${now.getDate()}日`;
  const lunar = getLunar(now);

  return { now, time, dateStr, shortDate, lunar, WD, WD_FULL };
}
