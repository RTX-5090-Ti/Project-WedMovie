import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ButtonHover from "../ButtonHover";

function FeatureCard({ item, onMovieClick }) {
  const go = () => onMovieClick?.(item.id);

  return (
    <article className="group">
      {/* Banner */}
      <div
        onClick={go}
        className="relative cursor-pointer rounded-2xl bg-neutral-800"
      >
        <img
          src={item.banner}
          alt={item.title}
          className="w-full aspect-[16/6] object-cover transition-transform duration-500 group-hover:scale-[1.02] rounded-2xl"
        />

        {/* Poster nhỏ chồng ở góc trái */}
        <div className="absolute -bottom-6 left-4">
          <img
            src={item.poster}
            alt={item.title}
            className="w-16 md:w-20 aspect-[2/3] object-cover rounded-xl shadow-xl ring-1 ring-black/30"
          />
        </div>

        {/* Badge ở banner */}
        {Array.isArray(item.badges) && item.badges.length > 0 ? (
          <div className="absolute flex flex-wrap gap-2 -translate-x-1/2 bottom-4 left-1/2 md:left-28 md:translate-x-0">
            {item.badges.map((b, i) => (
              <span
                key={i}
                className={`text-xs font-semibold px-2.5 py-1 rounded-md backdrop-blur ${
                  b.color || "bg-black/60"
                }`}
              >
                {b.text}
              </span>
            ))}
          </div>
        ) : item.badge ? ( // (nếu sau này có case 1 badge dạng chuỗi)
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 md:left-28 md:translate-x-0 text-xs font-semibold px-2.5 py-1 rounded-md bg-black/60 backdrop-blur">
            {item.badge}
          </span>
        ) : null}
      </div>

      {/* Text zone */}
      <div className="px-1 pt-8">
        <h3
          onClick={go}
          className="text-lg font-semibold line-clamp-1 cursor-pointer hover:text-[#f0d25b]"
        >
          {item.title}
        </h3>
        <p
          onClick={go}
          className="text-sm cursor-pointer text-white/60 line-clamp-1"
        >
          {item.subtitle}
        </p>

        {/* meta: dạng chấm ngăn cách */}
        {item.meta?.length > 0 && (
          <div className="flex flex-wrap items-center mt-1 text-sm gap-x-2 text-white/70">
            {item.meta.map((m, i) => (
              <span key={i} className="flex items-center gap-2">
                {i !== 0 && (
                  <span className="inline-block w-1 h-1 rounded-full bg-white/40" />
                )}
                <span>{m}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function FeatureRow({
  title,
  items = [],
  onClickButton,
  onMovieClick,
}) {
  return (
    <section className="relative w-full">
      <div className="flex gap-5 mb-4">
        <h2 className="text-3xl font-bold ">{title}</h2>
        <ButtonHover onClick={onClickButton} />
      </div>

      <Swiper
        modules={[Navigation]}
        navigation={{ nextEl: ".swiper-next", prevEl: ".swiper-prev" }}
        spaceBetween={24}
        // grabCursor
        speed={550}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1536: { slidesPerView: 4 },
        }}
        className="!overflow-visible"
      >
        {items.map((it) => (
          <SwiperSlide key={it.id}>
            <FeatureCard item={it} onMovieClick={onMovieClick} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
