import Dialog from "@mui/material/Dialog";
export default function MovieEditModal({
  open,
  busy = false,
  form,
  error,
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
    <Dialog open={open} onClose={() => { if (!busy) onClose(); }} fullWidth maxWidth="sm" className="admin-dialog" aria-labelledby="edit-movie-title">
      <div className="admin-dialog-content w-full max-w-2xl rounded-2xl border border-white/10 bg-[#1c1f29] p-6 shadow-xl">
        <h3 id="edit-movie-title" className="mb-4 text-xl font-semibold">Cập nhật thông tin phim</h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Title VI */}
          <div className="flex flex-col gap-1">
            <label htmlFor="edit-movie-titleVi" className="text-sm text-white/70">Tiêu đề tiếng Việt</label>
            <input id="edit-movie-titleVi"
              className="px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400"
              type="text"
              placeholder="Nhập tiêu đề tiếng Việt"
              value={form.titleVi}
              onChange={(e) => handleChange("titleVi", e.target.value)}
            />
          </div>

          {/* Title EN */}
          <div className="flex flex-col gap-1">
            <label htmlFor="edit-movie-titleEn" className="text-sm text-white/70">Tiêu đề tiếng Anh</label>
            <input id="edit-movie-titleEn"
              className="px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400"
              type="text"
              placeholder="Nhập tiêu đề tiếng Anh"
              value={form.titleEn}
              onChange={(e) => handleChange("titleEn", e.target.value)}
            />
          </div>

          {/* isSeries + featured */}
          <div className="flex flex-col col-span-2 gap-2 mt-2">
            <div className="flex items-center gap-2">
              <input
                id="isSeries"
                type="checkbox"
                checked={form.isSeries}
                onChange={(e) => handleChange("isSeries", e.target.checked)}
                className="w-4 h-4 bg-transparent border rounded border-white/40"
              />
              <label htmlFor="isSeries" className="text-sm text-white/80">
                Đây là phim bộ (isSeries)
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="featured"
                type="checkbox"
                checked={form.featured || false}
                onChange={(e) => handleChange("featured", e.target.checked)}
                className="w-4 h-4 bg-transparent border rounded border-white/40"
              />
              <label htmlFor="featured" className="text-sm text-white/80">
                Đánh dấu là phim nổi bật (featured)
              </label>
            </div>
          </div>
        </div>

        {/* Description VI */}
        <div className="flex flex-col gap-1 mt-4">
          <label htmlFor="edit-movie-descVi" className="text-sm text-white/70">Mô tả tiếng Việt</label>
          <textarea id="edit-movie-descVi"
            className="w-full px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400 min-h-[80px]"
            placeholder="Nhập mô tả tiếng Việt"
            value={form.descVi}
            onChange={(e) => handleChange("descVi", e.target.value)}
          />
        </div>

        {/* Description EN */}
        <div className="flex flex-col gap-1 mt-3">
          <label htmlFor="edit-movie-descEn" className="text-sm text-white/70">Mô tả tiếng Anh</label>
          <textarea id="edit-movie-descEn"
            className="w-full px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400 min-h-[80px]"
            placeholder="Nhập mô tả tiếng Anh"
            value={form.descEn}
            onChange={(e) => handleChange("descEn", e.target.value)}
          />
        </div>

        {error && <p role="alert" className="mt-3 text-red-400">{error}</p>}
        {/* Buttons */}
        <div className="admin-dialog-actions flex justify-end gap-3 pt-4 mt-4">
          <button type="button" disabled={busy}
            onClick={onClose}
            className="px-4 py-2 text-sm border cursor-pointer rounded-xl border-white/30 hover:bg-white/10"
          >
            Đóng
          </button>
          <button type="button" disabled={busy}
            onClick={onSubmit}
            className="px-4 py-2 text-sm font-semibold text-black cursor-pointer rounded-xl bg-yellow-500/80 hover:bg-yellow-400"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </Dialog>
  );
}
