import { BottomNav } from './components/BottomNav';
import { Layout } from './components/Layout';
import { PasswordGate } from './components/PasswordGate';
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

  // Font size
  useEffect(() => {
    const map = { sm: '18px', md: '20px', lg: '24px' };
    document.documentElement.style.fontSize = map[cfg.fontSize] || '16px';
  }, [cfg.fontSize]);

  // Android bridge: keep screen on
  useEffect(() => {
    if (cfg.keepOn && window.Android?.setKeepScreenOn) {
      window.Android.setKeepScreenOn(true);
    }
  }, [cfg.keepOn]);

  const ActiveMode = MODE_COMPONENTS[cfg.mode];

  return (
    <PasswordGate>
      <Layout>
        <div className="flex-1 overflow-hidden relative">
          <ActiveMode />
        </div>
        <BottomNav />
        {settingsOpen && <SettingsPage />}
      </Layout>
    </PasswordGate>
  );
}

export default App;
