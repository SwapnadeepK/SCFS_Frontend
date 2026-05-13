import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./auth/AuthContext";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/layout/Footer";

import useAuth from "./auth/useAuth";

//const drawerWidth = 250;
//const navbarHeight = 64;

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Layout */}
      <div style={{ flex: 1 }}>
        
        {/* Sidebar (overlay) */}
        {user && <Sidebar />}

        {/* Content */}
        <div
          style={{
            marginTop: 64,
            paddingLeft: user ? 250 : 0, // ✅ ONLY SHIFT HERE

            display: "flex",
            flexDirection: "column",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <div style={{ flex: 1, padding: "20px" }}>
            <AppRoutes />
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;