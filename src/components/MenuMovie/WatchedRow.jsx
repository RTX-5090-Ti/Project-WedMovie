// src/components/MenuMovie/WatchedRow.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadHistory, removeFromHistory } from "../../libary/history";
import { useAuth } from "../../auth/AuthContext";

const API = "http://localhost:5000";

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
  m?.poster || m?.backdrop || "/images/default-poster.jpg";

export default function WatchedRow({ titleName = "Phim Đã Xem" }) {
  const { user, isGuest } = useAuth();
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  // 1) load từ localStorage
  useEffect(() => {
    if (isGuest || !user?.email) {
      setList([]);
      return;
    }
    const raw = loadHistory(user.email) || [];
    setList(raw.map(withTitleObj));
  }, [user?.email, isGuest]);

  // 2) nghe sự kiện cập nhật lịch sử để refresh ngay
  useEffect(() => {
    if (!user?.email) return;
    const onUpdate = () => {
      const raw = loadHistory(user.email) || [];
      setList(raw.map(withTitleObj));
    };
    window.addEventListener("history:updated", onUpdate);
    return () => window.removeEventListener("history:updated", onUpdate);
  }, [user?.email]);

  // 3) hydrate: fetch bù những item thiếu VI/EN từ json-server
  useEffect(() => {
    if (!list.length) return;
    const need = list.filter((m) => !getTitleVi(m) || !getTitleEn(m));
    if (!need.length) return;

    let mounted = true;
    (async () => {
      try {
        const hydrated = await Promise.all(
          need.map(async (m) => {
            const r = await fetch(`${API}/movies/${encodeURIComponent(m.id)}`);
            if (!r.ok) return m;
            const full = await r.json();
            // gộp lại, ưu tiên field từ db.json
            return {
              ...m,
              title: {
                vi: full?.title?.vi || getTitleVi(m),
                en: full?.title?.en || getTitleEn(m),
              },
              poster: m.poster || full?.poster || full?.backdrop,
              backdrop: m.backdrop || full?.backdrop,
            };
          })
        );
        if (!mounted) return;
        // thay thế các item đã hydrate vào list
        setList((old) => {
          const map = new Map(old.map((x) => [String(x.id), x]));
          hydrated.forEach((h) => map.set(String(h.id), h));
          return Array.from(map.values());
        });
      } catch {
        console.log("Lỗi");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [list]);

  if (isGuest || !user?.email) return null;
  if (!list.length) return null;

  const handleRemove = (e, id) => {
    e.stopPropagation();
    setList(removeFromHistory(user.email, id).map(withTitleObj));
  };

  const goDetail = (m) => navigate(`/movie/${m.id}`);

  return (
    <section className="px-6 mt-8 md:px-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-extrabold tracking-wide md:text-xl">
          {titleName}
        </h2>
      </div>

      <div className="pb-4 overflow-x-auto">
        <div className="inline-flex gap-4">
          {list.map((m) => {
            const vi = getTitleVi(m);
            const en = getTitleEn(m);
            return (
              <div
                key={m.id}
                onClick={() => goDetail(m)}
                className="relative w-[180px] md:w-[200px] shrink-0 cursor-pointer group"
                title={vi || en || ""}
              >
                <img
                  src={getPoster(m)}
                  alt={vi || en || ""}
                  className="w-full aspect-[2/3] object-cover rounded-xl border border-white/10 transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />

                <div
                  onClick={(e) => handleRemove(e, m.id)}
                  className="absolute flex items-center justify-center w-8 h-8 text-sm font-bold text-white transition-opacity duration-200 border rounded-full opacity-0 top-2 right-2 bg-black/60 border-white/20 group-hover:opacity-100 hover:bg-black/80"
                  aria-label="Xoá khỏi đã xem"
                  title="Xoá khỏi đã xem"
                >
                  ×
                </div>

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
