// pages/plant/health.jsx
import { useState, useRef, useEffect } from 'react';
import axios from '@/lib/axios';
import TabsNav from '@/components/TabsNav';
import Modal from '@/components/Modal';
import localDiseases from '@/data/diseases.json';
import ChatBotComponent from '@/components/ChatBotComponent';
import Sidebar from "@/components/Sidebar";
import BottomNav from '@/components/BottomNav';

export default function PlantHealthPage() {
  const [activeTab, setActiveTab] = useState('Scan');
  const [selectedDisease, setSelectedDisease] = useState(null);

  return (
    <div className="flex bg-[#F5F5F5] min-h-screen">
      <Sidebar />
      <div className="w-full">
        <TabsNav activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="p-6 max-w-xl mx-auto space-y-6">
          
          <div className=" p-6 rounded-lg  space-y-6">
            <h1 className="text-2xl font-bold text-center text-green-800">🧪 Analyse Santé de la Plante</h1>

            {activeTab === 'Scan' && <ScanComponent onSelectDisease={setSelectedDisease} />}
            {activeTab === 'Chat' && <ChatBotComponent />}
            {activeTab === 'History' && (
              <p className="text-center text-gray-400 mt-10"> Historique en cours de développement...</p>
            )}
          </div>

          {selectedDisease && (
            <Modal onClose={() => setSelectedDisease(null)}>
              <h2 className="text-xl font-bold mb-2 text-red-600">
                {selectedDisease.disease_details?.local_name || selectedDisease.name}
              </h2>
              <p className="text-sm mb-4">
                <strong>Description :</strong><br />
                {selectedDisease.disease_details?.description || 'Non disponible'}
              </p>
              <p className="text-sm">
                <strong>Traitement :</strong><br />
                {selectedDisease.disease_details?.treatment || 'Non disponible'}
              </p>
            </Modal>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function ScanComponent({ onSelectDisease }) {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
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
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takeSnapshotAndAnalyze = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    if (!video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      setImage(blob);
      setPreviewUrl(URL.createObjectURL(blob));
      setResult(null);
      setLoading(true);

      const formData = new FormData();
      formData.append('image', blob);

      try {
        const res = await axios.post('/plants/health', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data.success) {
          setResult(res.data.health_data);
        } else {
          setError('Analyse échouée.');
        }
      } catch (err) {
        console.error(err);
        setError('Erreur serveur pendant l’analyse.');
      } finally {
        setLoading(false);
      }
    }, 'image/jpeg');
  };

  const reset = () => {
    setImage(null);
    setPreviewUrl('');
    setResult(null);
    setError('');
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
        className="w-full h-64 object-cover rounded border"
      />

      {/*  Tips Box */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h2 className="font-semibold text-green-800 mb-2">Diagnostiquer l’état de santé</h2>
        <p className="text-sm text-gray-700 mb-2">
          Placez la plante bien en vue dans le cadre pour lancer l’analyse de maladies potentielles.
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

      {/*  Preview */}
      {previewUrl && (
        <div className="text-center mt-4">
          <img src={previewUrl} alt="Preview" className="mx-auto h-64 object-cover rounded shadow" />
        </div>
      )}

      {/*  Actions */}
      <div className="flex  space-x-4">
        <button
          onClick={takeSnapshotAndAnalyze}
          className="bg-green-600 flex-1/2 text-white px-4 py-2 rounded-xl hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Analyse en cours...' : 'Scan pour Diagnostiquer'}
        </button>

        <button
          onClick={reset}
          className="bg-gray-400 flex-1/2 text-white px-4 py-2 rounded-xl hover:bg-gray-500"
        >
          Réinitialiser
        </button>
      </div>

      {/*  Error */}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {/*  Result */}
      {result && (
        <div className="p-4 border rounded bg-gray-50 shadow space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Résultats de l’analyse</h2>
          <p>
            <strong>Plante en bonne santé :</strong>{' '}
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
                  onClick={() => onSelectDisease(enrichDisease(disease))}
                >
                  Voir détails
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
