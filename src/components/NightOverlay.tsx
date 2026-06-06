import { useClock } from '../hooks/useClock';
import { useConfigStore } from '../hooks/useConfig';

export function NightOverlay() {
  const { time, shortDate } = useClock();
  const nightActive = useConfigStore((s) => s.nightActive);
  const setNightActive = useConfigStore((s) => s.setNightActive);

  if (!nightActive) return null;

  return (
    <div
      className="fixed inset-0 bg-white z-[200] flex items-center justify-center flex-col gap-4 cursor-pointer"
      onClick={() => setNightActive(false)}
    >
      <div className="night-time">{time}</div>
      <div className="text-[15px] tracking-widest">{shortDate}</div>
      <div className="text-[12px] tracking-[1.5px] mt-5">
        点击任意位置退出夜间模式
      </div>
    </div>
  );
}
