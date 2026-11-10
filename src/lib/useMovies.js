import { useEffect, useMemo, useSyncExternalStore } from "react";
import { subscribeMovies, getMoviesSnapshot, loadMovies, retryMovies } from "./movieStore";
export default function useMovies(featuredOnly = false) {
  const state = useSyncExternalStore(subscribeMovies, getMoviesSnapshot);
  useEffect(() => { loadMovies(); }, []);
  const data = useMemo(() => featuredOnly ? state.data.filter((movie) => movie.featured) : state.data, [state.data, featuredOnly]);
  return { ...state, data, retry: retryMovies };
}
