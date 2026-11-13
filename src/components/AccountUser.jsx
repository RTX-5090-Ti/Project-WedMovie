import Dialog from "@mui/material/Dialog";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/useAuth";

export default function AccountUser() {
  const { user, updateUser, changePassword } = useAuth(); // user trong auth: { email, name } hoặc null
  const [open, setOpen] = useState(false);
  const [openImg, setOpenImg] = useState(false);

  // state hiển thị
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [gender, setGender] = useState("unknown"); // "male" | "female" | "unknown"
  const [avatar, setAvatar] = useState(""); // ảnh đang xài
  const [selected, setSelected] = useState(null); // ảnh vừa chọn trong modal

  // dùng 1 state để báo cho cả 2 (thông tin + đổi pass)
  const [passMsg, setPassMsg] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // có 3 lựa chọn giới tính
  const options = [
    { value: "unknown", label: "Không xác định" },
    { value: "male", label: "Nam" },
    { value: "female", label: "Nữ" },
  ];

  // mảng avatar mẫu để người dùng chọn
  const avatarList = [
    { id: 1, src: "/images/avatarUser/07.jpg" },
    { id: 2, src: "/images/avatarUser/08.jpg" },
    { id: 3, src: "/images/avatarUser/11.jpg" },
    { id: 4, src: "/images/avatarUser/14.jpg" },
    { id: 5, src: "/images/avatarUser/15.jpg" },
    { id: 6, src: "/images/avatarUser/16.jpg" },
    { id: 7, src: "/images/avatarUser/19.jpg" },
    { id: 8, src: "/images/avatarUser/28.jpg" },
    { id: 9, src: "/images/avatarUser/37.jpg" },
    { id: 10, src: "/images/avatarUser/13.jpg" },
    { id: 11, src: "/images/avatarUser/22.jpg" },
    { id: 12, src: "/images/avatarUser/21.jpg" },
  ];

  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  useEffect(() => {
    setEmail(user?.email || ""); setDisplayName(user?.name || "");
    setGender(user?.gender || "unknown"); setAvatar(user?.avatar || "");
  }, [user]);
  async function save(action, success) {
    if (busyRef.current) return;
    busyRef.current = true; setBusy(true); setPassMsg("");
    try { await action(); setPassMsg(success); }
    catch (error) { setPassMsg(error.message); }
    finally { busyRef.current = false; setBusy(false); }
  }
  const saveAvatarForUser = (avatarUrl) => save(async () => {
    await updateUser({ avatar: avatarUrl }); setAvatar(avatarUrl);
  }, "Đã cập nhật ảnh đại diện.");
  const handleUpdate = () => save(() => updateUser({ name: displayName, gender, avatar: selected?.src || avatar }), "Đã cập nhật thông tin.");
  const handleChangePassword = () => {
    if (!oldPass || !newPass || !confirmPass) { setPassMsg("Vui lòng nhập đủ 3 ô mật khẩu."); return; }
    if (newPass !== confirmPass) { setPassMsg("Mật khẩu xác nhận không khớp."); return; }
    save(async () => { await changePassword(oldPass, newPass); setOldPass(""); setNewPass(""); setConfirmPass(""); setOpen(false); }, "Đổi mật khẩu thành công.");
  };

  return (
    <div className="account-layout flex max-w-6xl gap-12 px-6 py-10 mx-auto" aria-busy={busy}>
      {busy && <p className="account-saving" role="status">Đang lưu...</p>}
      {/* Cột trái: form */}
      <div className="account-form flex-1">
        <h1 className="mb-2 text-2xl font-bold">Tài khoản</h1>
        <p className="mb-8 text-sm text-white/60">
          Cập nhật thông tin tài khoản
        </p>

        {/* Email */}
        <div className="mb-5">
          <label htmlFor="account-email" className="block mb-2 text-sm text-white/70">Email</label>
          <input
            type="text"
            id="account-email" autoComplete="email"
                value={email}
            readOnly
            className="w-full bg-[#12151b] border border-white/5 rounded-lg px-4 py-3 text-sm outline-none text-white/80"
          />
          <p className="mt-1 text-xs text-white/30">
            Email không thể thay đổi.
          </p>
        </div>

        {/* Tên hiển thị */}
        <div className="mb-5">
          <label htmlFor="account-name" className="block mb-2 text-sm text-white/70">
            Tên hiển thị
          </label>
          <input
            type="text"
            id="account-name" autoComplete="name"
                value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-[#12151b] border border-white/5 rounded-lg px-4 py-3 text-sm outline-none text-white placeholder:text-white/20 focus:border-[#d9aa3d]"
            placeholder="Nhập tên của bạn"
          />
        </div>

        {/* Giới tính */}
        <div className="mb-7">
          <label className="block mb-3 text-sm text-white/70">Giới tính</label>
          <div className="account-gender flex flex-wrap items-center gap-6 text-sm">
            {options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <input type="radio" name="gender" value={opt.value}
                  checked={gender === opt.value} onChange={() => setGender(opt.value)} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* nút cập nhật */}
        <button type="button" disabled={busy}
                onClick={handleUpdate}
          className="bg-[#d9aa3d] hover:bg-[#c49731] transition-colors text-sm font-semibold px-8 py-3 rounded-md inline-block cursor-pointer"
        >
          Cập nhật
        </button>

        {passMsg ? (
          <p role="status" className="mt-3 text-sm text-green-400">{passMsg}</p>
        ) : null}

        {/* link đổi mật khẩu */}
        <p className="text-sm mt-7 text-white/50">
          Đổi mật khẩu, nhấn vào{" "}
          <button type="button"
            onClick={() => {
              setPassMsg(""); // clear msg cũ trước khi mở
              setOpen(true);
            }}
            className="text-[#f0d25b] cursor-pointer hover:underline"
          >
            đây
          </button>
        </p>
      </div>

      {/* Modal đổi mật khẩu */}
      {open && (
        <Dialog open={open} onClose={() => { if (!busy) setOpen(false); }} className="account-dialog" aria-labelledby="password-dialog-title" fullWidth maxWidth="xs">
          <div className="account-dialog-content bg-[#1a1d24] p-8">
            <h2 id="password-dialog-title" className="mb-6 text-lg font-semibold text-center">
              Đổi mật khẩu
            </h2>

            {/* Input mật khẩu cũ */}
            <div className="mb-4">
              <label htmlFor="account-old-password" className="block mb-2 text-sm text-white/70">
                Mật khẩu cũ
              </label>
              <input
                type="password"
                id="account-old-password" autoComplete="current-password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#12151b] border border-white/10 text-sm outline-none focus:border-[#f0d25b]"
              />
            </div>

            {/* Input mật khẩu mới */}
            <div className="mb-4">
              <label htmlFor="account-new-password" className="block mb-2 text-sm text-white/70">
                Mật khẩu mới
              </label>
              <input
                type="password"
                id="account-new-password" autoComplete="new-password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#12151b] border border-white/10 text-sm outline-none focus:border-[#f0d25b]"
              />
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div className="mb-6">
              <label htmlFor="account-confirm-password" className="block mb-2 text-sm text-white/70">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                id="account-confirm-password" autoComplete="new-password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#12151b] border border-white/10 text-sm outline-none focus:border-[#f0d25b]"
              />
            </div>

            {passMsg ? (
              <p className="mb-4 text-xs text-center text-red-300">{passMsg}</p>
            ) : null}

            {/* Nút hành động */}
            <div className="account-dialog-actions flex justify-between">
              <button type="button" disabled={busy}
                onClick={handleChangePassword}
                className="bg-[#f0d25b] text-black font-semibold px-5 py-2 rounded-md hover:bg-[#d9aa3d] transition-colors cursor-pointer inline-flex items-center justify-center"
              >
                Đổi mật khẩu
              </button>
              <button type="button" disabled={busy}
                onClick={() => {
                  setOpen(false);
                  setPassMsg("");
                  setOldPass("");
                  setNewPass("");
                  setConfirmPass("");
                }}
                className="inline-flex items-center justify-center px-5 py-2 transition-colors border rounded-md cursor-pointer border-white/10 hover:bg-white/10"
              >
                Đóng
              </button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Cột phải: avatar */}
      <div className="account-avatar w-[260px] flex flex-col items-center gap-5">
        {/* Ảnh đang dùng */}
        <div className="account-avatar-image w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-[#1f2127] shadow-[0_0_0_3px_rgba(0,0,0,0.3)]">
          <img
            src={avatar || selected?.src || "/images/test/avatar-small.webp"}
            alt="avatar"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Nút mở modal */}
        <button type="button" disabled={busy}
                onClick={() => setOpenImg(true)}
          className="flex items-center gap-2 bg-[#12151b] border border-white/5 hover:border-[#d9aa3d] px-4 py-2 rounded-md text-sm cursor-pointer"
        >
          <span className="text-lg">▦</span>
          Ảnh có sẵn
        </button>

        <p className="text-xs text-center text-white/30">Chọn ảnh có sẵn</p>

        {/* MODAL chọn avatar */}
        {openImg && (
          <Dialog open={openImg} onClose={() => { if (!busy) setOpenImg(false); }} className="account-dialog" aria-labelledby="avatar-dialog-title" fullWidth maxWidth="sm">
            <div className="account-dialog-content bg-[#1a1d24] p-6">
              <h2 id="avatar-dialog-title" className="mb-5 text-lg font-semibold text-center">
                Chọn ảnh đại diện
              </h2>

              <div className="avatar-options grid grid-cols-3 gap-5 mb-6 sm:grid-cols-4">
                {avatarList.map((ava) => (
                  <button type="button" aria-label={`Avatar ${ava.id}`} aria-pressed={selected?.id === ava.id}
                    key={ava.id}
                    onClick={() => setSelected(ava)}
                    className={`avatar-option w-[100px] h-[100px] rounded-full overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                      selected?.id === ava.id
                        ? "border-[#f0d25b] scale-105"
                        : "border-transparent hover:border-white/20"
                    }`}
                  >
                    <img
                      src={ava.src || "/images/test/avatar-small.webp"}
                      alt={`avatar-${ava.id}`}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>

              <div className="account-dialog-actions flex justify-end gap-4">
                <button type="button" disabled={busy}
                onClick={() => setOpenImg(false)}
                  className="inline-flex items-center justify-center px-5 py-2 text-sm transition-colors border rounded-md cursor-pointer border-white/10 hover:bg-white/10"
                >
                  Đóng
                </button>
                <button type="button" disabled={busy}
                onClick={() => {
                    if (selected?.src) {
                      // chuẩn hoá đường dẫn, bỏ ../../public đi
                      const normalized = selected.src.replace(
                        "../../public",
                        ""
                      );
                      saveAvatarForUser(normalized);
                    }
                    setOpenImg(false);
                  }}
                  className="px-5 py-2 rounded-md text-sm bg-[#f0d25b] text-black font-semibold hover:bg-[#d9aa3d] transition-colors cursor-pointer inline-flex  items-center justify-center"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </div>
  );
}
