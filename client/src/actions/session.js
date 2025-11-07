// src/actions/sessionActions.js

import jwtDecode from "jwt-decode";
import * as userService from "../services/users.js";

// ======================
// Action Types
// ======================
export const SET_CURRENT_USER = "SET_CURRENT_USER";
export const RECEIVE_SESSION_ERROR = "RECEIVE_SESSION_ERROR";
export const CLEAR_SESSION_ERROR = "CLEAR_SESSION_ERROR";

// ======================
// Backend Base URL (Render backend)
// ======================
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://pinterest-clone-i7bd.onrender.com"; // fallback for local safety

// Configure axios globally for userService
if (userService.instance) {
  userService.instance.defaults.baseURL = `${API_BASE_URL}/api/users`;
}

// ======================
// Auth Token Utilities
// ======================
export const setAuthToken = (token) => {
  if (token) {
    userService.instance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`; // ✅ Added Bearer prefix
  } else {
    delete userService.instance.defaults.headers.common["Authorization"];
  }
};

// ======================
// Redux Action Creators
// ======================
export const setCurrentUser = (user) => ({
  type: SET_CURRENT_USER,
  user,
});

export const receiveError = (error) => ({
  type: RECEIVE_SESSION_ERROR,
  error,
});

export const clearError = () => ({
  type: CLEAR_SESSION_ERROR,
});

// ======================
// Thunk Actions
// ======================
export const signup = (userData) => async (dispatch) => {
  try {
    await userService.signup(userData);
    dispatch(login(userData)); // Auto login after signup
  } catch (error) {
    const errorMsg =
      error.response?.data?.error || error.message || "Signup failed";
    dispatch(receiveError(errorMsg));
  }
};

export const login = (userData) => async (dispatch) => {
  try {
    const response = await userService.login(userData);
    const token = response.data.token;

    // Save token and set axios header
    localStorage.setItem("jwtToken", token);
    setAuthToken(token);

    // Decode and dispatch current user
    const decodedUser = jwtDecode(token);
    dispatch(setCurrentUser(decodedUser));
  } catch (error) {
    const errorMsg =
      error.response?.data?.error || error.message || "Login failed";
    dispatch(receiveError(errorMsg));
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("jwtToken");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};
