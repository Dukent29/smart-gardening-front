// dossier: pages/login · fichier: index.jsx
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import BottomNav from "@/components/BottomNav";

export default function LoginPage() {
  const { login } = useAuth();
  const router    = useRouter();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });   // POST /api/users/login
      router.push("/dashboard");
    } catch {
      setError("Identifiants invalides");
    }
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center p-4">
      <BottomNav />
      <form onSubmit={handleLogin}
            className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold">Connexion 🌿</h1>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="email" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="password" placeholder="Mot de passe"
          value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Se connecter
        </button>

        {/* petit lien vers register */}
        <p className="text-sm text-center">
          Pas de compte ?{" "}
          <span
            className="text-green-700 cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Inscris-toi
          </span>
        </p>
      </form>
    </div>
  );
}
