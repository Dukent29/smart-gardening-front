import { usePWAInstall } from '@/hooks/usePWAInstall';

export default function InstallPWAButton({ className = '' }) {
  const { canInstall, install, isStandalone } = usePWAInstall();

  // Déjà installée → pas besoin d’afficher
  if (isStandalone) return null;

  // Si le prompt n’est pas dispo (iOS Safari notamment), on cache le bouton
  if (!canInstall) return null;

  return (
    <button
      onClick={install}
      className={
        "fixed bottom-4 right-4 z-50 rounded-xl px-4 py-2 shadow bg-emerald-600 text-white hover:bg-emerald-700 " +
        className
      }
    >
      📲 Installer l’app
    </button>
  );
}
