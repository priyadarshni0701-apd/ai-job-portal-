import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center animate-fadeInUp">
        <div className="text-8xl font-extrabold text-blue-600 mb-4"
          style={{ fontFamily: "Sora, sans-serif" }}>
          404
        </div>
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2"
          style={{ fontFamily: "Sora, sans-serif" }}>
          Page Not Found
        </h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary px-6 py-3">
            ← Back to Home
          </Link>
          <Link to="/jobs" className="btn-outline px-6 py-3">
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}