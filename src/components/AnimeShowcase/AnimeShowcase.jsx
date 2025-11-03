// src/components/AnimeShowcase.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { motion, AnimatePresence } from "framer-motion";
import ButtonHover from "../ButtonHover";

export default function AnimeShowcase({
  data,
  thumbs = [],
  activeId,
  onSelect,
  onClickButton,
  onTitleClick,
}) {
  return (
    <section className="w-full ">
      <div className="flex gap-5">
        <h2 className="mb-4 text-3xl font-bold">Kho Tàng Anime Mới Nhất</h2>
        <ButtonHover onClick={onClickButton} />
      </div>
      <div className="relative rounded-3xl bg-[#1b1e24] ring-1 ring-white/5">
        {/* Background ảnh bên phải */}
        <AnimatePresence mode="wait">
          <motion.img
            key={data.bg}
            src={data.bg}
            alt=""
            className="absolute inset-0 object-cover object-right w-full h-full rounded-3xl"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Lớp gradient + texture hạt (giữ nguyên CSS) */}
        <div
          className="
            absolute inset-0
            bg-[linear-gradient(90deg,rgba(14,16,20,0.95)_0%,rgba(14,16,20,0.8)_40%,rgba(14,16,20,0.25)_65%,rgba(14,16,20,0)_85%)] rounded-3xl
          "
        />
        <div
          className="
            pointer-events-none absolute inset-0 opacity-25
            [background-image:radial-gradient(currentColor_1px,transparent_1px)]
            [background-size:6px_6px] text-black
          "
        />

        {/* Content trái */}
        <div className="relative z-10 px-6 lg:px-10 py-10 lg:py-14 max-w-[760px]">
          <AnimatePresence mode="wait">
            <motion.h3
              onClick={onTitleClick}
              key={data.title}
              className="mb-2 text-4xl font-extrabold lg:text-5xl cursor-pointer hover:text-[#f0d25b]"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {data.title}
            </motion.h3>
          </AnimatePresence>

          <motion.p
            key={data.subtitle}
            className="mb-4 text-lg text-white/70"
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 1, opacity: 1 }}
            transition={{ duration: 0.28 }}
          >
            {data.subtitle}
          </motion.p>

          {/* badges hàng 1: IMDb + [year, duration, nation.vi] */}
          <div className="flex flex-wrap gap-2 mb-3">
            {data.score && (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-yellow-500/90 text-black">
                IMDb {data.score}
              </span>
            )}
            {data.tags1?.map((b, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/10"
              >
                {b}
              </span>
            ))}
          </div>

          {/* badges thể loại */}
          <div className="flex flex-wrap gap-2 mb-6">
            {data.genres?.map((g, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md text-xs bg-white/8"
              >
                {g}
              </span>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={data.desc}
              className="mb-8 leading-relaxed text-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {data.desc}
            </motion.p>
          </AnimatePresence>

          {/* Nút hành động (giữ nguyên) */}

          <div
            onClick={onTitleClick}
            className="inline-flex items-center gap-3 px-5 py-3 font-semibold text-white transition rounded-full bg-[rgba(255,255,255,0.3)] cursor-pointer hover:opacity-90"
          >
            <img
              className="w-[34px] h-[34px]"
              src="/images/logo-header/play.gif"
              alt="play"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            Xem ngay
          </div>
        </div>

        {/* Thumbnails dưới (giữ layout cũ, thêm click + active highlight) */}
        <div className="relative z-10 px-4 pb-6 lg:px-8">
          <div className="absolute left-0 right-0 flex justify-center px-2 -bottom-10">
            <Swiper
              modules={[FreeMode]}
              freeMode
              grabCursor
              spaceBetween={14}
              slidesPerView={"auto"}
              className="!overflow-visible"
            >
              {thumbs.map((t) => (
                <SwiperSlide key={t.id} style={{ width: 82 }}>
                  <div
                    className={`overflow-hidden shadow-lg rounded-2xl ring-1 ring-black/20 bg-neutral-800 cursor-pointer transition 
                      ${
                        activeId === t.id
                          ? "ring-2 ring-white scale-[1.02]"
                          : "opacity-80 hover:opacity-100"
                      }`}
                    onClick={() => onSelect && onSelect(t.id)}
                    title={t.title}
                  >
                    <img
                      src={t.poster}
                      alt={t.title}
                      className="w-full aspect-[2/3] object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="h-12" />
        </div>
      </div>
    </section>
  );
}
