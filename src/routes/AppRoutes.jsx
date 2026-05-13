import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ROLES } from "../utils/roles";

/* =========================================
   PUBLIC PAGES
========================================= */
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";

/* =========================================
   LAYOUTS + GUARDS
========================================= */
import PrivateLayout from "../layouts/PrivateLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import ProfileGuard from "../components/guards/ProfileGuard";

/* =========================================
   USER PAGES
========================================= */
import RoleRequest from "../pages/user/RoleRequest";
import CompleteProfile from "../pages/user/CompleteProfile";
import Profile from "../pages/user/Profile";

/* =========================================
   ADMIN PAGES
========================================= */
import AdminDashboard from "../pages/admin/AdminDashboard";
import Payments from "../pages/admin/Payments";
import Reports from "../pages/admin/Reports";
import Users from "../pages/admin/Users";
import Roles from "../pages/admin/Roles";
import Permissions from "../pages/admin/Permissions";
import AdminRoleRequests from "../pages/admin/AdminRoleRequests";

import CreateFeeStructure from "../pages/admin/CreateFeeStructure";
import FeeApprovals from "../pages/admin/FeeApprovals";

/* =========================================
   STUDENT PAGES
========================================= */
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentFees from "../pages/student/StudentFees";
import PayFee from "../pages/student/PayFee";
import TransactionHistory from "../pages/student/TransactionHistory";

export default function AppRoutes() {
  return (
    <Routes>

      {/* =====================================
          PUBLIC ROUTES
      ===================================== */}
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      {/* =====================================
          ROLE REQUEST
      ===================================== */}
      <Route
        path="/request-role"
        element={<RoleRequest />}
      />

      {/* =====================================
          COMPLETE PROFILE
      ===================================== */}
      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute>
            <CompleteProfile />
          </ProtectedRoute>
        }
      />

      {/* =====================================
          PROFILE
      ===================================== */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* =====================================
          ADMIN ROUTES
      ===================================== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute
            allowedRoles={[
              ROLES.VTU_ADMIN,
            ]}
          >
            <ProfileGuard>
              <PrivateLayout />
            </ProfileGuard>
          </ProtectedRoute>
        }
      >
        {/* DEFAULT */}
        <Route
          index
          element={
            <Navigate
              to="dashboard"
              replace
            />
          }
        />

        {/* ADMIN PAGES */}
        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="payments"
          element={<Payments />}
        />

        <Route
          path="fee-structures"
          element={
            <CreateFeeStructure />
          }
        />

        <Route
          path="fee-approvals"
          element={<FeeApprovals />}
        />

        <Route
          path="reports"
          element={<Reports />}
        />

        <Route
          path="users"
          element={<Users />}
        />

        <Route
          path="roles"
          element={<Roles />}
        />

        <Route
          path="permissions"
          element={<Permissions />}
        />

        <Route
          path="role-requests"
          element={
            <AdminRoleRequests />
          }
        />

        {/* INVALID ADMIN ROUTE */}
        <Route
          path="*"
          element={
            <Navigate
              to="/admin/dashboard"
              replace
            />
          }
        />
      </Route>

      {/* =====================================
          STUDENT ROUTES
      ===================================== */}
      <Route
        path="/student"
        element={
          <ProtectedRoute
            allowedRoles={[
              ROLES.STUDENT,
            ]}
          >
            <ProfileGuard>
              <PrivateLayout />
            </ProfileGuard>
          </ProtectedRoute>
        }
      >
        {/* DEFAULT */}
        <Route
          index
          element={
            <Navigate
              to="dashboard"
              replace
            />
          }
        />

        {/* STUDENT PAGES */}
        <Route
          path="dashboard"
          element={
            <StudentDashboard />
          }
        />

        <Route
          path="fees"
          element={<StudentFees />}
        />

        <Route
          path="pay-fee"
          element={<PayFee />}
        />

        <Route
          path="transactions"
          element={
            <TransactionHistory />
          }
        />

        {/* INVALID STUDENT ROUTE */}
        <Route
          path="*"
          element={
            <Navigate
              to="/student/dashboard"
              replace
            />
          }
        />
      </Route>

      {/* =====================================
          404
      ===================================== */}
      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}