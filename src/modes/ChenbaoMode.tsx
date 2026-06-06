import { useClock, zp } from '../hooks/useClock';
import { getLunarInfo, getLunarShort, getWeekDates } from '../hooks/useLunar';
import { useConfigStore } from '../hooks/useConfig';
import { useWeatherStore } from '../hooks/useWeather';
import { weatherIcon } from '../utils/weatherIcon';

const WEEKDAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export function ChenbaoMode() {
  const { now, time, WD_FULL } = useClock();
  const cfg = useConfigStore((s) => s.cfg);
  const w = useWeatherStore((s) => s.now);
  const daily = useWeatherStore((s) => s.daily);

  const day = now.getDate();
  const lunar = getLunarInfo(now);

  // Mini calendar from real data
  const y = now.getFullYear();
  const m = now.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const prevDays = new Date(y, m, 0).getDate();
  const WD_HEADERS = ['日', '一', '二', '三', '四', '五', '六'];

  const calCells: {
    day: number;
    other: boolean;
    isToday: boolean;
    isWeekend: boolean;
    lunarStr: string;
  }[] = [];
  let d = 1;
  let nd = 1;
  const total = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  for (let i = 0; i < total; i++) {
    let cd: number;
    let other = false;
    if (i < firstDay) {
      cd = prevDays - firstDay + i + 1;
      other = true;
    } else if (d > daysInMonth) {
      cd = nd++;
      other = true;
    } else {
      cd = d++;
    }

    const dow = i % 7;
    const isToday =
      !other && now.getFullYear() === y && now.getMonth() === m && now.getDate() === cd;
    const isWeekend = dow === 0 || dow === 6;
    const lunarStr = !other ? getLunarShort(new Date(y, m, cd)) : '';

    calCells.push({ day: cd, other, isToday, isWeekend, lunarStr });
  }

  // Forecast: skip today
  const forecast = daily.slice(1, 4).map((fd) => {
    const dt = new Date(fd.fxDate);
    return {
      day: WEEKDAY_NAMES[dt.getDay()],
      icon: weatherIcon(fd.iconDay),
      temp: `${fd.tempMax}°/${fd.tempMin}°`,
    };
  });

  return (
    <section
      className="h-full overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gridTemplateRows: 'auto 1fr',
      }}
    >
      {/* Main */}
      <div className="px-3.5 pt-3 flex flex-col border-r border-gray-200">
        <div
          className="font-mono font-black leading-[0.85]"
          style={{ fontSize: 'clamp(80px, 28vw, 120px)', letterSpacing: '-4px' }}
        >
          {zp(day)}
        </div>
        <div className="flex items-center gap-2.5 mt-2 pt-2 border-t-2 border-black">
          <span className="text-[14px] font-bold tracking-widest">
            {WD_FULL[now.getDay()]}
          </span>
          <span className="text-[11px] tracking-wide" style={{ color: 'var(--gray)' }}>
            农历 {lunar.full}
            {lunar.festivals.length > 0 && ` · ${lunar.festivals.join(' ')}`}
          </span>
        </div>
        <div className="font-mono text-[48px] font-normal tracking-tight mt-2.5">{time}</div>

        {/* Mini calendar */}
        <div className="mt-3.5 flex-1">
          <div className="grid grid-cols-7 border-b border-gray-200 pb-1 mb-1.5">
            {WD_HEADERS.map((h, i) => (
              <div
                key={i}
                className="text-center text-[9px] font-bold"
                style={{ color: 'var(--gray)' }}
              >
                {h}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calCells.map((cell, i) => (
              <div
                key={i}
                className="text-center py-1 flex flex-col items-center"
              >
                <span
                  className={`font-mono text-[12px] font-semibold ${
                    cell.isToday
                      ? 'bg-black text-white w-[22px] h-[22px] rounded-full flex items-center justify-center font-bold'
                      : cell.other
                        ? 'text-gray-400'
                        : ''
                  }`}
                  style={
                    !cell.isToday && !cell.other ? { color: 'var(--gray)' } : undefined
                  }
                >
                  {cell.day}
                </span>
                <span className="text-[7px] mt-px" style={{ color: 'var(--light-gray)' }}>
                  {cell.lunarStr}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex flex-col px-2.5 py-2.5 gap-0">
        {/* Weather */}
        <div className="py-2.5 border-b border-gray-200">
          <div
            className="text-[8px] font-black tracking-widest uppercase mb-1.5"
            style={{ color: 'var(--gray)' }}
          >
            天气
          </div>
          <div className="flex items-end gap-1.5 mb-1">
            <span className="text-[24px] leading-none">
              {w ? weatherIcon(w.icon) : '⛅'}
            </span>
            <span className="font-mono text-[36px] font-bold leading-none">
              {w?.temp ?? '--'}°
            </span>
          </div>
          <div className="text-[10px] leading-relaxed" style={{ color: 'var(--gray)' }}>
            {cfg.city} · {w?.text ?? '加载中'}
            <br />
            {w && `湿度 ${w.humidity}% · ${w.windDir} ${w.windScale}级`}
          </div>
        </div>

        {/* Forecast */}
        <div className="py-2.5 border-b border-gray-200">
          <div
            className="text-[8px] font-black tracking-widest uppercase mb-1.5"
            style={{ color: 'var(--gray)' }}
          >
            未来预报
          </div>
          <div className="flex flex-col gap-1">
            {forecast.length > 0
              ? forecast.map((f, i) => (
                  <div key={i} className="flex justify-between items-center text-[10px]">
                    <span className="font-bold tracking-wide" style={{ color: 'var(--gray)' }}>
                      {f.day}
                    </span>
                    <span className="text-[12px]">{f.icon}</span>
                    <span className="font-mono text-[9px]">{f.temp}</span>
                  </div>
                ))
              : [1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center text-[10px]">
                    <span className="font-bold" style={{ color: 'var(--gray)' }}>—</span>
                    <span>❓</span>
                    <span className="font-mono text-[9px]">--/--</span>
                  </div>
                ))}
          </div>
        </div>

        {/* Events */}
        <div className="py-2.5">
          <div
            className="text-[8px] font-black tracking-widest uppercase mb-1.5"
            style={{ color: 'var(--gray)' }}
          >
            日程
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-1.5 items-start">
              <div className="w-1.5 h-1.5 bg-black rounded-full mt-1 flex-shrink-0" />
              <div>
                <div className="text-[11px] tracking-wide">暂无日程</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
