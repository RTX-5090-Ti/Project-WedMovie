import { normalizeEmail, validateAccount } from "../../lib/validation";
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { movie } from "../../data/dataMovie";
import LogoAndLanguage from "../../components/LogoAndLanguage/LogoAndLanguage";
import { useAuth } from "../../auth/useAuth";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export function LoginPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const from = state?.from;
  const destination = from?.pathname?.startsWith("/") && !from.pathname.startsWith("//") && from.pathname !== "/login"
    ? `${from.pathname}${from.search || ""}${from.hash || ""}` : "/home";
  const { register, login, guestLogin, notice } = useAuth();
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
  const [loginMode, setLoginMode] = useState(true); // true=login, false=register
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [name, setName] = useState("");
  const [backgroundVideo] = useState(() => getRandomItem(movie));
  const [toastOpen, setToastOpen] = useState(false);
  const [toastKey, setToastKey] = useState(0);

  function handleForgotPassword(event) {
    event.preventDefault();
    setToastKey((value) => value + 1);
    setToastOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (busyRef.current) return;
    const fields = { name, email: normalizeEmail(email), password: pw };
    const validation = validateAccount(fields, { login: loginMode });
    if (validation) { setErr(validation); return; }
    busyRef.current = true; setBusy(true); setErr("");
    try {
      const res = await (loginMode ? login(fields) : register(fields));
      if (!res.ok) { setErr(res.error); return; }
      if (loginMode) navigate(destination, { replace: true });
      else { setLoginMode(true); setPw(""); setErr("Đăng ký thành công. Bạn có thể đăng nhập."); }
    } catch (error) { setErr(error.message); }
    finally { busyRef.current = false; setBusy(false); }
  }

  function handleGuest(e) {
    e.preventDefault();
    if (busyRef.current) return;
    guestLogin();
    navigate(destination.startsWith("/all-movies") || destination.startsWith("/movie/") ? destination : "/home", { replace: true });
  }

  return (
    <div className="login-page">
      {notice && <p role="status" className="login-notice">{notice}</p>}
      <LogoAndLanguage></LogoAndLanguage>
      <video className="login-video" autoPlay loop muted playsInline aria-hidden="true">
        <source src={backgroundVideo} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ video.
      </video>
      <div className="login-overlay" aria-hidden="true"></div>
      <main className="login-content">
      {/*Login page */}
      {loginMode && (
        <div className="wrapper">
          <form action="#" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div className="input-field">
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                autoCapitalize="none"
                placeholder=" "
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="login-email">Enter your email</label>
            </div>
            <div className="input-field">
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder=" "
                required
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
              <label htmlFor="login-password">Enter your password</label>
            </div>
            <div className="forget">
              <label>
                <input type="checkbox" id="remember" />
                <p>Remember me</p>
              </label>
              <a href="#" onClick={handleForgotPassword}>Forgot password?</a>
            </div>
            <button type="submit" disabled={busy}>Log In</button>
            {err && (
              <p className="err" style={{ color: "red" }}>
                {err}
              </p>
            )}

            <div className="register">
              <p>
                Don't have an account?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (busyRef.current) return;
                    setErr("");
                    setLoginMode(false);
                  }}
                >
                  Register
                </a>
              </p>
              <a href="#" className="guest" onClick={handleGuest}>
                Join as a guest
              </a>
            </div>
          </form>
        </div>
      )}
      {/* Register page */}
      {!loginMode && (
        <div className="register-box">
          <form action="#" onSubmit={handleSubmit}>
            <h2>Register</h2>
            <div className="input-field">
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                placeholder=" "
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="register-name">Enter your name</label>
            </div>
            <div className="input-field">
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                autoCapitalize="none"
                placeholder=" "
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="register-email">Enter your email</label>
            </div>
            <div className="input-field">
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                placeholder=" "
                required
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
              <label htmlFor="register-password">Enter your password</label>
            </div>
            <div className="forget"></div>
            <button type="submit" disabled={busy}>{busy ? "Đang gửi..." : "Create account"}</button>
            {err && <p role="alert" className="text-red-400">{err}</p>}
            <div className="register">
              <p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (busyRef.current) return;
                    setErr("");
                    setLoginMode(true);
                  }}
                >
                  Back to Login
                </a>
              </p>
            </div>
          </form>
        </div>
      )}
      </main>
      <Snackbar
        key={toastKey}
        open={toastOpen}
        autoHideDuration={5000}
        onClose={(_, reason) => {
          if (reason !== "clickaway") setToastOpen(false);
        }}
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
