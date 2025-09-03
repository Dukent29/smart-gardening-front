// dossier: pages/login · fichier: index.jsx
import { useState } from "react";
import { useAuth } from "@/context/authProvider";
import { useRouter } from "next/router";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const { login } = useAuth();
  const router    = useRouter();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="w-full max-w-lg mx-auto px-4 min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <form onSubmit={handleLogin}
            className=" p-6 rounded  w-full space-y-4">
        <h1 className="text-xl font-bold text-[#074221]">Connexion </h1>

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex flex-col items-center mb-4">
          <button className="w-full bg-white border border-gray-300 py-2 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-gray-100">
            <FaGoogle className="text-[#0a5d2f] w-5 h-5" />
            <span className="text-gray-600 font-medium">Continue with Google</span>
          </button>
          <div className="flex items-center w-full mt-2">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-400 text-sm">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>
        </div>

        <div className="relative">
          <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
          <input
            type="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#D9D9D9] p-2 pl-10 rounded-xl placeholder-gray-500 text-gray-600"
          />
        </div>

        <div className="relative">
          <FaLock className="absolute left-3 top-3 text-gray-500" />
          <input
            type={showPassword ? "text" : "password"} placeholder="Mot de passe"
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#D9D9D9] p-2 pl-10 rounded-xl placeholder-gray-500 text-gray-600"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

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
          </span> <br/>
          <span className="text-green-700 cursor-pointer" onClick={() => router.push("/login/forgotPassword")}>
            Mot de passe oublié ?
          </span>
        </p>
      </form>
    </div>
  );
}
