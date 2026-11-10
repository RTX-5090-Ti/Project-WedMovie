import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleRoute from "./auth/RoleRoute";
import AllMoviesClick from "./pages/AllMovieClick/AllMoviesClick";
import MovieDetail from "./pages/MovieDetail/MovieDetail";
import AccountUserPage from "./pages/AccountUserPage/AccountUserPage";
import Manager from "./pages/Manager/Manager";
import CanvasCursor from "./components/Cursor/CanvasCursor";

function App() {
  return (
    <>
      <CanvasCursor />
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
    </>
  );
}

export default App;
