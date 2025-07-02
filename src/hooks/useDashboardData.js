// src/hooks/useDashboardData.js
import { useEffect, useState } from "react";
import { getPlantsWithSensors } from "../lib/plantSensorsService.js";

export const useDashboardData = () => {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const plants = await getPlantsWithSensors();   // ← déjà un tableau
        setData(plants);
      } catch (err) {
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    const interval = setInterval(fetchAll, 10_000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
};
