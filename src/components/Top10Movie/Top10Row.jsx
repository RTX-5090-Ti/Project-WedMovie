// Top10Row.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

export default function Top10Row({ title, items = [], onMovieClick }) {
  return (
    <section className="w-full ">
      <h2 className="mb-5 text-3xl font-bold">{title}</h2>

      <Swiper
        modules={[FreeMode]}
        freeMode
        // grabCursor
        spaceBetween={24}
        slidesPerView={"6"}
      >
        {items.map((m, idx) => (
          <SwiperSlide key={m.id} style={{ width: 300 }}>
            <article className="group">
              {/* Poster */}
              <div
                onClick={() => onMovieClick?.(m.id)}
                className="relative overflow-hidden transition-transform duration-300 shadow-lg cursor-pointer rounded-3xl ring-1 ring-white/10 bg-neutral-800 group-hover:-translate-y-1"
              >
                <img
                  src={m.poster}
                  alt={m.title}
                  className="w-full aspect-[3/4] object-cover transition-transform duration-300 
                             group-hover:scale-[1.03]"
                />
                {/* badges ở đáy */}
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
              </div>

              {/* Hàng thông tin + số thứ hạng to ở bên trái */}
              <div className="mt-4 grid grid-cols-[40px_1fr] gap-4 items-start">
                <div className="overflow-hidden text-5xl font-black leading-none text-yellow-600/90">
                  {idx + 1}
                </div>
                <div>
                  <h3
                    onClick={() => onMovieClick?.(m.id)}
                    className="text-lg font-semibold line-clamp-1 hover:text-[#f0d25b] cursor-pointer"
                  >
                    {m.title}
                  </h3>
                  <p
                    onClick={() => onMovieClick?.(m.id)}
                    className="text-sm cursor-pointer text-white/60 line-clamp-1"
                  >
                    {m.subtitle}
                  </p>
                  {/* hàng nhãn nhỏ như T16  |  Phần 1  |  Tập 28 */}
                  <div className="flex flex-wrap mt-1 text-sm gap-x-4 gap-y-1 text-white/70">
                    {m.meta?.map((x, i) => (
                      <span key={i}>{x}</span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
