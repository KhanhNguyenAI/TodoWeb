// contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../src/lib/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Testing API connection...");
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

    if (token) {
      try {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        console.log("Making auth check request...");
        const response = await api.get("/auth/me");
        console.log("Auth check success:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Auth check failed:", error);
        console.error("Error details:", error.response?.data);
        localStorage.removeItem("token");
        delete api.defaults.headers.Authorization;
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);

      return response.data;
    } catch (error) {
      // Re-throw error để component có thể xử lý
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.Authorization;
    setUser(null);
  };

  // Thêm hàm check authentication status
  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated, // Thêm hàm tiện ích
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
