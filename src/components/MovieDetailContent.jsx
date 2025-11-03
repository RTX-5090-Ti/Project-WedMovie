import { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Button,
  Divider,
  Dialog,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import { useAuth } from "../auth/AuthContext";
import { isFav, toggleFav } from "../libary/favorites";
import { pushHistory } from "../libary/history";

const API = "http://localhost:5000";

// Chuẩn hoá đường dẫn ảnh
function normPath(s, fallback = "/images/default-poster.jpg") {
  if (!s) return fallback;
  return s.startsWith("./public/") ? s.replace("./public", "") : s;
}

// Lấy YouTube ID từ nhiều dạng URL
function getYouTubeId(url = "") {
  if (!url || typeof url !== "string") return "";
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    if (host === "youtu.be") return u.pathname.slice(1);
    if (host.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const parts = u.pathname.split("/").filter(Boolean);
      const i = parts.indexOf("embed");
      if (i >= 0 && parts[i + 1]) return parts[i + 1];
      if (parts.length) return parts[parts.length - 1];
    }
  } catch {
    const id = url.trim();
    if (/^[a-zA-Z0-9_-]{6,}$/.test(id)) return id;
  }
  return "";
}

export default function MovieDetailContent() {
  const { id } = useParams();
  const { state } = useLocation(); // có thể có { movie }
  const navigate = useNavigate();

  const movieFromState = state?.movie || null;

  const [raw, setRaw] = useState(movieFromState);
  const [loading, setLoading] = useState(!movieFromState);
  const [error, setError] = useState("");
  const [openPlayer, setOpenPlayer] = useState(false);
  // set cho  Thông báo "toast notification" hoặc "toast message"
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastKey, setToastKey] = useState(0);
  const toastResetRef = useRef(null);
  //
  // const { isGuest } = useAuth();
  const { user, isGuest } = useAuth();
  const [fav, setFav] = useState(false);

  function ToastTransition(props) {
    return <Slide {...props} direction="up" />;
  }

  const showToast = (msg) => {
    setToastMsg(msg);
    // nếu đang mở hoặc vừa đóng, ta force-close trước
    setToastOpen(false);
    // clear timer cũ (nếu có)
    if (toastResetRef.current) clearTimeout(toastResetRef.current);
    // đợi 1 tick để MUI hoàn tất unmount/exit, rồi remount lại
    toastResetRef.current = setTimeout(() => {
      setToastKey((k) => k + 1); // đổi key => remount Snackbar
      setToastOpen(true); // mở lại chắc chắn
    }, 10);
  };

  // Map dữ liệu để render
  const m = useMemo(() => {
    if (!raw) return null;
    return {
      id: raw.id,
      backdrop: normPath(raw.backdrop, ""),
      poster: normPath(raw.smallPoster) || normPath(raw.poster),
      titleMain: raw?.title?.en || raw?.title?.vi || "",
      subtitle:
        (raw?.title?.vi || raw?.title?.en || "") +
        (raw?.year ? ` (${raw.year})` : ""),
      duration: raw?.duration || "",
      rating: raw?.rating ?? "",
      nation: raw?.nation?.vi || raw?.nation?.en || "",
      release: raw?.year ? String(raw.year) : "",
      desc: raw?.description?.vi || raw?.description?.en || "",
      genres: (raw?.genres || []).map((g) => g?.vi || g?.en).filter(Boolean),
      trailer: raw?.trailer || raw?.video || "",
    };
  }, [raw]);

  const handleAddFavorite = () => {
    if (isGuest) {
      showToast("Bạn cần đăng nhập để sử dụng tính năng này.");
      return;
    }
    if (!user) {
      showToast("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
      return;
    }
    const favPayload = {
      id: m.id,
      title: { vi: m?.title?.vi || m.titleMain || "", en: m?.title?.en || "" },
      poster: m.poster,
      backdrop: m.backdrop,
    };
    const { added } = toggleFav(user.email, favPayload);
    setFav(added);
    showToast(added ? "Đã thêm vào Yêu thích" : "Đã bỏ khỏi Yêu thích");
  };

  // Khi movie hoặc user đổi, kiểm tra lại trạng thái yêu thích
  useEffect(() => {
    if (!m) return;
    if (!user || isGuest) {
      setFav(false);
      return;
    }
    setFav(isFav(user.email, m.id));
  }, [m?.id, user?.email, isGuest]);

  // Fetch theo id (có fallback /movies?id=...) khi không nhận state.movie
  useEffect(() => {
    let mounted = true;

    if (movieFromState) {
      setLoading(false);
      setError("");
      return;
    }

    if (!id) return;

    (async () => {
      setLoading(true);
      setError("");
      try {
        // 1) /movies/:id
        let res = await fetch(`${API}/movies/${encodeURIComponent(id)}`);
        if (res.status === 404) {
          // 2) fallback /movies?id=...
          res = await fetch(`${API}/movies?id=${encodeURIComponent(id)}`);
          const arr = await res.json();
          if (!mounted) return;
          if (Array.isArray(arr) && arr.length) {
            setRaw(arr[0]);
            return;
          }
          throw new Error("NOT_FOUND");
        }
        if (!res.ok) throw new Error(`HTTP_${res.status}`);
        const json = await res.json();
        if (!mounted) return;
        setRaw(json);
      } catch (e) {
        if (!mounted) return;
        console.error("Load movie failed:", e);
        setRaw(null);
        setError("Không tìm thấy phim hoặc dữ liệu đã thay đổi.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, movieFromState]);

  const videoId = useMemo(() => getYouTubeId(m?.trailer || ""), [m]);
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${encodeURIComponent(
        videoId
      )}?autoplay=1&rel=0&modestbranding=1`
    : "";

  // Loading
  if (loading) {
    return (
      <Box
        sx={{
          bgcolor: "#0f1317",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  // Error / Không có dữ liệu
  if (error || !m) {
    return (
      <Box sx={{ bgcolor: "#0f1317", minHeight: "60vh", color: "white", p: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h6" color="error">
            {error || "Không tìm thấy phim."}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
        </Container>
      </Box>
    );
  }
  // UI chi tiết + nút XEM PHIM (Dialog full-screen)
  return (
    <Box
      sx={{
        bgcolor: "#0f1317",
        color: "#fff",
        minHeight: "100vh",
        pb: 10,
        backgroundImage: m.backdrop
          ? `linear-gradient(to bottom, rgba(15,19,23,0.3), #0f1317), url(${m.backdrop})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container maxWidth="xl" sx={{ pt: 10 }}>
        <Stack
          className="mt-[200px]"
          direction={{ xs: "column", md: "row" }}
          spacing={6}
        >
          {/* Poster */}
          <Box
            sx={{ flexShrink: 0, width: { xs: "60%", md: 300 }, mx: "auto" }}
          >
            <Box
              component="img"
              src={m.poster}
              alt={m.titleMain}
              sx={{
                width: "100%",
                aspectRatio: "2/3",
                borderRadius: 2,
                objectFit: "cover",
                boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
              }}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                bgcolor: videoId ? "#b91c1c" : "rgba(255,255,255,0.12)",
                py: 1.4,
                fontWeight: 700,
                "&:hover": {
                  bgcolor: videoId ? "#dc2626" : "rgba(255,255,255,0.14)",
                },
              }}
              onClick={() => {
                if (!videoId) return;
                setOpenPlayer(true);
                // ghi lịch sử nếu user thật
                if (!isGuest && user) {
                  pushHistory(user.email, {
                    id: m.id,
                    title: {
                      vi: m?.title?.vi || m.titleMain || "",
                      en: m?.title?.en || "",
                    },
                    poster: m.poster,
                    backdrop: m.backdrop,
                  });
                }
              }}
              disabled={!videoId}
            >
              {videoId ? "XEM PHIM" : "KHÔNG CÓ LINK VIDEO"}
            </Button>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(-1)}
              >
                Quay lại
              </Button>
            </Stack>
          </Box>

          {/* Info */}
          <Box sx={{ flexGrow: 1, pt: { xs: 2, md: 2 } }}>
            <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>
              {m.titleMain}
            </Typography>
            <Typography variant="h6" sx={{ color: "#93c5fd", mb: 2 }}>
              {m.subtitle}
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography
                sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 700 }}
              >
                {m.duration}
              </Typography>
              <Chip
                label="R"
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "#fff" }}
              />
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <StarIcon sx={{ color: "#fbbf24" }} />
                <Typography sx={{ fontWeight: 700 }}>
                  IMDb {m.rating || "—"}
                </Typography>
              </Stack>
            </Stack>

            <Stack spacing={1.2} sx={{ mb: 3 }}>
              {m.nation && (
                <Typography>
                  <strong>QUỐC GIA:</strong> {m.nation}
                </Typography>
              )}
              {m.release && (
                <Typography>
                  <strong>KHỞI CHIẾU:</strong> {m.release}
                </Typography>
              )}
            </Stack>

            <Typography
              sx={{
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.9)",
                maxWidth: 900,
              }}
            >
              {m.desc || "Chưa có mô tả."}
            </Typography>

            <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.12)" }} />

            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              {m.genres.map((g, i) => (
                <Chip
                  key={i}
                  label={g}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.06)",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                />
              ))}
            </Stack>

            <div
              onClick={handleAddFavorite}
              className={`group inline-flex items-center gap-3 mt-5 rounded-[12px] p-2 cursor-pointer
              transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/20
               border ${
                 fav
                   ? "border-yellow-400/40 bg-yellow-400/10 hover:bg-yellow-400/20"
                   : "border-white/5 bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.12)] hover:border-white/10"
               }`}
              title={
                isGuest
                  ? "Đăng nhập để sử dụng"
                  : fav
                  ? "Bỏ khỏi Yêu thích"
                  : "Thêm vào Yêu thích"
              }
            >
              <img
                className={`w-[30px] transition-transform duration-300 ${
                  fav ? "rotate-90" : "group-hover:rotate-90"
                }`}
                src="/images/logo/plus.gif"
                alt=""
              />
              <span
                className={`font-medium ${
                  fav
                    ? "text-yellow-300"
                    : "text-white/80 group-hover:text-white"
                }`}
              >
                {fav ? "Đã thêm" : "Add to favorite"}
              </span>
            </div>
          </Box>
        </Stack>
      </Container>

      {/* Dialog full screen phát YouTube */}
      <Dialog
        open={openPlayer}
        onClose={() => setOpenPlayer(false)}
        fullScreen
        PaperProps={{ sx: { bgcolor: "black" } }}
      >
        <IconButton
          onClick={() => setOpenPlayer(false)}
          sx={{
            position: "fixed",
            top: 12,
            right: 12,
            zIndex: 2000,
            color: "#fff",
            bgcolor: "rgba(255,255,255,0.04)",
          }}
          aria-label="close player"
        >
          <CloseIcon />
        </IconButton>

        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={`${m.titleMain} - player`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            style={{
              width: "100%",
              height: "100vh",
              border: 0,
              background: "black",
            }}
          />
        ) : (
          <Box sx={{ color: "white", p: 4 }}>
            <Typography>Không tìm thấy video hợp lệ để phát.</Typography>
            <Button
              sx={{ mt: 2 }}
              variant="outlined"
              onClick={() => setOpenPlayer(false)}
            >
              Đóng
            </Button>
          </Box>
        )}
      </Dialog>
      <Snackbar
        key={toastKey}
        open={toastOpen}
        autoHideDuration={5000}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;
          setToastOpen(false);
        }}
        TransitionComponent={Slide}
        TransitionProps={{
          direction: "up",
          onExited: () => {
            /* optional cleanup */
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="info"
          variant="filled"
          sx={{
            bgcolor: "rgba(17,24,39,0.9)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            backdropFilter: "blur(6px)",
            "& .MuiAlert-icon": { color: "#facc15" },
          }}
        >
          {toastMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
