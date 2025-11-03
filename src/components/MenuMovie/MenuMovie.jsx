// MovieRow.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

export default function MenuMovie({ movies = [], onMovieClick }) {
  return (
    <section className="w-full">
      {/* <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div> */}

      <Swiper
        modules={[FreeMode]}
        freeMode={true}
        grabCursor={false}
        spaceBetween={18}
        slidesPerView={"7"} // auto theo độ rộng card
      >
        {movies.map((m) => (
          <SwiperSlide key={m.id} style={{ width: 210 }}>
            <article className="group">
              {/* Poster */}
              <div
                onClick={() => onMovieClick?.(m.id)}
                className="relative overflow-hidden shadow-md cursor-pointer rounded-2xl ring-1 ring-white/5 bg-neutral-800"
              >
                <img
                  src={m.poster}
                  alt={m.title}
                  className="aspect-[2/3] w-full object-cover transition-transform duration-300 
                             group-hover:scale-[1.04]"
                />

                {/* Badge overlay (ví dụ: P.Đề / T.Minh) */}
                <div className="absolute flex gap-2 -translate-x-1/2 bottom-3 left-1/2">
                  {m.badges?.map((b, i) => (
                    <span
                      key={i}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold 
                                  bg-black/60 backdrop-blur ${b.color ?? ""}`}
                    >
                      {b.text}
                    </span>
                  ))}
                </div>

                {/* Hover overlay nhẹ */}
                <div className="absolute inset-0 transition-colors bg-black/0 group-hover:bg-black/10" />
              </div>

              {/* Title + subtitle */}
              <h3
                onClick={() => onMovieClick?.(m.id)}
                className="mt-3 text-base font-semibold text-center line-clamp-1 hover:text-[#f0d25b] cursor-pointer"
              >
                {m.title}
              </h3>
              <p
                onClick={() => onMovieClick?.(m.id)}
                className="text-sm text-center cursor-pointer text-white/60 line-clamp-1"
              >
                {m.subtitle}
              </p>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
