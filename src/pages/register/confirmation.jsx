export default function ConfirmationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold">Vérifie ta boîte mail ✉️</h1>
        <p className="text-gray-600">
          Un lien de confirmation t’a été envoyé. Clique dessus pour activer ton compte.
        </p>
        <a href="/login" className="text-blue-600 hover:underline text-sm">
          Retour à la connexion
        </a>
      </div>
    </div>
  );
}
