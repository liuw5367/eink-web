import { BottomNav } from './components/BottomNav';
import { Layout } from './components/Layout';
import { NightOverlay } from './components/NightOverlay';
import { BankeMode } from './modes/BankeMode';
import { ChenbaoMode } from './modes/ChenbaoMode';
import { SettingsPage } from './settings/SettingsPage';
import { useConfigStore } from './hooks/useConfig';
import { useEffect } from 'react';

const MODE_COMPONENTS = {
  banke: BankeMode,
  chenbao: ChenbaoMode,
} as const;

function App() {
  const cfg = useConfigStore((s) => s.cfg);
  const settingsOpen = useConfigStore((s) => s.settingsOpen);
  const setNightActive = useConfigStore((s) => s.setNightActive);

  // Font size
  useEffect(() => {
    const map = { sm: '18px', md: '20px', lg: '24px' };
    document.documentElement.style.fontSize = map[cfg.fontSize] || '16px';
  }, [cfg.fontSize]);

  // Night mode auto-check
  useEffect(() => {
    const checkNight = () => {
      if (!cfg.night) return;
      const now = new Date();
      const cur = now.getHours() * 60 + now.getMinutes();
      const [sh, sm] = cfg.nightStart.split(':').map(Number);
      const [eh, em] = cfg.nightEnd.split(':').map(Number);
      const st = sh * 60 + sm;
      const en = eh * 60 + em;
      const isNight = st > en ? cur >= st || cur < en : cur >= st && cur < en;
      if (isNight) setNightActive(true);
    };

    checkNight();
    const interval = setInterval(checkNight, 60000);
    return () => clearInterval(interval);
  }, [cfg.night, cfg.nightStart, cfg.nightEnd, setNightActive]);

  // Android bridge: keep screen on
  useEffect(() => {
    if (cfg.keepOn && window.Android?.setKeepScreenOn) {
      window.Android.setKeepScreenOn(true);
    }
  }, [cfg.keepOn]);

  const ActiveMode = MODE_COMPONENTS[cfg.mode];

  return (
    <Layout>
      <div className="flex-1 overflow-hidden relative">
        <ActiveMode />
      </div>
      <BottomNav />
      {settingsOpen && <SettingsPage />}
      <NightOverlay />
    </Layout>
  );
}

export default App;
