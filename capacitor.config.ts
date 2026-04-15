import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.beatflow.app',
  appName: 'BeatFlow',
  webDir: 'public',
  bundledWebRuntime: false,
  server: {
    url: 'https://beatflow.space',
    cleartext: false
  },
  android: {
    allowMixedContent: true,
  }
};

export default config;
