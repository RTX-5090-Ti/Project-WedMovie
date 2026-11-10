import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router-dom";


export default function UserMenu({ user }) {
  const [open, setOpen] = useState(false);

  const ref = useRef(null);
  const { logout, role, user: currentUser } = useAuth();
  const avatar = currentUser?.avatar || "";
  const navigate = useNavigate();

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
        onClick={() => setOpen((value) => !value)}
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
            onClick={() => { setOpen(false); navigate("/all-movies?type=favorites"); }}
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
