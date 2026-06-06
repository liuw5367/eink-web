export interface AppConfig {
  mode: Mode;
  interval: number;
  topHour: boolean;
  night: boolean;
  nightStart: string;
  nightEnd: string;
  nightSkip: boolean;
  nightDim: boolean;
  lunar: boolean;
  weather: boolean;
  todo: boolean;
  quote: boolean;
  fontSize: "sm" | "md" | "lg";
  city: string;
  apiKey: string;
  wpSrc: "bing" | "local" | "pattern";
  keepOn: boolean;
  fullscreen: boolean;
  orient: "portrait" | "landscape" | "auto";
}

export type Mode =
  // | 'clock' | 'info'| 'wallpaper'
  "banke" | "chenbao";

export interface AndroidBridge {
  getBatteryLevel: () => number;
  setKeepScreenOn: (on: boolean) => void;
  setScreenBrightness: (val: number) => void;
  vibrate: () => void;
}

declare global {
  interface Window {
    Android?: AndroidBridge;
  }
}
