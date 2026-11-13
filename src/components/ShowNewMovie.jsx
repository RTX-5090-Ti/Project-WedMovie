// ShowNewMovie.jsx
import { useMemo } from "react";
import { movieImageFallback } from "../lib/imageFallback";
import {
  Box,
  Container,
  Card,
  CardActionArea,
  CardMedia,
  Typography,
  Chip,
  Stack,
} from "@mui/material";

function getTitleVi(m) {
  return typeof m.title === "string"
    ? m.title
    : m.title?.vi || m.title?.en || "";
}
function getTitleEn(m) {
  // m.subtitle (nếu được map sẵn) hoặc title.en
  if (typeof m.subtitle === "string") return m.subtitle;
  if (typeof m.title === "object") return m.title?.en || m.title?.vi || "";
  return "";
}

export default function ShowNewMovie({
  title = "Danh sách",
  movies = [],
  onTitleClick,
}) {
  // Nếu muốn đảm bảo đủ field, có thể chuẩn hóa nhẹ:

  const list = useMemo(
    () =>
      (movies || []).map((m) => ({
        ...m,
        poster: (m.smallPoster || m.poster || "/images/default-poster.svg").replace(/^\.\/public\//, "/"),
        badges: m.badges || [],
      })),
    [movies]
  );

  return (
    <Box component="main" sx={{ bgcolor: "#192026", py: { xs: 2, sm: 3 }, mt: { xs: "80px", sm: "96px", lg: "150px" }, minWidth: 0 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5, mb: { xs: 2, sm: 3 } }}>
          <Typography component="h1" sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 700, color: "white", minWidth: 0, overflowWrap: "anywhere" }}>{title}</Typography>
          <Typography sx={{ fontSize: { xs: 12, sm: 14 }, color: "rgba(255,255,255,.6)", flexShrink: 0 }}>▼ Bộ lọc</Typography>
        </Box>

        {/* Giữ poster đủ rõ trên điện thoại, tăng số cột theo màn hình. */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(3, minmax(0, 1fr))",
              sm: "repeat(4, minmax(0, 1fr))",
              md: "repeat(5, minmax(0, 1fr))",
              lg: "repeat(6, minmax(0, 1fr))",
              xl: "repeat(8, minmax(0, 1fr))",
            },
            columnGap: { xs: "10px", sm: "16px" },
            rowGap: { xs: "20px", sm: "28px" },
          }}
        >
          {list.map((m, idx) => (
            <Card
              key={m.id ?? idx}
              elevation={0}
              sx={{
                bgcolor: "transparent",
                borderRadius: { xs: 1.5, sm: 3 },
                minWidth: 0,
                textAlign: "center",
              }}
            >
              <CardActionArea
                onClick={() => onTitleClick?.(m.id)}
                aria-label={getTitleVi(m)}
                sx={{
                  borderRadius: { xs: 1.5, sm: 3 },
                  overflow: "hidden",
                  position: "relative",
                  ":hover img": { transform: "scale(1.05)" },
                }}
              >
                <CardMedia
                  onError={movieImageFallback}
                  component="img"
                  image={m.poster}
                  alt={getTitleVi(m)}
                  loading="lazy"
                  sx={{
                    width: "100%",
                    aspectRatio: "2 / 3",
                    objectFit: "cover",
                    transition: "transform .3s ease",
                    borderRadius: { xs: 1.5, sm: 3 },
                    border: "1px solid rgba(255,255,255,0.07)",
                    backgroundColor: "#20262b",
                  }}
                />
                {/* badges */}
                <Stack
                  direction="row"
                  spacing={0.5}
                  useFlexGap
                  flexWrap="wrap"
                  sx={{
                    position: "absolute",
                    left: 4,
                    right: 4,
                    bottom: { xs: 6, sm: 10 },
                    justifyContent: "center",
                  }}
                >
                  {m.badges.map((b, i) => (
                    <Chip
                      key={i}
                      label={b.text}
                      size="small"
                      sx={{
                        bgcolor:
                          b.color === "bg-green-600/80"
                            ? "rgba(22,163,74,0.8)" // ✅ xanh lá theo Tailwind bg-green-600/80
                            : "rgba(0,0,0,.6)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: { xs: 9, sm: 12 },
                        height: { xs: 18, sm: 24 },
                        maxWidth: "100%",
                        "& .MuiChip-label": { px: { xs: 0.5, sm: 1 } },
                        borderRadius: 1.2,
                        backdropFilter: "blur(6px)",
                      }}
                      className={b.color ?? ""}
                    />
                  ))}
                </Stack>
              </CardActionArea>

              <Box sx={{ mt: { xs: 0.75, sm: 1.25 }, "& h3": { fontSize: { xs: 12, sm: 16 } }, "& p": { fontSize: { xs: 10, sm: 14 } } }}>
                <h3
                  onClick={() => onTitleClick?.(m.id)}
                  className="font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis hover:text-[#f0d25b] cursor-pointer"
                  title={getTitleVi(m)}
                >
                  {getTitleVi(m)}
                </h3>
                <p
                  className="overflow-hidden text-sm text-white/60 whitespace-nowrap text-ellipsis"
                  title={getTitleEn(m)}
                >
                  {getTitleEn(m)}
                </p>
              </Box>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
