import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function PlantHealthResultPage() {
  const [result, setResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const data = sessionStorage.getItem("lastScan");
    if (data) setResult(JSON.parse(data));
  }, []);

  if (!result) {
    return <p className="text-center text-gray-500">Aucun résultat disponible.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center text-green-800">
        Résultats de l’analyse
      </h1>

      <p>
        <strong>Plante en bonne santé :</strong>{" "}
        {result.health_assessment?.is_healthy ? (
          <span className="text-green-600 font-semibold">✅ Oui</span>
        ) : (
          <span className="text-red-500 font-semibold">❌ Non</span>
        )}
      </p>

      {result.health_assessment.diseases
        .filter((d) => d.probability > 0.6)
        .slice(0, 3)
        .map((disease, idx) => (
          <div key={idx} className="border rounded-lg p-4 bg-red-50 shadow-sm relative">
            <h4 className="text-md font-semibold text-red-700">
              {disease.disease_details?.local_name || disease.name}
            </h4>
            <p className="text-sm text-gray-600">
              Probabilité : <span className="font-semibold">{Math.round(disease.probability * 100)}%</span>
            </p>
            <button
              className="text-xs text-gray-400 hover:text-green-600 absolute top-2 right-2"
              onClick={() => router.push(`/plant/health/disease/${disease.name}`)}
            >
              Voir détails
            </button>
          </div>
        ))}
    </div>
  );
}
