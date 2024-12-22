"use client";

import { LoadingFullPageSpinner } from "@/components/Loading";
import { api } from "@/config/api";
import { createContext, useContext, useEffect, useState } from "react";

// Create Context
const AuthContext = createContext();

// Create Hook to use it in application
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
        console.log("No token found!")
        return;
      }

      try {

        const response = await api.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status == 200) {
          setUser(response.data.user);
        }
      } catch (err) {
        if (err.response?.status === 403) {
          localStorage.removeItem("token");
          setUser(null);
          console.log("You are not authorized to access this page!");
        } else {
          console.error("Unexpected error:", err.message);
        }
      } finally {1
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login Function
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    if (response.status == 200) {
      localStorage.setItem("token", token);
      setUser(user.user);
      location.href = "/";
    }
  };

  // Logout
  const logout = async () => {
    const response = await api.get("/auth/logout", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status == 200) {
      localStorage.removeItem("token");
      setUser(null);
      location.href = "/auth/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading ? children : <LoadingFullPageSpinner />}
    </AuthContext.Provider>
  );
};
