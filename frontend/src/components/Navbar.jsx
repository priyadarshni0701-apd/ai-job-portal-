import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
        <img src={logo}  alt="logo" className="w-10 h-10 object-contain" />
        <span>JobNova</span>
        </Link>

        {/* Desktop Menu */}
        {user && (
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-slate-600">
              {user.full_name}{" "}
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full capitalize">
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
              className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        )}

        {!user && (
          <div className="hidden md:flex gap-3">
            <Link to="/login" className="text-sm text-slate-600 hover:text-blue-600">Login</Link>
            <Link to="/register" className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700">
              Register
            </Link>
          </div>
        )}

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-slate-600 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-3 border-t border-slate-100 pt-3 pb-2 px-4 flex flex-col gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-600 font-medium">
                {user.full_name}{" "}
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full capitalize">
                  {user.role}
                </span>
              </span>
              {user.role === "seeker" && (
                <>
                  <Link to="/jobs" onClick={() => setMenuOpen(false)} className="text-sm text-slate-700 hover:text-blue-600">Jobs</Link>
                  <Link to="/resume" onClick={() => setMenuOpen(false)} className="text-sm text-slate-700 hover:text-blue-600">Resume</Link>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm text-slate-700 hover:text-blue-600">Dashboard</Link>
                </>
              )}
              {user.role === "recruiter" && (
                <>
                  <Link to="/post-job" onClick={() => setMenuOpen(false)} className="text-sm text-slate-700 hover:text-blue-600">Post Job</Link>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm text-slate-700 hover:text-blue-600">Dashboard</Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-left text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm text-slate-700 hover:text-blue-600">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="text-sm text-blue-600 font-medium">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}