// pwa-runtime-caching.mjs
const oneDay = 24 * 60 * 60;
const oneMonth = 30 * oneDay;
const oneYear = 365 * oneDay;

export default [
  // Ne JAMAIS cacher ton API (auth incluse)
  {
    urlPattern: ({ url }) => url.pathname.startsWith('/api'),
    handler: 'NetworkOnly',
    method: 'GET',
    options: { cacheName: 'api-calls' },
  },
  // Images (hors /api)
  {
    urlPattern: ({ request }) => request.destination === 'image',
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'images',
      expiration: { maxEntries: 200, maxAgeSeconds: oneMonth },
    },
  },
  // Google Fonts
  {
    urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts',
      expiration: { maxEntries: 30, maxAgeSeconds: oneYear },
    },
  },
];
