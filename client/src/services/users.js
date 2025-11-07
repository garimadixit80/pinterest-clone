// src/services/users.js
import axios from "axios";

// ==============================
// ✅ Backend Base URL (Render backend)
// ==============================
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://pinterest-clone-i7bd.onrender.com"; // fallback safety

// ==============================
// ✅ Axios Instance
// ==============================
export const instance = axios.create({
  baseURL: `${API_BASE_URL}/api/users`,
  withCredentials: false, // using JWT, not cookies
});

// ==============================
// ✅ User API Endpoints
// ==============================

// Signup
export const signup = async (userData) => {
  try {
    const response = await instance.post("/signup", userData);
    return response.data;
  } catch (error) {
    console.error("❌ Signup Error:", error.response?.data || error.message);
    throw error;
  }
};

// Login
export const login = async (userData) => {
  try {
    const response = await instance.post("/login", userData);
    return response.data;
  } catch (error) {
    console.error("❌ Login Error:", error.response?.data || error.message);
    throw error;
  }
};

// Get profile
export const getProfile = async (userId) => {
  try {
    const response = await instance.get(`/${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Get Profile Error:", error.response?.data || error.message);
    throw error;
  }
};

// Save pin
export const savePin = async ({ userId, photoUrl }) => {
  try {
    const response = await instance.put(`/${userId}/save-pin`, { photoUrl });
    return response.data;
  } catch (error) {
    console.error("❌ Save Pin Error:", error.response?.data || error.message);
    throw error;
  }
};

// Delete saved pin
export const deleteSavedPin = async ({ userId, photoUrl }) => {
  try {
    const response = await instance.put(`/${userId}/delete-pin`, { photoUrl });
    return response.data;
  } catch (error) {
    console.error("❌ Delete Saved Pin Error:", error.response?.data || error.message);
    throw error;
  }
};
