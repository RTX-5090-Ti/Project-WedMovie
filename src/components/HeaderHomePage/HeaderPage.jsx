import "../LanguageSelect/LanguageSelect.css";
import { movieImageFallback } from "../../lib/imageFallback";
import useMovies from "../../lib/useMovies";
import MovieLoadStatus from "../loading/MovieLoadStatus";
import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./HeaderHomePage.css";
import UserMenu from "../dropdownAvatar/DropdownAvatar";
import { useAuth } from "../../auth/useAuth";
import { moviesUrl } from "../../lib/movieFilters";


// Chuẩn hoá chữ: bỏ dấu + lowercase
function normalizeText(str = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function normalizePoster(src) {
  if (!src) return "/images/default-poster.svg";
  return src.startsWith("./public/") ? src.replace("./public", "") : src;
}

export default function HeaderPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const headerRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("English");
  const [openMenu, setOpenMenu] = useState(null);
  const genreRef = useRef(null);
  const countryRef = useRef(null);
  const { isGuest, user } = useAuth();

  // SEARCH
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const { data: allMovies, loading, error, retry } = useMovies();
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setMobileMenu(false);
    setMobileSearch(false);
    setOpenMenu(null);
    setIsOpen(false);
    setShowPanel(false);
  }, [location.key]);

  useEffect(() => {
    const close = (event) => {
      if (event.type === "keydown" && event.key !== "Escape") return;
      if (event.type === "pointerdown" && headerRef.current?.contains(event.target)) return;
      setMobileMenu(false);
      setMobileSearch(false);
      setOpenMenu(null);
      setIsOpen(false);
      setShowPanel(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  useEffect(() => {
    if (mobileSearch) inputRef.current?.focus();
  }, [mobileSearch]);

  // Chuẩn hóa tên để so sánh (bỏ dấu + thường hóa)
  const n = (s) => normalizeText(s || "");

  // chờ user dừng nhập 400ms mới search
  useEffect(() => {
    const t = setTimeout(() => {
      const raw = query.trim();
      if (raw.length < 2) {
        setResults([]);
        setShowPanel(false);
        return;
      }

      const searchText = normalizeText(raw);
      const tokens = searchText.split(/\s+/).filter(Boolean);

      // Lọc phim có chứa tất cả token trong title.vi hoặc title.en
      const matched = allMovies.filter((m) => {
        const vi = normalizeText(m?.title?.vi || "");
        const en = normalizeText(m?.title?.en || "");
        return tokens.every((tk) => vi.includes(tk) || en.includes(tk));
      });

      const mapped = matched.slice(0, 8).map((m) => ({
        id: m.id,
        poster: normalizePoster(m.smallPoster || m.poster),
        titleVi: m?.title?.vi || "",
        titleEn: m?.title?.en || "",
        tags: [
          m?.badges?.[0]?.text || "",
          m?.year ? String(m.year) : "",
          m?.duration || "",
        ].filter(Boolean),
      }));

      setResults(mapped);
      setShowPanel(true);
    }, 400);
    return () => clearTimeout(t);
  }, [query, allMovies]);

  // Đóng panel hoặc menu khi click ra ngoài
  useEffect(() => {
    const handleClick = (e) => {
      if (
        genreRef.current &&
        !genreRef.current.contains(e.target) &&
        countryRef.current &&
        !countryRef.current.contains(e.target)
      ) {
        setOpenMenu(null);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowPanel(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Khi chọn 1 phim
  const onPickMovie = (id) => {
    setShowPanel(false);
    setQuery("");
    setResults([]);
    navigate(`/movie/${id}`);
  };

  // UI PHẦN TRÊN
  const toggleMenu = () => setIsOpen((v) => !v);
  const selectOption = (option) => {
    setSelected(option);
    setIsOpen(false);
  };


  // Lấy danh sách thể loại động từ allMovies (hiển thị vi nếu có)
  const genres = useMemo(() => {
    const map = new Map();

    allMovies.forEach((m) => {
      (m?.genres || []).forEach((g) => {
        const label = g?.vi?.trim() || g?.en?.trim() || "";
        if (!label) return;

        const key = n(label); // normalizeText
        if (!map.has(key)) {
          map.set(key, label);
        }
      });
    });

    return Array.from(map.values());
  }, [allMovies]);


  // Lấy danh sách quốc gia tự động từ allMovies
  const countries = useMemo(() => {
    const map = new Map(); // key = normalized label, value = display label

    allMovies.forEach((m) => {
      // một số file có 'countries', một số có 'nation' — kiểm tra cả 2
      const list =
        Array.isArray(m?.countries) && m.countries.length
          ? m.countries
          : Array.isArray(m?.nation) && m.nation.length
          ? m.nation
          : m?.nation &&
            typeof m.nation === "object" &&
            (m.nation.vi || m.nation.en)
          ? [m.nation]
          : [];

      (list || []).forEach((c) => {
        const label = (c?.vi && c.vi.trim()) || (c?.en && c.en.trim()) || "";
        if (!label) return;

        const key = n(label);
        if (!map.has(key)) {
          map.set(key, label);
        }
      });
    });

    return Array.from(map.values());
  }, [allMovies]);

  const goHot = () => navigate(moviesUrl({ type: "hot" }));
  const goSingle = () => navigate(moviesUrl({ type: "single" }));
  const goSeries = () => navigate(moviesUrl({ type: "series" }));
  const goByCountry = (country) => { navigate(moviesUrl({ country })); setOpenMenu(null); };
  const goByGenre = (genre) => { navigate(moviesUrl({ genre })); setOpenMenu(null); };

  return (
    <header ref={headerRef} className={`site-header ${mobileMenu ? "menu-open" : ""}`}>
      {/* Logo + Search */}
      <div className="header-brand-search">
        <img onError={movieImageFallback}
          role="link" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") navigate("/home"); }}
          className="site-logo transition-transform cursor-pointer hover:scale-105"
          src="/images/logo-header/Logo-0.75.png"
          alt="logo"
          onClick={() => navigate("/home")}
        />

        {/* Ô tìm kiếm */}
        <div ref={searchRef} className={`header-search ${mobileSearch ? "is-open" : ""}`}>
          {(loading || error) && (
            <div className="absolute left-0 right-0 top-full z-50">
              <MovieLoadStatus loading={loading} error={error} retry={retry} />
            </div>
          )}
          <div className="inline-flex items-center w-full gap-3 search">
            <img onError={movieImageFallback} src="/images/logo-header/Icon.png" alt="search" />
            <input
              ref={inputRef}
              aria-label="Tìm kiếm phim"
              onKeyDown={(event) => {
                if (event.key === "Enter" && query.trim()) navigate(moviesUrl({ q: query.trim() }));
              }}
              className="w-full border-none outline-none"
              type="text"
              placeholder="Tìm kiếm phim"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim().length >= 2 && setShowPanel(true)}
            />
            {query && (
              <div
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setShowPanel(false);
                }}
                className="flex items-center justify-center w-4 h-4 p-2 border rounded-full cursor-pointer text-white/60 hover:text-white"
              >
                ×
              </div>
            )}
          </div>

          {/* Panel kết quả */}
          {showPanel && (
            <div className="absolute left-0 right-0 mt-2 rounded-xl bg-[rgba(0,0,0,0.8)] ring-1 ring-white/10 backdrop-blur p-4 max-h-[420px] overflow-auto">
              {results.length === 0 ? (
                <div className="py-3 text-sm text-center text-white/50">
                  Không tìm thấy phim phù hợp.
                </div>
              ) : (
                <ul className="space-y-3">
                  {results.map((m) => (
                    <li
                      key={m.id}
                      onClick={() => onPickMovie(m.id)}
                      className="grid grid-cols-[48px_1fr] gap-3 items-center cursor-pointer rounded-lg hover:bg-white/5 p-1"
                    >
                      <img onError={movieImageFallback}
                        src={m.poster}
                        alt={m.titleVi || m.titleEn}
                        className="object-cover w-12 h-16 rounded-md ring-1 ring-black/30"
                      />
                      <div>
                        <div className="font-semibold leading-tight text-[15px]">
                          {m.titleVi || m.titleEn}
                        </div>
                        <div className="text-sm leading-tight text-white/60">
                          {m.titleEn || m.titleVi}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-white/70">
                          {m.tags.map((t, i) => (
                            <span key={i} className="flex items-center gap-2">
                              {i !== 0 && (
                                <span className="inline-block w-1 h-1 rounded-full bg-white/40" />
                              )}
                              <span>{t}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Menu giữa */}
      <nav id="header-navigation" aria-label="Điều hướng chính" className="header-navigation">
        <button type="button"
          onClick={goHot}
          className="hover:text-[#f0d25b] transition-all cursor-pointer"
        >
          Phim hot
        </button>
        <button type="button"
          onClick={goSingle}
          className="hover:text-[#f0d25b] transition-all cursor-pointer"
        >
          Phim lẻ
        </button>
        <button type="button"
          onClick={goSeries}
          className="hover:text-[#f0d25b] transition-all cursor-pointer"
        >
          Phim bộ
        </button>

        {/* Quốc gia */}
        <div
          ref={countryRef}
          className="inline-flex items-center gap-[5px] relative"
        >
          <button type="button"
            className="header-filter-control cursor-pointer"
            onClick={() =>
              setOpenMenu(openMenu === "country" ? null : "country")
            }
          >
            Quốc gia
          </button>
          <img onError={movieImageFallback}
            onClick={() =>
              setOpenMenu(openMenu === "country" ? null : "country")
            }
            className="w-[12px] cursor-pointer"
            src="/images/logo-header/downArown.png"
            alt="arrow"
          />
          {openMenu === "country" && (
            <div className="absolute top-[30px] right-0 bg-[rgba(0,0,0,0.7)] w-[380px] grid grid-cols-3 gap-[10px] p-3 text-center rounded-[8px]">
              {countries.map((country, i) => (
                <button type="button"
                  onClick={() => goByCountry(country)}
                  key={i}
                  className="hover:text-[#f0d25b] transition-all cursor-pointer"
                >
                  {country}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Thể loại */}
        <div
          ref={genreRef}
          className="inline-flex items-center gap-[5px] relative"
        >
          <button type="button"
            className="header-filter-control cursor-pointer"
            onClick={() => setOpenMenu(openMenu === "genre" ? null : "genre")}
          >
            Thể loại
          </button>
          <img onError={movieImageFallback}
            onClick={() => setOpenMenu(openMenu === "genre" ? null : "genre")}
            className="w-[12px] cursor-pointer"
            src="/images/logo-header/downArown.png"
            alt="arrow"
          />
          {openMenu === "genre" && (
            <div className="absolute top-[30px] right-0 bg-[rgba(0,0,0,0.7)] w-[380px] grid grid-cols-3 gap-[10px] p-3 text-center rounded-[8px]">
              {genres.map((g, i) => (
                <button type="button"
                  onClick={() => goByGenre(g)}
                  key={i}
                  className="hover:text-[#f0d25b] transition-all cursor-pointer"
                >
                  {g}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="language-select">
          <button type="button" aria-expanded={isOpen}
            className="flex items-center justify-between language-select__selected"
            onClick={toggleMenu}
          >
            <span>{selected}</span>
            <img onError={movieImageFallback}
              className="w-[20px]"
              src="/images/logo-header/flight_4919659.png"
              alt="world"
            />
          </button>
          {isOpen && (
            <ul className="language-select__options">
              <li><button type="button" onClick={() => selectOption("English")}>English</button></li>
              <li><button type="button" onClick={() => selectOption("Vietnamese")}>Vietnamese</button></li>
            </ul>
          )}
        </div>
        

      </nav>

      {/* Language + Avatar */}
      <div className="header-actions">
        <button type="button" className="header-mobile-button" aria-label="Tìm kiếm" aria-expanded={mobileSearch}
          onClick={() => { setMobileSearch(!mobileSearch); setMobileMenu(false); }}>
          {mobileSearch ? "✕" : <img src="/images/logo-header/Icon.png" alt="" />}
        </button>
        {isGuest || !user ? (
          <button type="button"
            onClick={() => navigate("/login")}
            className="px-4 py-3 text-sm font-medium text-white transition border rounded-full cursor-pointer border-white/10 hover:bg-white/10"
          >
            Đăng nhập
          </button>
        ) : (
          <UserMenu user={user.name} />
        )}
        <button type="button" className="header-mobile-button" aria-label={mobileMenu ? "Đóng menu" : "Mở menu"}
          aria-expanded={mobileMenu} aria-controls="header-navigation"
          onClick={() => { setMobileMenu(!mobileMenu); setMobileSearch(false); }}>
          {mobileMenu ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}
