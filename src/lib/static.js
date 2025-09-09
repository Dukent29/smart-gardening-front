// src/lib/static.js
const STATIC_BASE = (process.env.NEXT_PUBLIC_STATIC_BASE || "https://awm.portfolio-etudiant-rouen.com/api")
  .replace(/\/+$/,"");

export const toApiStatic = (raw = "") => {
  if (!raw) return "";
  if (/^blob:/i.test(raw)) return raw;

  let p = String(raw).trim().replace(/^https?:\/\/[^/]+\/?/, "");
  p = p.replace(/^\/+/, "");
  p = p.replace(/^api\/+/, "");
  if (!/^uploads\//i.test(p)) p = `uploads/${p}`;
  return `${STATIC_BASE}/${p}`;
};
