import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const { parsed } = loadEnv();

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginReact()],
  server: {
    open: false,
  },
  source: {
    define: {
      'import.meta.env.PUBLIC_QWEATHER_KEY': JSON.stringify(parsed.PUBLIC_QWEATHER_KEY || ''),
      'import.meta.env.PUBLIC_QWEATHER_CITY': JSON.stringify(parsed.PUBLIC_QWEATHER_CITY || '北京'),
    },
  },
});
