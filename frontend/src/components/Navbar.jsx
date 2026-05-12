import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`text-sm font-medium transition-colors px-1 pb-0.5 ${
        isActive(to)
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-slate-600 hover:text-blue-600"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" fill="white" fillOpacity="0.9"/>
                <path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="14" r="2" fill="#0057e7"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'Sora, sans-serif' }} className="text-xl font-800 text-slate-800">
              Hire<span className="text-blue-600">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLink("/jobs", "Browse Jobs")}
            {user?.role === "seeker" && navLink("/resume", "My Resume")}
            {user?.role === "seeker" && navLink("/dashboard", "Dashboard")}
            {user?.role === "recruiter" && navLink("/post-job", "Post a Job")}
            {user?.role === "recruiter" && navLink("/dashboard", "Dashboard")}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs font-semibold text-slate-800">{user.full_name}</p>
                    <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="btn-outline text-red-500 border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 text-xs px-3 py-2">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-outline text-sm px-4 py-2">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/>
                    <line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-4 animate-fadeIn">
          {user && (
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {user.full_name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{user.full_name}</p>
                <p className="text-xs text-slate-400 capitalize">{user.role}</p>
              </div>
            </div>
          )}
          {navLink("/jobs", "Browse Jobs")}
          {user?.role === "seeker" && navLink("/resume", "My Resume")}
          {user?.role === "seeker" && navLink("/dashboard", "Dashboard")}
          {user?.role === "recruiter" && navLink("/post-job", "Post a Job")}
          {user?.role === "recruiter" && navLink("/dashboard", "Dashboard")}
          {user ? (
            <button onClick={handleLogout} className="text-sm text-red-500 font-medium text-left">
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline w-full justify-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary w-full justify-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}