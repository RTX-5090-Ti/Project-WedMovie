const key = (email) => `fav_${email}`;

export function loadFavorites(email) {
  try {
    return JSON.parse(localStorage.getItem(key(email)) || "[]");
  } catch {
    return [];
  }
}

export function isFav(email, movieId) {
  if (!email) return false;
  const list = loadFavorites(email);
  return list.some((m) => String(m.id) === String(movieId));
}

export function toggleFav(email, movie) {
  if (!email) return [];
  const list = loadFavorites(email);
  const exists = list.some((m) => String(m.id) === String(movie.id));
  const next = exists
    ? list.filter((m) => String(m.id) !== String(movie.id))
    : [movie, ...list];
  localStorage.setItem(key(email), JSON.stringify(next));
  return { next, added: !exists };
}

export function clearFavorites(email) {
  localStorage.removeItem(key(email));
}
