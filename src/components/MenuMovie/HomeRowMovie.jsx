import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuMovie from "./MenuMovie";
import ButtonHover from "../ButtonHover";

const API = "http://localhost:5000";

// Chuẩn hóa path ảnh: "./public/xxx" -> "/xxx"
function normalizePoster(src) {
  if (!src) return "/images/default-poster.jpg";
  return src.startsWith("./public/") ? src.replace("./public", "") : src;
}

// Shuffle Fisher–Yates
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function HomeRowMovie({ titleName }) {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/movies`);
        const data = await res.json();

        // Bỏ phim có thể loại Anime
        const noAnime = data.filter(
          (m) =>
            !m.genres?.some(
              (g) =>
                g.vi?.toLowerCase().includes("anime") ||
                g.en?.toLowerCase().includes("anime")
            )
        );

        // Random 10 phim
        const picked = shuffle(noAnime).slice(0, 10);

        // Map sang format MenuMovie cần: { id, poster, title (VI), subtitle (EN), badges }
        const mapped = picked.map((m) => ({
          id: m.id,
          poster: normalizePoster(m.poster),
          title: m?.title?.vi || m?.title?.en || "",
          subtitle: m?.title?.en || m?.title?.vi || "",
          badges: m?.badges || [],
        }));

        setMovies(mapped);
      } catch (e) {
        console.error("Fetch movies failed:", e);
        setMovies([]);
      }
    })();
  }, []);

  //  Hàm điều hướng, truyền title + mode để tái sử dụng
  const goAllMovies = () =>
    navigate("/all-movies", {
      state: {
        title: "Phim điện ảnh mới toanh",
        movies, // lọc giống section này
      },
    });
  const goDetail = (id) => navigate(`/movie/${id}`);

  return (
    <div className="bg-[#192026] text-white px-6 py-10 w-full max-w-[100vw] overflow-x-hidden">
      <div className="flex gap-4 mb-6">
        <h2 className="text-2xl font-bold">{titleName}</h2>
        <ButtonHover onClick={goAllMovies} />
      </div>

      <MenuMovie movies={movies} onMovieClick={goDetail} />
    </div>
  );
}
