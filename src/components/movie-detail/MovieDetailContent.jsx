// src/components/movie-detail/MovieDetailContent.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid } from "@mui/material";
import { useAuth } from "../../auth/AuthContext"; // sửa path nếu khác

import DetailHero from "./MovieHero";
import DetailActions from "./MovieActions";
import DetailInfo from "./MovieInfo";
import PlayerDialog from "./PlayerDialog";

const API = "http://localhost:5000"; // mày đang hardcode thì giữ nguyên

export default function MovieDetailContent() {
  const { id } = useParams();
  const { user, isGuest } = useAuth();
  const [movie, setMovie] = useState(null);
  const [openPlayer, setOpenPlayer] = useState(false);

  // --- fetch movie y như cũ ---
  useEffect(() => {
    async function fetchMovie() {
      const res = await fetch(`${API}/movies/${id}`);
      const data = await res.json();
      setMovie(data);

      // nếu file gốc của mày có lưu history thì để lại ở đây
      if (!isGuest && user?.email) {
        const key = `history_${user.email}`;
        const old = JSON.parse(localStorage.getItem(key) || "[]");
        const payload = {
          id: data.id,
          title: data.title, // giữ đủ vi + en
          poster: data.poster,
          backdrop: data.backdrop,
          watchedAt: Date.now(),
        };
        const exists = old.find((x) => x.id === data.id);
        const next = exists
          ? old.map((x) => (x.id === data.id ? payload : x))
          : [payload, ...old];
        localStorage.setItem(key, JSON.stringify(next));
      }
    }
    fetchMovie();
  }, [id, isGuest, user]);

  // --- toggle favorite giữ nguyên kiểu cũ ---
  const handleToggleFavorite = useCallback(
    (movieData) => {
      if (!user?.email) return false;
      const key = `fav_${user.email}`;
      const old = JSON.parse(localStorage.getItem(key) || "[]");

      // quan trọng: LƯU ĐỦ title
      const payload = {
        id: movieData.id,
        title: movieData.title,
        poster: movieData.poster,
        backdrop: movieData.backdrop,
      };

      const exists = old.find((x) => x.id === movieData.id);
      const next = exists
        ? old.filter((x) => x.id !== movieData.id)
        : [payload, ...old];

      localStorage.setItem(key, JSON.stringify(next));
      return !exists;
    },
    [user]
  );

  if (!movie) return <div className="p-6 text-white/50">Đang tải phim...</div>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {/* 1. Phần banner / thumbnail / tiêu đề -> giữ nguyên UI */}
      <DetailHero movie={movie} onPlay={() => setOpenPlayer(true)} />

      {/* 2. Phần dưới: actions + info */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          {/* phần mô tả, thông tin, genre... */}
          <DetailInfo movie={movie} />
        </Grid>
        <Grid item xs={12} md={4}>
          {/* phần nút bấm (xem phim, yêu thích) */}
          <DetailActions
            movie={movie}
            isGuest={isGuest}
            onPlay={() => setOpenPlayer(true)}
            onToggleFavorite={handleToggleFavorite}
          />
        </Grid>
      </Grid>

      {/* dialog xem phim */}
      <PlayerDialog
        open={openPlayer}
        onClose={() => setOpenPlayer(false)}
        movie={movie}
      />
    </Container>
  );
}
