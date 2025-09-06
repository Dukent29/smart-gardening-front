import { useState, useRef, useEffect } from "react";
import axios from "@/lib/axios";
import { AppLayout } from "@/layout/AppLayout";
import TabsNav from "@/components/TabsNavPlant";
import Modal from "@/components/Modal";
import { FaSyncAlt } from "react-icons/fa";
import { IoScanCircle } from "react-icons/io5";


const STATIC_BASE = (process.env.NEXT_PUBLIC_STATIC_BASE || "https://awm.portfolio-etudiant-rouen.com/api").replace(/\/+$/, "");


const toApiStatic = (raw = "") => {
  if (!raw) return "";
  let p = String(raw).trim().replace(/^https?:\/\/[^/]+\/?/, ""); 
  p = p.replace(/^\/+/, "");     
  p = p.replace(/^api\/+/, "");  
  if (!/^uploads\//i.test(p)) p = `uploads/${p}`;
  return `${STATIC_BASE}/${p}`; 
};

export default function AddPlantPage() {
  const [activeTab, setActiveTab] = useState("AddPhoto");
  const [form, setForm] = useState({ name: "", type: "", description: "", image: null });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);

  const videoRef = useRef(null);
  const [cameraFacingMode, setCameraFacingMode] = useState("user");

  
  useEffect(() => {
    if (activeTab !== "AddPhoto") return;
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraFacingMode } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Erreur accès caméra:", err);
        setError("Impossible d'accéder à la caméra.");
      }
    };
    start();
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((t) => t.stop());
      }
    };
  }, [activeTab, cameraFacingMode]);

  
  const handleScanToAdd = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    if (!video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      setImage(blob);
      setPreviewUrl(URL.createObjectURL(blob));
      setLoading(true);

      const formData = new FormData();
      formData.append("image", blob);

      try {
        const res = await axios.post("/plants/identify", formData, { headers: { "Content-Type": "multipart/form-data" } });
        if (res.data.success) {
          setResult(res.data);
          setShowResultModal(true);
        } else {
          setError("Identification failed");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors de l'identification");
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  // 📝 Upload file (manual)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      setError("Veuillez télécharger une image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", form.image);

    try {
      setLoading(true);
      const res = await axios.post("/plants/identify", formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data.success) {
        setResult(res.data);
        setShowResultModal(true);
        setForm({
          name: res.data.name,
          type: res.data.type,
          description: res.data.description,
          image: form.image,
        });
      } else {
        setError("Identification failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'identification.");
    } finally {
      setLoading(false);
    }
  };

  // 💾 Save plant
  const savePlant = async () => {
    if (!result) {
      setError("Aucun résultat à enregistrer.");
      return;
    }

    const payload = {
      name: result.name,
      type: result.type,
      description: result.description,
      user_id: 1, 
      imageUrl: result.image_url || null, 
    };

    try {
      const res = await axios.post("/plants/add-plant", payload);
      if (res.data.success) {
        alert("✅ Plante ajoutée avec succès !");
        setShowResultModal(false);
        reset();
        window.location.href = "/dashboard";
      } else {
        setError(res.data.message || "Erreur lors de l'ajout de la plante.");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur serveur lors de l'ajout de la plante.");
    }
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setPreviewUrl("");
    setError("");
    setForm({ name: "", type: "", description: "", image: null });
  };

  const handleCancelResult = () => {
    setShowResultModal(false);
    reset();
  };

  const toggleCamera = () => setCameraFacingMode((m) => (m === "user" ? "environment" : "user"));

  return (
    <AppLayout title="Ajouter une plante">
      <TabsNav activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="space-y-6 mt-6">
        {/* Add Photo Tab */}
        {activeTab === "AddPhoto" && (
          <div>
            <div className="relative">
              <video ref={videoRef} autoPlay playsInline className="w-full h-80 object-cover rounded-lg border" />
              <button
                onClick={toggleCamera}
                className="absolute top-2 right-2 text-white text-2xl hover:text-gray-300 focus:outline-none"
                aria-label="Switch Camera"
              >
                <FaSyncAlt />
              </button>

              <button
                onClick={handleScanToAdd}
                className="absolute bottom-4 right-2 text-white text-5xl hover:text-gray-300 focus:outline-none"
                aria-label="Scan Plant"
                disabled={loading}
              >
                <IoScanCircle />
              </button>

              
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500"></div>
                <div className="absolute inset-x-0 top-0 h-1 bg-green-500 animate-scan"></div>
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-4 mt-4">
              <h2 className="font-semibold text-green-800 mb-2">Add Plant to Garden</h2>
              <p className="text-sm text-gray-700 mb-2">
                Position your plant in the camera viewfinder. We'll detect the plant type and add it to your garden with optimal care settings.
              </p>
              <div className="bg-white p-3 rounded shadow-inner">
                <h3 className="font-semibold text-green-700">Tips for best results:</h3>
                <ul className="list-disc list-inside text-sm text-gray-800 space-y-1 mt-1">
                  <li>Ensure good lighting</li>
                  <li>Hold camera steady</li>
                  <li>Capture leaves clearly</li>
                  <li>Include the whole plant if possible</li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-2 p-4">
              <button
                onClick={handleScanToAdd}
                className="bg-[#0A5D2F] flex-1 text-white px-4 py-3 rounded-xl hover:bg-green-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Analyse en cours..." : "Scanner la plante"}
              </button>
            </div>
          </div>
        )}

        
        {activeTab === "AddManually" && (
          <form onSubmit={handleFormSubmit} className="space-y-4 p-4">
            <div className="bg-gray-100 rounded-lg p-4">
              <h2 className="font-semibold text-green-800 mb-2">Ajouter une plante manuellement</h2>
              <p className="text-sm text-gray-700">
                Téléchargez une image de votre plante, et nous l'identifierons pour vous. Remplissez les détails pour l'ajouter à votre jardin.
              </p>
            </div>

            {/* Custom File Input */}
            <div className="relative border-dashed border-2 border-gray-300 rounded-lg p-6 text-center">
              <input
                name="image"
                type="file"
                onChange={handleFormChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-green-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p className="text-sm text-gray-700">Cliquez pour télécharger une image</p>
                <p className="text-xs text-gray-500">Formats acceptés : JPG, PNG</p>
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#0A5D2F] text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Identification en cours..." : "Identifier la plante"}
            </button>
          </form>
        )}

        
        {error && <p className="text-red-600 text-center">{error}</p>}

        
        {showResultModal && result && (
          <Modal onClose={handleCancelResult}>
            <div className="flex flex-col w-full max-w-md overflow-hidden rounded-md">
              
              <img
                src={toApiStatic(result.image_url)}
                alt="Plante identifiée"
                className="w-full h-64 object-cover"
              />

              
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{result.name}</h2>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Type:</strong> {result.type}
                </p>
                <p className="text-sm text-gray-600">
                  {result.description?.length > 150 ? (
                    <>
                      {result.description.slice(0, 150)}...
                      <button
                        onClick={() => alert(result.description)}
                        className="text-blue-500 hover:underline ml-1"
                      >
                        Lire plus
                      </button>
                    </>
                  ) : (
                    result.description
                  )}
                </p>
              </div>

              {/* Boutons */}
              <div className="flex flex-col gap-3 p-4">
                <button
                  onClick={savePlant}
                  className="w-full bg-[#074221] hover:bg-[#0A5D2F] text-white font-semibold py-3 rounded-lg transition"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AppLayout>
  );
}
