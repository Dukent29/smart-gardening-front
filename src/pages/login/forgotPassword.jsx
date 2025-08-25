//forgot password page
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authProvider";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await forgotPassword(email);
      router.push("/login"); // Redirect to login after successful request
    } catch (err) {
      setError(err.message || "Erreur lors de la demande de réinitialisation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <form onSubmit={handleSubmit} className="p-6 rounded w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-[#074221]">Réinitialiser le mot de passe</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Adresse e-mail"
          className="w-full bg-[#D9D9D9] placeholder-[#8EB49F] rounded-xl px-4 py-2 text-gray-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#074221] hover:bg-[#0A5D2F] text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Envoi en cours..." : "Envoyer la demande"}
        </button>
      </form>
    </div>
  );
}