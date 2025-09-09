// src/lib/axios.js
import axios from "axios";

const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
const base = raw.replace(/\/+$/, "");
const apiBase = base.endsWith("/api") ? base : `${base}/api`;

const instance = axios.create({
  baseURL: apiBase,          // ⇦ toujours finit par /api ✅
  withCredentials: false,    // mets true si tu utilises des cookies
  timeout: 15000,
});

instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  // (option) éviter du cache agressif en GET via proxies
  if (config.method?.toLowerCase() === "get") {
    config.headers["Cache-Control"] = "no-cache";
    config.headers["Pragma"] = "no-cache";
  }
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window !== "undefined" && err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default instance;
