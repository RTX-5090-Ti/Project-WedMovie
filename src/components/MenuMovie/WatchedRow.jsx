import MovieLoadStatus from "../loading/MovieLoadStatus";
import { movieImageFallback } from "../../lib/imageFallback";
// src/components/MenuMovie/WatchedRow.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadHistory, removeFromHistory } from "../../lib/history";
import { useAuth } from "../../auth/useAuth";



// helpers đọc tiêu đề
const getTitleVi = (x) => x?.title?.vi || x?.titleVi || x?.title_vi || "";
const getTitleEn = (x) => x?.title?.en || x?.titleEn || x?.title_en || "";
const withTitleObj = (m) => ({
  ...m,
  title: {
    vi: getTitleVi(m) || "",
    en: getTitleEn(m) || "",
  },
});

// poster fallback
const getPoster = (m) =>
  m?.poster || m?.backdrop || "/images/default-poster.svg";

export default function WatchedRow({ titleName = "Phim Đã Xem" }) {
  const { user, isGuest } = useAuth();
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [removing, setRemoving] = useState(null);
  useEffect(() => {
    let active = true;
    let version = 0;
    setList([]);
    if (isGuest || !user?.id) { setLoading(false); return; }
    const refresh = async () => {
      const requestVersion = ++version;
      setLoading(true); setError("");
      try { const movies = await loadHistory(user.id); if (active && requestVersion === version) setList(movies.map(withTitleObj)); }
      catch (err) { if (active && requestVersion === version) setError(err.message); }
      finally { if (active && requestVersion === version) setLoading(false); }
    };
    refresh();
    const onUpdate = (event) => { if (event.detail?.userId === user.id) refresh(); };
    window.addEventListener("history:updated", onUpdate);
    window.addEventListener("focus", refresh);
    return () => { active = false; window.removeEventListener("history:updated", onUpdate); window.removeEventListener("focus", refresh); };
  }, [user?.id, isGuest, attempt]);
  if (isGuest || !user?.id) return null;
  if (loading || error) return <MovieLoadStatus loading={loading} error={error} retry={() => setAttempt((value) => value + 1)} />;
  if (!list.length) return null;
  const handleRemove = async (event, id) => {
    event.stopPropagation();
    if (removing) return;
    setRemoving(id);
    try { await removeFromHistory(user.id, id); }
    catch (err) { setError(err.message); }
    finally { setRemoving(null); }
  };

  const goDetail = (m) => navigate(`/movie/${m.id}`);

  return (
    <section className="home-section watched-section px-6 mt-8 md:px-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-extrabold tracking-wide md:text-xl">
          {titleName}
        </h2>
      </div>

      <div className="history-scroll pb-4 overflow-x-auto">
        <div className="inline-flex gap-4">
          {list.map((m) => {
            const vi = getTitleVi(m);
            const en = getTitleEn(m);
            return (
              <div
                key={m.id}
                onClick={() => goDetail(m)}
                className="history-card relative w-[180px] md:w-[200px] shrink-0 cursor-pointer group"
                title={vi || en || ""}
              >
                <img onError={movieImageFallback}
                  src={getPoster(m)}
                  alt={vi || en || ""}
                  className="w-full aspect-[2/3] object-cover rounded-xl border border-white/10 transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />

                <button type="button" disabled={removing === m.id}
                  onClick={(e) => handleRemove(e, m.id)}
                  className="history-remove absolute flex items-center justify-center w-8 h-8 text-sm font-bold text-white transition-opacity duration-200 border rounded-full opacity-0 top-2 right-2 bg-black/60 border-white/20 group-hover:opacity-100 hover:bg-black/80"
                  aria-label="Xoá khỏi đã xem"
                  title="Xoá khỏi đã xem"
                >
                  ×
                </button>

                {/* VI trên, EN dưới */}
                <div className="mt-2 ">
                  <div className="text-[14px] font-semibold leading-snug line-clamp-2 text-center hover:text-[#f0d25b]">
                    {vi || "—"}
                  </div>
                  {en ? (
                    <div className="text-[12px] opacity-70 leading-snug line-clamp-2 text-center">
                      {en}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
