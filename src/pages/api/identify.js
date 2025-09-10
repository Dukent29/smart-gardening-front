// src/pages/api/identify.js
import formidable from "formidable";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    // 1) Parse multipart/form-data
    const { files } = await new Promise((resolve, reject) => {
      const form = formidable({
        multiples: false,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        keepExtensions: true,
      });
      form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
    });

    // 2) Fichier quel que soit le format (objet vs tableau)
    let file = files?.image;
    if (Array.isArray(file)) file = file[0];
    if (!file) {
      return res.status(400).json({ success: false, error: "No file uploaded under 'image'." });
    }

    // 3) chemin selon version formidable (filepath | path)
    const filePath = file.filepath || file.path;
    if (!filePath) {
      return res.status(400).json({
        success: false,
        error: "Uploaded file has no filepath/path (check formidable).",
      });
    }

    // 4) Lire en buffer
    const fs = await import("fs");
    const buf = fs.readFileSync(filePath);
    const base64 = buf.toString("base64");

    // 5) Appel Plant.id
    const r = await fetch("https://api.plant.id/v2/identify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": process.env.PLANT_ID_API_KEY || "",
      },
      body: JSON.stringify({
        images: [base64],
        modifiers: ["similar_images"],
        plant_details: ["common_names", "taxonomy", "wiki_description"],
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      return res.status(502).json({ success: false, error: "Plant.id failed", details: t });
    }

    const data = await r.json();
    const s = data?.suggestions?.[0] ?? {};
    const name = s.plant_name || "Unknown";
    const taxonomy = s.plant_details?.taxonomy || {};
    const type = taxonomy.class || "Unknown";
    const description = s.plant_details?.wiki_description?.value || "No description";

    // 6) Upload image: ESSAYER @vercel/blob via import dynamique (serveur seulement)
    let image_url;
    try {
      const { put } = await import("@vercel/blob"); // <— import dynamique
      const rand = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`; // pas de node:crypto
      const uploaded = await put(`uploads/${rand}.jpg`, buf, {
        access: "public",
        contentType: file.mimetype || "image/jpeg",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      image_url = uploaded.url;
    } catch (blobErr) {
      // En local sans token blob: fallback en data URL (toujours fonctionnel pour l'UI)
      image_url = `data:${file.mimetype || "image/jpeg"};base64,${base64}`;
    }

    return res.status(200).json({
      success: true,
      name,
      type,
      description,
      image_url,
    });
  } catch (e) {
    console.error("[API IDENTIFY] error:", e);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
