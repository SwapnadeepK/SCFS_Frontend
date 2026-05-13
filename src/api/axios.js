import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL|| "http://localhost:5000/api" // ✅ Use env variable for flexibility
});

// ✅ Attach token automatically
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle token expiry globally
export const setupInterceptors = (logout, enqueueSnackbar) => {
  API.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401 && !window.location.pathname.includes("/login")) {
        logout();

        enqueueSnackbar("Session expired. Please login again.", {
          variant: "error",
        });

        window.location.href = "/login";
      }

      return Promise.reject(err);
    }
  );
};

export default API;