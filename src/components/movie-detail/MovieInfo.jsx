// src/components/movie-detail/DetailInfo.jsx
import { Box } from "@mui/material";

export default function DetailInfo({ movie }) {
  return (
    <Box>
      {/* dán nguyên UI cũ */}
      <div className="bg-[#12151b] border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
        <div>
          <h2 className="mb-2 text-lg font-semibold text-white">Mô tả</h2>
          <p className="text-sm leading-relaxed text-white/60">
            {movie.description?.vi || movie.description?.en || "Chưa có mô tả."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-white/50">
          {movie.year ? <span>Năm: {movie.year}</span> : null}
          {movie.duration ? <span>Thời lượng: {movie.duration}</span> : null}
          {movie.country ? <span>Quốc gia: {movie.country}</span> : null}
        </div>

        {movie.genres?.length ? (
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((g) => (
              <span
                key={g.vi || g.en}
                className="px-3 py-1 text-xs rounded-full bg-white/5 text-white/70"
              >
                {g.vi || g.en}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Box>
  );
}
