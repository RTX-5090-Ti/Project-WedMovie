import { backdropFallback } from "../../lib/imageFallback";
import useMovies from "../../lib/useMovies";
import MovieLoadStatus from "../loading/MovieLoadStatus";
// src/components/Content.Movie.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";


// Chuẩn hóa đường dẫn ảnh: "./public/..." -> "/..."
function normalizeSrc(src) {
  if (!src) return "";
  return src.startsWith("./public/") ? src.replace("./public", "") : src;
}

// Shuffle Fisher–Yates
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ContentMovie() {
  const [slides, setSlides] = useState([]); // 5 phim featured ngẫu nhiên
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const lang = "vi";
  const timerRef = useRef(null);
  const [timerReset, setTimerReset] = useState(0);

  // Lấy featured -> chọn ngẫu nhiên 5
  const { data, loading, error, retry } = useMovies(true);

  useEffect(() => {
      const picked = shuffle(data).slice(0, 5);
      setSlides(picked);
      setIndex(0);
  }, [data]);

  // Tự chạy 7s đổi slide
  useEffect(() => {
    if (!slides.length) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timerRef.current);
  }, [slides.length, timerReset]);

  // Cho phép click đổi thủ công (reset timer)
  function goTo(i) {
    clearInterval(timerRef.current);
    setIndex(i);
    setTimerReset((value) => value + 1);
  }

  const current = slides[index] || null;

  const backdrop = useMemo(
    () => normalizeSrc(current?.backdrop) || "/images/default-backdrop.svg",
    [current]
  );

  const title =
    (current?.title && (current.title[lang] || current.title.en)) || "—";

  const year = current?.year ?? "—";
  const rating =
    typeof current?.rating === "number"
      ? current.rating.toFixed(1)
      : current?.rating || "—";

  const genres = Array.isArray(current?.genres)
    ? current.genres.filter(
        (g) =>
          !["Theaters", "Chiếu rạp"].includes(g?.en) &&
          !["Theaters", "Chiếu rạp"].includes(g?.vi)
      )
    : [];

  const desc =
    current?.description?.[lang] ||
    current?.description?.en ||
    "No description.";

  if (loading || error) return <MovieLoadStatus loading={loading} error={error} retry={retry} />;

  return (
    <div className="home-hero relative w-full h-[680px] md:h-[720px] overflow-hidden rounded-none md:rounded-2xl mb-8">
      {/* Backdrop + transition */}
      <AnimatePresence mode="wait">
        <Motion.img
          key={backdrop + index}
          src={backdrop}
          alt={title}
          onError={backdropFallback}
          className="absolute inset-0 object-cover w-full h-full"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.0)_40%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/65 via-black/30 to-transparent" />

      {/* Content */}
      <div className="hero-copy absolute z-10 bottom-10 md:bottom-16 left-6 md:left-12 right-6 md:right-10">
        {/* Title + lang toggle */}
        <div className="flex items-center gap-4 mb-3">
          <AnimatePresence mode="wait">
            <Motion.h1
              onClick={() => current?.id && navigate(`/movie/${current.id}`)}
              key={title + index}
              className="mb-5 text-2xl font-extrabold cursor-pointer md:text-5xl drop-shadow-md hover:text-[#f0d25b]"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {title}
            </Motion.h1>
          </AnimatePresence>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 mb-3 text-xs md:text-sm">
          <span className="py-[2px] px-2 border border-[#f0d25b] rounded text-[#f0d25b]">
            IMDb <span className="font-medium text-white">{rating}</span>
          </span>
          <span className="py-[2px] px-2 border border-white/80 rounded">
            {year}
          </span>
          <div className="flex-wrap hidden gap-2 ml-2 md:flex">
            {genres.map((g, i) => (
              <span
                key={`${g.en}-${i}`}
                className="py-[4px] px-[10px] rounded bg-white/10 border border-white/25 text-xs"
              >
                {g[lang] || g.en}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <AnimatePresence mode="wait">
          <Motion.p
            key={desc + index}
            className="hero-description max-w-[700px] leading-relaxed text-sm md:text-base text-white/90  mb-5 text-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {desc}
          </Motion.p>
        </AnimatePresence>

        {/* Actions */}
        <div className="hero-actions flex items-center justify-between gap-4">
          <div
            onClick={() => current?.id && navigate(`/movie/${current.id}`)}
            className="flex items-center gap-3 px-5 py-3 font-semibold text-white transition rounded-full bg-[rgba(255,255,255,0.3)] cursor-pointer hover:opacity-90"
          >
            <img
              className="w-[34px] h-[34px]"
              src="/images/logo-header/play.gif"
              alt="play"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            Xem ngay
          </div>

          {/* Dots indicator (clickable) */}
          
          <div className="hero-thumbnails flex items-center gap-2 ml-2">
            {slides.map((m, i) => (
              <button type="button" aria-label={`Slide ${i + 1}`} aria-pressed={i === index}
                key={i}
                onClick={() => goTo(i)}
                className={`relative w-[90px] h-[50px] rounded overflow-hidden cursor-pointer transition-all duration-300 ${
                  i === index
                    ? "ring-2 ring-white scale-110"
                    : "opacity-60 hover:opacity-90"
                }`}
              >
                <img
                  src={
                    (m.backdrop && m.backdrop.replace("./public", "")) ||
                    "/images/default-backdrop.svg"
                  }
                  alt={m.title?.vi || m.title?.en}
                  className="object-cover w-full h-full"
                  onError={backdropFallback}
                />
                {/* overlay tối nhẹ khi chưa active */}
                {i !== index && (
                  <div className="absolute inset-0 bg-black/30"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
