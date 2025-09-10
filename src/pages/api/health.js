// src/pages/api/health.js
import formidable from "formidable";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    // Parse multipart/form-data
    const { files } = await new Promise((resolve, reject) => {
      const form = formidable({
        multiples: false,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        keepExtensions: true,
      });
      form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
    });

    let file = files?.image;
    if (Array.isArray(file)) file = file[0];
    if (!file) return res.status(400).json({ success: false, error: "No file uploaded (field 'image')" });

    const filePath = file.filepath || file.path;
    if (!filePath) {
      return res.status(400).json({ success: false, error: "Uploaded file has no filepath/path" });
    }

    // Buffer -> base64
    const fs = await import("fs");
    const buf = fs.readFileSync(filePath);
    const base64 = buf.toString("base64");

    // Appel Plant.id (health_assessment) — payload correct
    const plantKey = process.env.PLANT_ID_API_KEY || "";
    if (!plantKey) {
      return res.status(500).json({ success: false, error: "Missing PLANT_ID_API_KEY env var" });
    }

    const body = {
      images: [base64],
      // `disease_details` doit être un tableau de champs
      disease_details: ["description", "treatment", "local_name"],
      // utile pour les exemples/visuels
      similar_images: true,
      // optionnel : langue des descriptions
      // language: "en",
    };

    const r = await fetch("https://api.plant.id/v2/health_assessment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": plantKey,
      },
      body: JSON.stringify(body),
    });

    // Forward l’erreur réelle de Plant.id (pas un 502 flou)
    if (!r.ok) {
      const text = await r.text().catch(() => "");
      console.error("[Plant.id health error]", r.status, text);
      return res.status(r.status).json({ success: false, error: "Plant.id health failed", details: text });
    }

    const data = await r.json();

    // Upload de l’image sur Vercel Blob (si possible), sinon fallback data:
    let image_url;
    try {
      const { put } = await import("@vercel/blob"); // import dynamique => serveur only
      const rand = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      const uploaded = await put(`uploads/${rand}.jpg`, buf, {
        access: "public",
        contentType: file.mimetype || "image/jpeg",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      image_url = uploaded.url;
    } catch (blobErr) {
      // en dev local sans token blob
      image_url = `data:${file.mimetype || "image/jpeg"};base64,${base64}`;
    }

    return res.status(200).json({
      success: true,
      health_data: data,
      image_url,
    });
  } catch (e) {
    console.error("[API HEALTH] error:", e);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
