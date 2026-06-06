import { useClock } from '../hooks/useClock';
import { useConfigStore } from '../hooks/useConfig';

export function WallpaperMode() {
  const { time, dateStr, lunar } = useClock();
  const cfg = useConfigStore((s) => s.cfg);

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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#333] text-[10px] tracking-widest text-center">
        ── 壁纸区域 ──
        <br />
        <span className="text-[8px]">在 APK 中替换为图片背景</span>
      </div>

      {/* Overlay */}
      <div className="relative z-10 mt-auto px-3.5 py-3.5 text-white" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85))' }}>
        <div className="font-mono text-[48px] font-bold leading-none">{time}</div>
        <div className="text-[12px] tracking-widest text-[#ccc] mt-0.5">{dateStr}</div>
        <div className="text-[10px] text-[#888] mt-1.5 flex gap-3">
          <span>🔋 --%</span>
          <span>⛅ 28°C 多云</span>
          {cfg.lunar && <span>农历 {lunar}</span>}
        </div>
      </div>
    </section>
  );
}
