import { newestMovieFirst } from "./movieSort";
export const textKey = (value = "") => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d").toLowerCase().trim();
export const hasGenre = (movie, genre) => (movie.genres || []).some((item) => [item.vi, item.en].some((value) => textKey(value) === textKey(genre)));
export function moviesUrl(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    (Array.isArray(value) ? value : [value]).forEach((entry) => { if (entry) params.append(key, entry); });
  });
  return `/all-movies?${params}`;
}
export function filterMovies(movies, params) {
  const type = params.get("type"), genres = params.getAll("genre"), country = params.get("country");
  const query = textKey(params.get("q") || "");
  return movies.filter((movie) => {
    if (type === "hot" && !movie.featured) return false;
    if (type === "single" && movie.isSeries) return false;
    if (type === "series" && (!movie.isSeries || hasGenre(movie, "Anime"))) return false;
    if (type === "new" && hasGenre(movie, "Anime")) return false;
    if (genres.length && !genres.some((genre) => hasGenre(movie, genre))) return false;
    const nations = movie.countries || (Array.isArray(movie.nation) ? movie.nation : [movie.nation]);
    if (country && !nations.some((nation) => nation && [nation.vi, nation.en].some((value) => textKey(value) === textKey(country)))) return false;
    return !query || query.split(/\s+/).every((word) => textKey(`${movie.title?.vi || ""} ${movie.title?.en || ""}`).includes(word));
  }).sort(newestMovieFirst);
}
