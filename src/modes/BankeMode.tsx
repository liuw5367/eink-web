import { useClock, zp } from '../hooks/useClock';
import { getLunarInfo, getLunarShort, getWeekDates } from '../hooks/useLunar';
import { useConfigStore } from '../hooks/useConfig';
import { useWeatherStore } from '../hooks/useWeather';
import { weatherIcon } from '../utils/weatherIcon';

export function BankeMode() {
  const { now, time, WD_FULL } = useClock();
  const cfg = useConfigStore((s) => s.cfg);
  const w = useWeatherStore((s) => s.now);
  const hourly = useWeatherStore((s) => s.hourly);
  const daily = useWeatherStore((s) => s.daily);
  const air = useWeatherStore((s) => s.air);

  const day = now.getDate();
  const lunar = getLunarInfo(now);
  const weekDates = getWeekDates(now);

  // Hourly: next 7 hours
  const hourlyForecast = hourly.slice(0, 7).map((h) => {
    const dt = new Date(h.fxTime);
    return {
      time: `${dt.getHours()}时`,
      icon: weatherIcon(h.icon),
      temp: `${h.temp}°`,
    };
  });

  // Forecast: skip today, show next 7 days
  const forecast = daily.slice(1, 8).map((d) => {
    const dt = new Date(d.fxDate);
    const info = getLunarInfo(dt);
    return {
      day: info.weekDayChinese,
      icon: weatherIcon(d.iconDay),
      temp: `${d.tempMax}/${d.tempMin}`,
    };
  });

  const today = daily[0];

  return (
    <section className="flex flex-col h-full">
      {/* Top */}
      <div className="px-3.5 pt-3.5 flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="text-[20px] font-semibold tracking-[6px]" style={{ color: 'var(--gray)' }}>
            {WD_FULL[now.getDay()]}
          </div>
          <div className="text-[14px] tracking-widest" style={{ color: 'var(--gray)' }}>
            农历 {lunar.full}
            {lunar.festivals.length > 0 && ` · ${lunar.festivals.join(' ')}`}
          </div>
          <div className="font-mono text-[24px] tracking-wide mt-0.5">{time}</div>
        </div>
        <div className="border-2 border-black p-2 flex flex-col gap-0.5 items-end">
          <span className="font-mono text-[34px] font-bold tracking-wide">
            {w?.temp ?? '--'}°C
          </span>
          <span className="text-[12px] tracking-wide" style={{ color: 'var(--gray)' }}>
            {w?.text ?? '加载中'}
          </span>
          <span className="text-[11px] tracking-wide" style={{ color: 'var(--light-gray)' }}>
            {cfg.city}
          </span>
        </div>
      </div>

      {/* Hero date */}
      <div className="text-center px-3.5 pt-2">
        <div
          className="font-mono font-black leading-[0.85]"
          style={{ fontSize: 'clamp(100px, 35vw, 160px)', letterSpacing: '-6px' }}
        >
          {zp(day)}
        </div>
        <div className="flex justify-between items-center px-2.5 mt-1.5">
          <div className="flex-1 h-[1.5px] bg-black" />
          <div className="text-[22px] font-semibold tracking-[6px] px-3">
            {now.getFullYear()}年{now.getMonth() + 1}月
          </div>
          <div className="flex-1 h-[1.5px] bg-black" />
        </div>
      </div>

      {/* Week row with real lunar data */}
      <div className="px-3.5 pt-3 grid grid-cols-7 gap-1">
        {weekDates.map((d, i) => {
          const isActive = d.toDateString() === now.toDateString();
          const lun = getLunarShort(d);
          return (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span
                className="text-[11px] font-bold tracking-wide"
                style={{ color: 'var(--gray)' }}
              >
                {['日', '一', '二', '三', '四', '五', '六'][d.getDay()]}
              </span>
              <span
                className={`font-mono text-[20px] font-semibold w-[36px] h-[36px] flex items-center justify-center ${
                  isActive ? 'bg-black text-white rounded-sm font-bold' : ''
                }`}
              >
                {d.getDate()}
              </span>
              <span className="text-[10px]" style={{ color: 'var(--light-gray)' }}>
                {lun}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom */}
      <div className="mt-auto px-3.5 py-2 border-t-2 border-black flex flex-col gap-2">
        {/* Row 1: 7-hour forecast */}
        <div className="flex justify-between">
          {hourlyForecast.length > 0
            ? hourlyForecast.map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <span className="text-[10px]" style={{ color: 'var(--gray)' }}>
                    {h.time}
                  </span>
                  <span className="text-[14px]">{h.icon}</span>
                  <span className="font-mono text-[10px]">{h.temp}</span>
                </div>
              ))
            : Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <span className="text-[10px]" style={{ color: 'var(--gray)' }}>—</span>
                  <span className="text-[14px]">❓</span>
                  <span className="font-mono text-[10px]">--°</span>
                </div>
              ))}
        </div>

        {/* Row 2: 7-day forecast */}
        <div className="flex justify-between">
          {forecast.length > 0
            ? forecast.map((f, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <span className="text-[10px] font-bold" style={{ color: 'var(--gray)' }}>
                    {f.day}
                  </span>
                  <span className="text-[14px]">{f.icon}</span>
                  <span className="font-mono text-[10px]">{f.temp}</span>
                </div>
              ))
            : Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <span className="text-[10px] font-bold" style={{ color: 'var(--gray)' }}>—</span>
                  <span className="text-[14px]">❓</span>
                  <span className="font-mono text-[10px]">--/--</span>
                </div>
              ))}
        </div>

        {/* Row 3: indicators left + quote right */}
        <div className="flex justify-between items-end">
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px]" style={{ color: 'var(--gray)' }}>
            {w && <span>体感 {w.feelsLike}°</span>}
            {w && <span>风速 {w.windScale}级</span>}
            {w && <span>湿度 {w.humidity}%</span>}
            {air && <span>空气 {air.category}</span>}
            {today && <span>日出 {today.sunrise}</span>}
            {today && <span>日落 {today.sunset}</span>}
          </div>
          <div
            className="text-[12px] tracking-widest text-right leading-relaxed"
            style={{ color: 'var(--light-gray)' }}
          >
            万物并育而不相害
            <br />
            道并行而不相悖
          </div>
        </div>
      </div>
    </section>
  );
}
