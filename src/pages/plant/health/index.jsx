import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "@/lib/axios";
import localDiseases from "@/data/diseases.json";

export default function PlantHealthScanPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Erreur caméra :", err);
        setError("Impossible d'accéder à la caméra.");
      }
    };
    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const takeSnapshotAndAnalyze = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    if (!video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      setLoading(true);

      const formData = new FormData();
      formData.append("image", blob);

      try {
        const res = await axios.post("/plants/health", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data.success) {
          sessionStorage.setItem("lastScan", JSON.stringify(res.data.health_data));
          router.push("/plant/health/result");
        } else {
          setError("Analyse échouée.");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur serveur pendant l’analyse.");
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  return (
    <div className="space-y-6">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-64 object-cover rounded border"
      />

      <div className="bg-gray-100 rounded-lg p-4">
        <h2 className="font-semibold text-green-800 mb-2">Diagnostiquer l’état de santé</h2>
        <p className="text-sm text-gray-700 mb-2">
          Placez la plante bien en vue dans le cadre pour lancer l’analyse de maladies potentielles.
        </p>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={takeSnapshotAndAnalyze}
          className="bg-green-600 flex-1 text-white px-4 py-2 rounded-xl hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Analyse en cours..." : "Scan pour Diagnostiquer"}
        </button>
      </div>

      {error && <p className="text-red-600 text-center">{error}</p>}
    </div>
  );
}
