import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    // Do NOT attach token for login and register endpoints
    const publicEndpoints = [
      "/auth/login/seeker/",
      "/auth/login/recruiter/",
      "/auth/register/",
      "/auth/token/refresh/",
    ];
    const isPublic = publicEndpoints.some((ep) =>
      config.url?.includes(ep)
    );

    if (!isPublic) {
      const token = localStorage.getItem("access");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Don't retry login/register endpoints
    const publicEndpoints = [
      "/auth/login/seeker/",
      "/auth/login/recruiter/",
      "/auth/register/",
      "/auth/token/refresh/",
    ];
    const isPublic = publicEndpoints.some((ep) =>
      original.url?.includes(ep)
    );

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !isPublic
    ) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) throw new Error("No refresh token");

        const { data } = await axios.post(
          `${BASE_URL}/auth/token/refresh/`,
          { refresh }
        );
        localStorage.setItem("access", data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;