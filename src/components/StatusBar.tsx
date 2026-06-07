import { useEffect, useRef } from "react";
import { useConfigStore } from "../hooks/useConfig";
import { zp } from "../hooks/useClock";
import { MODE_NAMES } from "./BottomNav";

export function StatusBar() {
  const cfg = useConfigStore((s) => s.cfg);
  const timeRef = useRef<HTMLSpanElement>(null);

  // Update time via DOM (no re-render)
  useEffect(() => {
    const tick = () => {
      if (timeRef.current) {
        const now = new Date();
        timeRef.current.textContent = zp(now.getHours()) + ':' + zp(now.getMinutes());
      }
    };
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between px-3 py-[5px] border-b-2 border-black bg-black text-white font-mono flex-shrink-0 h-8" style={{ fontSize: "var(--text-xs)" }}>
      <div className="flex items-center gap-2">
        <span>{MODE_NAMES[cfg.mode]}</span>
        <span className="opacity-40">│</span>
        <span className="opacity-75">
          {cfg.interval === 0 ? "手动刷新" : `↺ ${cfg.interval}min`}
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <span id="statusBattery">🔋 --%</span>
        <span ref={timeRef}>--:--</span>
      </div>
    </div>
  );
}
