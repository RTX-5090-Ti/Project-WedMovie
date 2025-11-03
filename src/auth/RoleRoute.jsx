import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Kiểm tra Admin và User
export default function RoleRoute({ role }) {
  const { role: current } = useAuth();
  if (current === role) return <Outlet />;
  return <Navigate to="/home" replace />;
}
