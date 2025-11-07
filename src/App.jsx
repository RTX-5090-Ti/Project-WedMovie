// import { useState } from "react";

import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleRoute from "./auth/RoleRoute";
import AllMoviesClick from "./pages/AllMovieClick/AllMoviesClick";
import MovieDetail from "./pages/MovieDetail/MovieDetail";
import AcountUserPage from "./pages/AcountUserPage/AcountUserPage";
import Manager from "./pages/Manager/Manager";
import CanvasCursor from "./components/Cursor/CanvasCursor";

function App() {
  return (
    <>
      <CanvasCursor
        // optional props: maxParticles, spawnPerMove, size, color, life, blur
        maxParticles={80}
        spawnPerMove={1}
        size={12}
        color={"0,210,255"} // neon cyan as "r,g,b"
        life={700}
        blur={14}
      />
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
          <Route path="/profile" element={<div>Profile page</div>} />
          <Route path="/account" element={<AcountUserPage />} />
          <Route path="/admin" element={<Manager />} />
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      {/* <HomePage />
      <AllMoviesClick />
      <LoginPage></LoginPage> */}
    </>
  );
}

export default App;
