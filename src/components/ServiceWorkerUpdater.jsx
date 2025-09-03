import { useEffect, useState } from 'react';
import { Workbox } from 'workbox-window';

export default function ServiceWorkerUpdater() {
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const wb = new Workbox('/sw.js');
      wb.addEventListener('waiting', () => setNeedRefresh(true));
      wb.register();
    }
  }, []);

  if (!needRefresh) return null;

  return (
    <button
      onClick={() => {
        navigator.serviceWorker.getRegistration().then(reg => reg?.waiting?.postMessage({ type: 'SKIP_WAITING' }));
        window.location.reload();
      }}
      className="fixed bottom-4 right-4 rounded-xl px-4 py-2 shadow bg-emerald-600 text-white"
    >
      🔄 Nouvelle version dispo — Mettre à jour
    </button>
  );
}
