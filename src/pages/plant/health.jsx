// pages/plant/health.jsx
import { useState } from 'react';
import axios from '@/lib/axios';
import TabsNav from '@/components/TabsNav';
import Modal from '@/components/Modal';
import localDiseases from '@/data/diseases.json';
import ChatBotComponent from '@/components/ChatBotComponent';
import Sidebar from "@/components/Sidebar";

// 🧪 Scan logic stays here
function ScanComponent({ onSelectDisease }) {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    try {
      setLoading(true);
      const res = await axios.post('/plants/health', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border rounded p-2" />
      {previewUrl && <img src={previewUrl} alt="Preview" className="mx-auto h-64 object-cover rounded" />}

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleAnalyze}
          disabled={!image || loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Analyse...' : '🔍 Lancer l’analyse'}
        </button>
        <button onClick={reset} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
          ❌ Réinitialiser
        </button>
      </div>

      {error && <p className="text-red-600 text-center">{error}</p>}

      {result && (
        <div className="mt-6 p-4 border rounded bg-white shadow space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">🧪 Résultats de l’analyse</h2>
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

// 💬 Chat tab
export default function PlantHealthPage() {
  const [activeTab, setActiveTab] = useState('Scan');
  const [selectedDisease, setSelectedDisease] = useState(null);

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 max-w-xl mx-auto space-y-6 flex-1">
        <TabsNav activeTab={activeTab} onTabChange={setActiveTab} />
        <h1 className="text-2xl font-bold text-center">🌿 Analyse et Assistance</h1>
        {activeTab === 'Scan' && <ScanComponent onSelectDisease={setSelectedDisease} />}
        {activeTab === 'Chat' && <ChatBotComponent />}
        {activeTab === 'History' && (
          <p className="text-center text-gray-400 mt-10">📜 Historique en cours de développement...</p>
        )}
        {selectedDisease && (
          <Modal onClose={() => setSelectedDisease(null)}>
            <h2 className="text-xl font-bold mb-2 text-red-600">
              {selectedDisease.disease_details?.local_name || selectedDisease.name}
            </h2>
            <p className="text-sm mb-4">
              <strong>Description :</strong>
              <br />
              {selectedDisease.disease_details?.description || 'Non disponible'}
            </p>
            <p className="text-sm">
              <strong>Traitement :</strong>
              <br />
              {selectedDisease.disease_details?.treatment || 'Non disponible'}
            </p>
          </Modal>
        )}
      </div>
    </div>
  );
}
