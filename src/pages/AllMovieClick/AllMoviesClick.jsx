import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import HeaderPage from "../../components/HeaderHomePage/HeaderPage";
import ShowNewMovie from "../../components/ShowNewMovie";
import MovieLoadStatus from "../../components/loading/MovieLoadStatus";
import useMovies from "../../lib/useMovies";
import { filterMovies } from "../../lib/movieFilters";
import { loadFavorites } from "../../lib/favorites";
import { useAuth } from "../../auth/useAuth";
import { useTranslation } from "react-i18next";
import { movieFilterLabel } from "../../lib/movieLanguage";
export default function AllMoviesClick() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || "vi";
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const catalog = useMovies();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const isFavorites = params.get("type") === "favorites";
  const typeTitles = { hot: "nav.hot", single: "nav.single", series: "nav.series", new: "home.new", favorites: "catalog.favorites" };
  const genreLabels = catalog.data.flatMap((movie) => movie.genres || []);
  const countryLabels = catalog.data.flatMap((movie) => movie.countries?.length ? movie.countries : Array.isArray(movie.nation) ? movie.nation : [movie.nation]);
  const typeTitle = typeTitles[params.get("type")];
  const title = typeTitle ? t(typeTitle)
    : params.has("genre") ? t("catalog.genre", { genres: params.getAll("genre").map((genre) => movieFilterLabel(genre, genreLabels, language)).join(", ") })
    : params.has("country") ? t("catalog.country", { country: movieFilterLabel(params.get("country"), countryLabels, language) })
    : params.get("q")?.trim() ? t("catalog.search", { query: params.get("q").trim() })
    : t("catalog.all");
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
    {status.loading || status.error ? <div className="mt-28"><MovieLoadStatus {...status} /></div> : isFavorites && !user ? <p className="p-8 mt-28 text-white">{t("catalog.loginRequired")}</p> : <>
      <ShowNewMovie title={title} movies={movies} onTitleClick={(id) => navigate(`/movie/${id}`)} />
      {!movies.length && <p className="p-8 text-center text-white/70">{t("catalog.empty")}</p>}
    </>}
  </>;
}
