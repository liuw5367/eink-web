import { useClock } from '../hooks/useClock';
import { getLunarInfo } from '../hooks/useLunar';
import { useConfigStore } from '../hooks/useConfig';
import { useWeatherStore } from '../hooks/useWeather';
import { weatherIcon } from '../utils/weatherIcon';

export function ClockMode() {
  const { now, dateStr } = useClock();
  const cfg = useConfigStore((s) => s.cfg);
  const w = useWeatherStore((s) => s.now);
  const daily = useWeatherStore((s) => s.daily);
  const air = useWeatherStore((s) => s.air);
  const hourly = useWeatherStore((s) => s.hourly);

  const lunar = getLunarInfo(now);
  const today = daily[0];
  const icon = w ? weatherIcon(w.icon) : '⛅';

  // Find today's hourly forecasts remaining
  const nowHour = now.getHours();
  const upcomingHours = hourly
    .filter((h) => {
      const hTime = new Date(h.fxTime).getHours();
      return hTime >= nowHour;
    })
    .slice(0, 4);

  return (
    <section className="flex flex-col overflow-y-auto overflow-x-hidden h-full">
      {/* Clock block */}
      <div className="px-3.5 py-4 text-center border-b border-gray-200">
        <div
          className="font-mono font-bold leading-none"
          style={{ fontSize: 'clamp(56px, 18vw, 80px)', letterSpacing: '-3px' }}
        >
          {useClock().time}
        </div>
        <div className="text-[13px] font-semibold tracking-wide mt-1">{dateStr}</div>
        {cfg.lunar && (
          <div className="text-[10px] tracking-wide mt-0.5" style={{ color: 'var(--gray)' }}>
            农历 {lunar.full}
            {lunar.festivals.length > 0 && ` · ${lunar.festivals.join(' ')}`}
            {lunar.jieQi && ` · ${lunar.jieQi}`}
          </div>
        )}
      </div>

      {/* Weather */}
      {cfg.weather && (
        <>
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-gray-200 gap-2">
            <div>
              <div className="widget-label">📍 {cfg.city}</div>
              <div className="font-mono text-[34px] font-bold leading-none">
                {w?.temp ?? '--'}°
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--gray)' }}>
                {w?.text ?? '加载中…'}
              </div>
              {today && (
                <div
                  className="font-mono text-[11px] mt-[3px]"
                  style={{ color: 'var(--gray)' }}
                >
                  {today.tempMax}° / {today.tempMin}°
                </div>
              )}
            </div>
            <div className="text-right">
              <span className="text-[30px] block">{icon}</span>
            </div>
          </div>
          <div
            className="flex gap-2.5 px-3.5 py-1.5 text-[10px] border-b border-gray-200 flex-wrap"
            style={{ color: 'var(--gray)' }}
          >
            {w && (
              <>
                <span>🌬 {w.windDir} {w.windScale}级</span>
                <span>💧 湿度 {w.humidity}%</span>
              </>
            )}
            {air && <span>AQI: {air.category} {air.aqi}</span>}
            {today && (
              <>
                <span>🌅 {today.sunrise}</span>
                <span>🌇 {today.sunset}</span>
              </>
            )}
          </div>

          {/* Hourly forecast */}
          {upcomingHours.length > 0 && (
            <div className="flex border-b border-gray-200">
              {upcomingHours.map((h, i) => {
                const hr = new Date(h.fxTime).getHours();
                return (
                  <div
                    key={i}
                    className="flex-1 text-center py-1.5 px-0.5 text-[10px] border-r border-gray-100 last:border-0"
                  >
                    <div className="font-mono text-[9px]" style={{ color: 'var(--gray)' }}>
                      {hr}:00
                    </div>
                    <div className="text-[14px] my-0.5">{weatherIcon(h.icon)}</div>
                    <div className="font-mono text-[9px]">{h.temp}°</div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Todo */}
      {cfg.todo && (
        <div className="px-3.5 py-2.5 border-b border-gray-200">
          <div className="widget-label">今日安排</div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2 py-1 text-[12px] border-b border-gray-100 last:border-0">
              <span className="font-mono text-[10px] min-w-[38px]" style={{ color: 'var(--gray)' }}>
                10:00
              </span>
              <span>产品评审会议</span>
            </div>
            <div className="flex items-baseline gap-2 py-1 text-[12px] border-b border-gray-100 last:border-0">
              <span className="font-mono text-[10px] min-w-[38px]" style={{ color: 'var(--gray)' }}>
                14:30
              </span>
              <span>代码 Code Review</span>
            </div>
            <div className="flex items-baseline gap-2 py-1 text-[12px] border-b border-gray-100 last:border-0">
              <span className="font-mono text-[10px] min-w-[38px]" style={{ color: 'var(--gray)' }}>
                明天
              </span>
              <span>还图书馆的书</span>
            </div>
          </div>
        </div>
      )}

      {/* Quote */}
      {cfg.quote && (
        <div className="px-3.5 py-2.5 mt-auto">
          <div className="widget-label">每日一句</div>
          <div className="text-[12px] leading-relaxed text-[#333]">
            读书不觉已春深，一寸光阴一寸金。
          </div>
          <div className="text-[10px] mt-[3px] text-right" style={{ color: 'var(--light-gray)' }}>
            — 王贞白《白鹿洞》
          </div>
        </div>
      )}
    </section>
  );
}
