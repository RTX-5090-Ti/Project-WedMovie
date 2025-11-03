// ShowNewMovie.jsx
import { useMemo } from "react";
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
        poster: m.poster || "/images/default-poster.jpg",
        badges: m.badges || [],
      })),
    [movies]
  );

  return (
    <Box sx={{ bgcolor: "#192026", py: 3, mt: "150px" }}>
      <Container maxWidth="xl">
        <Box className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-sm text-white/60">▼ Bộ lọc</p>
        </Box>

        {/* 8 phim mỗi hàng, dư tự xuống dòng */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(8, minmax(0,1fr))",
            gap: "16px",
          }}
        >
          {list.map((m, idx) => (
            <Card
              key={m.id ?? idx}
              elevation={0}
              sx={{
                bgcolor: "transparent",
                borderRadius: 3,
                textAlign: "center",
              }}
            >
              <CardActionArea
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "relative",
                  ":hover img": { transform: "scale(1.05)" },
                }}
              >
                <CardMedia
                  onClick={() => onTitleClick?.(m.id)}
                  component="img"
                  image={m.poster}
                  alt={getTitleVi(m)}
                  sx={{
                    width: "100%",
                    aspectRatio: "2 / 3",
                    objectFit: "cover",
                    transition: "transform .3s ease",
                    borderRadius: 3,
                    border: "1px solid rgba(255,255,255,0.07)",
                    backgroundColor: "#20262b",
                  }}
                />
                {/* badges */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    position: "absolute",
                    left: "50%",
                    bottom: 10,
                    transform: "translateX(-50%)",
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
                        borderRadius: 1.2,
                        backdropFilter: "blur(6px)",
                      }}
                      className={b.color ?? ""}
                    />
                  ))}
                </Stack>
              </CardActionArea>

              <div style={{ marginTop: 10 }}>
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
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Box>
  );
}
