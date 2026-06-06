import { Solar } from 'lunar-javascript';

export interface LunarInfo {
  /** 农历月，如"四月" */
  month: string;
  /** 农历日，如"廿一" */
  day: string;
  /** 完整农历，如"四月廿一" */
  full: string;
  /** 干支年，如"丙午" */
  ganZhi: string;
  /** 生肖，如"马" */
  shengXiao: string;
  /** 节日列表 */
  festivals: string[];
  /** 其他节日（如母亲节等） */
  otherFestivals: string[];
  /** 节气 */
  jieQi: string;
  /** 星期几（数字，0=日） */
  weekDay: number;
  /** 星期几（中文） */
  weekDayChinese: string;
}

export function getLunarInfo(date: Date): LunarInfo {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();

  return {
    month: lunar.getMonthInChinese() + '月',
    day: lunar.getDayInChinese(),
    full: lunar.getMonthInChinese() + '月' + lunar.getDayInChinese(),
    ganZhi: lunar.getYearInGanZhi(),
    shengXiao: lunar.getYearShengXiao(),
    festivals: lunar.getFestivals(),
    otherFestivals: lunar.getOtherFestivals(),
    jieQi: lunar.getJieQi(),
    weekDay: solar.getWeek(),
    weekDayChinese: solar.getWeekInChinese(),
  };
}

export function getLunarShort(date: Date): string {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  const day = lunar.getDayInChinese();
  // 初一显示月份
  return day === '初一' ? lunar.getMonthInChinese() + '月' : day;
}

export function getLunarFull(date: Date): string {
  const info = getLunarInfo(date);
  const parts = [info.ganZhi + '(' + info.shengXiao + '年)', info.full];
  if (info.festivals.length) parts.push(info.festivals.join(' '));
  if (info.jieQi) parts.push(info.jieQi);
  return parts.join(' ');
}

export function getWeekDates(date: Date): Date[] {
  const day = date.getDay();
  const start = new Date(date);
  start.setDate(date.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}
