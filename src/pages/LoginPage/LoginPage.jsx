import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./LoginPagge.css";
import { movie } from "../../data/dataMovie";
import LogoAndLanguge from "../../components/Logo&Languge/Logo&Languge";
import { useAuth } from "../../auth/AuthContext.jsx";

export function LoginPage() {
  const navigate = useNavigate();
  const { register, login, guestLogin } = useAuth();

  function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
  const [loginMode, setLoginMode] = useState(true); // true=login, false=register
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [name, setName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    if (loginMode) {
      const res = await login({ email, password: pw });
      if (!res.ok) return setErr(res.error || "Login failed");
      navigate("/home", { replace: true });
    } else {
      const res = await register({ name, email, password: pw });
      if (!res.ok) return setErr(res.error || "Register failed");
      // Đăng ký xong: quay về login
      setLoginMode(true);
      setPw("");
      // (có thể giữ nguyên email để user gõ pass)
      navigate("/login", { replace: true });
    }
  }

  function handleGuest(e) {
    e.preventDefault();
    guestLogin();
    navigate("/home", { replace: true });
  }

  return (
    <div className="box">
      <LogoAndLanguge></LogoAndLanguge>
      <video className="video" autoPlay loop muted>
        <source src={getRandomItem(movie)} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ video.
      </video>
      <div className="overlay"></div>
      {/*Login page */}
      {loginMode && (
        <div className="wrapper">
          <form action="#" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div className="input-field">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Enter your email</label>
            </div>
            <div className="input-field">
              <input
                type="password"
                required
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
              <label>Enter your password</label>
            </div>
            <div className="forget">
              <label>
                <input type="checkbox" id="remember" />
                <p>Remember me</p>
              </label>
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit">Log In</button>
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
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label>Enter your name</label>
            </div>
            <div className="input-field">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Enter your email</label>
            </div>
            <div className="input-field">
              <input
                type="password"
                required
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
              <label>Enter your password</label>
            </div>
            <div className="forget"></div>
            <button type="submit">Create acount</button>
            <div className="register">
              <p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
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
    </div>
  );
}
