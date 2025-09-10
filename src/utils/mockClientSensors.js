// src/utils/mockClientSensors.js
import { useEffect } from "react";

export const thresholds = {
  temperature: { low: 18, high: 30 },
  humidity: { low: 40, high: 70 },
  soil_moisture: { low: 25, high: 60 },
  light: { low: 200, high: 800 },
};

const sensorTypes = ["temperature", "humidity", "soil_moisture", "light"];

function generateRandomValue(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

function getStatus(type, value) {
  const t = thresholds[type];
  if (!t) return "OK";
  if (value < t.low) return "LOW";
  if (value > t.high) return "CRITICAL";
  return "OK";
}

// 👇 Fonction à importer dans ton front
export function generateMockSensors(plant_id) {
  return sensorTypes.map((type) => {
    const t = thresholds[type];
    const value = generateRandomValue(t.low - 5, t.high + 5);
    return {
      plant_id,
      type,
      value,
      status: getStatus(type, value),
      timestamp: new Date().toISOString(),
    };
  });
}

export function useSensorData(mutate) {
  useEffect(() => {
    const interval = setInterval(() => {
      mutate(); // re-fetch depuis ton API
    }, 30000); // 30s

    return () => clearInterval(interval);
  }, [mutate]);
}
