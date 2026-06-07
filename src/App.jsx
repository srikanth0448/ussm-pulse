import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import AttendancePage from "./pages/AttendancePage";
import ComingSoonPage from "./pages/ComingSoonPage";
import "./App.css";
import AppLayout from "./components/layouts/AppLayout";

function App() {
  const isAuthenticated = !!sessionStorage.getItem("token");

  return (
    <>
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/attendance" : "/login"} replace />
          }
        />

        {/* Public */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/attendance" replace />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/attendance" element={<AttendancePage />} />
            <Route
              path="/requests"
              element={<ComingSoonPage title="Requests" />}
            />
            <Route path="/leaves" element={<ComingSoonPage title="Leaves" />} />
            <Route
              path="/holidays"
              element={<ComingSoonPage title="Holidays List" />}
            />
          </Route>
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/attendance" : "/login"} replace />
          }
        />
      </Routes>
    </>
  );
}

export default App;
