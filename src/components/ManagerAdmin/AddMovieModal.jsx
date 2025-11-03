// AddMovieModal.jsx
export default function AddMovieModal({
  open,
  form,
  onChange,
  onClose,
  onSubmit,
}) {
  if (!open) return null;

  const handleChange = (field, value) => {
    onChange({
      ...form,
      [field]: value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#1c1f29] p-6 shadow-xl">
        <h3 className="mb-4 text-xl font-semibold">Thêm phim mới</h3>

        {/* Title + nation + year */}
        <div className="grid grid-cols-2 gap-4">
          {/* Title VI */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">
              Tiêu đề tiếng Việt *
            </label>
            <input
              className="px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400"
              type="text"
              value={form.titleVi}
              onChange={(e) => handleChange("titleVi", e.target.value)}
            />
          </div>

          {/* Title EN */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">Tiêu đề tiếng Anh *</label>
            <input
              className="px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400"
              type="text"
              value={form.titleEn}
              onChange={(e) => handleChange("titleEn", e.target.value)}
            />
          </div>

          {/* Nation VI */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">Quốc gia (VI)</label>
            <input
              className="px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400"
              type="text"
              value={form.nationVi}
              onChange={(e) => handleChange("nationVi", e.target.value)}
            />
          </div>

          {/* Nation EN */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">Nation (EN)</label>
            <input
              className="px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400"
              type="text"
              value={form.nationEn}
              onChange={(e) => handleChange("nationEn", e.target.value)}
            />
          </div>

          {/* Year */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">Năm</label>
            <input
              className="px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400"
              type="number"
              value={form.year}
              onChange={(e) => handleChange("year", e.target.value)}
            />
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">Thời lượng</label>
            <input
              className="px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400"
              type="text"
              placeholder="vd: 1h 45m"
              value={form.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
            />
          </div>
        </div>

        {/* isSeries + featured + rating */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex flex-col col-span-2 gap-2">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={form.isSeries}
                  onChange={(e) => handleChange("isSeries", e.target.checked)}
                  className="w-4 h-4 bg-transparent border rounded border-white/40"
                />
                Phim bộ (isSeries)
              </label>

              <label className="flex items-center gap-2 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => handleChange("featured", e.target.checked)}
                  className="w-4 h-4 bg-transparent border rounded border-white/40"
                />
                Phim nổi bật (featured)
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">Rating</label>
            <input
              className="px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400"
              type="number"
              step="0.1"
              value={form.rating}
              onChange={(e) => handleChange("rating", e.target.value)}
            />
          </div>
        </div>

        {/* Poster paths */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">Poster (path)</label>
            <input
              className="px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400"
              type="text"
              placeholder="./public/images/..."
              value={form.poster}
              onChange={(e) => handleChange("poster", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">Small poster (path)</label>
            <input
              className="px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400"
              type="text"
              placeholder="./public/images/..."
              value={form.smallPoster}
              onChange={(e) => handleChange("smallPoster", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">Backdrop (path)</label>
            <input
              className="px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400"
              type="text"
              placeholder="./public/images/..."
              value={form.backdrop}
              onChange={(e) => handleChange("backdrop", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">Trailer (URL)</label>
            <input
              className="px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400"
              type="text"
              placeholder="https://www.youtube.com/..."
              value={form.trailer}
              onChange={(e) => handleChange("trailer", e.target.value)}
            />
          </div>
        </div>

        {/* Genres */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">
              Thể loại (VI) – cách nhau bởi dấu phẩy
            </label>
            <input
              className="px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400"
              type="text"
              placeholder="Hành động, Khoa học, Phiêu lưu"
              value={form.genresVi}
              onChange={(e) => handleChange("genresVi", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">
              Genres (EN) – tương ứng, cách nhau bởi dấu phẩy
            </label>
            <input
              className="px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400"
              type="text"
              placeholder="Action, Sci-Fi, Adventure"
              value={form.genresEn}
              onChange={(e) => handleChange("genresEn", e.target.value)}
            />
          </div>
        </div>

        {/* Descriptions */}
        <div className="flex flex-col gap-1 mt-4">
          <label className="text-sm text-white/70">Mô tả tiếng Việt</label>
          <textarea
            className="min-h-[80px] w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-white/40 focus:border-yellow-400"
            value={form.descVi}
            onChange={(e) => handleChange("descVi", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1 mt-3">
          <label className="text-sm text-white/70">Mô tả tiếng Anh</label>
          <textarea
            className="min-h-[80px] w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-white/40 focus:border-yellow-400"
            value={form.descEn}
            onChange={(e) => handleChange("descEn", e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2 mt-4">
          <div
            onClick={onClose}
            className="px-4 py-2 text-sm border cursor-pointer rounded-xl border-white/30 hover:bg-white/10"
          >
            Đóng
          </div>
          <div
            onClick={onSubmit}
            className="px-4 py-2 text-sm font-semibold text-black cursor-pointer rounded-xl bg-yellow-500/80 hover:bg-yellow-400"
          >
            Add
          </div>
        </div>
      </div>
    </div>
  );
}
