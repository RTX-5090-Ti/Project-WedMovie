import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

// Kiểm tra có phiên hợp lệ chưa (admin, user, guest)
export default function ProtectedRoute({ allowGuest = false }) {
  const { user, isGuest, loading, authError, retryAuth, notice } = useAuth();
  const loc = useLocation();

  if (loading) {
    return (
      <div className="p-6 text-white/50">Đang kiểm tra phiên đăng nhập...</div>
    );
  }
  if (authError) return <div role="alert" className="p-8 text-white"><p>{authError}</p><button onClick={retryAuth}>Thử lại</button></div>;
  if (user) return <>{notice && <p role="status" className="fixed bottom-0 z-[100] p-3 text-white bg-black">{notice}</p>}<Outlet /></>;
  if (allowGuest && isGuest) return <Outlet />; // cho guest nếu bật
  // Còn lại thì đá về Login
  return <Navigate to="/login" state={{ from: loc }} replace />;
}
