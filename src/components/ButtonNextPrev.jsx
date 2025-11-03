export default function ButtonNextPrev() {
  return (
    <div className="flex gap-2">
      <button className="p-2 rounded-full swiper-prev bg-white/5 hover:bg-white/10">
        ‹
      </button>
      <button className="p-2 rounded-full swiper-next bg-white/5 hover:bg-white/10">
        ›
      </button>
    </div>
  );
}
