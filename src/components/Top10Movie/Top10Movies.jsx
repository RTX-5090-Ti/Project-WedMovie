import useMovies from "../../lib/useMovies";
import MovieLoadStatus from "../loading/MovieLoadStatus";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Top10Row from "./Top10Row";


// Chuẩn hóa poster: "./public/..." -> "/..."
function normalizePoster(src) {
  if (!src) return "/images/default-poster.svg";
  return src.startsWith("./public/") ? src.replace("./public", "") : src;
}

export default function Top10Movies() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const { data, loading, error, retry } = useMovies(true);

  useEffect(() => {
        const top10 = data.slice(0, 10).map((m) => ({
          id: m.id,
          poster: normalizePoster(m.poster),
          // Tên hiển thị: dòng trên VI, dòng dưới EN (Top10Row dùng title/subtitle)
          title: m?.title?.vi || m?.title?.en || "",
          subtitle: m?.title?.en || m?.title?.vi || "",
          // badges giữ nguyên từ db.json
          badges: m?.badges || [],
          // meta thay thế bằng [year, duration]
          meta: [
            m?.year ? String(m.year) : "",
            m?.duration ? String(m.duration) : "",
          ].filter(Boolean),
        }));

        setItems(top10);
  }, [data]);

  const goDetail = (id) => {
    navigate(`/movie/${id}`); // chuyển sang MovieDetail theo id
  };

  if (loading || error) return <MovieLoadStatus loading={loading} error={error} retry={retry} />;

  return (
    <div className="home-section bg-[#192026] text-white w-full max-w-[100vw] overflow-x-hidden px-6 py-10 mb-[30px]">
      <Top10Row
        title="Top 10 Phim Hot Hôm Nay"
        items={items}
        onMovieClick={goDetail}
      />
    </div>
  );
}
