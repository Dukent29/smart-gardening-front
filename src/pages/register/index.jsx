import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authContext";


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
      router.push("/register/confirmation"); // ou page de login si tu veux
    } catch (err) {
      setError(err.message || "Erreur lors de l’inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Créer un compte</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Nom d'utilisateur"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Adresse email"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Mot de passe"
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
        name="confirmPassword"
        type="password"
        placeholder="Confirmez le mot de passe"
        className="w-full border px-4 py-2 rounded"
        value={form.confirmPassword}
        onChange={handleChange}
        required
        />

        <label className="flex items-center text-sm">
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
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? "Création…" : "Créer mon compte"}
        </button>

        <p className="text-xs text-center">
          Déjà un compte ?{" "}
          <a href="/auth/Login" className="text-blue-600 hover:underline">
            Se connecter
          </a>
        </p>
      </form>
    </div>
  );
}