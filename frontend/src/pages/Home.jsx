import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    name: "Arun Kumar",
    role: "Frontend Developer",
    avatar: "AK",
    text: "JobNova helped me land a frontend developer role within 2 weeks. The AI recommendations were very accurate.",
    color: "bg-blue-600",
  },
  {
    name: "Sneha Reddy",
    role: "HR Recruiter",
    avatar: "SR",
    text: "Posting jobs and managing applications became very easy with JobNova. The dashboard is clean and simple.",
    color: "bg-orange-500",
  },
  {
    name: "Vignesh Kumar",
    role: "Data Analyst",
    avatar: "VK",
    text: "I uploaded my resume and quickly found jobs matching my skills. The experience was smooth and professional.",
    color: "bg-green-600",
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
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

            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Find Your Dream Job
              <br />
              <span className="text-orange-400">
                with AI Precision
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Upload your resume. Our AI reads your skills and matches you
              with the most relevant jobs — ranked by compatibility percentage.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn-accent text-base px-8 py-3"
                >
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-accent text-base px-8 py-3"
                  >
                    Get Started Free →
                  </Link>

                  <Link
                    to="/jobs"
                    className="btn-outline border-white text-white hover:bg-white hover:text-blue-700 text-base px-8 py-3"
                  >
                    Browse Jobs
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      </section>

     
      {/* How It Works */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-10">
            <h2 className="section-title">How JobNova Works</h2>
            <p className="section-sub">
              Land your dream job in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="card p-6 relative">

                <div
                  className="text-5xl font-extrabold text-blue-50 absolute top-4 right-4"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  {item.step}
                </div>

                <div className="text-3xl mb-4">{item.icon}</div>

                <h3 className="text-base font-semibold text-slate-800 mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.desc}
                </p>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-10">
            <h2 className="section-title">Loved by Professionals</h2>
            <p className="section-sub">
              See what our users say about JobNova
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card p-6">

                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-full ${t.color} text-white flex items-center justify-center font-bold text-sm`}
                  >
                    {t.avatar}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {t.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      {t.role}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  "{t.text}"
                </p>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">

          <h2
            className="text-3xl sm:text-4xl font-extrabold mb-4"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Ready to Find Your Perfect Job?
          </h2>

          <p className="text-blue-100 mb-8 text-lg">
            Join professionals who found their dream jobs with AI matching.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">

            <Link
              to="/register"
              className="btn-accent text-base px-8 py-3"
            >
              Create Free Account →
            </Link>

            <Link
              to="/jobs"
              className="btn-outline border-white text-white hover:bg-white hover:text-blue-700 text-base px-8 py-3"
            >
              Browse Jobs
            </Link>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" />
                </svg>
              </div>

              <span
                className="text-white font-bold"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                JobNova
              </span>
            </div>

            <p className="text-sm">
              © 2026 JobNova. Built with React + Django + AI.
            </p>

            <div className="flex gap-4 text-sm">
              <Link to="/jobs" className="hover:text-white">
                Jobs
              </Link>

              <Link to="/register" className="hover:text-white">
                Register
              </Link>

              <Link to="/login" className="hover:text-white">
                Login
              </Link>
            </div>

          </div>

        </div>
      </footer>

    </div>
  );
}