import { loadLibrary, putLibrary, removeLibrary, clearLibrary } from "./userLibrary";
export const loadFavorites = (userId) => loadLibrary("favorites", userId);
export async function isFav(userId, movieId) {
  return (await loadFavorites(userId)).some((movie) => String(movie.id) === String(movieId));
}
export async function toggleFav(userId, movie) {
  const exists = await isFav(userId, movie.id);
  if (exists) await removeLibrary("favorites", userId, movie.id);
  else await putLibrary("favorites", userId, movie);
  return { added: !exists };
}
export const clearFavorites = (userId) => clearLibrary("favorites", userId);
