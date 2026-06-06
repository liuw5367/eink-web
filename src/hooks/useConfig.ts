import { create } from 'zustand';
import type { AppConfig, Mode } from '../types';

const STORAGE_KEY = 'eink_cfg';

const DEFAULTS: AppConfig = {
  mode: 'banke',
  interval: 15,
  topHour: false,
  night: true,
  nightStart: '23:00',
  nightEnd: '06:00',
  nightSkip: true,
  fontSize: 'md',
  city: import.meta.env.PUBLIC_QWEATHER_CITY || '北京',
  apiKey: import.meta.env.PUBLIC_QWEATHER_KEY || '',
  keepOn: true,
};

function loadConfig(): AppConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Let env defaults take precedence over empty saved values
      if (!parsed.apiKey && DEFAULTS.apiKey) parsed.apiKey = DEFAULTS.apiKey;
      if (!parsed.city && DEFAULTS.city) parsed.city = DEFAULTS.city;
      return { ...DEFAULTS, ...parsed };
    }
  } catch {}
  return { ...DEFAULTS };
}

function saveConfig(cfg: AppConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {}
}

// Android bridge stubs for browser fallback
if (!window.Android) {
  window.Android = {
    getBatteryLevel: () => 82,
    setKeepScreenOn: () => {},
    setScreenBrightness: () => {},
    vibrate: () => {},
  };
}

interface ConfigStore {
  cfg: AppConfig;
  settingsOpen: boolean;
  nightActive: boolean;
  update: (partial: Partial<AppConfig>) => void;
  setMode: (mode: Mode) => void;
  setSettingsOpen: (open: boolean) => void;
  setNightActive: (active: boolean) => void;
  reset: () => void;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  cfg: loadConfig(),
  settingsOpen: false,
  nightActive: false,

  update: (partial) => {
    const newCfg = { ...get().cfg, ...partial };
    saveConfig(newCfg);
    set({ cfg: newCfg });
  },

  setMode: (mode) => {
    const newCfg = { ...get().cfg, mode };
    saveConfig(newCfg);
    set({ cfg: newCfg });
  },

  setSettingsOpen: (open) => set({ settingsOpen: open }),
  setNightActive: (active) => set({ nightActive: active }),

  reset: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ cfg: { ...DEFAULTS } });
  },
}));
