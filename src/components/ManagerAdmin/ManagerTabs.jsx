// 2 nút Active

export default function ManagerTabs({ activeTab, onChange }) {
  const base =
    "inline-flex items-center justify-center px-6 py-3 font-semibold text-sm rounded-xl cursor-pointer transition-all duration-200";

  const moviesActive = activeTab === "movies";
  const usersActive = activeTab === "users";

  const moviesClass = `${base} ${
    moviesActive
      ? "bg-yellow-400 text-black shadow-lg shadow-yellow-500/30 scale-[1.02]"
      : "bg-yellow-500/80 text-black hover:bg-yellow-400 hover:scale-[1.01]"
  }`;

  const usersClass = `${base} ${
    usersActive
      ? "bg-yellow-400 text-black shadow-lg shadow-yellow-500/30 scale-[1.02]"
      : "bg-yellow-500/80 text-black hover:bg-yellow-400 hover:scale-[1.01]"
  }`;

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className={moviesClass} onClick={() => onChange("movies")}>
        Quản lý phim 🎬
      </div>

      <div className={usersClass} onClick={() => onChange("users")}>
        Quản lý người dùng 👤
      </div>
    </div>
  );
}
