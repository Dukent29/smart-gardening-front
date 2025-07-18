// pages/plant/add/index.jsx

import { useState, useRef, useEffect } from 'react';
import axios from '@/lib/axios';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function AddPlantPage() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const videoRef = useRef(null);

  // 📷 Start camera on mount
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Erreur accès caméra:", err);
        setError("Impossible d'accéder à la caméra");
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // 🌿 Fusion de capture + analyse
  const handleScanToAdd = () => {
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
        const res = await axios.post('/plants/identify', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (res.data.success) {
          setResult(res.data);
        } else {
          setError('Identification failed');
        }
      } catch (err) {
        console.error(err);
        setError('Erreur lors de l’identification');
      } finally {
        setLoading(false);
      }
    }, 'image/jpeg');
  };

  // 💾 Enregistrement dans la DB
  const savePlant = async () => {
    try {
      const payload = {
        name: result.name,
        type: result.type,
        description: result.description,
        imageUrl: result.image_url,
      };

      const res = await axios.post('/plants/add-plant', payload);

      if (res.data.success) {
        alert('✅ Plante enregistrée avec succès !');
        reset();
      } else {
        setError(res.data.message || 'Erreur lors de l’enregistrement');
      }
    } catch (err) {
      console.error('Erreur lors du save:', err);
      setError('Erreur serveur lors de l’enregistrement');
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setPreviewUrl('');
    setError('');
  };

  return (
    <div className="flex bg-[#F5F5F5] min-h-screen">
      <Sidebar />
      <div className=' w-full'>
      <Header title="Ajouter une plante" />
        <div className="p-6 max-w-xl mx-auto space-y-6">
        
        

        {/* 📷 Live camera */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-64 object-cover rounded border"
        />

        {/* 📝 Tips section */}
        <div className="bg-gray-100 rounded-lg p-4">
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

        {/* 📸 Preview */}
        {previewUrl && (
          <div className="text-center mt-4">
            <img src={previewUrl} alt="Preview" className="mx-auto h-64 object-cover rounded" />
          </div>
        )}

        {/* 🔘 Scan + Cancel */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleScanToAdd}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Analyse en cours...' : 'Scan to Add'}
          </button>

          <button
            onClick={reset}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Annuler
          </button>
        </div>

        {/* ⚠️ Error */}
        {error && <p className="text-red-600 text-center">{error}</p>}

        {/* ✅ Result after analysis */}
        {result && (
          <div className="border rounded p-4 shadow space-y-2">
            <img src={result.image_url} className="w-full h-52 object-cover rounded" alt="Plante identifiée" />
            <p><strong>Nom:</strong> {result.name}</p>
            <p><strong>Type:</strong> {result.type}</p>
            <p><strong>Description:</strong> {result.description}</p>

            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={savePlant}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                ✅ Confirmer & Enregistrer
              </button>
              <button
                onClick={reset}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
