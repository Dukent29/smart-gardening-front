// src/lib/plantSensorsService.js
import axios from "./axios";

export const getPlantsWithSensors = async () => {
  const res = await axios.get("/plants-with-sensors");
  console.log("DBG payload backend:", res.data);

  // 🔥 la bonne clé est "data"
  return res.data.data ?? [];      // renvoie toujours un **tableau**
};
