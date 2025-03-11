import api from "./api";
import Cookies from "js-cookie";

const TOKEN_KEY = "token"; // key for storing jwt token in cookies
const USER_KEY = "user"; // key for storing user data in local storage

export const authService = {
  // Logs in the user by sending credentials to the API
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    this.setSession(response.data); // store token and user data
    return response.data;
  },

  // Logs out the user by clearing session data
  async logout() {
    this.clearSession();
    // try {
    //   await api.post("/users/logout");
    // } catch (error) {
    //   console.error("Logout error:", error);
    // }
  },

  // stores token in cookies and user data in local storage
  setSession(authData) {
    Cookies.set(TOKEN_KEY, authData.token, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });
    localStorage.setItem(USER_KEY, JSON.stringify(authData));
  },

  clearSession() {
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  //   check if the user is logged in (if token exists)
  isAuthenticated() {
    return !!Cookies.get(TOKEN_KEY); // returns true if token exists
  },

  getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  getToken() {
    return Cookies.get(TOKEN_KEY);
  },
};
