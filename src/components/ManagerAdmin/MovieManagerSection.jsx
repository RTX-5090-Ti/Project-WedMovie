// render phim ttwf db.json và phân trang

const PAGE_SIZE = 14;

export default function MovieManagerSection({
  movies,
  currentPage,
  onPageChange,
  onDeleteMovie,
  onSelectMovie,
  onOpenAddMovie,
}) {
  const totalPages = Math.max(1, Math.ceil(movies.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentMovies = movies.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="mb-3 text-2xl font-semibold">Quản lý phim 🎬</h2>
        <span
          onClick={onOpenAddMovie}
          className="px-6 py-3 font-semibold text-black cursor-pointer rounded-xl bg-yellow-500/80 hover:bg-yellow-400"
        >
          Thêm phim mới
        </span>
      </div>

      {/* Danh sách phim */}
      {currentMovies.length === 0 ? (
        <p className="text-white/70">Không có phim nào.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4">
          {currentMovies.map((m) => (
            <li
              key={m.id}
              onClick={() => onSelectMovie && onSelectMovie(m)}
              className="group flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 text-sm 
                         transition-all duration-200 hover:bg-white/10 hover:-translate-y-[1px] cursor-pointer"
            >
              {/* Hình smallPoster bên trái */}
              <div className="flex items-center gap-4">
                <img
                  src={m.smallPoster || m.poster}
                  alt={m.title?.vi || m.title?.en || "movie"}
                  className="w-[70px] h-[100px] object-cover rounded-md border border-white/10"
                />

                {/* Tiêu đề VI/EN bên phải hình */}
                <div className="flex flex-col">
                  <span className="text-base font-semibold transition-colors duration-200 group-hover:text-[#f0d25b]">
                    {m.title?.vi || "Tiêu đề tiếng Việt"}
                  </span>
                  <span className="mt-1 text-xs transition-colors duration-200 text-white/60 group-hover:text-white/80">
                    {m.title?.en || "English title"}
                  </span>
                </div>
              </div>

              {/* Nút X xoá phim */}
              <div
                className="px-2 text-lg font-bold text-red-400 hover:text-red-300"
                title="Gỡ phim này"
              >
                <img
                  onClick={(e) => {
                    onDeleteMovie(m.id);
                    e.stopPropagation();
                  }}
                  className="w-5 cursor-pointer"
                  src="././public/images/logo-header/letter-x_9313433.png"
                  alt="delete"
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {movies.length > 0 && (
        <div className="flex items-center justify-center gap-3 mt-6 text-sm">
          <div
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`rounded-lg border px-3 py-1 ${
              currentPage === 1
                ? "cursor-not-allowed border-white/20 text-white/30"
                : "cursor-pointer border-white/40 hover:bg-white/10"
            }`}
          >
            ← Trước
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white/70">
              Trang{" "}
              <span className="font-semibold text-yellow-300">
                {currentPage}
              </span>{" "}
              / {totalPages}
            </span>
          </div>

          <div
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`rounded-lg border px-3 py-1 ${
              currentPage === totalPages
                ? "cursor-not-allowed border-white/20 text-white/30"
                : "cursor-pointer border-white/40 hover:bg-white/10"
            }`}
          >
            Sau →
          </div>
        </div>
      )}
    </div>
  );
}
