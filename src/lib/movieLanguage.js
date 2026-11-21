export function movieText(value, language = "vi") {
  if (typeof value === "string") return value;
  const lang = language.startsWith("en") ? "en" : "vi";
  return value?.[lang]?.trim() || value?.[lang === "vi" ? "en" : "vi"]?.trim() || "";
}

export function movieTitles(value, language = "vi") {
  const title = movieText(value, language);
  const other = movieText(value, language.startsWith("en") ? "vi" : "en");
  return { title, subtitle: title.toLowerCase() === other.toLowerCase() ? "" : other };
}

export function movieBadge(text, t) {
  return text === "P.Đề" ? t("movie.subtitles") : text === "T.Minh" ? t("movie.dubbed") : text;
}

// Translate the visible filter label without changing its URL or matching value.
export function movieFilterLabel(value, entries, language) {
  const normalize = (text = "") => text.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
  const entry = entries.find((item) => item && [item.vi, item.en].some((text) => text && normalize(text) === normalize(value)));
  return entry ? movieText(entry, language) : value;
}
