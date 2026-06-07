import { useState, useEffect, useRef } from "react";
import { useConfigStore } from "../hooks/useConfig";
import { useClock, zp } from "../hooks/useClock";
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

export function BottomNav() {
  const cfg = useConfigStore((s) => s.cfg);
  const setMode = useConfigStore((s) => s.setMode);
  const setSettingsOpen = useConfigStore((s) => s.setSettingsOpen);
  const { time } = useClock();
  const [modePickerOpen, setModePickerOpen] = useState(false);
  const [battery, setBattery] = useState("--");
  const [countdown, setCountdown] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);

  // Battery
  useEffect(() => {
    const poll = () => {
      if (window.Android?.getBatteryLevel) {
        setBattery(String(window.Android.getBatteryLevel()));
      } else if (navigator.getBattery) {
        navigator.getBattery().then((b) => {
          setBattery(String(Math.round(b.level * 100)));
        });
      }
    };
    poll();
    const interval = setInterval(poll, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Refresh countdown
  useEffect(() => {
    if (cfg.interval === 0) {
      setCountdown("手动");
      return;
    }
    let remaining = cfg.interval * 60;
    const tick = () => {
      remaining--;
      if (remaining <= 0) remaining = cfg.interval * 60;
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      setCountdown(m > 0 ? `${m}min` : `${s}s`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [cfg.interval]);

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
      {/* Left: battery · time · countdown */}
      <div className="flex items-center gap-2 font-bold">
        <span>🔋 {battery}%</span>
        <span className="opacity-70">│</span>
        <span className="">{time}</span>
        <span className="opacity740">│</span>
        <span className="">↺ {countdown}</span>
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
