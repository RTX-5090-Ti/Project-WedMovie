import { listRecords, request, recordPath } from "./api";
let snapshot = { data: [], loading: true, error: "" };
let loaded = false;
let pending = null;
const listeners = new Set();
const publish = (patch) => {
  snapshot = { ...snapshot, ...patch };
  listeners.forEach((listener) => listener());
};
export const subscribeMovies = (listener) => { listeners.add(listener); return () => listeners.delete(listener); };
export const getMoviesSnapshot = () => snapshot;
export function loadMovies(force = false) {
  if (pending) return pending;
  if (loaded && !force) return Promise.resolve(snapshot.data);
  publish({ loading: true, error: "" });
  pending = listRecords("movies").then((data) => {
    loaded = true;
    publish({ data, loading: false });
    return data;
  }).catch((error) => {
    publish({ loading: false, error: error.message });
    return null;
  }).finally(() => { pending = null; });
  return pending;
}
export const retryMovies = () => loadMovies(true);
export async function saveMovie(movie, isNew = false) {
  const saved = await request(isNew ? "/movies" : recordPath("movies", movie.id), { method: isNew ? "POST" : "PATCH", body: movie });
  if (pending) await pending;
  publish({ data: [saved, ...snapshot.data.filter((item) => String(item.id) !== String(saved.id))] });
  return saved;
}
export async function deleteMovie(id) {
  await request(recordPath("movies", id), { method: "DELETE" });
  if (pending) await pending;
  publish({ data: snapshot.data.filter((item) => String(item.id) !== String(id)) });
}
