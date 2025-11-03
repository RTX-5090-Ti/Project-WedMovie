import { useState } from "react";
import ManagerTabs from "./ManagerTabs";
import UserManagerSection from "./UserManagerSection";
import AddUserModal from "./AddUserModal";
import MovieManagerSection from "./MovieManagerSection";
import MovieEditModal from "./MovieEditModal";
import AddMovieModal from "./AddMovieModal";

const API = import.meta.env?.VITE_API_BASE || "http://localhost:5000";

export default function ManagerAdmin() {
  const [activeTab, setActiveTab] = useState("movies"); // "movies" | "users"

  const [users, setUsers] = useState([]);
  const [showAddBox, setShowAddBox] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");

  // state cho phim + trang hiện tại
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // state cho popup thêm phim
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [newMovieForm, setNewMovieForm] = useState({
    titleVi: "",
    titleEn: "",
    isSeries: false,
    featured: false,
    nationVi: "",
    nationEn: "",
    year: "",
    poster: "",
    smallPoster: "",
    backdrop: "",
    genresVi: "",
    genresEn: "",
    descVi: "",
    descEn: "",
    trailer: "",
    duration: "",
    rating: "",
  });

  // state cho popup edit phim
  const [editingMovie, setEditingMovie] = useState(null);
  const [editForm, setEditForm] = useState({
    titleVi: "",
    titleEn: "",
    isSeries: false,
    descVi: "",
    descEn: "",
    featured: false,
  });

  // Lấy danh sách user từ localStorage (bỏ admin)
  const loadUsers = () => {
    try {
      const raw = localStorage.getItem("users_db") || "[]";
      const db = JSON.parse(raw);
      const filtered = db.filter((u) => u.email !== "admin@gmail.com");
      setUsers(filtered);
    } catch (e) {
      console.error("Lỗi đọc users_db:", e);
      setUsers([]);
    }
  };

  // Lấy danh sách phim từ JSON-server (db.json)
  const loadMovies = async () => {
    try {
      // const res = await fetch(`${API}/movies`);
      const res = await fetch(`${API}/movies?_sort=id&_order=desc`);

      if (!res.ok) throw new Error("Không fetch được movies");
      const data = await res.json();
      setMovies(Array.isArray(data) ? data : []);
      setCurrentPage(1); // reset về trang 1 mỗi lần load
    } catch (e) {
      console.error("Lỗi đọc movies:", e);
      setMovies([]);
    }
  };

  const handleOpenAddMovie = () => {
    setNewMovieForm({
      titleVi: "",
      titleEn: "",
      isSeries: false,
      featured: false,
      nationVi: "",
      nationEn: "",
      year: "",
      poster: "",
      smallPoster: "",
      backdrop: "",
      genresVi: "",
      genresEn: "",
      descVi: "",
      descEn: "",
      trailer: "",
      duration: "",
      rating: "",
    });
    setShowAddMovie(true);
  };

  const handleCreateMovie = async () => {
    const {
      titleVi,
      titleEn,
      isSeries,
      featured,
      nationVi,
      nationEn,
      year,
      poster,
      smallPoster,
      backdrop,
      genresVi,
      genresEn,
      descVi,
      descEn,
      trailer,
      duration,
      rating,
    } = newMovieForm;

    if (!titleVi.trim() || !titleEn.trim()) {
      alert("Vui lòng nhập tiêu đề tiếng Việt và tiếng Anh");
      return;
    }

    // parse year & rating
    const yearNum = year ? Number(year) : null;
    const ratingNum = rating ? Number(rating) : null;

    // genres: tách bằng dấu phẩy
    const viArr = genresVi
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const enArr = genresEn
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const genres = viArr.map((vi, idx) => ({
      vi,
      en: enArr[idx] || enArr[enArr.length - 1] || vi,
    }));

    // auto tạo id mới dạng string
    const nextIdNumber =
      movies.reduce((max, m) => {
        const n = Number(m.id);
        if (!isNaN(n) && n > max) return n;
        return max;
      }, 0) + 1;

    const payload = {
      id: String(nextIdNumber),
      title: {
        en: titleEn,
        vi: titleVi,
      },
      isSeries,
      badges: [], // có thể thêm sau
      nation: {
        en: nationEn || nationVi,
        vi: nationVi || nationEn,
      },
      year: yearNum || new Date().getFullYear(),
      poster,
      smallPoster,
      genres,
      description: {
        en: descEn,
        vi: descVi,
      },
      backdrop,
      trailer,
      duration,
      rating: ratingNum || 0,
      featured,
    };

    try {
      const res = await fetch(`${API}/movies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Thêm phim thất bại");

      const created = (await res.json().catch(() => null)) || payload;

      // cập nhật state movies để thấy ngay trên UI
      // setMovies((prev) => [...prev, created]);
      setMovies((prev) => [created, ...prev]);

      setShowAddMovie(false);
      alert("Thêm phim mới thành công!");
    } catch (e) {
      console.error("Lỗi thêm movie:", e);
      alert("Không thêm được phim. Kiểm tra lại JSON-server.");
    }
  };

  const openEditMovie = (movie) => {
    setEditingMovie(movie);
    setEditForm({
      titleVi: movie.title?.vi || "",
      titleEn: movie.title?.en || "",
      isSeries: !!movie.isSeries,
      descVi: movie.description?.vi || "",
      descEn: movie.description?.en || "",
      featured: !!movie.featured,
    });
  };

  const closeEditMovie = () => {
    setEditingMovie(null);
  };

  const handleUpdateMovie = async () => {
    if (!editingMovie) return;

    const id = editingMovie.id;

    // chuẩn bị payload mới, giữ lại các field khác (year, rating, ...),
    // chỉ sửa title, isSeries, description
    const payload = {
      ...editingMovie,
      title: {
        ...(editingMovie.title || {}),
        vi: editForm.titleVi,
        en: editForm.titleEn,
      },
      isSeries: editForm.isSeries,
      featured: editForm.featured,
      description: {
        ...(editingMovie.description || {}),
        vi: editForm.descVi,
        en: editForm.descEn,
      },
    };

    try {
      const res = await fetch(`${API}/movies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");

      // JSON-server thường trả về object mới, nhưng nếu không thì dùng payload
      const updated = (await res.json().catch(() => null)) || payload;

      // cập nhật lại state movies
      setMovies((prev) => prev.map((m) => (m.id === id ? updated : m)));

      setEditingMovie(null);
      alert("Cập nhật thông tin phim thành công!");
    } catch (e) {
      console.error("Lỗi cập nhật movie:", e);
      alert("Không cập nhật được phim. Kiểm tra lại JSON-server.");
    }
  };

  // đổi tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "users") {
      loadUsers();
    }
    if (tab === "movies") {
      loadMovies();
    }
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

    if (db.some((u) => u.email === email)) {
      setError("Email đã tồn tại");
      return;
    }

    const fallbackName = name || email.split("@")[0] || "User";
    const newUser = {
      email,
      password: "1",
      name: fallbackName,
      role: "user",
      avatar: "",
      gender: "unknown",
    };

    db.push(newUser);
    localStorage.setItem("users_db", JSON.stringify(db));

    loadUsers();
    setShowAddBox(false);
  };

  // Xoá 1 phim theo id
  const handleDeleteMovie = async (id) => {
    const ok = window.confirm("Bạn có chắc muốn gỡ phim này không?");
    if (!ok) return;

    try {
      const res = await fetch(`${API}/movies/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Xoá thất bại");

      // Xoá trong state hiện tại
      setMovies((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      console.error("Lỗi xoá movie:", e);
      alert("Không xoá được phim. Kiểm tra lại JSON-server.");
    }
  };

  return (
    <div className="mt-[100px] p-10 text-white">
      <h1 className="mb-5 text-3xl font-bold">Trang Quản Lý</h1>

      <p className="mb-4">Chào mừng Admin!</p>

      {/* 2 nút tab có active state */}
      <ManagerTabs activeTab={activeTab} onChange={handleTabChange} />

      {/* Nội dung mỗi tab */}
      {activeTab === "users" && (
        <UserManagerSection
          users={users}
          onDeleteUser={handleDeleteUser}
          onOpenAddBox={handleOpenAddBox}
        />
      )}

      {activeTab === "movies" && (
        <MovieManagerSection
          movies={movies}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onDeleteMovie={handleDeleteMovie}
          onSelectMovie={openEditMovie}
          onOpenAddMovie={handleOpenAddMovie}
        />
      )}

      {/* Popup thêm tài khoản */}
      <AddUserModal
        open={showAddBox}
        newName={newName}
        newEmail={newEmail}
        error={error}
        onChangeName={setNewName}
        onChangeEmail={setNewEmail}
        onClose={() => setShowAddBox(false)}
        onCreate={handleCreateUser}
      />
      {/* Edit phim */}
      <MovieEditModal
        open={!!editingMovie}
        form={editForm}
        onChange={setEditForm}
        onClose={closeEditMovie}
        onSubmit={handleUpdateMovie}
      />
      {/* Add phim mơi */}
      <AddMovieModal
        open={showAddMovie}
        form={newMovieForm}
        onChange={setNewMovieForm}
        onClose={() => setShowAddMovie(false)}
        onSubmit={handleCreateMovie}
      />
    </div>
  );
}
