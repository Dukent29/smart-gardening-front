// 📁 pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login"); // Redirection immédiate vers /login
  }, []);

  return null; // Rien n'est affiché
}
