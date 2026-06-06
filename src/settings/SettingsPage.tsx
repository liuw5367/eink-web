import { useConfigStore } from '../hooks/useConfig';
import { SettingRow, Toggle, Select, Input, TimeInput } from './SettingRow';
import { MODE_NAMES } from '../components/BottomNav';
import type { Mode } from '../types';

const MODE_CARDS: { mode: Mode; icon: string; label: string }[] = [
  { mode: 'clock', icon: '🕐', label: '时钟信息' },
  { mode: 'info', icon: '📰', label: '资讯面板' },
  { mode: 'wallpaper', icon: '🖼', label: '壁纸时钟' },
  { mode: 'banke', icon: '⬛', label: '版刻' },
  { mode: 'chenbao', icon: '📰', label: '晨报' },
];

const INTERVAL_CHIPS = [
  { value: 5, label: '5分钟' },
  { value: 15, label: '15分钟' },
  { value: 30, label: '30分钟' },
  { value: 60, label: '1小时' },
  { value: 0, label: '仅手动' },
];

export function SettingsPage() {
  const cfg = useConfigStore((s) => s.cfg);
  const update = useConfigStore((s) => s.update);
  const setMode = useConfigStore((s) => s.setMode);
  const setSettingsOpen = useConfigStore((s) => s.setSettingsOpen);
  const setNightActive = useConfigStore((s) => s.setNightActive);
  const reset = useConfigStore((s) => s.reset);

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-[11px] border-b-2 border-black flex-shrink-0">
        <div className="text-[18px] font-black tracking-wide">⚙ 设置</div>
        <button
          className="text-[11px] font-bold cursor-pointer px-2.5 py-[5px] border-2 border-black tracking-wide"
          onClick={() => setSettingsOpen(false)}
        >
          ✕ 关闭
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {/* Default mode */}
        <div className="border-b border-gray-200">
          <SectionTitle>默认显示模式</SectionTitle>
          <div className="grid grid-cols-3 gap-2 px-3.5 py-2.5">
            {MODE_CARDS.map((card) => (
              <button
                key={card.mode}
                className={`border-2 px-1.5 py-2.5 text-center cursor-pointer text-[10px] font-bold ${
                  cfg.mode === card.mode
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300'
                }`}
                onClick={() => {
                  setMode(card.mode);
                  setSettingsOpen(false);
                }}
              >
                <div className="text-[18px] mb-1">{card.icon}</div>
                {card.label}
              </button>
            ))}
          </div>
        </div>

        {/* Refresh */}
        <div className="border-b border-gray-200">
          <SectionTitle>刷新策略</SectionTitle>
          <SettingRow label="刷新间隔" sub="内容自动更新频率">
            <span />
          </SettingRow>
          <div className="flex flex-wrap gap-1.5 px-3.5 pb-3">
            {INTERVAL_CHIPS.map((chip) => (
              <button
                key={chip.value}
                className={`border-2 border-black px-3 py-1 text-[11px] font-bold cursor-pointer ${
                  cfg.interval === chip.value ? 'bg-black text-white' : 'bg-white'
                }`}
                style={{ fontFamily: "'Noto Serif SC', serif" }}
                onClick={() => update({ interval: chip.value })}
              >
                {chip.label}
              </button>
            ))}
          </div>
          <SettingRow label="整点刷新" sub="仅在整点更新内容">
            <Toggle checked={cfg.topHour} onChange={(v) => update({ topHour: v })} />
          </SettingRow>
        </div>

        {/* Night mode */}
        <div className="border-b border-gray-200">
          <SectionTitle>夜间模式</SectionTitle>
          <SettingRow label="启用夜间模式" sub="夜间自动切换极简时钟">
            <Toggle checked={cfg.night} onChange={(v) => update({ night: v })} />
          </SettingRow>
          <div className="flex items-center gap-2 px-3.5 py-1 text-[12px]" style={{ opacity: cfg.night ? 1 : 0.4 }}>
            <span className="text-[12px] font-semibold">时段</span>
            <TimeInput value={cfg.nightStart} onChange={(v) => update({ nightStart: v })} />
            <span className="text-[12px]" style={{ color: 'var(--gray)' }}>至</span>
            <TimeInput value={cfg.nightEnd} onChange={(v) => update({ nightEnd: v })} />
          </div>
          <SettingRow label="夜间跳过刷新" sub="夜间暂停内容更新">
            <Toggle checked={cfg.nightSkip} onChange={(v) => update({ nightSkip: v })} />
          </SettingRow>
          <SettingRow label="夜间降低亮度" sub="自动调至最低亮度">
            <Toggle checked={cfg.nightDim} onChange={(v) => update({ nightDim: v })} />
          </SettingRow>
        </div>

        {/* Display content */}
        <div className="border-b border-gray-200">
          <SectionTitle>显示内容</SectionTitle>
          <SettingRow label="显示农历">
            <Toggle checked={cfg.lunar} onChange={(v) => update({ lunar: v })} />
          </SettingRow>
          <SettingRow label="显示天气">
            <Toggle checked={cfg.weather} onChange={(v) => update({ weather: v })} />
          </SettingRow>
          <SettingRow label="显示今日安排">
            <Toggle checked={cfg.todo} onChange={(v) => update({ todo: v })} />
          </SettingRow>
          <SettingRow label="显示每日一句">
            <Toggle checked={cfg.quote} onChange={(v) => update({ quote: v })} />
          </SettingRow>
          <SettingRow label="字体大小">
            <Select
              value={cfg.fontSize}
              options={[
                { value: 'sm', label: '较小' },
                { value: 'md', label: '标准' },
                { value: 'lg', label: '较大' },
              ]}
              onChange={(v) => update({ fontSize: v as 'sm' | 'md' | 'lg' })}
            />
          </SettingRow>
        </div>

        {/* Content sources */}
        <div className="border-b border-gray-200">
          <SectionTitle>内容设置</SectionTitle>
          <SettingRow label="天气城市">
            <Input value={cfg.city} placeholder="城市名" onChange={(v) => update({ city: v })} />
          </SettingRow>
          <SettingRow label="天气 API Key" sub="和风天气 / OpenWeather">
            <Input value={cfg.apiKey} placeholder="粘贴 Key" onChange={(v) => update({ apiKey: v })} />
          </SettingRow>
          <SettingRow label="壁纸来源">
            <Select
              value={cfg.wpSrc}
              options={[
                { value: 'bing', label: '每日必应' },
                { value: 'local', label: '本地图片' },
                { value: 'pattern', label: '纯色图案' },
              ]}
              onChange={(v) => update({ wpSrc: v as 'bing' | 'local' | 'pattern' })}
            />
          </SettingRow>
        </div>

        {/* System */}
        <div className="border-b border-gray-200">
          <SectionTitle>系统</SectionTitle>
          <SettingRow label="防止锁屏" sub="保持屏幕常亮（需 APK 支持）">
            <Toggle checked={cfg.keepOn} onChange={(v) => update({ keepOn: v })} />
          </SettingRow>
          <SettingRow label="启动全屏" sub="隐藏状态栏和导航栏">
            <Toggle checked={cfg.fullscreen} onChange={(v) => update({ fullscreen: v })} />
          </SettingRow>
          <SettingRow label="屏幕方向">
            <Select
              value={cfg.orient}
              options={[
                { value: 'portrait', label: '竖屏' },
                { value: 'landscape', label: '横屏' },
                { value: 'auto', label: '自动' },
              ]}
              onChange={(v) => update({ orient: v as 'portrait' | 'landscape' | 'auto' })}
            />
          </SettingRow>
          <SettingRow
            label="预览夜间模式"
            sub="查看夜间界面效果"
            onClick={() => {
              setSettingsOpen(false);
              setTimeout(() => setNightActive(true), 300);
            }}
          >
            <span className="text-[11px] font-bold cursor-pointer" style={{ color: 'var(--gray)' }}>
              ▶ 预览
            </span>
          </SettingRow>
          <SettingRow
            label="立即刷新内容"
            sub="重新拉取天气 / 新闻"
            onClick={() => {
              setSettingsOpen(false);
            }}
          >
            <span className="text-[11px] font-bold cursor-pointer" style={{ color: 'var(--gray)' }}>
              ↺ 刷新
            </span>
          </SettingRow>
          <SettingRow
            label="恢复默认设置"
            danger
            onClick={() => {
              if (confirm('确认恢复所有默认设置？')) {
                reset();
              }
            }}
          >
            <span className="text-[11px] font-bold text-red-600 cursor-pointer">重置</span>
          </SettingRow>
        </div>

        {/* Footer */}
        <div className="px-3.5 py-4 text-center text-[10px] leading-relaxed" style={{ color: '#bbb' }}>
          EInk Panel v1.0 · 掌阅 Neo3 专版
          <br />
          <span>设置自动保存到本地</span>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[8px] font-black tracking-[2.5px] px-3.5 pt-2.5 pb-1 uppercase"
      style={{ color: 'var(--gray)' }}
    >
      {children}
    </div>
  );
}
