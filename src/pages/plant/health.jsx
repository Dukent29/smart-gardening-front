// This file is deprecated after refactoring. See /plant/health/index.jsx for the new implementation.
// pages/plant/health.jsx
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "@/lib/axios";
import { AppLayout } from "@/layout/AppLayout";
import TabsNav from "@/components/TabsNav";
import Modal from "@/components/Modal";
import localDiseases from "@/data/diseases.json";
import ChatBotComponent from "@/components/SimpleChatBot.jsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function DeprecatedPlantHealthPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Scan");
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const router = useRouter();

  return (
    <AppLayout title="Santé de la Plante">
      <TabsNav activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="space-y-6">
        <div className="space-y-6">
          {loading ? (
            <Skeleton height={200} />
          ) : (
            activeTab === "Scan" && (
              <ScanComponent
                onSelectDisease={setSelectedDisease}
                onShowResults={(data) => {
                  setAnalysisData(data);
                  setShowResultsModal(true);
                }}
              />
            )
          )}
          {activeTab === "Chat" && <ChatBotComponent />}
          {activeTab === "History" && (
            <p className="text-center text-gray-400 mt-10">
              Historique en cours de développement...
            </p>
          )}
        </div>

        {selectedDisease && (
          <Modal onClose={() => setSelectedDisease(null)}>
            <div className="flex flex-col w-full max-w-md overflow-hidden rounded-2xl">
              {loading ? (
                <Skeleton height={200} />
              ) : (
                selectedDisease?.imageUrl && (
                  <img
                    src={selectedDisease.imageUrl}
                    alt="Disease Image"
                    className="w-full h-56 object-cover"
                  />
                )
              )}

              <div className="px-6 py-4 bg-white">
                {loading ? (
                  <Skeleton count={3} />
                ) : (
                  <>
                    <h2 className="text-xl font-bold mb-2 text-red-600">
                      {selectedDisease.disease_details?.local_name || selectedDisease.name}
                    </h2>
                    <p className="text-sm mb-4 text-gray-700">
                      <strong>Description :</strong>
                      <br />
                      {selectedDisease.disease_details?.description || "Non disponible"}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Traitement :</strong>
                      <br />
                      {selectedDisease.disease_details?.treatment || "Non disponible"}
                    </p>
                  </>
                )}
              </div>
            </div>
          </Modal>
        )}

        {showResultsModal && analysisData && (
          <Modal onClose={() => setShowResultsModal(false)}>
            <div className="flex flex-col w-full max-w-md overflow-hidden rounded-2xl">
              {loading ? (
                <Skeleton height={200} />
              ) : (
                analysisData?.imageUrl && (
                  <img
                    src={analysisData.imageUrl}
                    alt="Image analysée"
                    className="w-full h-56 object-cover"
                  />
                )
              )}

              <div className="p-4">
                {loading ? (
                  <Skeleton count={3} />
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Résultats de l'analyse
                    </h2>
                    <p className="text-md text-gray-700 mb-1">
                      <strong>Plante en bonne santé :</strong>{" "}
                      {analysisData.result.health_assessment?.is_healthy ? (
                        <span className="text-[#0A5D2F] font-semibold">✅ Oui</span>
                      ) : (
                        <span className="text-red-500 font-semibold">❌ Non</span>
                      )}
                    </p>
                    {analysisData.result.health_assessment.diseases
                      .filter((d) => d.probability > 0.6)
                      .slice(0, 3)
                      .map((disease, idx) => (
                        <div
                          key={idx}
                          className="border rounded-lg bg-red-50 shadow-sm relative p-4"
                        >
                          <h4 className="text-md font-semibold text-red-700">
                            {disease.disease_details?.local_name || disease.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Probabilité :{" "}
                            <span className="font-semibold">
                              {Math.round(disease.probability * 100)}%
                            </span>
                          </p>
                          <button
                            className="text-xs text-gray-400 hover:text-green-600 absolute top-2 right-2"
                            onClick={() => {
                              setShowResultsModal(false);
                              setSelectedDisease(analysisData.enrichDisease(disease));
                            }}
                          >
                            Voir détails
                          </button>
                        </div>
                      ))}
                  </>
                )}
              </div>

              <div className="flex flex-col gap-3 p-4">
                {loading ? (
                  <Skeleton height={50} />
                ) : (
                  <button
                    onClick={() => {
                      setShowResultsModal(false);
                      savePlant();
                    }}
                    className="w-full bg-[#074221] hover:bg-[#0A5D2F] text-white font-semibold py-3 rounded-lg transition"
                  >
                    Enregistrer
                  </button>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AppLayout>
  );
}

function ScanComponent({ onSelectDisease, onShowResults }) {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);

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

      setImage(blob);
      const imageUrl = URL.createObjectURL(blob);
      setPreviewUrl(imageUrl);
      setLoading(true);

      const formData = new FormData();
      formData.append("image", blob);

      try {
        const res = await axios.post("/plants/health", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data.success) {
          onShowResults({
            result: res.data.health_data,
            imageUrl: imageUrl,
            enrichDisease: enrichDisease
          });
        } else {
          setError("Analyse échouée.");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur serveur pendant l'analyse.");
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  const reset = () => {
    setImage(null);
    setPreviewUrl("");
    setError("");
  };

  const enrichDisease = (disease) => {
    const local = localDiseases.find(
      (item) => item.name.toLowerCase() === disease.name.toLowerCase()
    );
    return {
      ...disease,
      disease_details: {
        ...disease.disease_details,
        description: local?.description || disease.disease_details?.description,
        treatment: local?.treatment || disease.disease_details?.treatment,
      },
    };
  };

  return (
    <div className="space-y-6">
      {/* 📷 Live camera */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-64 object-cover border"
      />

      {/* Tips Box */}
      <div className="bg-gray-100 p-4">
        <h2 className="font-semibold text-green-800 mb-2">Diagnostiquer l'état de santé</h2>
        <p className="text-sm text-gray-700 mb-2">
          Placez la plante bien en vue dans le cadre pour lancer l'analyse de maladies potentielles.
        </p>
        <div className="bg-white p-3 rounded shadow-inner">
          <h3 className="font-semibold text-green-700">Conseils pour de meilleurs résultats :</h3>
          <ul className="list-disc list-inside text-sm text-gray-800 space-y-1 mt-1">
            <li>Lumière naturelle ou bien éclairée</li>
            <li>Placer les feuilles visibles</li>
            <li>Stabiliser la caméra</li>
            <li>Inclure toute la plante si possible</li>
          </ul>
        </div>
      </div>


      {/* Actions */}
      <div className="flex space-x-4 p-2">
        <button
          onClick={takeSnapshotAndAnalyze}
          className="bg-[#0A5D2F] flex-1 text-white px-4 py-2 rounded-xl hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Analyse en cours..." : "Scanner la Plante"}
        </button>

        <button
          onClick={reset}
          className="bg-gray-400 flex-1 text-white px-4 py-2 rounded-xl hover:bg-gray-500"
        >
          Réinitialiser
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-600 text-center">{error}</p>}
    </div>
  );
}
