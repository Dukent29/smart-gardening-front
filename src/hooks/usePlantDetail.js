import useSWR from "swr";
import { getPlantDetail }  from "../lib/plantService";
import { getLatestActions } from "../lib/actionService";

export const usePlantDetail = (id) => {
  const { data: plantData, error: plantError, mutate } = useSWR(
    id ? ["plant", id] : null,
    () => getPlantDetail(id),
    { refreshInterval: 30_000 }
  );

  const { data: actions } = useSWR(
    id ? ["actions", id] : null,
    () => getLatestActions(id),
    { refreshInterval: 30_000 }
  );

  return {
    plant: plantData,                // ✅ ici : c'est l’objet complet
    sensors: plantData?.sensors ?? [],
    actions,
    loading: !plantData && !plantError,
    error: plantError,
    mutate,
  };
};