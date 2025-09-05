import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authProvider";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaGoogle } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    rgpd: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.rgpd) {
      setError("Tu dois accepter les conditions RGPD pour continuer.");
      return;
    }
    try {
      setLoading(true);
      await register(form.username, form.email, form.password);
      router.push("/register/confirmation");
    } catch (err) {
      setError(err.message || "Erreur lors de l’inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <form onSubmit={handleSubmit} className="p-6 rounded w-full space-y-4">
        <h1 className="text-2xl font-bold text-[#074221]">Créer un compte</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex flex-col items-center mb-4">
          <button className="w-full bg-white border border-gray-300 py-2 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-gray-100">
            <FaGoogle className="text-[#0a5d2f] w-5 h-5" />
            <span className="text-gray-600 font-medium">Continuer avec Google</span>
          </button>
          <div className="flex items-center w-full mt-2">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-400 text-sm">OU</span>
            <hr className="flex-grow border-gray-300" />
          </div>
        </div>

        <div className="relative">
          <FaUser className="absolute left-3 top-3 text-gray-500" />
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Nom d'utilisateur"
            className="w-full bg-[#D9D9D9] placeholder-gray-500 rounded-xl px-4 py-2 text-gray-600 pl-10"
            required
          />
        </div>

        <div className="relative">
          <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Adresse e-mail"
            className="w-full bg-[#D9D9D9] placeholder-gray-500 rounded-xl px-4 py-2 text-gray-600 pl-10"
            required
          />
        </div>

        <div className="relative">
          <FaLock className="absolute left-3 top-3 text-gray-500" />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            placeholder="Mot de passe"
            className="w-full bg-[#D9D9D9] placeholder-gray-500 rounded-xl px-4 py-2 text-gray-600 pl-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="relative">
          <FaLock className="absolute left-3 top-3 text-gray-500" />
          <input
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirmez le mot de passe"
            className="w-full bg-[#D9D9D9] placeholder-gray-500 rounded-xl px-4 py-2 text-gray-600 pl-10"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <label className="flex items-center text-sm text-gray-700">
          <input
            name="rgpd"
            type="checkbox"
            checked={form.rgpd}
            onChange={handleChange}
            className="mr-2"
          />
          J’accepte les conditions RGPD
        </label>

        <button
          type="submit"
          disabled={!form.rgpd || loading}
          className="w-full bg-[#09552b] rounded-xl hover:bg-green-700 text-white font-semibold py-2 px-4"
        >
          {loading ? "Création…" : "Créer mon compte"}
        </button>

        <p className="text-xs text-center text-gray-700">
          Déjà un compte ?{" "}
          <a href="/login" className="text-green-700 hover:underline">
            Se connecter
          </a>
        </p>
      </form>
    </div>
  );
}