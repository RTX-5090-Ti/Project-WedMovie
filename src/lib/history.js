import { loadLibrary, libraryRecords, putLibrary, removeLibrary, clearLibrary } from "./userLibrary";
export const loadHistory = (userId) => loadLibrary("history", userId);
export async function pushHistory(userId, movie) {
  await putLibrary("history", userId, movie);
  const rows = await libraryRecords("history", userId);
  await Promise.all(rows.sort((a, b) => b.updatedAt - a.updatedAt).slice(200).map((row) => removeLibrary("history", userId, row.movieId)));
}
export const removeFromHistory = (userId, movieId) => removeLibrary("history", userId, movieId);
export const clearHistory = (userId) => clearLibrary("history", userId);
