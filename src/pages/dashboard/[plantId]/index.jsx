import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { usePlantDetail } from "@/hooks/usePlantDetail";
import axios from "@/lib/axios";
import SensorCard from "@/components/SensorCard";
import { AppLayout } from "@/layout/AppLayout";
import { FiMoreVertical } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const STATIC_BASE = (process.env.NEXT_PUBLIC_STATIC_BASE || "https://awm.portfolio-etudiant-rouen.com/api").replace(/\/+$/, "");

const toPlantImageUrl = (raw = "") => {
  if (!raw) return "";

  let s = String(raw).trim();

  // 1) data: URL (leave it)
  if (/^data:/i.test(s)) return s;

  // 2) Fix accidental "hosthttps://..." concatenations (keep the last http URL)
  const multiHttp = s.match(/https?:\/\/.+https?:\/\/(.+)$/i);
  if (multiHttp) s = "https://" + multiHttp[1];

  // 3) If absolute URL
  if (/^https?:\/\//i.test(s)) {
    try {
      const apiHost = new URL(STATIC_BASE).host;
      const u = new URL(s);

      // If not our API host -> external (e.g., Vercel Blob). Use as-is.
      if (u.host !== apiHost) return s;

      // If it's our API host, normalize path to /uploads/...
      let p = u.pathname.replace(/^\/+/, "");
      p = p.replace(/^api\/+/, "");
      if (!/^uploads\//i.test(p)) p = `uploads/${p}`;
      return `${STATIC_BASE}/${p}`;
    } catch {
      // If URL parsing fails, fall through to relative handling below
    }
  }

  let p = String(raw).trim().replace(/^https?:\/\/[^/]+\/?/, "");
  p = p.replace(/^\/+/g, "");
  p = p.replace(/^api\/+/g, "");
  if (!/^uploads\//i.test(p)) p = `uploads/${p}`;
  return `${STATIC_BASE}/${p}`;
};

export default function PlantDetail() {
  const router = useRouter();
  const { plantId } = router.query;
  const { plant, sensors, actions, loading, error, mutate } = usePlantDetail(plantId);

  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  // ------- derived sensors -------
  const latestByType = {};
  (sensors || []).forEach((s) => {
    if (!latestByType[s.type] || new Date(s.timestamp) > new Date(latestByType[s.type].timestamp)) {
      latestByType[s.type] = s;
    }
  });

  const getOverallStatus = () => {
    const allStatuses = Object.values(latestByType).map(sensor => sensor.status);
    if (allStatuses.includes("CRITICAL")) return "CRITICAL";
    if (allStatuses.includes("LOW")) return "LOW";
    if (allStatuses.length > 0 && allStatuses.every(status => status === "OK")) return "OK";
    return "UNKNOWN";
  };

  const overallStatus = getOverallStatus();
  const getBadgeStyle = (status) => {
    const styles = {
      OK: "bg-green-100 text-green-800 border-green-200",
      LOW: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CRITICAL: "bg-red-100 text-red-800 border-red-200",
      UNKNOWN: "bg-gray-100 text-gray-600 border-gray-200"
    };
    return styles[status] || styles.UNKNOWN;
  };

  // ------- actions (logic unchanged) -------
  const handleSimulateManualAction = async () => {
    try {
      const res = await axios.patch(`/simulation/simulate-response/${plantId}`);
      if (res.data.success) {
        console.log("✅ Manual actions applied:", res.data.updatedSensors);
        mutate();
      }
    } catch (err) {
      console.error("❌ Failed to simulate manual actions:", err);
      alert("Erreur lors du déclenchement de l'action manuelle.");
    }
  };

  const toggleAutomationMode = async () => {
    try {
      const res = await axios.patch(`/plants/${plantId}/automation`, {
        is_automatic: !plant.is_automatic,
      });
      if (res.data.success) {
        console.log("🌿 Automation mode updated");
        mutate();
      }
    } catch (err) {
      console.error("❌ Failed to toggle automation mode:", err);
      alert("Erreur lors de la mise à jour du mode automatique.");
    }
  };

  const handleDeletePlant = async () => {
    try {
      setLoadingAction(true);
      const res = await axios.delete(`/plants/${plantId}`);
      if (res.data.success) {
        alert("✅ Plante supprimée avec succès !");
        router.push("/dashboard");
      } else {
        alert("❌ Échec de la suppression de la plante.");
      }
    } catch (err) {
      console.error("❌ Failed to delete plant:", err);
      alert("Erreur lors de la suppression de la plante.");
    } finally {
      setLoadingAction(false);
      setShowDeleteModal(false);
    }
  };

  const handleEditPlant = () => {
    router.push(`/plants/edit/${plantId}`);
  };

  // ------- helpers for short description -------
  const DESC_LIMIT = 180;
  const fullDesc = plant?.description || "";
  const needsClamp = fullDesc.length > DESC_LIMIT;
  const shortDesc = needsClamp ? fullDesc.slice(0, DESC_LIMIT).trim() + "…" : fullDesc;

  return (
    <AppLayout title={plant?.plant_name || "Détails de la Plante"}>
      <div className="min-h-screen bg-gradient-to-b from-[#F2F7F4] to-[#F7FAF9] -mt-6">
        {/* ============ HERO IMAGE + OVERLAY ============ */}
        <section className="relative">
          {loading ? (
            <Skeleton height={320} />
          ) : plant?.image_url ? (
            <img
              src={toPlantImageUrl(plant.image_url)}
              alt={plant?.plant_name}
              className="w-full h-[38vh] sm:h-[48vh] object-cover"
            />
          ) : (
            <div className="w-full h-[38vh] sm:h-[48vh] bg-emerald-50 grid place-items-center text-emerald-700">
              <span className="text-sm">Aucune image</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

          {/* Kebab menu */}
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="p-2 rounded-full bg-white/80 backdrop-blur hover:bg-white ring-1 ring-black/5 shadow"
            >
              <FiMoreVertical className="w-5 h-5 text-gray-700" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-20">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete Plant
                </button>
                <button
                  onClick={handleEditPlant}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit Plant
                </button>
              </div>
            )}
          </div>

          {/* Type + Title over image */}
          {!loading && !error && (
            <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-4">
              <div className="max-w-3xl">
                <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full ring-1 ring-black/5 uppercase bg-white/80 backdrop-blur text-emerald-800">
                  {plant?.plant_type || "Plant"}
                </span>
                <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold leading-tight text-white drop-shadow">
                  {plant?.plant_name}
                </h1>
              </div>
            </div>
          )}
        </section>

        {/* =================== BODY =================== */}
        <main className="px-4 sm:px-6">
          <div className="mx-auto max-w-3xl -mt-6 sm:-mt-10">
            {/* Description (short with Read more) */}
            <section className="rounded-2xl bg-white/90 backdrop-blur ring-1 ring-gray-200 shadow-sm p-5 sm:p-7 mt-10">
              {loading ? (
                <>
                  <Skeleton width="60%" height={24} />
                  <Skeleton count={3} className="mt-3" />
                </>
              ) : error ? (
                <p className="text-center text-red-500">{error.message}</p>
              ) : (
                <>
                  <p className="text-sm text-gray-500">{plant?.plant_type}</p>

                  {/* Content with clamp/toggle */}
                  <div className="mt-2 text-gray-700 leading-relaxed">
                    <p className="whitespace-pre-line">
                      {descExpanded ? fullDesc : shortDesc}
                    </p>

                    {needsClamp && (
                      <button
                        type="button"
                        onClick={() => setDescExpanded((v) => !v)}
                        className="mt-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        {descExpanded ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </section>

            {/* Sensors + actions */}
            {!loading && !error && (
              <section className="p-4 sm:p-5 space-y-4 bg-white/90 backdrop-blur ring-1 ring-gray-200 rounded-2xl shadow-sm mt-6">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getBadgeStyle(overallStatus)}`}>
                    {overallStatus === "UNKNOWN" ? "Unknown" : overallStatus}
                  </span>
                  <button
                    onClick={toggleAutomationMode}
                    className={`text-xs px-2 py-1 rounded border font-semibold shadow-sm hover:shadow transition ${
                      plant.is_automatic
                        ? "bg-blue-100 text-blue-700 border-blue-300"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                  >
                    {plant.is_automatic ? "AUTO" : "MANUAL"}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <SensorCard
                    type="soil_moisture"
                    value={latestByType.soil_moisture?.value}
                    status={latestByType.soil_moisture?.status || "OK"}
                    isManual={!plant.is_automatic}
                    onAction={handleSimulateManualAction}
                  />
                  <SensorCard
                    type="light"
                    value={latestByType.light?.value}
                    status={latestByType.light?.status || "OK"}
                    isManual={!plant.is_automatic}
                    onAction={handleSimulateManualAction}
                  />
                  <SensorCard
                    type="temperature"
                    value={latestByType.temperature?.value}
                    status={latestByType.temperature?.status || "OK"}
                    isManual={!plant.is_automatic}
                    onAction={handleSimulateManualAction}
                  />
                  <SensorCard
                    type="humidity"
                    value={latestByType.humidity?.value}
                    status={latestByType.humidity?.status || "OK"}
                    isManual={!plant.is_automatic}
                    onAction={handleSimulateManualAction}
                  />
                </div>

                <div className="text-xs text-right text-gray-500">
                  Dernier arrosage : {plant?.lastActionAt ? new Date(plant.lastActionAt).toLocaleString() : "—"}
                </div>

                <div className="mt-2">
                  <h2 className="text-md font-semibold mb-2 text-[#0A5D2F]">Dernières actions</h2>
                  {actions?.length ? (
                    <ul className="space-y-1 text-sm text-gray-700">
                      {actions.slice(0, 2).map((a) => (
                        <li key={a._id}>
                          {new Date(a.timestamp).toLocaleString()} — {a.action}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Aucune action enregistrée.</p>
                  )}
                </div>
              </section>
            )}

            <div className="h-24" />
          </div>
        </main>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-semibold text-gray-800">Êtes-vous sûr ?</h2>
              <p className="text-sm text-gray-600 mt-2">
                Cette action est irréversible. Voulez-vous vraiment supprimer cette plante ?
              </p>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeletePlant}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  disabled={loadingAction}
                >
                  {loadingAction ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
