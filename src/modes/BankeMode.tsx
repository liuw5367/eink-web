import { useClock, getLunarShort, zp } from '../hooks/useClock';
import { useConfigStore } from '../hooks/useConfig';

export function BankeMode() {
  const { now, time, WD, WD_FULL, lunar } = useClock();
  const cfg = useConfigStore((s) => s.cfg);

  const day = now.getDate();
  const today = now.getDay();

  // Week row
  const weekCells = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - today + i);
    const isActive = d.toDateString() === now.toDateString();
    const lun = cfg.lunar ? getLunarShort(d) : '';
    return { day: d.getDate(), label: WD[i], lunar: lun, active: isActive };
  });

  // Forecast data (placeholder)
  const forecast = [
    { day: '今天', icon: '⛅', temp: '28/19' },
    { day: '明天', icon: '☀️', temp: '30/21' },
    { day: '周四', icon: '🌤', temp: '32/22' },
    { day: '周五', icon: '🌧', temp: '25/18' },
  ];

  return (
    <section className="flex flex-col h-full">
      {/* Top */}
      <div className="px-3.5 pt-3.5 flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="text-[16px] font-semibold tracking-[6px]" style={{ color: 'var(--gray)' }}>
            {WD_FULL[now.getDay()]}
          </div>
          <div className="text-[12px] tracking-widest" style={{ color: 'var(--gray)' }}>
            农历 {lunar}
          </div>
          <div className="font-mono text-[20px] tracking-wide mt-0.5">{time}</div>
        </div>
        <div className="border-2 border-black p-2 flex flex-col gap-0.5 items-end">
          <span className="font-mono text-[28px] font-bold tracking-wide">28°C</span>
          <span className="text-[10px] tracking-wide" style={{ color: 'var(--gray)' }}>
            多云
          </span>
          <span className="text-[9px] tracking-wide" style={{ color: 'var(--light-gray)' }}>
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
          <div className="text-[18px] font-semibold tracking-[6px] px-3">
            {now.getFullYear()}年{now.getMonth() + 1}月
          </div>
          <div className="flex-1 h-[1.5px] bg-black" />
        </div>
      </div>

      {/* Week row */}
      <div className="px-3.5 pt-3 grid grid-cols-7 gap-1">
        {weekCells.map((cell, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] font-bold tracking-wide" style={{ color: 'var(--gray)' }}>
              {cell.label}
            </span>
            <span
              className={`font-mono text-[18px] font-semibold w-[34px] h-[34px] flex items-center justify-center ${
                cell.active ? 'bg-black text-white rounded-sm font-bold' : ''
              }`}
            >
              {cell.day}
            </span>
            <span className="text-[9px]" style={{ color: 'var(--light-gray)' }}>
              {cell.lunar}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="mt-auto px-3.5 py-3 flex justify-between items-end border-t-2 border-black">
        <div className="flex gap-3.5">
          {forecast.map((f, i) => (
            <div key={i} className="flex flex-col gap-0.5 items-center">
              <span className="text-[9px] tracking-wide font-bold" style={{ color: 'var(--gray)' }}>
                {f.day}
              </span>
              <span className="text-[14px]">{f.icon}</span>
              <span className="font-mono text-[9px]">{f.temp}</span>
            </div>
          ))}
        </div>
        <div
          className="text-[11px] tracking-widest text-right leading-relaxed max-w-[160px]"
          style={{ color: 'var(--light-gray)' }}
        >
          万物并育而不相害
          <br />
          道并行而不相悖
        </div>
      </div>
    </section>
  );
}
