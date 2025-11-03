import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";

export default function AcountUser() {
  const { user } = useAuth(); // user trong auth: { email, name } hoặc null
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

  // 1) LOAD DỮ LIỆU TỪ localStorage
  useEffect(() => {
    const raw = localStorage.getItem("auth");
    if (raw) {
      try {
        const saved = JSON.parse(raw);
        const u = saved.user || {};
        setEmail(u.email || "");
        setDisplayName(u.name || "");
        setGender(saved.gender || "unknown");
        setAvatar(saved.avatar || "");
      } catch (err) {
        console.log("parse auth error", err);
      }
    } else if (user) {
      setEmail(user.email || "");
      setDisplayName(user.name || "");
      setGender("unknown");
    }
  }, [user]);

  // lưu avatar cho đúng user
  const saveAvatarForUser = (avatarUrl) => {
    if (!email) return;

    // 1. users_db
    const usersRaw = localStorage.getItem("users_db") || "[]";
    const users = JSON.parse(usersRaw);
    const idx = users.findIndex((u) => u.email === email);
    if (idx !== -1) {
      users[idx] = {
        ...users[idx],
        avatar: avatarUrl,
      };
      localStorage.setItem("users_db", JSON.stringify(users));
    }

    // 2. auth
    const authRaw = localStorage.getItem("auth");
    if (authRaw) {
      const auth = JSON.parse(authRaw);
      const nextAuth = {
        ...auth,
        avatar: avatarUrl,
        user: {
          ...(auth.user || {}),
          email,
          name: displayName,
        },
      };
      localStorage.setItem("auth", JSON.stringify(nextAuth));
    } else {
      // fallback
      localStorage.setItem(
        "auth",
        JSON.stringify({
          user: { email, name: displayName },
          role: "user",
          isGuest: false,
          gender,
          avatar: avatarUrl,
        })
      );
    }

    // cập nhật UI liền
    setAvatar(avatarUrl);
  };

  // 2) CẬP NHẬT THÔNG TIN (tên, giới tính, avatar)
  const handleUpdate = () => {
    if (!email) {
      setPassMsg("Không tìm thấy tài khoản để cập nhật.");
      return;
    }

    // cập nhật vào users_db nếu có
    const usersRaw = localStorage.getItem("users_db") || "[]";
    const users = JSON.parse(usersRaw);
    const idx = users.findIndex((u) => u.email === email);
    if (idx !== -1) {
      users[idx] = {
        ...users[idx],
        name: displayName,
        gender: gender,
        avatar: selected?.src || avatar || users[idx].avatar,
      };
      localStorage.setItem("users_db", JSON.stringify(users));
    }

    // cập nhật vào auth
    const authRaw = localStorage.getItem("auth");
    if (authRaw) {
      const auth = JSON.parse(authRaw);
      const nextAuth = {
        ...auth,
        gender: gender,
        avatar: selected?.src || avatar || auth.avatar,
        user: {
          ...(auth.user || {}),
          email: email,
          name: displayName,
        },
      };
      localStorage.setItem("auth", JSON.stringify(nextAuth));
    } else {
      // chưa có thì tạo mới
      const nextAuth = {
        user: { email, name: displayName },
        role: "user",
        isGuest: false,
        gender: gender,
        avatar: selected?.src || avatar || "",
      };
      localStorage.setItem("auth", JSON.stringify(nextAuth));
    }

    setAvatar(selected?.src || avatar);
    setPassMsg("Đã cập nhật thông tin ✅");
  };

  // ĐỔI MẬT KHẨU
  const handleChangePassword = () => {
    if (!email) {
      setPassMsg("Không tìm thấy tài khoản.");
      return;
    }

    if (!oldPass || !newPass || !confirmPass) {
      setPassMsg("Vui lòng nhập đủ 3 ô.");
      return;
    }

    if (newPass !== confirmPass) {
      setPassMsg("Mật khẩu xác nhận không khớp.");
      return;
    }

    // đọc users_db
    const usersRaw = localStorage.getItem("users_db") || "[]";
    const users = JSON.parse(usersRaw);

    // tìm user theo email
    const idx = users.findIndex((u) => u.email === email);
    if (idx === -1) {
      setPassMsg("Không tìm thấy người dùng trong hệ thống.");
      return;
    }

    const userInDb = users[idx];

    // nếu user có password thì bắt check, còn không thì cho đổi luôn
    if (userInDb.password && userInDb.password !== oldPass) {
      setPassMsg("Mật khẩu cũ không đúng.");
      return;
    }

    // cập nhật mật khẩu mới
    users[idx] = {
      ...userInDb,
      password: newPass,
    };
    localStorage.setItem("users_db", JSON.stringify(users));

    // optional: ghi chú vô auth
    const authRaw = localStorage.getItem("auth");
    if (authRaw) {
      const auth = JSON.parse(authRaw);
      localStorage.setItem(
        "auth",
        JSON.stringify({
          ...auth,
          lastPasswordChange: Date.now(),
        })
      );
    }

    setPassMsg("Đổi mật khẩu thành công ✅");
    setOldPass("");
    setNewPass("");
    setConfirmPass("");
    setOpen(false); // đóng modal luôn cho dễ thấy
  };

  return (
    <div className="flex max-w-6xl gap-12 px-6 py-10 mx-auto">
      {/* Cột trái: form */}
      <div className="flex-1">
        <h1 className="mb-2 text-2xl font-bold">Tài khoản</h1>
        <p className="mb-8 text-sm text-white/60">
          Cập nhật thông tin tài khoản
        </p>

        {/* Email */}
        <div className="mb-5">
          <label className="block mb-2 text-sm text-white/70">Email</label>
          <input
            type="text"
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
          <label className="block mb-2 text-sm text-white/70">
            Tên hiển thị
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-[#12151b] border border-white/5 rounded-lg px-4 py-3 text-sm outline-none text-white placeholder:text-white/20 focus:border-[#d9aa3d]"
            placeholder="Nhập tên của bạn"
          />
        </div>

        {/* Giới tính */}
        <div className="mb-7">
          <label className="block mb-3 text-sm text-white/70">Giới tính</label>
          <div className="flex items-center gap-6 text-sm">
            {options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer select-none"
                onClick={() => setGender(opt.value)}
              >
                <span
                  className={`inline-block w-3 h-3 rounded-full border transition-all duration-200 ${
                    gender === opt.value
                      ? "border-[#d9aa3d] bg-[#d9aa3d]"
                      : "border-white/30"
                  }`}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* nút cập nhật */}
        <div
          onClick={handleUpdate}
          className="bg-[#d9aa3d] hover:bg-[#c49731] transition-colors text-sm font-semibold px-8 py-3 rounded-md inline-block cursor-pointer"
        >
          Cập nhật
        </div>

        {passMsg ? (
          <p className="mt-3 text-sm text-green-400">{passMsg}</p>
        ) : null}

        {/* link đổi mật khẩu */}
        <p className="text-sm mt-7 text-white/50">
          Đổi mật khẩu, nhấn vào{" "}
          <span
            onClick={() => {
              setPassMsg(""); // clear msg cũ trước khi mở
              setOpen(true);
            }}
            className="text-[#f0d25b] cursor-pointer hover:underline"
          >
            đây
          </span>
        </p>
      </div>

      {/* Modal đổi mật khẩu */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1d24] rounded-xl p-8 w-[400px] shadow-lg border border-white/10">
            <h2 className="mb-6 text-lg font-semibold text-center">
              Đổi mật khẩu
            </h2>

            {/* Input mật khẩu cũ */}
            <div className="mb-4">
              <label className="block mb-2 text-sm text-white/70">
                Mật khẩu cũ
              </label>
              <input
                type="password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#12151b] border border-white/10 text-sm outline-none focus:border-[#f0d25b]"
              />
            </div>

            {/* Input mật khẩu mới */}
            <div className="mb-4">
              <label className="block mb-2 text-sm text-white/70">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#12151b] border border-white/10 text-sm outline-none focus:border-[#f0d25b]"
              />
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div className="mb-6">
              <label className="block mb-2 text-sm text-white/70">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#12151b] border border-white/10 text-sm outline-none focus:border-[#f0d25b]"
              />
            </div>

            {/* nếu muốn tách message riêng cho modal thì để ở đây */}
            {passMsg ? (
              <p className="mb-4 text-xs text-center text-red-300">{passMsg}</p>
            ) : null}

            {/* Nút hành động */}
            <div className="flex justify-between">
              <div
                onClick={handleChangePassword}
                className="bg-[#f0d25b] text-black font-semibold px-5 py-2 rounded-md hover:bg-[#d9aa3d] transition-colors cursor-pointer inline-flex items-center justify-center"
              >
                Đổi mật khẩu
              </div>
              <div
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cột phải: avatar */}
      <div className="w-[260px] flex flex-col items-center gap-5">
        {/* Ảnh đang dùng */}
        <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-[#1f2127] shadow-[0_0_0_3px_rgba(0,0,0,0.3)]">
          <img
            src={avatar || selected?.src || "/images/test/avatar-small.webp"}
            alt="avatar"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Nút mở modal */}
        <div
          onClick={() => setOpenImg(true)}
          className="flex items-center gap-2 bg-[#12151b] border border-white/5 hover:border-[#d9aa3d] px-4 py-2 rounded-md text-sm cursor-pointer"
        >
          <span className="text-lg">▦</span>
          Ảnh có sẵn
        </div>

        <p className="text-xs text-center text-white/30">Chọn ảnh có sẵn</p>

        {/* MODAL chọn avatar */}
        {openImg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1a1d24] rounded-xl p-6 w-[600px] shadow-lg border border-white/10">
              <h2 className="mb-5 text-lg font-semibold text-center">
                Chọn ảnh đại diện
              </h2>

              <div className="grid grid-cols-3 gap-5 mb-6 sm:grid-cols-4">
                {avatarList.map((ava) => (
                  <div
                    key={ava.id}
                    onClick={() => setSelected(ava)}
                    className={`w-[100px] h-[100px] rounded-full overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                      selected?.id === ava.id
                        ? "border-[#f0d25b] scale-105"
                        : "border-transparent hover:border-white/20"
                    }`}
                  >
                    <img
                      src={ava.src || "/images/default-avatar.png"}
                      alt={`avatar-${ava.id}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4">
                <div
                  onClick={() => setOpenImg(false)}
                  className="inline-flex items-center justify-center px-5 py-2 text-sm transition-colors border rounded-md cursor-pointer border-white/10 hover:bg-white/10"
                >
                  Đóng
                </div>
                <div
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
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
