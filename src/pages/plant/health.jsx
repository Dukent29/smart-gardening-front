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
import { FaSyncAlt } from "react-icons/fa";
import { TbHealthRecognition } from "react-icons/tb"; 

const STATIC_BASE = (process.env.NEXT_PUBLIC_STATIC_BASE || "https://awm.portfolio-etudiant-rouen.com/api").replace(/\/+$/, "");
const toApiStatic = (raw = "") => {
  if (!raw) return "";
  if (/^blob:/i.test(raw)) return raw; 
  
  let p = String(raw).trim().replace(/^https?:\/\/[^/]+\/?/, "");
  p = p.replace(/^\/+/, "");    
  p = p.replace(/^api\/+/, ""); 
  if (!/^uploads\//i.test(p)) p = `uploads/${p}`;
  return `${STATIC_BASE}/${p}`;  
};


export default function DeprecatedPlantHealthPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Scan");
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const router = useRouter();

  const saveScanResultToLocalStorage = (result) => {
    const existingResults = JSON.parse(localStorage.getItem("scanHistory")) || [];
    const updatedResults = [...existingResults, result];
    localStorage.setItem("scanHistory", JSON.stringify(updatedResults));
  };

  const savePlant = () => {
    const scanResult = {
      result: analysisData.result,
      imageUrl: analysisData.imageUrl,
      timestamp: new Date().toISOString(),
    };
    saveScanResultToLocalStorage(scanResult);
    alert("Résultat enregistré avec succès !");
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
              src={entry.imageUrl}
              alt="Scan Image"
              className="w-full h-40 object-cover rounded-lg mb-2"
            />
            <p className="text-sm text-gray-600">
              <strong>Date :</strong> {new Date(entry.timestamp).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              <strong>État :</strong>{" "}
              {entry.result.health_assessment?.is_healthy
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
              />
            )
          )}
          {activeTab === "Chat" && <ChatBotComponent />}
          {activeTab === "History" && renderHistory()}
        </div>

        {selectedDisease && (
          <Modal
            onClose={() => {
              setSelectedDisease(null); // Close the disease details modal
              setShowResultsModal(true); // Reopen the disease identification modal
            }}
          >
            <div className="flex flex-col w-full max-w-md overflow-hidden rounded-2xl">
              {loading ? (
                <Skeleton height={200} />
              ) : (
                selectedDisease?.imageUrl && (
                  <img
                    src={toApiStatic(selectedDisease.imageUrl)}
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
                      {analysisData.result.health_assessment?.is_healthy ? (
                        <span className="text-[#0A5D2F] font-semibold">Aucun signe de maladie détecté</span>
                      ) : (
                        <span className="text-red-500 font-semibold"> Présence de maladies probables</span>
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
  const [cameraFacingMode, setCameraFacingMode] = useState("user"); 

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
        const res = await axios.post(
          "https://awm.portfolio-etudiant-rouen.com/api/api/plants/identify", // Hardcoded URL
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (res.data.success) {
          onShowResults({
            result: res.data.health_data,
            imageUrl: imageUrl,
            enrichDisease: enrichDisease,
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
      
      <div className="relative">
  <video
    ref={videoRef}
    autoPlay
    playsInline
    className="w-full h-80 object-cover border"
  />

  {/* Switch camera — rond en haut/droite */}
  <button
    onClick={toggleCamera}
    className="absolute top-4 right-4  grid place-items-center w-10 h-10 rounded-full  text-white shadow-lg ring-2 ring-white/60 hover:opacity-90 focus:outline-none"
    aria-label="Switch Camera"
  >
    <FaSyncAlt className="text-lg" />
  </button>

  {/* Scan/Capture — même icône, fond rond plein */}
  <button
    onClick={takeSnapshotAndAnalyze}
    className="absolute bottom-4  h-10 right-4 disabled:opacity-50"
    aria-label="Scan Plant"
    disabled={loading}
  >
    <span className="grid place-items-center  rounded-full text-white shadow-[0_8px_20px_rgba(16,185,129,0.45)] ring-4 ring-white/50">
      <TbHealthRecognition className="text-3xl" />
    </span>
  </button>

  {/* OVERLAY : coins + ligne horizontale centrale */}
  <div className="absolute inset-0 pointer-events-none">
    {/* Coins */}
    <span className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-emerald-400 rounded-tl-md"></span>
    <span className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-emerald-400 rounded-tr-md"></span>
    <span className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-emerald-400 rounded-bl-md"></span>
    <span className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-emerald-400 rounded-br-md"></span>

    {/* Animated horizontal scan line */}
    <span className="absolute left-4 right-4 top-0 h-1 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.65)] animate-scan"></span>
  </div>
</div>


      
      <div className="bg-white rounded-lg p-4 m-2 ring-1 ring-gray-200">
        <h2 className="font-semibold text-emerald-800 mb-1">Diagnostiquer l'état de santé</h2>
        <p className="text-sm text-gray-600 mb-3">
          Placez la plante bien en vue dans le cadre pour lancer l'analyse de maladies potentielles.
        </p>
        <div className="rounded-lg bg-emerald-50/60 ring-1 ring-emerald-200 p-3">
          <h3 className="font-semibold text-emerald-700 text-sm mb-2">Conseils pour de meilleurs résultats :</h3>
          <ul className="text-sm text-emerald-900 space-y-1.5">
            <li>• Lumière naturelle ou bien éclairée</li>
            <li>• Placer les feuilles visibles</li>
            <li>• Stabiliser la caméra</li>
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
