import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { ROLES } from "../utils/roles";

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  const { user, login, logout } = context;

  // ✅ FIX: token comes from user
  const token = user?.token;

  // ✅ FIX: proper auth check
  const isAuthenticated = !!user && !!user.token;

  // ✅ Role checks
  const isVTUAdmin = () => user?.role === ROLES.VTU_ADMIN;
  const isPrincipal = () => user?.role === ROLES.PRINCIPAL;
  const isProfessor = () => user?.role === ROLES.PROFESSOR;
  const isStudent = () => user?.role === ROLES.STUDENT;

  const hasRole = (role) => user?.role === role;
  const hasAnyRole = (roles) => roles.includes(user?.role);

  return {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    isVTUAdmin,
    isPrincipal,
    isProfessor,
    isStudent,
    hasRole,
    hasAnyRole,
  };
};

export default useAuth;