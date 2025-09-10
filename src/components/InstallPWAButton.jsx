import { usePWAInstall } from '@/hooks/usePWAInstall';

export default function InstallPWAButton({ className = '' }) {
  const { canInstall, install, isStandalone } = usePWAInstall();

  if (isStandalone) return null;

  if (!canInstall) return null;

  return (
    <button
      onClick={install}
      className={
        "fixed bottom-4 right-4 z-50 rounded-xl px-4 py-2 shadow bg-[#09552b] text-white hover:bg-[#074221] " +
        className
      }
    >
      📲 Installer l’app
    </button>
  );
}
