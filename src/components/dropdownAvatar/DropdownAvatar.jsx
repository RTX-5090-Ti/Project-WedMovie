import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { loadFavorites } from "../../libary/favorites";

const API = import.meta.env?.VITE_API_BASE || "http://localhost:5000";
const getTitleVi = (x) =>
  x?.title?.vi || x?.titleVi || x?.title_vi || x?.title || "";
const getTitleEn = (x) => x?.title?.en || x?.titleEn || x?.title_en || "";

export default function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState("");
  const ref = useRef(null);
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  const reloadAvatar = () => {
    const raw = localStorage.getItem("auth");
    if (raw) {
      try {
        const auth = JSON.parse(raw);
        // chuẩn hoá giống bên account
        const av = (auth.avatar || "").replace("../../public", "");
        setAvatar(av);
      } catch {
        setAvatar("");
      }
    } else {
      setAvatar("");
    }
  };

  // đọc avatar từ localStorage mỗi lần mở component
  useEffect(() => {
    const load = () => {
      const raw = localStorage.getItem("auth");
      if (raw) {
        try {
          const auth = JSON.parse(raw);
          setAvatar(auth.avatar || "");
        } catch (e) {
          setAvatar("");
        }
      } else {
        setAvatar("");
      }
    };

    load();

    // nếu muốn realtime khi tab khác đổi avatar:
    const onStorage = (e) => {
      if (e.key === "auth") {
        load();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-white">
      {/* Avatar */}
      <div
        onClick={() => {
          // mở dropdown
          setOpen((v) => {
            const next = !v;
            if (next) {
              // mỗi lần mở thì load lại avatar
              reloadAvatar();
            }
            return next;
          });
        }}
        className="w-[42px] h-[42px] rounded-full overflow-hidden border border-white/20 
                   bg-transparent p-0 appearance-none transition-transform duration-200 
                   hover:scale-105 hover:ring-2 hover:ring-yellow-400/60 focus:ring-2 
                   focus:ring-yellow-400/60 cursor-pointer"
      >
        <img
          src={
            avatar && avatar !== "" ? avatar : "/images/test/avatar-small.webp"
          }
          alt="Avatar"
          className="object-center w-[42px] h-[42px] rounded-full"
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-xl bg-[rgba(0,0,0,0.1)] shadow-lg py-2 
                     border border-white/10 backdrop-blur-md z-50"
        >
          <DropdownItem icon="" text={user} />

          <DropdownItem
            icon="❤️"
            text="Yêu thích"
            onClick={async () => {
              // lấy favorites theo email đang đăng nhập
              // user ở đây là tên hiển thị; email lấy từ AuthContext ở HeaderPage (UserMenu chỉ nhận name).
              // Vì DropdownAvatar không có email, ta điều hướng qua HeaderPage: sửa nhẹ để truyền cả email vào prop user (name) thì khó,
              // nên lấy trực tiếp từ AuthContext:
              const auth = JSON.parse(localStorage.getItem("auth") || "null");
              const email = auth?.user?.email;
              const favs = email ? loadFavorites(email) : [];
              // Hydrate EN nếu thiếu (lấy từ /movies/:id trong db.json/json-server)
              const filled = await Promise.all(
                (favs || []).map(async (m) => {
                  const vi = getTitleVi(m);
                  const en = getTitleEn(m);
                  if (en) return { ...m, _vi: vi, _en: en };
                  try {
                    const r = await fetch(
                      `${API}/movies/${encodeURIComponent(m.id)}`
                    );
                    if (!r.ok) return { ...m, _vi: vi, _en: en || "" };
                    const full = await r.json();
                    return {
                      ...m,
                      _vi: vi || full?.title?.vi || "",
                      _en: en || full?.title?.en || "",
                    };
                  } catch {
                    return { ...m, _vi: vi, _en: en || "" };
                  }
                })
              );
              // map sang format ShowNewMovie
              const movies = filled.map((m) => ({
                id: m.id,
                poster: m.poster || m.backdrop || "/images/default-poster.jpg",
                title: m._vi || getTitleVi(m), // VI (hiển thị dòng trên)
                subtitle: m._en || getTitleEn(m), // EN (hiển thị dòng dưới)
                badges: [],
              }));
              navigate("/all-movies", {
                state: { title: "Phim Yêu Thích", movies },
              });
            }}
          />
          <DropdownItem icon="➕" text="Danh sách" />
          <DropdownItem icon="🔁" text="Xem tiếp" />

          <DropdownItem
            icon="👤"
            text="Tài khoản"
            onClick={() => navigate("/account")}
          />
          <div className="my-1 border-t border-white/10" />

          {/* Nếu là admin thì hiển thị nút Quản lý */}
          {role === "admin" && (
            <DropdownItem
              icon={
                <img
                  className="w-[35px]"
                  src="/images/logo-header/maintenance.gif"
                  alt="admin-manage"
                />
              }
              text="Quản lý"
              onClick={() => navigate("/admin")}
            />
          )}
          <DropdownItem
            onClick={() => {
              logout();
              navigate("/login");
            }}
            icon={
              <img
                className="w-[35px]"
                src="/images/logo-header/logout.gif"
                alt="log-out"
              />
            }
            text="Thoát"
          />
        </div>
      )}
    </div>
  );
}

// Component cho từng item
function DropdownItem({ icon, text, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center w-full gap-3 px-4 py-2 text-sm text-left transition-colors duration-200 cursor-pointer hover:text-[#f0d25b]"
    >
      <span className="text-lg">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
