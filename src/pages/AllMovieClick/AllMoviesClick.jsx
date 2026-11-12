import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import HeaderPage from "../../components/HeaderHomePage/HeaderPage";
import ShowNewMovie from "../../components/ShowNewMovie";
import MovieLoadStatus from "../../components/loading/MovieLoadStatus";
import useMovies from "../../lib/useMovies";
import { filterMovies } from "../../lib/movieFilters";
import { loadFavorites } from "../../lib/favorites";
import { useAuth } from "../../auth/useAuth";
export default function AllMoviesClick() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const catalog = useMovies();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const isFavorites = params.get("type") === "favorites";
  const typeTitles = { hot: "Phim hot", single: "Phim lẻ", series: "Phim bộ", new: "Phim điện ảnh mới toanh", favorites: "Phim yêu thích" };
  const title = typeTitles[params.get("type")] || (params.has("genre") ? `Thể loại: ${params.getAll("genre").join(", ")}` : params.has("country") ? `Phim ${params.get("country")}` : "Tất cả phim");
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    return () => { document.title = previousTitle; };
  }, [title]);
  useEffect(() => {
    let active = true;
    setFavorites([]); setError(""); setLoading(true);
    if (!isFavorites || !user?.id) { setLoading(false); return; }
    let version = 0;
    const refresh = () => {
      const current = ++version;
      setLoading(true); setError("");
      loadFavorites(user.id).then((list) => { if (active && current === version) setFavorites(list); }).catch((err) => { if (active && current === version) setError(err.message); }).finally(() => { if (active && current === version) setLoading(false); });
    };
    const onUpdate = (event) => { if (event.detail?.userId === user.id) refresh(); };
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("favorites:updated", onUpdate);
    return () => { active = false; window.removeEventListener("focus", refresh); window.removeEventListener("favorites:updated", onUpdate); };
  }, [isFavorites, user?.id, attempt]);
  const movies = isFavorites ? favorites.map((saved) => catalog.data.find((movie) => String(movie.id) === String(saved.id)) || saved) : filterMovies(catalog.data, params);
  const status = isFavorites ? { loading, error, retry: () => setAttempt((value) => value + 1) } : catalog;
  return <><HeaderPage />
    {status.loading || status.error ? <div className="mt-28"><MovieLoadStatus {...status} /></div> : isFavorites && !user ? <p className="p-8 mt-28 text-white">Vui lòng đăng nhập để xem phim yêu thích.</p> : <>
      <ShowNewMovie title={title} movies={movies} onTitleClick={(id) => navigate(`/movie/${id}`)} />
      {!movies.length && <p className="p-8 text-center text-white/70">Chưa có phim trong danh sách này.</p>}
    </>}
  </>;
}
