import axios from "axios";

// 🔹 Use your Render backend URL here
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://your-render-backend-url.onrender.com/api/users"; // ⬅️ replace with your actual Render link

export const instance = axios.create({
  baseURL: API_BASE_URL,
});

export const signup = async (userData) => {
  return await instance.post("/signup", userData);
};

export const login = async (userData) => {
  return await instance.post("/login", userData);
};

export const getProfile = async (userId) => {
  return await instance.get(`/${userId}`);
};

export const savePin = async ({ userId, photoUrl }) => {
  return await instance.put(`/${userId}/save-pin`, { photoUrl });
};

export const deleteSavedPin = async ({ userId, photoUrl }) => {
  return await instance.put(`/${userId}/delete-pin`, { photoUrl });
};
