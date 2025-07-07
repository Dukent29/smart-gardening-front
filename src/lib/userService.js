import axios from "@/lib/axios";

export const getUserProfile = async () => {
  const res = await axios.get("/users/profile");
  return res.data;
};
export const updateUserProfile = async (data) => {
  const res = await axios.put("/users/profile", data);
  return res.data;
};