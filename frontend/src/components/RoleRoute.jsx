import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-slate-400">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== role) return <Navigate to="/dashboard" />;
  return children;
}