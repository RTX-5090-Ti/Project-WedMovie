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
