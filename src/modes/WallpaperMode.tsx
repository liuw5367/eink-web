import { useClock } from '../hooks/useClock';
import { getLunarInfo } from '../hooks/useLunar';
import { useConfigStore } from '../hooks/useConfig';
import { useWeatherStore } from '../hooks/useWeather';
import { weatherIcon } from '../utils/weatherIcon';

export function WallpaperMode() {
  const { now, time, dateStr } = useClock();
  const cfg = useConfigStore((s) => s.cfg);
  const w = useWeatherStore((s) => s.now);

  const lunar = getLunarInfo(now);

  return (
    <section className="relative bg-black overflow-hidden h-full">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,.03) 3px, rgba(255,255,255,.03) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,.03) 3px, rgba(255,255,255,.03) 4px),
            radial-gradient(ellipse at 30% 40%, #222 0%, #000 70%)
          `,
        }}
      />

      {/* Hint */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#333] text-[12px] tracking-widest text-center">
        ── 壁纸区域 ──
        <br />
        <span className="text-[10px]">在 APK 中替换为图片背景</span>
      </div>

      {/* Overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 px-3.5 py-3.5 text-white"
        style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85))' }}
      >
        <div className="font-mono text-[52px] font-bold leading-none">{time}</div>
        <div className="text-[14px] tracking-widest text-[#ccc] mt-0.5">{dateStr}</div>
        <div className="text-[12px] text-[#888] mt-1.5 flex gap-3">
          <span>🔋 --%</span>
          {w && (
            <span>
              {weatherIcon(w.icon)} {w.temp}°C {w.text}
            </span>
          )}
          {cfg.lunar && <span>农历 {lunar.full}</span>}
        </div>
      </div>
    </section>
  );
}
