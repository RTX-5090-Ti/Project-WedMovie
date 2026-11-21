import { useTranslation } from "react-i18next";
import { movieTitles, movieBadge } from "../lib/movieLanguage";
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

export default function ShowNewMovie({
  title,
  movies = [],
  onTitleClick,
}) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || "vi";
  // Nếu muốn đảm bảo đủ field, có thể chuẩn hóa nhẹ:

  const list = useMemo(
    () =>
      (movies || []).map((m) => ({
        ...m,
        titles: movieTitles(typeof m.title === "string" ? { vi: m.title, en: m.subtitle } : m.title, language),
        poster: (m.smallPoster || m.poster || "/images/default-poster.svg").replace(/^\.\/public\//, "/"),
        badges: m.badges || [],
      })),
    [movies, language]
  );

  return (
    <Box component="main" sx={{ bgcolor: "#192026", py: { xs: 2, sm: 3 }, mt: { xs: "80px", sm: "96px", lg: "150px" }, minWidth: 0 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5, mb: { xs: 2, sm: 3 } }}>
          <Typography component="h1" sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 700, color: "white", minWidth: 0, overflowWrap: "anywhere" }}>{title || t("catalog.all")}</Typography>
          <Typography sx={{ fontSize: { xs: 12, sm: 14 }, color: "rgba(255,255,255,.6)", flexShrink: 0 }}>{t("catalog.filters")}</Typography>
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
                aria-label={m.titles.title}
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
                  alt={m.titles.title}
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
                      label={movieBadge(b.text, t)}
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
                  title={m.titles.title}
                >
                  {m.titles.title}
                </h3>
                {m.titles.subtitle && <p
                  className="overflow-hidden text-sm text-white/60 whitespace-nowrap text-ellipsis"
                  title={m.titles.subtitle}
                >
                  {m.titles.subtitle}
                </p>}
              </Box>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
