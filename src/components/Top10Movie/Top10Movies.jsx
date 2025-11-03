import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Top10Row from "./Top10Row";

const API = "http://localhost:5000";

// Chuẩn hóa poster: "./public/..." -> "/..."
function normalizePoster(src) {
  if (!src) return "/images/default-poster.jpg";
  return src.startsWith("./public/") ? src.replace("./public", "") : src;
}

export default function Top10Movies() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // Lấy phim featured
        const res = await fetch(`${API}/movies?featured=true`);
        const data = await res.json();

        // Nếu muốn ưu tiên mới nhất có thể sort createdAt/ year ở đây
        // data.sort((a, b) => (b.createdAt || 0).localeCompare(a.createdAt || 0));

        // Lấy đúng 10 phim (hoặc ít hơn nếu không đủ)
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
      } catch (err) {
        console.error("Load featured movies failed:", err);
      }
    })();
  }, []);

  const goDetail = (id) => {
    navigate(`/movie/${id}`); // chuyển sang MovieDetail theo id
  };

  return (
    <div className="bg-[#192026] text-white w-full max-w-[100vw] overflow-x-hidden px-6 py-10 mb-[30px]">
      <Top10Row
        title="Top 10 Phim Hot Hôm Nay"
        items={items}
        onMovieClick={goDetail}
      />
    </div>
  );
}
