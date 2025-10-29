import axios from "axios";

// ✅ Use environment variable for flexibility (Netlify → Render)
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://pinterest-clone-i7bd.onrender.com/api/users"; // fallback if env missing

// ✅ Create a reusable Axios instance
export const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ensures cookies/JWT work across origins
});

// ✅ API Endpoints
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
