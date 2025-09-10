export const thresholds = {
  temperature: { low: 18, high: 30 },
  humidity: { low: 40, high: 70 },
  soil_moisture: { low: 25, high: 60 },
  light: { low: 200, high: 800 },
};

const sensorTypes = ["temperature", "humidity", "soil_moisture", "light"];

function rand(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}
function statusFor(type, value) {
  const t = thresholds[type];
  if (!t) return "OK";
  if (value < t.low) return "LOW";
  if (value > t.high) return "CRITICAL";
  return "OK";
}

export function generateMockSensors(plant_id) {
  return sensorTypes.map((type) => {
    const t = thresholds[type];
    const value = rand(t.low - 5, t.high + 5);
    return {
      plant_id,
      type,                 // NOTE: côté front on normalise la clé -> "type"
      value,
      status: statusFor(type, value),
      timestamp: new Date().toISOString(),
    };
  });
}

export function buildLatestByType(rawSensors = [], plantIdForFallback) {
  const sensors =
    Array.isArray(rawSensors) && rawSensors.length > 0
      ? rawSensors.map((s) => ({
          type: s.type || s.sensor_type,   // normalise la clé
          value: s.value,
          status: s.status || "OK",
          timestamp: s.timestamp,
        }))
      : generateMockSensors(plantIdForFallback);

  const latest = {};
  sensors.forEach((s) => {
    if (!s?.type) return;
    if (!latest[s.type] || new Date(s.timestamp) > new Date(latest[s.type].timestamp)) {
      latest[s.type] = s;
    }
  });
  return latest;
}


export function overallStatusFromLatest(latestByType) {
  const list = Object.values(latestByType || {}).map((s) => s.status);
  if (!list.length) return "UNKNOWN";
  if (list.includes("CRITICAL")) return "CRITICAL";
  if (list.includes("LOW")) return "LOW";
  if (list.every((s) => s === "OK")) return "OK";
  return "UNKNOWN";
}
