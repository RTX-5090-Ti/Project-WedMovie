import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuMovie from "./MenuMovie";
import ButtonHover from "../ButtonHover";

const API = "http://localhost:5000";

// Chuẩn hóa path ảnh
function normalizePoster(src) {
  if (!src) return "/images/default-poster.jpg";
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

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const res = await fetch(`${API}/movies`);
        const data = await res.json();

        // lấy các phim khớp thể loại
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

        if (!ignore) setMovies(mapped);
      } catch (e) {
        console.error("Fetch movies failed:", e);
        if (!ignore) setMovies([]);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [genreKeys, limit]);

  // Điều hướng qua trang all-movies và truyền full list (không cắt limit)
  const goAllMovies = async () => {
    try {
      const res = await fetch(`${API}/movies`);
      const data = await res.json();
      const filteredFull = (data || [])
        .filter((m) => matchByGenres(m, genreKeys))
        .map((m) => ({
          id: m.id,
          poster: normalizePoster(m.poster),
          title: m?.title?.vi || m?.title?.en || "",
          subtitle: m?.title?.en || m?.title?.vi || "",
          badges: m?.badges || [],
        }));

      navigate("/all-movies", {
        state: {
          title:
            titleName ||
            `Danh sách: ${Array.isArray(genre) ? genre.join(", ") : genre}`,
          movies: filteredFull,
        },
      });
    } catch (e) {
      console.error("Go all movies failed:", e);
      navigate("/all-movies", {
        state: {
          title:
            titleName ||
            `Danh sách: ${Array.isArray(genre) ? genre.join(", ") : genre}`,
          movies: [],
        },
      });
    }
  };

  const goDetail = (id) => navigate(`/movie/${id}`);

  return (
    <div className="bg-[#192026] text-white px-6 py-10 w-full max-w-[100vw] overflow-x-hidden">
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
