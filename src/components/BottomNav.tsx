import { useConfigStore } from '../hooks/useConfig';
import type { Mode } from '../types';

export const MODE_NAMES: Record<Mode, string> = {
  clock: '时钟',
  info: '资讯',
  wallpaper: '壁纸',
  banke: '版刻',
  chenbao: '晨报',
};

const NAV_ITEMS: { mode: Mode; icon: string; label: string }[] = [
  { mode: 'clock', icon: '🕐', label: '时钟' },
  { mode: 'info', icon: '📰', label: '资讯' },
  { mode: 'banke', icon: '⬛', label: '版刻' },
  { mode: 'chenbao', icon: '📰', label: '晨报' },
  { mode: 'wallpaper', icon: '🖼', label: '壁纸' },
];

export function BottomNav() {
  const cfg = useConfigStore((s) => s.cfg);
  const setMode = useConfigStore((s) => s.setMode);
  const setSettingsOpen = useConfigStore((s) => s.setSettingsOpen);

  return (
    <nav className="flex items-stretch border-t-2 border-black flex-shrink-0 h-[46px]">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.mode}
          className={`flex-1 flex flex-col items-center justify-center text-[8px] font-bold tracking-[0.5px] cursor-pointer border-r border-black gap-0.5 ${
            cfg.mode === item.mode ? 'bg-black text-white' : 'bg-white text-black'
          }`}
          onClick={() => setMode(item.mode)}
        >
          <span className="text-[15px] leading-none">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
      <button
        className="flex-1 flex flex-col items-center justify-center text-[8px] font-bold tracking-[0.5px] cursor-pointer bg-white text-black gap-0.5"
        onClick={() => setSettingsOpen(true)}
      >
        <span className="text-[15px] leading-none">⚙️</span>
        <span>设置</span>
      </button>
    </nav>
  );
}
