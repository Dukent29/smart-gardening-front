// 📁 pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login"); // Redirection immédiate vers /login
  }, [router]); // Include 'router' in the dependency array

  return null; // Rien n'est affiché
}
