import { create } from 'zustand';
import type { AppConfig, Mode } from '../types';

const STORAGE_KEY = 'eink_cfg';

const DEFAULTS: AppConfig = {
  mode: 'clock',
  interval: 15,
  topHour: false,
  night: true,
  nightStart: '22:00',
  nightEnd: '07:00',
  nightSkip: true,
  nightDim: true,
  lunar: true,
  weather: true,
  todo: true,
  quote: true,
  fontSize: 'md',
  city: '北京',
  apiKey: '',
  wpSrc: 'pattern',
  keepOn: true,
  fullscreen: true,
  orient: 'portrait',
};

function loadConfig(): AppConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULTS, ...JSON.parse(saved) };
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
