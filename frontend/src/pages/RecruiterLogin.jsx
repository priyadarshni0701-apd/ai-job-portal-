import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";

export default function RecruiterLogin() {
  const { loginRecruiter }            = useAuth();
  const navigate                      = useNavigate();
  const [form, setForm]               = useState({ email: "", password: "" });
  const [loading, setLoading]         = useState(false);
  const [showPass, setShowPass]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginRecruiter(form.email, form.password);
      toast.success("Welcome back! 🏢");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-orange-600 to-red-700 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-yellow-400 blur-3xl" />
        </div>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <img src={logo} alt="JobNova" className="h-10 w-auto object-contain" />
          <span className="text-2xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>
            Job<span className="text-yellow-300">Nova</span>
          </span>
        </Link>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm mb-6">
            🏢 Recruiter Portal
          </div>
          <h2 className="text-4xl font-extrabold mb-4 leading-tight"
            style={{ fontFamily: "Sora, sans-serif" }}>
            Hire Smarter<br />with AI 🤖
          </h2>
          <p className="text-orange-100 text-lg mb-8">
            Find the perfect candidate using AI-powered matching.
          </p>
          <div className="space-y-3">
            {[
              "Post jobs and reach thousands of candidates",
              "AI ranks applicants by skill match percentage",
              "Manage applications with one-click status updates",
              "Find the right hire 3x faster",
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shrink-0">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-orange-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-orange-200 text-sm relative z-10">
          Are you a job seeker?{" "}
          <Link to="/login" className="text-white font-semibold underline">
            Seeker Login →
          </Link>
        </p>
      </div>

      {/* ── Right Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md animate-fadeInUp">
          <div className="card p-8">

            {/* Mobile logo */}
            <div className="flex lg:hidden items-center justify-center gap-2 mb-6">
              <img src={logo} alt="JobNova" className="h-9 w-auto object-contain" />
              <span className="text-xl font-bold text-slate-800"
                style={{ fontFamily: "Sora, sans-serif" }}>
                Job<span className="text-blue-600">Nova</span>
              </span>
            </div>

            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-3xl mx-auto mb-4">
                🏢
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-1"
                style={{ fontFamily: "Sora, sans-serif" }}>
                Recruiter Login
              </h1>
              <p className="text-sm text-slate-500">
                Sign in to find your perfect candidate
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Work Email
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    type="email" required value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field pl-10"
                    placeholder="recruiter@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    type={showPass ? "text" : "password"} required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-accent w-full justify-center py-3 text-base">
                {loading ? (
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : "Sign In as Recruiter →"}
              </button>
            </form>

            <div className="divider" />

            <div className="space-y-3 text-center text-sm">
              <p className="text-slate-500">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                  Register free →
                </Link>
              </p>
              <p className="text-slate-400">
                Are you a job seeker?{" "}
                <Link to="/login" className="text-blue-500 font-semibold hover:underline">
                  Seeker Login →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}