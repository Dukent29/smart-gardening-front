// pages/plant/add/index.jsx

import { useState, useRef, useEffect } from "react";
import axios from "@/lib/axios";
import { AppLayout } from "@/layout/AppLayout";
import TabsNav from "@/components/TabsNavPlant";
import Modal from "@/components/Modal";

export default function AddPlantPage() {
  const [activeTab, setActiveTab] = useState("AddPhoto"); // Default tab
  const [form, setForm] = useState({
    name: "",
    type: "",
    description: "",
    image: null,
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);

  const videoRef = useRef(null);

  // 📷 Start camera on mount for "AddPhoto" tab
  useEffect(() => {
    if (activeTab === "AddPhoto") {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Erreur accès caméra:", err);
          setError("Impossible d'accéder à la caméra.");
        }
      };

      startCamera();

      return () => {
        if (videoRef.current?.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
        }
      };
    }
  }, [activeTab]);

  // 🌿 Handle scanning and analysis for "Take Photo"
  const handleScanToAdd = () => {
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
      setPreviewUrl(URL.createObjectURL(blob));
      setLoading(true);

      const formData = new FormData();
      formData.append("image", blob);

      try {
        const res = await axios.post("/plants/identify", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

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

  // 📝 Handle manual form submission (upload image and get plant info)
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
      const res = await axios.post("/plants/identify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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

  // 💾 Save plant to the database
  const savePlant = async () => {
    if (!result) {
      setError("Aucun résultat à enregistrer.");
      return;
    }

    const payload = {
      name: result.name,
      type: result.type,
      description: result.description,
      user_id: 1, // Replace with the actual user ID
      imageUrl: result.image_url || null,
    };

    try {
      const res = await axios.post("/plants/add-plant", payload);
      if (res.data.success) {
        alert("✅ Plante ajoutée avec succès !");
        setShowResultModal(false);
        reset(); // Reset the state after saving
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
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
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

  return (
    <AppLayout title="Ajouter une plante">
      <TabsNav activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="space-y-6 mt-6">
        {/* Add Photo Tab */}
        {activeTab === "AddPhoto" && (
          <div>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-64 object-cover rounded-lg border"
            />

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

            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={handleScanToAdd}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Analyse en cours..." : "Scan to Add"}
              </button>
              <button
                onClick={reset}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Add Manually Tab */}
        {activeTab === "AddManually" && (
          <form onSubmit={handleFormSubmit} className="space-y-4 p-4">
            <div className="bg-gray-100 rounded-lg p-4">
              <h2 className="font-semibold text-green-800 mb-2">Add Plant Manually</h2>
              <p className="text-sm text-gray-700">
                Upload an image of your plant, and we'll identify it for you. Fill in the details to add it to your garden.
              </p>
            </div>

            <input
              name="image"
              type="file"
              onChange={handleFormChange}
              className="w-full bg-[#D9D9D9] rounded-lg px-4 py-2"
              required
            />
            <button
              type="submit"
              className="bg-[#0A5D2F] text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Identification en cours..." : "Identifier la plante"}
            </button>
          </form>
        )}

        {/* ⚠️ Error */}
        {error && <p className="text-red-600 text-center">{error}</p>}

        {/* Results Modal */}
        {showResultModal && result && (
          <Modal onClose={handleCancelResult}>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-800 sticky top-0 bg-white pb-2">
                Plante Identifiée
              </h2>
              
              <div className="text-center">
                <img
                  src={result.image_url}
                  className="mx-auto h-52 object-cover rounded-lg shadow"
                  alt="Plante identifiée"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-[#06331a]">
                  <strong>Nom:</strong> {result.name}
                </p>
                <p className="text-sm text-[#3b7d59]">
                  <strong>Type:</strong> {result.type}
                </p>
                <p className="text-sm text-[#474747]">
                  <strong>Description:</strong> {result.description}
                </p>
              </div>

              <div className="flex justify-center space-x-4 mt-6 pt-4 border-t sticky bottom-0 bg-white">
                <button
                  onClick={savePlant}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  ✅Enregistrer
                </button>
                <button
                  onClick={handleCancelResult}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                >
                  ❌ Annuler
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AppLayout>
  );
}
