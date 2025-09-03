// next.config.mjs
import withPWA from 'next-pwa';
import runtimeCaching from './pwa-runtime-caching.mjs'; // <= ton fichier
// Si tu veux le défaut: import runtimeCaching from 'next-pwa/cache.js';

const withPWAFunc = withPWA({
  dest: 'public',                            // génère /service-worker.js
  register: true,                            // auto-register
  skipWaiting: true,                         // active la nouvelle version direct
  disable: process.env.NODE_ENV === 'development', // pas de SW en dev
  runtimeCaching,                            // nos règles de cache
  fallbacks: { document: '/_offline' },      // voir étape 6 (optionnel)
});

export default withPWAFunc({
  reactStrictMode: true,
  webpack(config) {
    // garder ton support SVG en React component
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
});
