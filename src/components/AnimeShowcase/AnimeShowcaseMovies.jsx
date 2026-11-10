import { moviesUrl } from "../../lib/movieFilters";
import useMovies from "../../lib/useMovies";
import MovieLoadStatus from "../loading/MovieLoadStatus";
// src/components/AnimeShowcaseMovies.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimeShowcase from "./AnimeShowcase";


// Chuẩn hóa path "./public/..." -> "/..."
function normalize(src, fallback = "") {
  if (!src) return fallback;
  return src.startsWith("./public/") ? src.replace("./public", "") : src;
}

// Map 1 movie từ DB -> dữ liệu hero AnimeShowcase cần
function toHeroData(m) {
  return {
    bg: normalize(m.backdrop, "/images/default-backdrop.svg"),
    title: m?.title?.vi || m?.title?.en || "",
    subtitle: m?.title?.en || m?.title?.vi || "",
    score:
      typeof m?.rating === "number" ? m.rating.toFixed(1) : m?.rating || "",
    // tags1: đổi từ fake -> [year, duration, nation.vi]
    tags1: [
      m?.year ? String(m.year) : "",
      m?.duration ? String(m.duration) : "",
      m?.nation?.vi || "",
    ].filter(Boolean),
    genres: Array.isArray(m?.genres)
      ? m.genres.map((g) => g?.vi || g?.en).filter(Boolean)
      : [],
    // desc: lấy tiếng Việt
    desc: (m?.description && (m.description.vi || m.description.en)) || "",
  };
}

// Map 1 movie -> thumbnail nhỏ
function toThumb(m) {
  const small = normalize(m.smallPoster);
  return {
    id: m.id,
    title: m?.title?.vi || m?.title?.en || "",
    poster: small || normalize(m.poster, "/images/default-poster.svg"),
  };
}

export default function AnimeShowcaseMovies() {
  const [anime, setAnime] = useState([]);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const { data, loading, error, retry } = useMovies();

  useEffect(() => {
      const onlyAnime = (data || []).filter((m) =>
        m?.genres?.some(
          (g) =>
            (g?.vi || "").toLowerCase() === "anime" ||
            (g?.en || "").toLowerCase() === "anime"
        )
      );

      setAnime(onlyAnime);
      setIndex(0);
  }, [data]);

  const hero = useMemo(
    () => (anime[index] ? toHeroData(anime[index]) : null),
    [anime, index]
  );

  const thumbs = useMemo(() => anime.map(toThumb), [anime]);

  //  Khi bấm nút “Xem thêm”
  const goToAllMovies = () => navigate(moviesUrl({ genre: "Anime" }));

  // handler: click title -> đi chi tiết theo id hiện tại
  const goDetailFromTitle = () => {
    const m = anime[index];
    if (m?.id) navigate(`/movie/${m.id}`);
  };

  if (loading || error) return <MovieLoadStatus loading={loading} error={error} retry={retry} />;

  return (
    <div className="bg-[#192026] text-white mb-[60px] p-6 ">
      {hero && (
        <AnimeShowcase
          data={hero}
          thumbs={thumbs}
          activeId={anime[index]?.id}
          onSelect={(id) => {
            const i = anime.findIndex((x) => x.id === id);
            if (i >= 0) setIndex(i);
          }}
          onClickButton={goToAllMovies}
          onTitleClick={goDetailFromTitle}
        />
      )}
    </div>
  );
}
