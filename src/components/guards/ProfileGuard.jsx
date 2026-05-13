import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../../api/axios";
import useAuth from "../../auth/useAuth";

const ProfileGuard = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [complete, setComplete] = useState(null);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await API.get("/users/profile/check");
        setComplete(res.data.complete);
      } catch (err) {
        setComplete(false);
      } finally {
        setLoading(false);
      }
    };

    if (user) check();
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  if (loading) return <div>Loading...</div>;

  if (!complete) {
    return <Navigate to="/complete-profile" />;
  }

  return children;
};

export default ProfileGuard;