// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

// chuẩn hoá đường dẫn avatar kiểu ../../public/... -> /images/...
function normalizeAvatar(path) {
  if (!path) return "";
  return path.replace("../../public", "").replace("public/", "");
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { email, name }
  const [role, setRole] = useState(null); // 'admin' | 'user' | null
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("auth");
    if (raw) {
      try {
        const saved = JSON.parse(raw);
        setUser(saved.user || null);
        setRole(saved.role || null);
        setIsGuest(!!saved.isGuest);
      } catch (err) {
        console.log(err);
      }
    }
    seedAdmin();
    setLoading(false);
  }, []);

  function seedAdmin() {
    const RAW = localStorage.getItem("users_db") || "[]";
    const db = JSON.parse(RAW);
    const exists = db.some((u) => u.email === "admin@gmail.com");
    if (!exists) {
      db.push({
        email: "admin@gmail.com",
        password: "123",
        name: "Admin",
        role: "admin",
        avatar: "/images/test/avatar-small.webp",
        gender: "unknown",
      });
      localStorage.setItem("users_db", JSON.stringify(db));
    }
  }

  function persist(next) {
    localStorage.setItem("auth", JSON.stringify(next));
  }

  // ========== REGISTER ==========
  async function register({ name, email, password }) {
    const raw = localStorage.getItem("users_db") || "[]";
    const db = JSON.parse(raw);
    if (db.some((u) => u.email === email)) {
      return { ok: false, error: "Email đã tồn tại" };
    }
    const fallbackName = (email?.split?.("@")?.[0] || "User").trim();
    const newUser = {
      email,
      password,
      name: name?.trim() || fallbackName,
      role: "user",
      avatar: "", // 👈 thêm
      gender: "unknown", // 👈 thêm
    };
    db.push(newUser);
    localStorage.setItem("users_db", JSON.stringify(db));
    return { ok: true };
  }

  // ========== LOGIN ==========
  async function login({ email, password }) {
    // ADMIN CỨNG
    if (email === "admin@gmail.com" && password === "123") {
      const next = {
        user: { email, name: "Admin" },
        role: "admin",
        isGuest: false,
        avatar: "/images/test/avatar-small.webp",
        gender: "unknown",
      };
      setUser(next.user);
      setRole(next.role);
      setIsGuest(false);
      persist(next);
      return { ok: true };
    }

    // USER THƯỜNG
    const raw = localStorage.getItem("users_db") || "[]";
    const db = JSON.parse(raw);
    const found = db.find((u) => u.email === email && u.password === password);
    if (!found) return { ok: false, error: "Email hoặc mật khẩu sai" };

    const name = found.name?.trim() || email.split("@")[0] || "User";
    const role = found.role || "user";
    const avatar = normalizeAvatar(found.avatar || "");
    const gender = found.gender || "unknown";

    const next = {
      user: { email, name },
      role,
      isGuest: false,
      avatar,
      gender,
    };

    setUser(next.user);
    setRole(next.role);
    setIsGuest(false);
    persist(next);
    return { ok: true };
  }

  function guestLogin() {
    const next = { user: null, role: null, isGuest: true };
    setUser(null);
    setRole(null);
    setIsGuest(true);
    persist(next);
  }

  function logout() {
    setUser(null);
    setRole(null);
    setIsGuest(false);
    localStorage.removeItem("auth");
  }

  const value = {
    user,
    role,
    isGuest,
    loading,
    register,
    login,
    guestLogin,
    logout,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
