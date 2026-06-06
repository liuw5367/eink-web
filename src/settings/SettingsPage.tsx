import { useState } from 'react';
import { useConfigStore } from '../hooks/useConfig';
import { SettingRow, Toggle, Input, TimeInput } from './SettingRow';

const INTERVAL_CHIPS = [
  { value: 5, label: '5分钟' },
  { value: 15, label: '15分钟' },
  { value: 30, label: '30分钟' },
  { value: 60, label: '1小时' },
  { value: 0, label: '仅手动' },
];

type TabKey = 'refresh' | 'weather' | 'system';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'refresh', label: '刷新' },
  { key: 'weather', label: '天气' },
  { key: 'system', label: '系统' },
];

export function SettingsPage() {
  const cfg = useConfigStore((s) => s.cfg);
  const update = useConfigStore((s) => s.update);
  const setSettingsOpen = useConfigStore((s) => s.setSettingsOpen);
  const reset = useConfigStore((s) => s.reset);
  const [tab, setTab] = useState<TabKey>('refresh');

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-[11px] border-b-2 border-black flex-shrink-0">
        <div className="text-[22px] font-black tracking-wide">⚙ 设置</div>
        <button
          className="text-[13px] font-bold cursor-pointer px-2.5 py-[5px] border-2 border-black tracking-wide"
          onClick={() => setSettingsOpen(false)}
        >
          ✕ 关闭
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-black flex-shrink-0">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`flex-1 py-2.5 text-[14px] font-bold tracking-wide cursor-pointer border-r border-black last:border-r-0 ${
              tab === t.key ? 'bg-black text-white' : 'bg-white'
            }`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {/* ── 刷新 ── */}
        {tab === 'refresh' && (
          <>
            <div className="border-b border-gray-200">
              <SectionTitle>刷新策略</SectionTitle>
              <SettingRow label="刷新间隔" sub="内容自动更新频率">
                <span />
              </SettingRow>
              <div className="flex flex-wrap gap-1.5 px-3.5 pb-3">
                {INTERVAL_CHIPS.map((chip) => (
                  <button
                    key={chip.value}
                    className={`border-2 border-black px-3 py-1.5 text-[13px] font-bold cursor-pointer ${
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

            <div className="border-b border-gray-200">
              <SectionTitle>夜间模式</SectionTitle>
              <SettingRow label="启用夜间模式" sub="夜间自动切换极简时钟">
                <Toggle checked={cfg.night} onChange={(v) => update({ night: v })} />
              </SettingRow>
              <div
                className="flex items-center gap-2 px-3.5 py-1 text-[14px]"
                style={{ opacity: cfg.night ? 1 : 0.4 }}
              >
                <span className="text-[12px] font-semibold">时段</span>
                <TimeInput
                  value={cfg.nightStart}
                  onChange={(v) => update({ nightStart: v })}
                />
                <span className="text-[12px]">至</span>
                <TimeInput
                  value={cfg.nightEnd}
                  onChange={(v) => update({ nightEnd: v })}
                />
              </div>
              <SettingRow label="夜间跳过刷新" sub="夜间暂停内容更新">
                <Toggle
                  checked={cfg.nightSkip}
                  onChange={(v) => update({ nightSkip: v })}
                />
              </SettingRow>
            </div>
          </>
        )}

        {/* ── 天气 ── */}
        {tab === 'weather' && (
          <div className="border-b border-gray-200">
            <SectionTitle>天气设置</SectionTitle>
            <SettingRow label="天气城市">
              <Input
                value={cfg.city}
                placeholder="城市名"
                onChange={(v) => update({ city: v })}
              />
            </SettingRow>
            <SettingRow label="天气 API Key" sub="和风天气 / OpenWeather">
              <Input
                value={cfg.apiKey}
                placeholder="粘贴 Key"
                onChange={(v) => update({ apiKey: v })}
              />
            </SettingRow>
          </div>
        )}

        {/* ── 系统 ── */}
        {tab === 'system' && (
          <div className="border-b border-gray-200">
            <SectionTitle>系统</SectionTitle>
            <SettingRow label="防止锁屏" sub="保持屏幕常亮（需 APK 支持）">
              <Toggle checked={cfg.keepOn} onChange={(v) => update({ keepOn: v })} />
            </SettingRow>
            <SettingRow
              label="立即刷新内容"
              sub="重新拉取天气"
              onClick={() => {
                setSettingsOpen(false);
              }}
            >
              <span className="text-[13px] font-bold cursor-pointer">
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
              <span className="text-[13px] font-bold text-red-600 cursor-pointer">
                重置
              </span>
            </SettingRow>
          </div>
        )}

        {/* Footer */}
        <div className="px-3.5 py-4 text-center text-[12px] leading-relaxed">
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
    <div className="text-[10px] font-black tracking-[2.5px] px-3.5 pt-2.5 pb-1 uppercase">
      {children}
    </div>
  );
}
