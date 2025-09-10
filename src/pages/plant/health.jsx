// src/pages/plant/health.jsx
const textify = (val) => {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (Array.isArray(val)) return val.map(textify).join(", ");
  if (typeof val === "object") {
    // cas Plant.id: { value: "..." } ou { text: "..." }
    if ("value" in val && typeof val.value === "string") return val.value;
    if ("text" in val && typeof val.text === "string") return val.text;
    // fallback: évite l’[object Object]
    try {
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  }
  return String(val);
};
import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/layout/AppLayout";
import TabsNav from "@/components/TabsNav";
import Modal from "@/components/Modal";
import localDiseases from "@/data/diseases.json";
import ChatBotComponent from "@/components/SimpleChatBot.jsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaSyncAlt } from "react-icons/fa";
import { TbHealthRecognition } from "react-icons/tb";

const STATIC_BASE = (process.env.NEXT_PUBLIC_STATIC_BASE || "https://awm.portfolio-etudiant-rouen.com/api").replace(/\/+$/, "");

// Affichage image: gère data: , URL absolue (ex: Vercel Blob), et URLs locales (/uploads)
const toApiStatic = (raw = "") => {
  if (!raw) return "";

  let s = String(raw).trim();

  // data: URL — garder tel quel
  if (/^data:/i.test(s)) return s;

  // Absolu
  if (/^https?:\/\//i.test(s)) {
    try {
      const apiHost = new URL(STATIC_BASE).host;
      const u = new URL(s);
      if (u.host !== apiHost) return s; // externe (ex: Blob) => as-is

      // sinon, normaliser en /uploads/...
      let p = u.pathname.replace(/^\/+/, "").replace(/^api\/+/, "");
      if (!/^uploads\//i.test(p)) p = `uploads/${p}`;
      return `${STATIC_BASE}/${p}`;
    } catch {
      // si parsing fail, on continue en relatif
    }
  }

  // Relatif -> normaliser vers /uploads/
  let p = s.replace(/^https?:\/\/[^/]+\/?/, "").replace(/^\/+/, "").replace(/^api\/+/, "");
  if (!/^uploads\//i.test(p)) p = `uploads/${p}`;
  return `${STATIC_BASE}/${p}`;
};

export default function PlantHealthPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Scan");
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  const saveScanResultToLocalStorage = (result) => {
    try {
      const existingResults = JSON.parse(localStorage.getItem("scanHistory")) || [];
      const updatedResults = [...existingResults, result];
      localStorage.setItem("scanHistory", JSON.stringify(updatedResults));
    } catch (error) {
      console.error("Failed to save scan result to localStorage:", error);
    }
  };

  const savePlant = () => {
    if (!analysisData) {
      alert("No analysis data available to save.");
      return;
    }

    const scanResult = {
      result: analysisData.result,
      imageUrl: analysisData.imageUrl,
      timestamp: new Date().toISOString(),
    };

    saveScanResultToLocalStorage(scanResult);
    alert("Résultat enregistré localement ✅");
  };

  const renderHistory = () => {
    const scanHistory = JSON.parse(localStorage.getItem("scanHistory")) || [];
    if (scanHistory.length === 0) {
      return <p className="text-center text-gray-400 mt-10">Aucun historique disponible.</p>;
    }

    return (
      <div className="space-y-4">
        {scanHistory.map((entry, index) => (
          <div key={index} className="border rounded-lg bg-gray-50 shadow-sm p-4">
            <img
              src={toApiStatic(entry.imageUrl)}
              alt="Scan Image"
              className="w-full h-40 object-cover rounded-lg mb-2"
            />
            <p className="text-sm text-gray-600">
              <strong>Date :</strong> {new Date(entry.timestamp).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              <strong>État :</strong>{" "}
              {entry.result?.health_assessment?.is_healthy
                ? "Aucun signe de maladie détecté"
                : "Présence de maladies probables"}
            </p>
          </div>
        ))}
      </div>
    );
  };

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
                setPageLoading={setLoading}
              />
            )
          )}
          {activeTab === "Chat" && <ChatBotComponent />}
          {activeTab === "History" && renderHistory()}
        </div>

        {/* Modal Détail Maladie */}
        {selectedDisease && (
          <Modal
            onClose={() => {
              setSelectedDisease(null); // Close disease details
              setShowResultsModal(true); // Reopen results modal
            }}
          >
            <div className="flex flex-col w-full max-w-md overflow-hidden rounded-2xl">
              <div className="px-6 py-4 bg-white">
                {(() => {
                  const title = textify(
                    selectedDisease?.disease_details?.local_name ?? selectedDisease?.name
                  );
                  const desc = textify(selectedDisease?.disease_details?.description) || "Non disponible";
                  const treat = textify(selectedDisease?.disease_details?.treatment) || "Non disponible";

                  return (
                    <>
                      <h2 className="text-xl font-bold mb-2 text-red-600">{title}</h2>
                      <p className="text-sm mb-4 text-gray-700">
                        <strong>Description :</strong>
                        <br />
                        {desc}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Traitement :</strong>
                        <br />
                        {treat}
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>
          </Modal>
        )}

        {/* Modal Résultats Analyse */}
        {showResultsModal && analysisData && (
          <Modal onClose={() => setShowResultsModal(false)}>
            <div className="flex flex-col w-full max-w-md overflow-hidden rounded-lg">
              {loading ? (
                <Skeleton height={200} />
              ) : (
                analysisData?.imageUrl && (
                  <img
                    src={toApiStatic(analysisData.imageUrl)}
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
                      {analysisData.result?.health_assessment?.is_healthy ? (
                        <span className="text-[#0A5D2F] font-semibold">
                          Aucun signe de maladie détecté
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold">
                          Présence de maladies probables
                        </span>
                      )}
                    </p>

                    {/* Top 3 maladies probables > 60% */}
                    {Array.isArray(analysisData.result?.health_assessment?.diseases) &&
                      analysisData.result.health_assessment.diseases
                        .filter((d) => d.probability > 0.6)
                        .slice(0, 3)
                        .map((disease, idx) => (
                          <div
                            key={idx}
                            className="border rounded-lg bg-red-50 shadow-sm relative p-4 mt-3"
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

function ScanComponent({ onSelectDisease, onShowResults, setPageLoading }) {
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const [cameraFacingMode, setCameraFacingMode] = useState("user"); // "environment" pour cam arrière

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: cameraFacingMode },
        });
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
  }, [cameraFacingMode]);

  const toggleCamera = () => {
    setCameraFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  const enrichDisease = (disease) => {
    // priorité au match par entity_id si dispo, sinon par nom
    const local =
      localDiseases.find((x) => String(x.entity_id) === String(disease?.entity?.id)) ||
      localDiseases.find((x) => x.name.toLowerCase() === (disease?.name || "").toLowerCase());

    return {
      ...disease,
      disease_details: {
        ...disease.disease_details,
        description: local?.description || disease.disease_details?.description,
        treatment: local?.treatment || disease.disease_details?.treatment,
      },
    };
  };

  const takeSnapshotAndAnalyze = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    if (!video) return;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      setImage(blob);
      setLoading(true);
      setPageLoading?.(true);
      setError("");

      const fd = new FormData();
      fd.append("image", blob, "snapshot.jpg");

      try {
        // Appelle l’API serverless Vercel (pas ton back OVH)
        const resp = await fetch("/api/health", { method: "POST", body: fd });
        const data = await resp.json();

        if (!resp.ok || !data?.success) {
          throw new Error(data?.error || "Analyse échouée.");
        }

        onShowResults({
          result: data.health_data,
          imageUrl: data.image_url, // Blob public ou data:
          enrichDisease,
        });
      } catch (err) {
        console.error(err);
        setError("Erreur serveur pendant l'analyse.");
      } finally {
        setLoading(false);
        setPageLoading?.(false);
      }
    }, "image/jpeg");
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <video ref={videoRef} autoPlay playsInline className="w-full h-80 object-cover border" />

        {/* Switch camera */}
        <button
          onClick={toggleCamera}
          className="absolute top-4 right-4 grid place-items-center w-10 h-10 rounded-full text-white shadow-lg ring-2 ring-white/60 hover:opacity-90 focus:outline-none"
          aria-label="Switch Camera"
        >
          <FaSyncAlt className="text-lg" />
        </button>

        {/* Scan capture */}
        <button
          onClick={takeSnapshotAndAnalyze}
          className="absolute bottom-4 h-10 right-4 disabled:opacity-50"
          aria-label="Scan Plant"
          disabled={loading}
        >
          <span className="grid place-items-center rounded-full text-white shadow-[0_8px_20px_rgba(16,185,129,0.45)] ring-4 ring-white/50">
            <TbHealthRecognition className="text-3xl" />
          </span>
        </button>

        {/* Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-emerald-400 rounded-tl-md"></span>
          <span className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-emerald-400 rounded-tr-md"></span>
          <span className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-emerald-400 rounded-bl-md"></span>
          <span className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-emerald-400 rounded-br-md"></span>
          <span className="absolute left-4 right-4 top-0 h-1 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.65)] animate-scan"></span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 m-2 ring-1 ring-gray-200">
        <h2 className="font-semibold text-emerald-800 mb-1">Diagnostiquer l'état de santé</h2>
        <p className="text-sm text-gray-600 mb-3">
          Placez la plante bien en vue dans le cadre pour lancer l'analyse des maladies probables.
        </p>
        <div className="rounded-lg bg-emerald-50/60 ring-1 ring-emerald-200 p-3">
          <h3 className="font-semibold text-emerald-700 text-sm mb-2">
            Conseils pour de meilleurs résultats :
          </h3>
          <ul className="text-sm text-emerald-900 space-y-1.5">
            <li>• Lumière naturelle ou bien éclairée</li>
            <li>• Stabiliser la caméra</li>
            <li>• Feuilles bien visibles</li>
            <li>• Inclure toute la plante si possible</li>
          </ul>
        </div>
      </div>

      <div className="flex space-x-2 p-4">
        <button
          onClick={takeSnapshotAndAnalyze}
          className="bg-[#0A5D2F] flex-1 text-white px-4 py-3 rounded-xl hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Analyse en cours..." : "Scanner la Plante"}
        </button>
      </div>

      {error && <p className="text-red-600 text-center">{error}</p>}
    </div>
  );
}
