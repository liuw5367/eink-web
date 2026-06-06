declare module 'lunar-javascript' {
  interface Lunar {
    getYearInChinese(): string;
    getMonthInChinese(): string;
    getDayInChinese(): string;
    getYearShengXiao(): string;
    getYearInGanZhi(): string;
    getMonthInGanZhi(): string;
    getDayInGanZhi(): string;
    getFestivals(): string[];
    getOtherFestivals(): string[];
    getJieQi(): string;
    getDayYi(): string[];
    getDayJi(): string[];
    toString(): string;
    toFullString(): string;
  }

  interface Solar {
    getLunar(): Lunar;
    getWeek(): number;
    getWeekInChinese(): string;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    toYmd(): string;
    toYmdHms(): string;
    toString(): string;
    static fromYmd(year: number, month: number, day: number): Solar;
    static fromDate(date: Date): Solar;
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Solar;
  }

  interface Holiday {
    toString(): string;
    getName(): string;
  }

  interface HolidayUtil {
    static getHoliday(year: number, month: number, day: number): Holiday | null;
  }

  export { Solar, Lunar, HolidayUtil };
}
