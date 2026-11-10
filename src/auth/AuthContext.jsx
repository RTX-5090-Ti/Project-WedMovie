import { useEffect, useState } from "react";
import { authenticate, createUser, getUser, publicUser, updateProfile, changePassword as savePassword } from "../lib/users";
import { AuthCtx } from "./useAuth";
const session = (user, isGuest = false) => ({ user, role: user?.role || null, isGuest });
export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState(session(null));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [notice, setNotice] = useState("");
  const [attempt, setAttempt] = useState(0);
  const persist = (next) => { setAuth(next); localStorage.setItem("auth", JSON.stringify(next)); };
  useEffect(() => {
    let active = true;
    async function restore() {
      setAuthError("");
      try {
        const saved = JSON.parse(localStorage.getItem("auth") || "null");
        if (!saved) { if (active) setAuth(session(null)); return; }
        if (saved.isGuest) { if (active) setAuth(session(null, true)); return; }
        if (!saved.user?.id) {
          if (active) { setAuth(session(null)); setNotice("Vui lòng đăng nhập lại để chuyển tài khoản và dữ liệu cũ lên server."); }
          return;
        }
        const record = await getUser(saved.user.id);
        if (!active) return;
        if (record.deleted) { localStorage.removeItem("auth"); setAuth(session(null)); return; }
        persist(session(publicUser(record)));
      } catch (error) {
        if (!active) return;
        if (error.status === 404 || error instanceof SyntaxError) {
          localStorage.removeItem("auth"); setAuth(session(null));
        } else setAuthError(error.message);
      } finally { if (active) setLoading(false); }
    }
    restore();
    const refresh = () => setAttempt((value) => value + 1);
    const storage = (event) => { if (event.key === "auth") refresh(); };
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", storage);
    return () => { active = false; window.removeEventListener("focus", refresh); window.removeEventListener("storage", storage); };
  }, [attempt]);
  async function register(fields) {
    try { await createUser(fields); return { ok: true }; }
    catch (error) { return { ok: false, error: error.message }; }
  }
  async function login(fields) {
    try {
      const { user, warning } = await authenticate(fields);
      setNotice(warning); setAuthError(""); persist(session(user));
      return { ok: true };
    } catch (error) { return { ok: false, error: error.message }; }
  }
  async function updateUser(fields) {
    const user = await updateProfile(auth.user.id, fields);
    persist(session(user)); return user;
  }
  const changePassword = (oldPassword, newPassword) => savePassword(auth.user.id, oldPassword, newPassword);
  function guestLogin() { setAuthError(""); setNotice(""); persist(session(null, true)); }
  function logout() { setAuth(session(null)); setNotice(""); setAuthError(""); localStorage.removeItem("auth"); }
  return <AuthCtx.Provider value={{ ...auth, loading, authError, notice, retryAuth: () => setAttempt((value) => value + 1), register, login, guestLogin, logout, updateUser, changePassword }}>{children}</AuthCtx.Provider>;
}
