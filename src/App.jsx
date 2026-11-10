import "./App.css";
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleRoute from "./auth/RoleRoute";
import CanvasCursor from "./components/Cursor/CanvasCursor";

const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage").then((module) => ({ default: module.LoginPage })));
const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const AllMoviesClick = lazy(() => import("./pages/AllMovieClick/AllMoviesClick"));
const MovieDetail = lazy(() => import("./pages/MovieDetail/MovieDetail"));
const AccountUserPage = lazy(() => import("./pages/AccountUserPage/AccountUserPage"));
const Manager = lazy(() => import("./pages/Manager/Manager"));

function App() {
  return (
    <>
      <CanvasCursor />
      <Suspense fallback={<div role="status" aria-live="polite" className="flex min-h-screen items-center justify-center text-white/70">Đang tải trang...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* HOME: user + guest + admin đều vào chung */}
        <Route element={<ProtectedRoute allowGuest={true} />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/all-movies" element={<AllMoviesClick />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Route>

        {/* PROFILE: chỉ user và admin (guest chặn) */}
        <Route element={<ProtectedRoute allowGuest={false} />}>
          <Route path="/profile" element={<Navigate to="/account" replace />} />
          <Route path="/account" element={<AccountUserPage />} />
          <Route element={<RoleRoute role="admin" />}>
            <Route path="/admin" element={<Manager />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      </Suspense>
    </>
  );
}

export default App;
