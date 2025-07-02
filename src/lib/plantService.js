import axios from './axios';

// get all plant of a user
export const getPlants = () =>
  axios.get("/plants/all").then((r) => r.data.plants); 
