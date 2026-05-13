import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import useAuth from "../auth/useAuth";

const PrivateLayout = () => {
  const { user } = useAuth();

  return (
    <div
      style={{
        display: "flex",

        minHeight: "100vh",

        background: "#f5f7fb",
      }}
    >
      {/* SIDEBAR */}
      {user && <Sidebar />}

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,

          marginTop: "64px",

          padding: "16px",

          overflowX: "hidden",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default PrivateLayout;