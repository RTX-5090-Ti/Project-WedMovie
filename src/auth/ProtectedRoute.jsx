import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Kiểm tra có phiên hợp lệ chưa (admin, user, guest)
export default function ProtectedRoute({ allowGuest = false }) {
  const { user, isGuest, loading } = useAuth();
  const loc = useLocation();

  if (loading) {
    return (
      <div className="p-6 text-white/50">Đang kiểm tra phiên đăng nhập...</div>
    );
  }
  if (user) return <Outlet />; // user thật
  if (allowGuest && isGuest) return <Outlet />; // cho guest nếu bật
  // Còn lại thì đá về Login
  return <Navigate to="/login" state={{ from: loc }} replace />;
}
