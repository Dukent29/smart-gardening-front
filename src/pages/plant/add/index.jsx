// pages/plant/add/index.jsx
import { useState } from 'react';
import axios from '@/lib/axios'; // Assurez-vous que le chemin est correct
import Sidebar from '@/components/Sidebar';

export default function AddPlantPage() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null); // reset any previous result
  };

  const identifyPlant = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    try {
      setLoading(true);
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
  };
  console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL)

  // save to the database
  const savePlant = async () => {
  try {
    const payload = {
      name: result.name,
      type: result.type,
      description: result.description,
      imageUrl: result.image_url, 
    };

    const res = await axios.post('/plants/add-plant', payload); // token auto via axios interceptor

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
    <div className="flex">
      <Sidebar />
      <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">🌱 Ajouter une plante</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full border rounded p-2"
      />

      {previewUrl && (
        <div className="text-center">
          <img src={previewUrl} alt="Preview" className="mx-auto h-64 object-cover rounded" />
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <button
          onClick={identifyPlant}
          disabled={!image || loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Analyse en cours...' : '🔍 Identifier'}
        </button>
        
        <button
          onClick={reset}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          ❌ Réinitialiser
        </button>
      </div>

      {error && <p className="text-red-600 text-center">{error}</p>}

      {result && (
        <div className="border rounded p-4 shadow space-y-2">
          <img src={result.image_url}  className="w-full h-52 object-cover rounded" alt="Plante identifiée" />
          <p><strong>Nom:</strong> {result.name}</p>
          <p><strong>Type:</strong> {result.type}</p>
          <p><strong>Description:</strong> {result.description}</p>

          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={savePlant}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              // TODO: handle save
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
    
  );
}
