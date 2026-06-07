/// <reference types="@rsbuild/core/types" />

interface ImportMetaEnv {
  readonly PUBLIC_QWEATHER_KEY: string;
  readonly PUBLIC_QWEATHER_CITY: string;
  readonly PUBLIC_QWEATHER_BASE_URL: string;
  readonly PUBLIC_QWEATHER_GEO_URL: string;
  readonly PUBLIC_ACCESS_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Imports the SVG file as a React component.
 * @requires [@rsbuild/plugin-svgr](https://npmjs.com/package/@rsbuild/plugin-svgr)
 */
declare module '*.svg?react' {
  import type React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
