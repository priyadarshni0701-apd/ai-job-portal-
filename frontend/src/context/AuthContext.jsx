import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/auth/profile/");
      setUser(data);
    } catch {
      // Token invalid — clear everything
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginSeeker = async (email, password) => {
    // Clear any old tokens first
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    const { data } = await api.post("/auth/login/seeker/", { email, password });
    localStorage.setItem("access",  data.tokens.access);
    localStorage.setItem("refresh", data.tokens.refresh);
    setUser(data.user);
    return data.user;
  };

  const loginRecruiter = async (email, password) => {
    // Clear any old tokens first
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    const { data } = await api.post("/auth/login/recruiter/", { email, password });
    localStorage.setItem("access",  data.tokens.access);
    localStorage.setItem("refresh", data.tokens.refresh);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    // Clear any old tokens first
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    const { data } = await api.post("/auth/register/", payload);
    localStorage.setItem("access",  data.tokens.access);
    localStorage.setItem("refresh", data.tokens.refresh);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        await api.post("/auth/logout/", { refresh });
      }
    } catch {
      // Ignore logout errors
    } finally {
      // Always clear local storage
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginSeeker,
        loginRecruiter,
        register,
        logout,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);