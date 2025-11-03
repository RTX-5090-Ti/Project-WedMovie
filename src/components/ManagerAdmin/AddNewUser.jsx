import { useState } from "react";

export default function ManagerAdminn() {
  const [users, setUsers] = useState([]);
  const [showUserManager, setShowUserManager] = useState(false);

  // trạng thái cho box "Thêm tài khoản"
  const [showAddBox, setShowAddBox] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");

  // Lấy danh sách user từ localStorage (bỏ admin)
  const loadUsers = () => {
    try {
      const raw = localStorage.getItem("users_db") || "[]";
      const db = JSON.parse(raw);
      // lọc bỏ admin
      const filtered = db.filter((u) => u.email !== "admin@gmail.com");
      setUsers(filtered);
    } catch (e) {
      console.error("Lỗi đọc users_db:", e);
      setUsers([]);
    }
  };

  // Khi bấm nút "Quản lý người dùng"
  const handleOpenUserManager = () => {
    loadUsers();
    setShowUserManager(true);
  };

  // Xoá 1 tài khoản theo email
  const handleDeleteUser = (email) => {
    const raw = localStorage.getItem("users_db") || "[]";
    let db = [];
    try {
      db = JSON.parse(raw);
    } catch {
      db = [];
    }

    const next = db.filter((u) => u.email !== email);
    localStorage.setItem("users_db", JSON.stringify(next));
    // cập nhật lại danh sách (lọc admin lần nữa)
    setUsers(next.filter((u) => u.email !== "admin@gmail.com"));
  };

  // mở box thêm tài khoản
  const handleOpenAddBox = () => {
    setNewName("");
    setNewEmail("");
    setError("");
    setShowAddBox(true);
  };

  // tạo user mới (mật khẩu mặc định = "1")
  const handleCreateUser = () => {
    const email = newEmail.trim();
    const name = newName.trim();

    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }

    const raw = localStorage.getItem("users_db") || "[]";
    let db = [];
    try {
      db = JSON.parse(raw);
    } catch {
      db = [];
    }

    // kiểm tra trùng email
    if (db.some((u) => u.email === email)) {
      setError("Email đã tồn tại");
      return;
    }

    const fallbackName = name || email.split("@")[0] || "User";
    const newUser = {
      email,
      password: "1", // mật khẩu mặc định
      name: fallbackName,
      role: "user",
      avatar: "",
      gender: "unknown",
    };

    db.push(newUser);
    localStorage.setItem("users_db", JSON.stringify(db));

    // reload lại danh sách users (bỏ admin)
    loadUsers();
    setShowAddBox(false);
  };

  return (
    <div className="mt-[100px] p-10 text-white">
      <h1 className="mb-5 text-3xl font-bold">Trang Quản Lý</h1>

      <div className="space-y-4">
        <p>Chào mừng Admin!</p>

        {/* 2 nút chức năng chính */}
        <div className="grid grid-cols-2 gap-6">
          <div className="inline-flex items-center justify-center px-6 py-3 font-semibold text-black cursor-pointer rounded-xl bg-yellow-500/80 hover:bg-yellow-400">
            Quản lý phim 🎬
          </div>

          <div
            className="inline-flex items-center justify-center px-6 py-3 font-semibold text-black cursor-pointer rounded-xl bg-yellow-500/80 hover:bg-yellow-400"
            onClick={handleOpenUserManager}
          >
            Quản lý người dùng 👤
          </div>
        </div>

        {/* Khu quản lý user */}
        {showUserManager && (
          <div className="mt-8">
            <div className="flex items-center justify-between w-[50%] mb-3">
              <h2 className="mb-3 text-2xl font-semibold">
                Danh sách tài khoản
              </h2>
              <span
                className="px-6 py-3 font-semibold text-black cursor-pointer rounded-xl bg-yellow-500/80 hover:bg-yellow-400"
                onClick={handleOpenAddBox}
              >
                Thêm tài khoản
              </span>
            </div>

            {users.length === 0 ? (
              <p className="text-white/70">Hiện chưa có tài khoản nào .</p>
            ) : (
              <ul className="space-y-2">
                {users.map((u) => (
                  <li
                    key={u.email}
                    className="w-[50%] flex items-center justify-between px-4 py-2 text-sm rounded-lg bg-white/5"
                  >
                    <span>{u.email}</span>
                    <div>
                      <img
                        onClick={() => handleDeleteUser(u.email)}
                        className="w-5 cursor-pointer"
                        src="/images/logo-header/letter-x_9313433.png"
                        alt="delete"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Box thêm tài khoản */}
      {showAddBox && (
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
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-white/70">Email</label>
                <input
                  className="px-3 py-2 text-sm bg-transparent border rounded-lg outline-none border-white/20 placeholder:text-white/40 focus:border-yellow-400"
                  type="email"
                  placeholder="Nhập email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <p className="text-xs text-white/60">
                Mật khẩu mặc định:{" "}
                <span className="font-semibold text-yellow-300">1</span>
              </p>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex justify-end gap-3 pt-2 mt-4">
                <div
                  onClick={() => setShowAddBox(false)}
                  className="px-4 py-2 text-sm border cursor-pointer rounded-xl border-white/30 hover:bg-white/10"
                >
                  Đóng
                </div>
                <div
                  onClick={handleCreateUser}
                  className="px-4 py-2 text-sm font-semibold text-black cursor-pointer rounded-xl bg-yellow-500/80 hover:bg-yellow-400"
                >
                  Tạo
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
