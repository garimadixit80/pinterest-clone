import jwtDecode from "jwt-decode";
import * as userService from "../services/users.js";

export const SET_CURRENT_USER = "SET_CURRENT_USER";
export const RECEIVE_SESSION_ERROR = "RECEIVE_SESSION_ERROR";
export const CLEAR_SESSION_ERROR = "CLEAR_SESSION_ERROR";

// ✅ Backend base URL (Render backend)
const API_BASE_URL = "https://pinterest-clone-i7bd.onrender.com";

// ✅ Set global axios base URL for userService
userService.instance.defaults.baseURL = `${API_BASE_URL}/api/users`;

export const setAuthToken = (token) => {
  if (token) {
    userService.instance.defaults.headers.common["Authorization"] = token;
  } else {
    delete userService.instance.defaults.headers.common["Authorization"];
  }
};

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

export const signup = (userData) => async (dispatch) => {
  try {
    await userService.signup(userData);
    dispatch(login(userData));
  } catch (exception) {
    dispatch(receiveError(exception.response?.data?.error || "Signup failed"));
  }
};

export const login = (userData) => async (dispatch) => {
  try {
    const response = await userService.login(userData);
    const token = response.data.token;
    localStorage.setItem("jwtToken", token);
    setAuthToken(token);
    dispatch(setCurrentUser(jwtDecode(token)));
  } catch (exception) {
    dispatch(receiveError(exception.response?.data?.error || "Login failed"));
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("jwtToken");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};
