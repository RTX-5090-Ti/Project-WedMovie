import { moviesUrl } from "../../lib/movieFilters";
import useMovies from "../../lib/useMovies";
import MovieLoadStatus from "../loading/MovieLoadStatus";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuMovie from "./MenuMovie";
import ButtonHover from "../ButtonHover";


// Chuẩn hóa path ảnh
function normalizePoster(src) {
  if (!src) return "/images/default-poster.svg";
  return src.startsWith("./public/") ? src.replace("./public", "") : src;
}

// bỏ dấu + lowercase để so sánh không phân biệt dấu/hoa-thường
function toKey(s = "") {
  return s
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

// Kiểm tra 1 movie có chứa ít nhất 1 thể loại khớp (vi hoặc en)
function matchByGenres(movie, genreKeys) {
  if (!Array.isArray(movie?.genres)) return false;
  // build keys của movie
  const keysInMovie = movie.genres.flatMap((g) => [
    toKey(g.vi ?? ""),
    toKey(g.en ?? ""),
  ]);
  return genreKeys.some((k) => keysInMovie.includes(k));
}

/**
 * Props:
 *  - titleName: string (tiêu đề hàng)
 *  - genre: string | string[]  (ví dụ: "Chiếu rạp", "Hài hước" hoặc ["Horror","Kinh dị"])
 *  - limit?: number (mặc định 10)
 */
export default function GenreRowMovie({ titleName, genre, limit = 10 }) {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  // chuẩn hóa genre -> mảng key đã loại dấu/lowercase
  const genreKeys = useMemo(() => {
    const arr = Array.isArray(genre) ? genre : [genre];
    return arr.filter(Boolean).map(toKey);
  }, [genre]);

  const { data, loading, error, retry } = useMovies();

  useEffect(() => {
        const filtered = (data || []).filter((m) =>
          matchByGenres(m, genreKeys)
        );

        // map sang format cho MenuMovie
        const mapped = filtered.slice(0, limit).map((m) => ({
          id: m.id,
          poster: normalizePoster(m.poster),
          title: m?.title?.vi || m?.title?.en || "",
          subtitle: m?.title?.en || m?.title?.vi || "",
          badges: m?.badges || [],
        }));

        setMovies(mapped);
  }, [data, genreKeys, limit]);

  // Điều hướng qua trang all-movies và truyền full list (không cắt limit)
  const goAllMovies = () => navigate(moviesUrl({ genre }));

  const goDetail = (id) => navigate(`/movie/${id}`);

  if (loading || error) return <MovieLoadStatus loading={loading} error={error} retry={retry} />;

  return (
    <div className="home-section bg-[#192026] text-white px-6 py-10 w-full max-w-[100vw] overflow-x-hidden">
      <div className="flex gap-4 mb-6">
        <h2 className="text-2xl font-bold">
          {titleName ||
            (Array.isArray(genre) ? genre.join(", ") : genre) ||
            "Danh sách"}
        </h2>
        <ButtonHover onClick={goAllMovies} />
      </div>

      <MenuMovie movies={movies} onMovieClick={goDetail} />
    </div>
  );
}
