import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <Link to="/" className="flex item-center gap-2">
      <img src={logo} alt="logo" className="w-8 h-8" />
      <span className="text-2xl font-bold text-blue-600">JobNova</span>
     </Link>
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            {user.full_name}{" "}
            <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
              {user.role}
            </span>
          </span>
          {user.role === "seeker" && (
            <>
              <Link to="/jobs" className="text-sm text-slate-600 hover:text-blue-600">Jobs</Link>
              <Link to="/resume" className="text-sm text-slate-600 hover:text-blue-600">Resume</Link>
              <Link to="/dashboard" className="text-sm text-slate-600 hover:text-blue-600">Dashboard</Link>
            </>
          )}
          {user.role === "recruiter" && (
            <>
              <Link to="/post-job" className="text-sm text-slate-600 hover:text-blue-600">Post Job</Link>
              <Link to="/dashboard" className="text-sm text-slate-600 hover:text-blue-600">Dashboard</Link>
            </>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <Link to="/login" className="text-sm text-slate-600 hover:text-blue-600">Login</Link>
          <Link to="/register" className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700">Register</Link>
        </div>
      )}
    </nav>
  );
}