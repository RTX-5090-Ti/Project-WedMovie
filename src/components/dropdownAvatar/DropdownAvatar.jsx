import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";


export default function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastKey, setToastKey] = useState(0);

  const showDevelopmentToast = () => {
    setOpen(false);
    setToastKey((value) => value + 1);
    setToastOpen(true);
  };
  const closeToast = (_, reason) => {
    if (reason !== "clickaway") setToastOpen(false);
  };

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
      <button type="button" aria-label="Tuỳ chọn tài khoản" aria-expanded={open}
        onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}
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
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="avatar-dropdown absolute right-0 mt-2 w-48 rounded-xl bg-[rgba(17,24,39,0.95)] shadow-lg py-2
                     border border-white/10 backdrop-blur-md z-50"
        >
          <DropdownItem icon="" text={user} />

          <DropdownItem
            icon="❤️"
            text="Yêu thích"
            onClick={() => { setOpen(false); navigate("/all-movies?type=favorites"); }}
          />
          <DropdownItem icon="➕" text="Danh sách" onClick={showDevelopmentToast} />
          <DropdownItem icon="🔁" text="Xem tiếp" onClick={showDevelopmentToast} />

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
      <Snackbar
        key={toastKey}
        open={toastOpen}
        autoHideDuration={5000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="info"
          variant="filled"
          onClose={() => setToastOpen(false)}
          sx={{
            bgcolor: "rgba(17,24,39,0.9)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            backdropFilter: "blur(6px)",
            "& .MuiAlert-icon": { color: "#facc15" },
          }}
        >
          Tính năng này đang phát triển
        </Alert>
      </Snackbar>
    </div>
  );
}

// Component cho từng item
function DropdownItem({ icon, text, onClick }) {
  return (
    <button type="button"
      onClick={onClick}
      className="flex items-center w-full min-h-11 gap-3 px-4 py-2 text-sm text-left transition-colors duration-200 cursor-pointer hover:text-[#f0d25b]"
    >
      <span className="text-lg">{icon}</span>
      <span className="min-w-0 break-words">{text}</span>
    </button>
  );
}
