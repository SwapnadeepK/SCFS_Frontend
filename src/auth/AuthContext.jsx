import { createContext, useEffect, useState } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profileStatus, setProfileStatus] = useState(null);

  /* ---------------- LOAD USER ---------------- */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored) setUser(stored);
  }, []);

  /* ---------------- LOGIN ---------------- */
  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });

    const { token, user } = res.data;

    const normalizedUser = {
      token,
      role: user.role,
      id: user.id,
      email: user.email,
    };

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);

    return normalizedUser;
  };

  /* ---------------- PROFILE CHECK (IMPORTANT) ---------------- */
  const checkProfile = async () => {
    try {
      const res = await API.get("/users/profile/check");

      setProfileStatus(res.data); 
      return res.data;
    } catch (err) {
      console.error("Profile check failed", err);
      return null;
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAuthenticated = !!user;

  const hasAnyRole = (roles = []) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        hasAnyRole,
        checkProfile,
        profileStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};