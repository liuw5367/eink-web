import { useState, useEffect, useRef } from "react";
import { useConfigStore } from "../hooks/useConfig";
import { zp } from "../hooks/useClock";
import type { Mode } from "../types";

export const MODE_NAMES: Record<Mode, string> = {
  banke: "版刻",
  chenbao: "晨报",
};

const MODE_ICONS: Record<Mode, string> = {
  banke: "🕐",
  chenbao: "📰",
};

const ALL_MODES: Mode[] = ["banke", "chenbao"];

function formatInterval(interval: number): string {
  if (interval === 0) return "手动";
  if (interval < 60) return `${interval}min`;
  return `${interval / 60}h`;
}

export function BottomNav() {
  const cfg = useConfigStore((s) => s.cfg);
  const setMode = useConfigStore((s) => s.setMode);
  const setSettingsOpen = useConfigStore((s) => s.setSettingsOpen);
  const [modePickerOpen, setModePickerOpen] = useState(false);
  const batteryRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Battery + time via DOM updates (no re-render)
  useEffect(() => {
    const updateTime = () => {
      if (timeRef.current) {
        const now = new Date();
        timeRef.current.textContent = zp(now.getHours()) + ':' + zp(now.getMinutes());
      }
    };
    const updateBattery = () => {
      if (window.Android?.getBatteryLevel) {
        if (batteryRef.current) batteryRef.current.textContent = `🔋 ${window.Android.getBatteryLevel()}%`;
      } else if (navigator.getBattery) {
        navigator.getBattery().then((b) => {
          if (batteryRef.current) batteryRef.current.textContent = `🔋 ${Math.round(b.level * 100)}%`;
        });
      }
    };
    updateTime();
    updateBattery();
    const timeInterval = setInterval(updateTime, 60000);
    const batteryInterval = setInterval(updateBattery, 5 * 60 * 1000);
    return () => { clearInterval(timeInterval); clearInterval(batteryInterval); };
  }, []);

  // Close picker on outside click
  useEffect(() => {
    if (!modePickerOpen) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setModePickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [modePickerOpen]);

  const handleModeSelect = (mode: Mode) => {
    setMode(mode);
    setModePickerOpen(false);
  };

  return (
    <nav
      className="flex items-center justify-between border-t-2 border-black flex-shrink-0 h-[50px] px-3 bg-white font-mono relative"
      style={{ fontSize: "var(--text-sm)" }}
    >
      {/* Left: battery · time · interval */}
      <div className="flex items-center gap-2 font-bold">
        <span className="flex items-center" ref={batteryRef}>🔋 --%</span>
        <span className="opacity-70">│</span>
        <span ref={timeRef}>--:--</span>
        <span className="opacity-70">│</span>
        <span className="flex items-center">↺ {formatInterval(cfg.interval)}</span>
      </div>

      {/* Right: mode icon + settings */}
      <div className="flex items-center gap-3">
        {/* Mode picker */}
        <div className="relative" ref={pickerRef}>
          <button
            className="cursor-pointer leading-none p-1"
            style={{ fontSize: "var(--text-base)" }}
            onClick={() => setModePickerOpen(!modePickerOpen)}
            title="切换模式"
          >
            {MODE_ICONS[cfg.mode]}
          </button>

          {/* Floating popup */}
          {modePickerOpen && (
            <div className="absolute bottom-full right-0 mb-2 bg-white border-2 border-black shadow-[4px_4px_0_#000] z-50 min-w-[140px]">
              {ALL_MODES.map((mode) => (
                <button
                  key={mode}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-left font-bold cursor-pointer border-b border-gray-200 last:border-0 ${
                    cfg.mode === mode
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                  style={{ fontSize: "var(--text-sm)" }}
                  onClick={() => handleModeSelect(mode)}
                >
                  <span style={{ fontSize: "var(--text-base)" }}>
                    {MODE_ICONS[mode]}
                  </span>
                  <span>{MODE_NAMES[mode]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          className="cursor-pointer leading-none p-1"
          style={{ fontSize: "var(--text-base)" }}
          onClick={() => setSettingsOpen(true)}
          title="设置"
        >
          ⚙️
        </button>
      </div>
    </nav>
  );
}
