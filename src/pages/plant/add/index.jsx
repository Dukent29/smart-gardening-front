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
            {/* Camera Block */}
            <div className="relative overflow-hidden rounded-2xl ring-1 ring-gray-200 bg-black/60">
              {/* Video */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full aspect-[4/3] object-cover"
              />

              {/* Viewfinder (scanner corners) */}
              <div className="pointer-events-none absolute inset-4">
                <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-emerald-400 rounded-br-xl"></div>
              </div>

              {/* Scan line */}
              <div className="pointer-events-none absolute left-6 right-6 top-10 h-[3px] bg-emerald-400 animate-scan rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)]"></div>

              {/* Switch Camera Button */}
              <button
                onClick={toggleCamera}
                aria-label="Switch Camera"
                className="absolute top-6 right-6 grid place-items-center w-10 h-10 rounded-full bg-white/90 backdrop-blur text-gray-800 ring-1 ring-black/5 shadow hover:scale-105 transition"
              >
                <FaSyncAlt className="text-lg" />
              </button>

              {/* Scan Button */}
              <button
                onClick={handleScanToAdd}
                aria-label="Scan Plant"
                disabled={loading}
                className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-green-700 text-white shadow-xl hover:from-emerald-700 hover:to-green-800 hover:rotate-3 transition-transform disabled:opacity-60 flex items-center justify-center"
              >
                <IoScanCircle className="text-3xl" />
                {/* Pulse ring */}
                <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-emerald-400/30 group-hover:animate-ping"></span>
              </button>
            </div>

            <div className="bg-white rounded-lg p-4 m-2 ring-1 ring-gray-200">
              <h2 className="font-semibold text-emerald-800 mb-1">Ajouter votre plante au jardin</h2>
              <p className="text-sm text-gray-600 mb-3">
                Place la plante dans le cadre et on s’occupe de reconnaître l’espèce.
              </p>
              <div className="rounded-lg bg-emerald-50/60 ring-1 ring-emerald-200 p-3">
                <h3 className="font-semibold text-emerald-700 text-sm mb-2">Tips for best results</h3>
                <ul className="text-sm text-emerald-900 space-y-1.5">
                  <li>• Bonne luminosité</li>
                  <li>• Tiens le téléphone stable</li>
                  <li>• Feuilles bien visibles</li>
                  <li>• Si possible, toute la plante</li>
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
            <div className="relative border-dashed border-2 border-emerald-200 rounded-lg p-6 text-center  bg-emerald-50/60">
              <input
                name="image"
                type="file"
                onChange={handleFormChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              <div className="flex flex-col items-center justify-center space-y-2 ">
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
              className="bg-[#0A5D2F] text-white px-4 py-2 rounded-xl hover:bg-green-700 disabled:opacity-50"
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
