// Bôx thheem tài khoản

export default function AddUserModal({
  open,
  newName,
  newEmail,
  error,
  onChangeName,
  onChangeEmail,
  onClose,
  onCreate,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1c1f29] p-6 shadow-xl">
        <h3 className="mb-4 text-xl font-semibold">Tạo tài khoản mới</h3>

        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">Tên hiển thị</label>
            <input
              className="px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400"
              type="text"
              placeholder="Nhập tên"
              value={newName}
              onChange={(e) => onChangeName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">Email</label>
            <input
              className="px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400"
              type="email"
              placeholder="Nhập email"
              value={newEmail}
              onChange={(e) => onChangeEmail(e.target.value)}
            />
          </div>

          <p className="text-xs text-white/60">
            Mật khẩu mặc định:{" "}
            <span className="font-semibold text-yellow-300">1</span>
          </p>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-3 pt-2 mt-4">
            <div
              onClick={onClose}
              className="px-4 py-2 text-sm border cursor-pointer rounded-xl border-white/30 hover:bg-white/10"
            >
              Đóng
            </div>
            <div
              onClick={onCreate}
              className="px-4 py-2 text-sm font-semibold text-black cursor-pointer rounded-xl bg-yellow-500/80 hover:bg-yellow-400"
            >
              Tạo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
