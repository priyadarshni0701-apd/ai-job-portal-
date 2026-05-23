import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  applied:     { color: "badge-blue",   label: "Applied" },
  reviewing:   { color: "badge-yellow", label: "Reviewing" },
  shortlisted: { color: "badge-purple", label: "Shortlisted" },
  rejected:    { color: "badge-red",    label: "Rejected" },
  hired:       { color: "badge-green",  label: "Hired 🎉" },
};

export default function SeekerDashboard() {
  const { user }                          = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications]   = useState([]);
  const [profile, setProfile]             = useState(null);
  const [loading, setLoading]             = useState(true);
  const [activeTab, setActiveTab]         = useState("recommendations");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recRes, appRes, profileRes] = await Promise.all([
          api.get("/resumes/recommended-jobs/"),
          api.get("/jobs/my-applications/"),
          api.get("/auth/profile/"),
        ]);
        setRecommendations(recRes.data.results || []);
        setApplications(appRes.data.results || appRes.data);
        setProfile(profileRes.data);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: "Applications",  value: applications.length,                                    icon: "📋", color: "bg-blue-50 text-blue-600" },
    { label: "Shortlisted",   value: applications.filter(a => a.status === "shortlisted").length, icon: "⭐", color: "bg-purple-50 text-purple-600" },
    { label: "Hired",         value: applications.filter(a => a.status === "hired").length,       icon: "🎉", color: "bg-green-50 text-green-600" },
    { label: "Matched Jobs",  value: recommendations.length,                                 icon: "🤖", color: "bg-orange-50 text-orange-600" },
  ];

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-xl"/>)}
      </div>
      <div className="skeleton h-96 rounded-xl"/>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-5xl mx-auto px-4">

        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-fadeInUp">
          <div>
            <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "Sora, sans-serif" }}>
              Hello, {user?.full_name?.split(" ")[0]} 👋
            </h1>
            <p className="text-slate-500 text-sm">Here's your job search overview</p>
          </div>
          <div className="flex gap-2">
            <Link to="/resume"  className="btn-outline text-sm">📄 Update Resume</Link>
            <Link to="/jobs"    className="btn-primary text-sm">Browse Jobs →</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="card p-4 animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-xl mb-3`}>
                {s.icon}
              </div>
              <div className="text-2xl font-bold text-slate-800" style={{ fontFamily: "Sora, sans-serif" }}>
                {s.value}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Profile Completion Banner */}
        {profile && profile.profile_completion < 70 && (
          <div className="card p-4 mb-6 border-l-4 border-blue-500 bg-blue-50 animate-fadeInUp">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">💡</span>
                <div>
                  <p className="text-sm font-semibold text-blue-800">
                    Complete your profile to get better job matches
                  </p>
                  <p className="text-xs text-blue-600 mt-0.5">
                    Your profile is {profile.profile_completion}% complete.
                    Add more details to improve your AI match score.
                  </p>
                  <div className="match-bar-track mt-2 max-w-xs">
                    <div className="match-bar-fill" style={{ width: `${profile.profile_completion}%` }}/>
                  </div>
                </div>
              </div>
              <Link to="/profile" className="btn-primary text-xs px-4 py-2 shrink-0">
                Complete Profile →
              </Link>
            </div>
          </div>
        )}

        {/* Resume Alert */}
        {recommendations.length === 0 && (
          <div className="card p-4 mb-6 border-l-4 border-orange-400 bg-orange-50 flex items-start gap-3 animate-fadeInUp">
            <span className="text-2xl shrink-0">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-orange-700">No resume uploaded yet</p>
              <p className="text-xs text-orange-600 mt-0.5">
                Upload your resume to get AI-matched job recommendations.{" "}
                <Link to="/resume" className="underline font-semibold">Upload now →</Link>
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          {[
            { id: "recommendations", label: `🤖 AI Matches (${recommendations.length})` },
            { id: "applications",    label: `📋 Applications (${applications.length})` },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Recommendations Tab */}
        {activeTab === "recommendations" && (
          <div className="space-y-4">
            {recommendations.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No matches yet</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Upload your resume to get AI-powered job recommendations
                </p>
                <Link to="/resume" className="btn-primary inline-flex">Upload Resume →</Link>
              </div>
            ) : recommendations.map(({ job, match_percentage }, i) => (
              <div key={job.id} className="card p-5 animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl font-bold text-blue-600 shrink-0"
                    style={{ fontFamily: "Sora, sans-serif" }}>
                    {job.company?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-800">{job.title}</h3>
                        <p className="text-sm text-slate-500">{job.company} · {job.location}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`text-xl font-extrabold ${
                          match_percentage >= 70 ? "text-green-600"
                          : match_percentage >= 40 ? "text-orange-500"
                          : "text-slate-400"
                        }`} style={{ fontFamily: "Sora, sans-serif" }}>
                          {match_percentage}%
                        </div>
                        <div className="text-xs text-slate-400">match</div>
                      </div>
                    </div>
                    <div className="match-bar-track mt-3 mb-3">
                      <div className="match-bar-fill" style={{ width: `${match_percentage}%` }}/>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {job.required_skills.slice(0, 4).map((s) => (
                          <span key={s} className="badge badge-gray text-xs">{s}</span>
                        ))}
                      </div>
                      <Link to={`/jobs/${job.id}`} className="btn-primary text-xs px-4 py-1.5">
                        Apply →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div className="space-y-3">
            {applications.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No applications yet</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Start applying for jobs to track them here
                </p>
                <Link to="/jobs" className="btn-primary inline-flex">Browse Jobs →</Link>
              </div>
            ) : applications.map((app, i) => (
              <div key={app.id}
                className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeInUp"
                style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center font-bold text-blue-600 shrink-0">
                    {app.job.company?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">{app.job.title}</h3>
                    <p className="text-xs text-slate-500">{app.job.company} · {app.job.location}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Applied {new Date(app.applied_at).toLocaleDateString()} ·{" "}
                      <span className={`font-semibold ${app.match_percentage >= 70 ? "text-green-600" : "text-blue-600"}`}>
                        {app.match_percentage}% match
                      </span>
                    </p>
                  </div>
                </div>
                <span className={`badge ${STATUS_CONFIG[app.status]?.color || "badge-gray"} self-start sm:self-center`}>
                  {STATUS_CONFIG[app.status]?.label || app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}