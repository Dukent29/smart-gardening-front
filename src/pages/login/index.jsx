// dossier: pages/login · fichier: index.jsx
import { useState } from "react";
import { useAuth } from "@/context/authProvider";
import { useRouter } from "next/router";

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
    
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F5F5]">
      
      <form onSubmit={handleLogin}
            className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-[#074221]">Connexion </h1>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="email" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#D9D9D9] p-2 rounded-xl placeholder-[#fff]"
        />
        <input
          type="password" placeholder="Mot de passe"
          value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#D9D9D9] p-2 rounded-xl placeholder-[#fff]"
        />

        <button className="w-full bg-[#0a5d2f] text-white py-2 rounded-xl hover:bg-green-700">
          Se connecter
        </button>

        {/* petit lien vers register */}
        <p className="text-sm text-center text-[#000]">
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
