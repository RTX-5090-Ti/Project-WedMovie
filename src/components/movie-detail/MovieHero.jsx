// src/components/movie-detail/DetailHero.jsx
import { Box } from "@mui/material";

export default function DetailHero({ movie, onPlay }) {
  // nếu file gốc của mày có hàm normalize thì copy nó vô đây luôn
  const backdrop =
    movie?.backdrop?.replace("./public", "") || "/images/default-bg.jpg";

  return (
    <Box sx={{ mb: 3 }}>
      {/* ⬇⬇⬇ DÁN NGUYÊN JSX CŨ Ở ĐÂY ⬇⬇⬇ */}
      {/* ví dụ: */}
      <div className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden bg-black/40">
        <img
          src={backdrop}
          alt={movie.title?.vi || movie.title?.en}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1014] via-[#0f1014]/60 to-transparent" />
        <div className="absolute flex flex-col gap-2 bottom-6 left-6 right-6">
          <p className="text-sm tracking-wide uppercase text-white/50">
            {movie.year} • {movie.genres?.[0]?.vi || movie.genres?.[0]?.en}
          </p>
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            {movie.title?.vi}
          </h1>
          {movie.title?.en ? (
            <p className="text-sm text-white/60 md:text-base">
              {movie.title.en}
            </p>
          ) : null}

          <div className="flex gap-3 mt-3">
            <button
              onClick={onPlay}
              className="px-4 py-2 text-sm font-semibold text-black transition bg-yellow-400 rounded-lg hover:bg-yellow-300"
            >
              ▶ Xem phim
            </button>
          </div>
        </div>
      </div>
      {/* ⬆⬆⬆ GIỮ NGUYÊN CLASSNAME CŨ ⬆⬆⬆ */}
    </Box>
  );
}
