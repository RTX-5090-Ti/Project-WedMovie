import { listRecords, recordPath, request } from "./api";

export async function libraryRecords(collection, userId) {
  return userId ? listRecords(collection, { userId }) : [];
}
export async function loadLibrary(collection, userId) {
  const rows = await libraryRecords(collection, userId);
  return rows.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).map((row) => row.movie);
}
export async function putLibrary(collection, userId, movie, updatedAt = Date.now()) {
  if (!userId || !movie?.id) throw new Error("Không tìm thấy tài khoản hoặc phim.");
  const id = `${userId}:${movie.id}`;
  const path = recordPath(collection, id);
  let exists = true;
  try { await request(path); } catch (error) { if (error.status !== 404) throw error; exists = false; }
  await request(exists ? path : `/${collection}`, { method: exists ? "PATCH" : "POST", body: { id, userId, movieId: String(movie.id), movie, updatedAt } });
  window.dispatchEvent(new CustomEvent(`${collection}:updated`, { detail: { userId } }));
}
export async function removeLibrary(collection, userId, movieId) {
  try { await request(recordPath(collection, `${userId}:${movieId}`), { method: "DELETE" }); }
  catch (error) { if (error.status !== 404) throw error; }
  window.dispatchEvent(new CustomEvent(`${collection}:updated`, { detail: { userId } }));
}
export async function clearLibrary(collection, userId) {
  const rows = await libraryRecords(collection, userId);
  await Promise.all(rows.map((row) => request(recordPath(collection, row.id), { method: "DELETE" })));
  window.dispatchEvent(new CustomEvent(`${collection}:updated`, { detail: { userId } }));
}

// Import only missing rows. Remove legacy data only after all writes succeed.
export async function migrateLibrary(user, legacyEmail = user.email) {
  for (const [prefix, collection] of [["fav", "favorites"], ["history", "history"]]) {
    const key = `${prefix}_${legacyEmail}`;
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    const old = JSON.parse(raw);
    if (!Array.isArray(old)) throw new Error("Dữ liệu cũ không hợp lệ; bản cũ vẫn được giữ lại.");
    const rows = await libraryRecords(collection, user.id);
    const ids = new Set(rows.map((row) => String(row.movieId)));
    for (const [index, movie] of old.slice(0, collection === "history" ? 200 : old.length).entries()) {
      if (movie?.id && !ids.has(String(movie.id))) {
        await putLibrary(collection, user.id, movie, movie.watchedAt || Date.now() - index);
        ids.add(String(movie.id));
      }
    }
    localStorage.removeItem(key);
  }
}
