import axios from './axios';

// POST api/users/login
export const loginUser = async (credentials) => {
    const { data } = await axios.post('/users/login', credentials);
    return data;
};

export const registerUser = async (newUser) => {
  // POST /api/users/register  (backend sur port 5000)
  const { data } = await axios.post("/users/register", newUser);
  return data;               // { success, token } si tu renvoies le token direct
};

// GET /api/users/profile (à créer plus tard si besoin)
export const getMe = async () => {
  // TODO : soit décoder le JWT ici, soit attendre un endpoint backend
  throw new Error("Endpoint /users/profile not implemented yet 🚧");
};

 export const forgotPassword = async (email) => {
  const { data } = await axios.post('/users/forgot-password', { email });
  return data;
}