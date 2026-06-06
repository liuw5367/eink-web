import { useClock } from '../hooks/useClock';
import { useConfigStore } from '../hooks/useConfig';

export function ClockMode() {
  const { time, dateStr, lunar } = useClock();
  const cfg = useConfigStore((s) => s.cfg);

  return (
    <section className="flex flex-col overflow-y-auto overflow-x-hidden h-full">
      {/* Clock block */}
      <div className="px-3.5 py-4 text-center border-b border-gray-200">
        <div
          className="font-mono font-bold leading-none"
          style={{ fontSize: 'clamp(56px, 18vw, 80px)', letterSpacing: '-3px' }}
        >
          {time}
        </div>
        <div className="text-[13px] font-semibold tracking-wide mt-1">{dateStr}</div>
        {cfg.lunar && (
          <div className="text-[10px] tracking-wide mt-0.5" style={{ color: 'var(--gray)' }}>
            农历 {lunar}
          </div>
        )}
      </div>

      {/* Weather */}
      {cfg.weather && (
        <>
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-gray-200 gap-2">
            <div>
              <div className="widget-label">📍 {cfg.city}</div>
              <div className="font-mono text-[34px] font-bold leading-none">28°</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--gray)' }}>
                多云转晴
              </div>
              <div className="font-mono text-[11px] mt-[3px]" style={{ color: 'var(--gray)' }}>
                28° / 19°
              </div>
            </div>
            <div className="text-right">
              <span className="text-[30px] block">⛅</span>
            </div>
          </div>
          <div
            className="flex gap-2.5 px-3.5 py-1.5 text-[10px] border-b border-gray-200 flex-wrap"
            style={{ color: 'var(--gray)' }}
          >
            <span>🌬 东南风 3级</span>
            <span>💧 湿度 65%</span>
            <span>AQI: 良 45</span>
            <span>🌅 05:11</span>
          </div>
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
