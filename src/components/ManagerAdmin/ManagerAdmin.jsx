import "./ManagerAdmin.css";
import { useState, useRef, useMemo } from "react";
import ManagerTabs from "./ManagerTabs";
import UserManagerSection from "./UserManagerSection";
import AddUserModal from "./AddUserModal";
import MovieManagerSection from "./MovieManagerSection";
import MovieEditModal from "./MovieEditModal";
import AddMovieModal from "./AddMovieModal";
import { newestMovieFirst } from "../../lib/movieSort";
import useMovies from "../../lib/useMovies";
import { saveMovie, deleteMovie } from "../../lib/movieStore";
import { listUsers, createUser, deleteUser } from "../../lib/users";
import { validateMovie } from "../../lib/validation";
const emptyMovie = { titleVi: "", titleEn: "", isSeries: false, featured: false, nationVi: "", nationEn: "", year: "", poster: "", smallPoster: "", backdrop: "", genresVi: "", genresEn: "", descVi: "", descEn: "", trailer: "", duration: "", rating: "" };
export default function ManagerAdmin() {
  const [activeTab, setActiveTab] = useState("movies");
  const catalog = useMovies();
  const movies = useMemo(() => [...catalog.data].sort(newestMovieFirst), [catalog.data]);
  const { loading: moviesLoading, error: moviesError, retry: loadMovies } = catalog;
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [showAddBox, setShowAddBox] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [movieError, setMovieError] = useState("");
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [newMovieForm, setNewMovieForm] = useState(emptyMovie);
  const [editingMovie, setEditingMovie] = useState(null);
  const [editForm, setEditForm] = useState(emptyMovie);
  const begin = () => { if (busyRef.current) return false; busyRef.current = true; setBusy(true); return true; };
  const finish = () => { busyRef.current = false; setBusy(false); };
  const loadUsers = async () => {
    setUsersLoading(true); setUsersError("");
    try { setUsers(await listUsers()); } catch (err) { setUsersError(err.message); }
    finally { setUsersLoading(false); }
  };
  const handleOpenAddMovie = () => { setMovieError(""); setNewMovieForm({ ...emptyMovie }); setShowAddMovie(true); };
  const handleCreateMovie = async () => {
    const validation = validateMovie(newMovieForm);
    if (validation) { setMovieError(validation); return; }
    if (!begin()) return;
    setMovieError("");
    const f = Object.fromEntries(Object.entries(newMovieForm).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value]));
    const vi = f.genresVi.split(",").map((value) => value.trim()).filter(Boolean);
    const en = f.genresEn.split(",").map((value) => value.trim()).filter(Boolean);
    try {
      await saveMovie({ id: crypto.randomUUID(), createdAt: new Date().toISOString(),
        title: { vi: f.titleVi, en: f.titleEn }, description: { vi: f.descVi, en: f.descEn },
        nation: { vi: f.nationVi || f.nationEn, en: f.nationEn || f.nationVi },
        genres: vi.map((value, index) => ({ vi: value, en: en[index] || value })), badges: [],
        year: f.year ? Number(f.year) : new Date().getFullYear(), rating: f.rating ? Number(f.rating) : 0,
        poster: f.poster, smallPoster: f.smallPoster, backdrop: f.backdrop, trailer: f.trailer,
        duration: f.duration, isSeries: f.isSeries, featured: f.featured,
      }, true);
      setCurrentPage(1); setShowAddMovie(false);
    } catch (err) { setMovieError(err.message); } finally { finish(); }
  };
  const openEditMovie = (movie) => {
    setMovieError(""); setEditingMovie(movie);
    setEditForm({ titleVi: movie.title?.vi || "", titleEn: movie.title?.en || "", descVi: movie.description?.vi || "", descEn: movie.description?.en || "", isSeries: !!movie.isSeries, featured: !!movie.featured });
  };
  const closeEditMovie = () => { if (!busyRef.current) setEditingMovie(null); };
  const handleUpdateMovie = async () => {
    if (!editingMovie) return;
    const validation = validateMovie(editForm);
    if (validation) { setMovieError(validation); return; }
    if (!begin()) return;
    setMovieError("");
    try {
      await saveMovie({ id: editingMovie.id,
        title: { vi: editForm.titleVi.trim(), en: editForm.titleEn.trim() },
        description: { vi: editForm.descVi.trim(), en: editForm.descEn.trim() },
        isSeries: editForm.isSeries, featured: editForm.featured,
      });
      setEditingMovie(null);
    } catch (err) { setMovieError(err.message); } finally { finish(); }
  };
  const handleTabChange = (tab) => { if (busyRef.current) return; setActiveTab(tab); if (tab === "users") loadUsers(); };
  const handleDeleteUser = async (email) => {
    const user = users.find((item) => item.email === email);
    if (!user || !window.confirm("Bạn có chắc muốn xóa tài khoản này?") || !begin()) return;
    try { await deleteUser(user.id); await loadUsers(); }
    catch (err) { setUsersError(err.message); } finally { finish(); }
  };
  const handleOpenAddBox = () => { setNewName(""); setNewEmail(""); setNewPassword(""); setError(""); setShowAddBox(true); };
  const handleCreateUser = async () => {
    if (!begin()) return;
    setError("");
    try { await createUser({ name: newName, email: newEmail, password: newPassword }); setShowAddBox(false); await loadUsers(); }
    catch (err) { setError(err.message); } finally { finish(); }
  };
  const handleDeleteMovie = async (id) => {
    if (!window.confirm("Bạn có chắc muốn gỡ phim này không?") || !begin()) return;
    setMovieError("");
    try { await deleteMovie(id); setCurrentPage((page) => Math.min(page, Math.max(1, Math.ceil((movies.length - 1) / 14)))); }
    catch (err) { setMovieError(err.message); } finally { finish(); }
  };
  return (
    <div className="admin-page mt-[100px] p-10 text-white">
      <h1 className="mb-5 text-3xl font-bold">Trang Quản Lý</h1>

      <p className="mb-4">Chào mừng Admin!</p>

      {/* 2 nút tab có active state */}
      <ManagerTabs activeTab={activeTab} onChange={handleTabChange} />

      {movieError && !showAddMovie && !editingMovie && <p role="alert" className="text-red-400">{movieError}</p>}
      {busy && <p role="status">Đang lưu thay đổi...</p>}
      {/* Nội dung mỗi tab */}
      {activeTab === "users" && (usersLoading ? <p role="status">Đang tải tài khoản...</p> : usersError ? <div role="alert"><p>{usersError}</p><button onClick={loadUsers}>Thử lại</button></div> : (
        <UserManagerSection
          users={users}
          onDeleteUser={handleDeleteUser}
          onOpenAddBox={handleOpenAddBox}
        />
      ))}

      {activeTab === "movies" && (moviesLoading ? (
        <p role="status" className="mt-8 text-white/70">
          Đang tải danh sách phim...
        </p>
      ) : moviesError ? (
        <div role="alert" className="mt-8">
          <p className="text-red-400">{moviesError}</p>
          <button
            type="button"
            onClick={loadMovies}
            className="px-4 py-2 mt-3 font-semibold text-black bg-yellow-400 rounded-lg cursor-pointer hover:bg-yellow-300"
          >
            Thử lại
          </button>
        </div>
      ) : (
        <MovieManagerSection
          movies={movies}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onDeleteMovie={handleDeleteMovie}
          onSelectMovie={openEditMovie}
          onOpenAddMovie={handleOpenAddMovie}
        />
      ))}

      {/* Popup thêm tài khoản */}
      <AddUserModal
        open={showAddBox}
        newName={newName}
        newEmail={newEmail}
        error={error}
        busy={busy}
        newPassword={newPassword}
        onChangePassword={setNewPassword}
        onChangeName={setNewName}
        onChangeEmail={setNewEmail}
        onClose={() => { if (!busy) setShowAddBox(false); }}
        onCreate={handleCreateUser}
      />
      {/* Edit phim */}
      <MovieEditModal
        open={!!editingMovie}
        form={editForm}
        onChange={setEditForm}
        onClose={closeEditMovie}
        error={movieError}
        busy={busy}
        onSubmit={handleUpdateMovie}
      />
      {/* Add phim mơi */}
      <AddMovieModal
        open={showAddMovie}
        form={newMovieForm}
        onChange={setNewMovieForm}
        onClose={() => { if (!busy) setShowAddMovie(false); }}
        error={movieError}
        busy={busy}
        onSubmit={handleCreateMovie}
      />
    </div>
  );
}
