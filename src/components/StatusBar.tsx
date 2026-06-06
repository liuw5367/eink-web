import { useClock } from '../hooks/useClock';
import { useConfigStore } from '../hooks/useConfig';
import { MODE_NAMES } from './BottomNav';

export function StatusBar() {
  const { time } = useClock();
  const cfg = useConfigStore((s) => s.cfg);

  return (
    <div className="flex items-center justify-between px-3 py-[5px] border-b-2 border-black bg-black text-white font-mono text-[10px] flex-shrink-0 h-7">
      <div className="flex items-center gap-2">
        <span>{MODE_NAMES[cfg.mode]}</span>
        <span className="opacity-40">│</span>
        <span className="opacity-75">
          {cfg.interval === 0 ? '手动刷新' : `↺ ${cfg.interval}min`}
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <span id="statusBattery">🔋 --%</span>
        <span>{time}</span>
      </div>
    </div>
  );
}
