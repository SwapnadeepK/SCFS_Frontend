import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import useAuth from "../auth/useAuth";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();
  const location = useLocation();

  const [profileComplete, setProfileComplete] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- PROFILE CHECK ---------------- */
  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;

      try {
        const res = await API.get("/users/profile/check");
        setProfileComplete(res.data?.complete ?? false);
      } catch (err) {
        setProfileComplete(false);
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, [user]);

  /* ---------------- NO USER ---------------- */
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /* ---------------- LOADING ---------------- */
  if (loading || profileComplete === null) {
    return <div>Loading...</div>;
  }

  /* ---------------- UNVERIFIED FLOW ---------------- */
  if (user.role === "UNVERIFIED") {
    if (location.pathname !== "/request-role") {
      return <Navigate to="/request-role" replace />;
    }
    return children;
  }

  /* ---------------- PROFILE INCOMPLETE ---------------- */
  if (profileComplete === false) {
    if (location.pathname !== "/complete-profile") {
      return <Navigate to="/complete-profile" replace />;
    }
    return children;
  }

  /* ---------------- ROLE BASED ACCESS ---------------- */
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;