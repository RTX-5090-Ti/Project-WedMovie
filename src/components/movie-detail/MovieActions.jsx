// src/components/movie-detail/DetailActions.jsx
import { Box } from "@mui/material";
import { useState } from "react";

export default function DetailActions({
  movie,
  isGuest,
  onPlay,
  onToggleFavorite,
}) {
  const [isFav, setIsFav] = useState(false);

  const handleFav = () => {
    if (isGuest) {
      // chỗ này ban đầu mày xài toast thì copy toast vô
      alert("Guest không được lưu yêu thích!");
      return;
    }
    const added = onToggleFavorite(movie);
    setIsFav(added);
  };

  return (
    <Box className="flex flex-col gap-3">
      {/* nếu file gốc của mày dùng MUI Button thì dán lại */}
      <button
        onClick={onPlay}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white transition border rounded-md bg-white/5 hover:bg-white/10 border-white/5"
      >
        ▶ Xem phim
      </button>

      {/* đây là cái nút mày đưa hôm trước */}
      <div
        onClick={handleFav}
        className={`inline-flex items-center gap-3 mt-1 border border-white/5 bg-[rgba(255,255,255,0.06)] rounded-[12px] p-2 cursor-pointer transition ${
          isFav ? "border-[#d9aa3d]" : ""
        }`}
      >
        <img className="w-[30px]" src="/images/logo/plus.gif" alt="" />
        <span>{isFav ? "Đã thêm vào yêu thích" : "Add to favorite"}</span>
      </div>
    </Box>
  );
}
