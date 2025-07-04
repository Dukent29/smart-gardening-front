// 📁 src/lib/actionService.js
import axios from "./axios";   // baseURL = "http://localhost:5000/api"

export const getLatestActions = (id) =>
  axios.get(`/actions/${id}/latest`).then(r => r.data.actions);

// bonne URL : /api + /simulate/plants/:id/apply-action
export const applyAction = (id, payload) =>
  axios.post(`/simulate/plants/${id}/apply-action`, payload)
       .then(r => r.data);