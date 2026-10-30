const fs = require('node:fs');
const path = require('node:path');

const firebasePlugins = new Set([
  '@react-native-firebase/app',
  '@react-native-firebase/auth',
]);
const googleServicesFile = './google-services.json';
const hasAndroidFirebaseConfig = fs.existsSync(
  path.resolve(process.cwd(), googleServicesFile),
);

module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    package: 'com.fashionlens.app',
    ...(hasAndroidFirebaseConfig ? { googleServicesFile } : {}),
  },
  plugins: [
    ...(config.plugins ?? []).filter((plugin) => {
      const pluginName = Array.isArray(plugin) ? plugin[0] : plugin;
      return !firebasePlugins.has(pluginName);
    }),
    ...(hasAndroidFirebaseConfig
      ? ['@react-native-firebase/app', '@react-native-firebase/auth']
      : []),
  ],
  extra: {
    ...config.extra,
    firebaseAndroidConfigured: hasAndroidFirebaseConfig,
  },
});
