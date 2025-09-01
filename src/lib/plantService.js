import axios from './axios';

// get all plant of a user
export const getPlants = () =>
  axios.get("/plants/all").then((r) => r.data.plants); 

//gte number of plant in database
export const getPlantCount = () =>
  axios.get("/plants/count").then((r) => r.data.count);

// indos complete plant + sensors + pivot + auto
export const getPlantDetail = (id) =>
  axios.get(`/${id}/with-sensors`)
       .then(res => res.data.data); 
