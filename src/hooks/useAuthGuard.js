// dossier: hooks · fichier: useAuthGuard.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authProvider";

/**
 * Redirects to /login if no authenticated user is found.
 * Call it at the top level of any protected page.
 */
export const useAuthGuard = () => {
  const { user, loading } = useAuth();   // from AuthProvider
  const router = useRouter();

  useEffect(() => {
    // Wait until the auth context has finished loading
    if (!loading && !user) {
      router.replace("/login");          // push → history ; replace → no back loop
    }
  }, [loading, user, router]);
};
