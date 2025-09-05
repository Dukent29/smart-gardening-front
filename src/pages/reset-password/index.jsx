import { useState } from "react";
import { useRouter } from "next/router";
import axios from "@/lib/axios";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("/users/reset-password", {
        token,
        newPassword,
      });

      if (response.data.success) {
        setSuccess(true);
        setError(null);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#0A5D2F]">
          Réinitialiser le mot de passe
        </h2>

        {success ? (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              Mot de passe mis à jour !
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Votre mot de passe a été changé avec succès. Utilisez votre nouveau mot de passe pour vous connecter.
            </p>
            <a
              href="/login"
              className="text-blue-500 hover:underline text-sm"
            >
              Aller à la connexion
            </a>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#0A5D2F] focus:border-[#0A5D2F] sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#0A5D2F] focus:border-[#0A5D2F] sm:text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0A5D2F] text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700"
            >
              Réinitialiser le mot de passe
            </button>
          </form>
        )}
      </div>
    </div>
  );
}