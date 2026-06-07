export interface AppConfig {
  mode: Mode;
  interval: number;
  topHour: boolean;
  night: boolean;
  nightStart: string;
  nightEnd: string;
  fontSize: "sm" | "md" | "lg";
  city: string;
  apiKey: string;
  keepOn: boolean;
}

export type Mode = "banke" | "chenbao";

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
