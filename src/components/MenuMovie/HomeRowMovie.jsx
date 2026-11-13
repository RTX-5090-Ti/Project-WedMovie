import { moviesUrl } from "../../lib/movieFilters";
import useMovies from "../../lib/useMovies";
import MovieLoadStatus from "../loading/MovieLoadStatus";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuMovie from "./MenuMovie";
import ButtonHover from "../ButtonHover";


// Chuẩn hóa path ảnh: "./public/xxx" -> "/xxx"
function normalizePoster(src) {
  if (!src) return "/images/default-poster.svg";
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

  const { data, loading, error, retry } = useMovies();

  useEffect(() => {
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
  }, [data]);

  //  Hàm điều hướng, truyền title + mode để tái sử dụng
  const goAllMovies = () => navigate(moviesUrl({ type: "new" }));

  const goDetail = (id) => navigate(`/movie/${id}`);

  if (loading || error) return <MovieLoadStatus loading={loading} error={error} retry={retry} />;

  return (
    <div className="home-section bg-[#192026] text-white px-6 py-10 w-full max-w-[100vw] overflow-x-hidden">
      <div className="flex gap-4 mb-6">
        <h2 className="text-2xl font-bold">{titleName}</h2>
        <ButtonHover onClick={goAllMovies} />
      </div>

      <MenuMovie movies={movies} onMovieClick={goDetail} />
    </div>
  );
}
