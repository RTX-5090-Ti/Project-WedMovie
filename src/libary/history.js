// src/lib/history.js
const key = (email) => `history_${email}`;

export function loadHistory(email) {
  try {
    return JSON.parse(localStorage.getItem(key(email)) || "[]");
  } catch {
    return [];
  }
}

export function pushHistory(email, movie) {
  if (!email || !movie?.id) return [];
  const list = loadHistory(email);
  const next = [
    movie,
    ...list.filter((x) => String(x.id) !== String(movie.id)),
  ].slice(0, 200);
  localStorage.setItem(key(email), JSON.stringify(next));
  // thông báo cho UI trong cùng tab
  window.dispatchEvent(
    new CustomEvent("history:updated", { detail: { email, id: movie.id } })
  );
  return next;
}

export function removeFromHistory(email, movieId) {
  if (!email) return [];
  const list = loadHistory(email);
  const next = list.filter((x) => String(x.id) !== String(movieId));
  localStorage.setItem(key(email), JSON.stringify(next));
  window.dispatchEvent(
    new CustomEvent("history:updated", {
      detail: { email, id: movieId, removed: true },
    })
  );
  return next;
}

export function clearHistory(email) {
  if (!email) return;
  localStorage.removeItem(key(email));
  window.dispatchEvent(
    new CustomEvent("history:updated", { detail: { email, cleared: true } })
  );
}
