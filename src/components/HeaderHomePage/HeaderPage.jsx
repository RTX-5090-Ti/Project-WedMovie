import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./HeaderHomePage.css";
import UserMenu from "../dropdownAvatar/DropdownAvatar";
import { useAuth } from "../../auth/AuthContext";

const API = "http://localhost:5000";

// Chuẩn hoá chữ: bỏ dấu + lowercase
function normalizeText(str = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function normalizePoster(src) {
  if (!src) return "/images/default-poster.jpg";
  return src.startsWith("./public/") ? src.replace("./public", "") : src;
}

export default function HeaderPage() {
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
  const [allMovies, setAllMovies] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Chuẩn hóa tên để so sánh (bỏ dấu + thường hóa)
  const n = (s) => normalizeText(s || "");

  // Load toàn bộ phim 1 lần
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/movies`);
        const data = await res.json();
        setAllMovies(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Fetch movies failed:", e);
      }
    })();
  }, []);

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
        poster: normalizePoster(m.smallPoster) || normalizePoster(m.poster),
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

  // const genres = [
  //   "Hình sự",
  //   "Hành động",
  //   "Chiến tranh",
  //   "Khoa học",
  //   "Chiếu rạp",
  //   "Kinh dị",
  //   "Hài hước",
  //   "Phiêu lưu",
  //   "Lãng mạn",
  //   "Gia đình",
  //   "Tâm lý",
  //   "Bí ẩn",
  //   "Hoạt hình",
  //   "Anime",
  //   "Hoàng cung",
  //   "Cổ trang",
  //   "Tình cảm",
  // ];

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

  // const countries = [
  //   "Mỹ",
  //   "Hàn Quốc",
  //   "Nhật Bản",
  //   "Anh",
  //   "Pháp",
  //   "Đức",
  //   "Thái Lan",
  //   "Đài Loan",
  //   "Trung Quốc",
  // ];

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

  // Chuẩn hoá dữ liệu để ShowNewMovie render đúng
  const mapToCard = (m) => ({
    id: m.id,
    poster: normalizePoster(m.smallPoster) || normalizePoster(m.poster),
    title: m?.title?.vi || m?.title?.en || "",
    subtitle: m?.title?.en || m?.title?.vi || "",
    badges: Array.isArray(m?.badges) ? m.badges : [],
  });

  // Điều hướng sang /all-movies với dataset đã lọc
  const goAllWith = (title, list) => {
    navigate("/all-movies", {
      state: {
        title,
        movies: list.map(mapToCard), // truyền đúng format ShowNewMovie
      },
    });
  };

  const goHot = () => {
    const list = allMovies
      .filter((m) => m?.featured === true)
      .slice() // copy ra mảng mới, tránh mutate allMovies
      .sort((a, b) => Number(b.id) - Number(a.id)); // id lớn (phim mới) nằm trước

    goAllWith("Phim hot", list);
  };

  const goSingle = () => {
    const list = allMovies
      .filter((m) => m?.isSeries === false)
      .slice()
      .sort((a, b) => Number(b.id) - Number(a.id)); //  sắp id giảm dần (phim mới nhất trước)

    goAllWith("Phim lẻ", list);
  };

  const goSeries = () => {
    const list = allMovies
      .filter(
        (m) =>
          m?.isSeries === true &&
          !m?.genres?.some(
            (g) =>
              g?.en?.toLowerCase() === "anime" ||
              g?.vi?.toLowerCase() === "anime"
          )
      )
      .slice()
      .sort((a, b) => Number(b.id) - Number(a.id)); // sắp id giảm dần

    goAllWith("Phim bộ", list);
  };

  // Lọc theo QUỐC GIA (so nation.vi / nation.en)
  const goByCountry = (countryLabel) => {
    const target = n(countryLabel);
    const list = allMovies.filter((m) => {
      const vi = n(m?.nation?.vi);
      const en = n(m?.nation?.en);
      return (
        vi === target ||
        en === target ||
        vi.includes(target) ||
        en.includes(target)
      );
    });
    goAllWith(`Phim ${countryLabel}`, list);
    setOpenMenu(null); // đóng dropdown
  };

  // Lọc theo THỂ LOẠI (so sánh genres[].vi / genres[].en)
  const goByGenre = (genreLabel) => {
    const target = n(genreLabel);
    const list = allMovies.filter((m) =>
      m?.genres?.some(
        (g) => n(g?.vi).includes(target) || n(g?.en).includes(target)
      )
    );
    goAllWith(`Thể loại: ${genreLabel}`, list);
    setOpenMenu(null); // đóng dropdown
  };

  return (
    <div className="py-[10px] px-[25px] flex items-center justify-between absolute left-0 right-0 top-0 z-50">
      {/* Logo + Search */}
      <div className="inline-flex items-center gap-3">
        <img
          className="transition-transform cursor-pointer hover:scale-105"
          src="/images/logo-header/Logo-0.75.png"
          alt="logo"
          onClick={() => navigate("/home")}
        />

        {/* Ô tìm kiếm */}
        <div ref={searchRef} className="relative w-[300px]">
          <div className="inline-flex items-center w-full gap-3 search">
            <img src="/images/logo-header/Icon.png" alt="search" />
            <input
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
                      <img
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
      <div className="flex justify-between gap-6">
        <span
          onClick={goHot}
          className="hover:text-[#f0d25b] transition-all cursor-pointer"
        >
          Phim hot
        </span>
        <span
          onClick={goSingle}
          className="hover:text-[#f0d25b] transition-all cursor-pointer"
        >
          Phim lẻ
        </span>
        <span
          onClick={goSeries}
          className="hover:text-[#f0d25b] transition-all cursor-pointer"
        >
          Phim bộ
        </span>

        {/* Quốc gia */}
        <div
          ref={countryRef}
          className="inline-flex items-center gap-[5px] relative"
        >
          <span
            className="cursor-pointer"
            onClick={() =>
              setOpenMenu(openMenu === "country" ? null : "country")
            }
          >
            Quốc gia
          </span>
          <img
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
                <span
                  onClick={() => goByCountry(country)}
                  key={i}
                  className="hover:text-[#f0d25b] transition-all cursor-pointer"
                >
                  {country}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Thể loại */}
        <div
          ref={genreRef}
          className="inline-flex items-center gap-[5px] relative"
        >
          <span
            className="cursor-pointer"
            onClick={() => setOpenMenu(openMenu === "genre" ? null : "genre")}
          >
            Thể loại
          </span>
          <img
            onClick={() => setOpenMenu(openMenu === "genre" ? null : "genre")}
            className="w-[12px] cursor-pointer"
            src="/images/logo-header/downArown.png"
            alt="arrow"
          />
          {openMenu === "genre" && (
            <div className="absolute top-[30px] right-0 bg-[rgba(0,0,0,0.7)] w-[380px] grid grid-cols-3 gap-[10px] p-3 text-center rounded-[8px]">
              {genres.map((g, i) => (
                <span
                  onClick={() => goByGenre(g)}
                  key={i}
                  className="hover:text-[#f0d25b] transition-all cursor-pointer"
                >
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Language + Avatar */}
      <div className="inline-flex items-center gap-3">
        <div className="custom-select">
          <div
            className="flex items-center justify-between selected"
            onClick={toggleMenu}
          >
            <span>{selected}</span>
            <img
              className="w-[20px]"
              src="/images/logo-header/flight_4919659.png"
              alt="world"
            />
          </div>
          {isOpen && (
            <ul className="options">
              <li onClick={() => selectOption("English")}>English</li>
              <li onClick={() => selectOption("Vietnamese")}>Vietnamese</li>
            </ul>
          )}
        </div>
        {/* <UserMenu /> */}

        {isGuest || !user ? (
          <div
            onClick={() => navigate("/login")}
            className="px-4 py-3 text-sm font-medium text-white transition border rounded-full cursor-pointer border-white/10 hover:bg-white/10"
          >
            Đăng nhập
          </div>
        ) : (
          <UserMenu user={user.name} />
        )}
      </div>
    </div>
  );
}
