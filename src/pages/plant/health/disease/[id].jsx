import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import localDiseases from "@/data/diseases.json";

export default function DiseaseDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [disease, setDisease] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem("lastScan");
    if (data) {
      const parsedData = JSON.parse(data);
      const foundDisease = parsedData.health_assessment.diseases.find(
        (d) => d.name === id
      );

      if (foundDisease) {
        const local = localDiseases.find(
          (item) => item.name.toLowerCase() === foundDisease.name.toLowerCase()
        );
        setDisease({
          ...foundDisease,
          disease_details: {
            ...foundDisease.disease_details,
            description: local?.description || foundDisease.disease_details?.description,
            treatment: local?.treatment || foundDisease.disease_details?.treatment,
          },
        });
      }
    }
  }, [id]);

  if (!disease) {
    return <p className="text-center text-gray-500">Aucune information disponible.</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-2 text-red-600">
        {disease.disease_details?.local_name || disease.name}
      </h2>
      <p className="text-sm mb-4">
        <strong>Description :</strong>
        <br />
        {disease.disease_details?.description || "Non disponible"}
      </p>
      <p className="text-sm">
        <strong>Traitement :</strong>
        <br />
        {disease.disease_details?.treatment || "Non disponible"}
      </p>
    </div>
  );
}
