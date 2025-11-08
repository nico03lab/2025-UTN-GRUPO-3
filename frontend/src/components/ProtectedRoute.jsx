import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute({ allowedRoles = [] }) {
  const { user, ready } = useAuth();

  if (!ready) {
    return <div className="text-center text-gray-500 mt-20">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const userRole = (user.rol || user.tipo || user.Tipo)?.toLowerCase();

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
