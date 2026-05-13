import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const STATS = [
  { value: "50K+", label: "Active Jobs" },
  { value: "2M+", label: "Job Seekers" },
  { value: "80K+", label: "Companies" },
  { value: "95%", label: "Match Accuracy" },
];

const CATEGORIES = [
  { icon: "💻", label: "Technology", count: "12,400 jobs" },
  { icon: "📊", label: "Finance", count: "8,200 jobs" },
  { icon: "🏥", label: "Healthcare", count: "6,800 jobs" },
  { icon: "🎨", label: "Design", count: "4,500 jobs" },
  { icon: "📱", label: "Marketing", count: "5,100 jobs" },
  { icon: "🏗️", label: "Engineering", count: "9,300 jobs" },
  { icon: "📚", label: "Education", count: "3,700 jobs" },
  { icon: "⚖️", label: "Legal", count: "2,100 jobs" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "📄",
    title: "Upload Your Resume",
    desc: "Upload your PDF resume. Our AI instantly reads and extracts your skills automatically.",
  },
  {
    step: "02",
    icon: "🤖",
    title: "AI Analyses Your Profile",
    desc: "Our TF-IDF algorithm scores every job against your skills and experience level.",
  },
  {
    step: "03",
    icon: "🎯",
    title: "Get Matched Jobs",
    desc: "See jobs ranked by match percentage. Apply to the ones that fit you best.",
  },
  {
    step: "04",
    icon: "🚀",
    title: "Land Your Dream Job",
    desc: "Track your applications in real time and get hired faster than ever.",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Software Engineer at Google",
    avatar: "PS",
    text: "JobNova matched me with my dream job at 94% match. The AI recommendations were spot on!",
    color: "bg-blue-600",
  },
  {
    name: "Rahul Verma",
    role: "Product Manager at Flipkart",
    avatar: "RV",
    text: "As a recruiter, the match percentage helped me shortlist candidates 3x faster.",
    color: "bg-orange-500",
  },
  {
    name: "Ananya Singh",
    role: "Data Scientist at Amazon",
    avatar: "AS",
    text: "Uploaded my resume and got 15 matched jobs within minutes. Incredible experience!",
    color: "bg-green-600",
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">

      {/* ── Hero Section ── */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-orange-400 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fadeInUp">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              AI-Powered Job Matching — Find jobs that truly fit you
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
              Find Your Dream Job<br />
              <span className="text-orange-400">with AI Precision</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Upload your resume. Our AI reads your skills and matches you with the most relevant jobs — ranked by compatibility percentage.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {user ? (
                <Link to="/dashboard" className="btn-accent text-base px-8 py-3">
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-accent text-base px-8 py-3">
                    Get Started Free →
                  </Link>
                  <Link to="/jobs" className="btn-outline border-white text-white hover:bg-white hover:text-blue-700 text-base px-8 py-3">
                    Browse Jobs
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14 max-w-3xl mx-auto">
            {STATS.map((s, i) => (
              <div key={i} className="text-center animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-3xl font-extrabold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>{s.value}</div>
                <div className="text-blue-200 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Job Categories ── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 animate-fadeInUp">
            <h2 className="section-title">Explore by Category</h2>
            <p className="section-sub">Thousands of jobs across every industry</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={i}
                to="/jobs"
                className="card p-5 flex flex-col items-center text-center cursor-pointer group animate-fadeInUp"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="text-3xl mb-3">{cat.icon}</span>
                <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{cat.label}</h3>
                <p className="text-xs text-slate-400 mt-1">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="section-title">How JobNova Works</h2>
            <p className="section-sub">Land your dream job in 4 simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="card p-6 relative animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-5xl font-extrabold text-blue-50 absolute top-4 right-4" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {item.step}
                </div>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-base font-semibold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="section-title">Loved by Professionals</h2>
            <p className="section-sub">See what our users say about JobNova</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card p-6 animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full ${t.color} text-white flex items-center justify-center font-bold text-sm`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-14 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center animate-fadeInUp">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            Ready to Find Your Perfect Job?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of professionals who found their dream jobs with AI matching.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn-accent text-base px-8 py-3">
              Create Free Account →
            </Link>
            <Link to="/jobs" className="btn-outline border-white text-white hover:bg-white hover:text-blue-700 text-base px-8 py-3">
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z"/>
                </svg>
              </div>
              <span className="text-white font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>JobNova</span>
            </div>
            <p className="text-sm">© 2026 JobNova. Built with React + Django + AI.</p>
            <div className="flex gap-4 text-sm">
              <Link to="/jobs" className="hover:text-white transition-colors">Jobs</Link>
              <Link to="/register" className="hover:text-white transition-colors">Register</Link>
              <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}