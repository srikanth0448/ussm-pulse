import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import AttendancePage from "./pages/AttendancePage";
import HolidaysList from "./pages/HolidaysList";
import "./App.css";
import AppLayout from "./components/layouts/AppLayout";
import Leaves from "./pages/Leaves";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import Requests from "./pages/RequestPage";
import WallPage from "./features/homepage/ViewWall";
function App() {
  const isAuthenticated = !!sessionStorage.getItem("token");

  return (
    <>
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/HomePage" : "/login"} replace />
          }
        />

        {/* Public */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/HomePage" replace />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/HomePage" element={<HomePage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/leaves" element={<Leaves title="Leaves" />} />
            <Route
              path="/holidays"
              element={<HolidaysList title="Holidays List" />}
            />
            <Route path="/ProfilePage" element={<ProfilePage />} />
            <Route path="/viewwallpage" element={<WallPage />} />
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
