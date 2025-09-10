// next.config.mjs
import withPWA from 'next-pwa';
import runtimeCaching from './pwa-runtime-caching.mjs';

const withPWAFunc = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching,
  fallbacks: { document: '/_offline' },
});

export default withPWAFunc({
  reactStrictMode: true,
  webpack(config, { isServer }) {
    // 1) Alias "node:*" -> built-ins Node (évite UnhandledSchemeError)
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'node:crypto': 'crypto',
      'node:fs': 'fs',
      'node:path': 'path',
      'node:url': 'url',
      'node:stream': 'stream',
      'node:buffer': 'buffer',
    };

    // 2) N'inclut JAMAIS formidable dans le bundle client
    if (!isServer) {
      config.externals = [...(config.externals || []), 'formidable'];
      // 3) Pas de polyfills Node côté client
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        crypto: false,
        fs: false,
        path: false,
        url: false,
        stream: false,
        buffer: false,
      };
    }

    // 4) Ton support SVG existant
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
});
