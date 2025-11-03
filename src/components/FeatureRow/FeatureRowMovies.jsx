import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FeatureRow from "./FeatureRow";

const API = "http://localhost:5000";

// Chuẩn hóa path: "./public/..." -> "/..."
function normalize(src, fallback = "") {
  if (!src) return fallback;
  return src.startsWith("./public/") ? src.replace("./public", "") : src;
}

export default function FeatureRowMovies() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/movies`);
        const data = await res.json();

        // Lọc phim có genre Theaters / Chiếu rạp
        const theaters = (data || []).filter((m) =>
          m?.genres?.some(
            (g) =>
              g?.en?.toLowerCase() === "theaters" ||
              g?.vi?.toLowerCase() === "chiếu rạp"
          )
        );

        // Map theo cấu trúc FeatureRow cần: { id, banner, poster, badge, title, subtitle, meta }
        const mapped = theaters.map((m) => {
          const banner = normalize(m.backdrop, "/images/default-backdrop.jpg");
          const small = normalize(m.smallPoster);
          const poster =
            small || normalize(m.poster, "/images/default-poster.jpg");
          const badges = Array.isArray(m.badges)
            ? m.badges
            : m.badge
            ? m.badge.split("•").map((t) => ({ text: t.trim() }))
            : [];

          const year = m?.year ? String(m.year) : "";
          const duration = m?.duration ? String(m.duration) : "";
          const nationVi = m?.nation?.vi || "";

          return {
            id: m.id,
            banner,
            poster, // FeatureRow dùng key "poster" cho tấm nhỏ góc trái
            badges, // FeatureRow.jsx đang đọc item.badge
            title: m?.title?.vi || m?.title?.en || "",
            subtitle: m?.title?.en || m?.title?.vi || "",
            meta: [nationVi, year, duration].filter(Boolean),
          };
        });

        setItems(mapped);
      } catch (e) {
        console.error("Load theaters movies failed:", e);
      }
    })();
  }, []);

  //  Khi bấm nút “Xem thêm”
  const goToAllMovies = () => {
    navigate("/all-movies", {
      state: {
        title: "Mãn Nhãn với Phim Chiếu Rạp",
        movies: items, // chính danh sách chiếu rạp đã load
      },
    });
  };

  // Click 1 card -> sang trang chi tiết
  const goDetail = (id) => navigate(`/movie/${id}`);

  return (
    <div className="bg-[#192026] text-white px-6 py-8 mb-[30px]">
      <FeatureRow
        title="Mãn Nhãn với Phim Chiếu Rạp"
        items={items}
        onClickButton={goToAllMovies} // truyền vào đây
        onMovieClick={goDetail}
      />
    </div>
  );
}


