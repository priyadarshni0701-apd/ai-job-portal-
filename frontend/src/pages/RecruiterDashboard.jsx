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

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appLoading, setAppLoading] = useState(false);
  const [showApplicants, setShowApplicants] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get("/jobs/my-jobs/");
        setJobs(data.results || data);
      } catch { toast.error("Failed to load jobs"); }
      finally { setLoading(false); }
    };
    fetchJobs();
  }, []);

  const viewApplications = async (job) => {
    setSelectedJob(job);
    setAppLoading(true);
    setShowApplicants(true);
    try {
      const { data } = await api.get(`/jobs/${job.id}/applications/`);
      setApplications(data.results || data);
    } catch { toast.error("Failed to load applications"); }
    finally { setAppLoading(false); }
  };

  const updateStatus = async (appId, status) => {
    try {
      await api.patch(`/jobs/applications/${appId}/status/`, { status });
      toast.success("Status updated");
      setApplications((prev) => prev.map((a) => a.id === appId ? { ...a, status } : a));
    } catch { toast.error("Update failed"); }
  };

  const totalApps = jobs.reduce((sum, j) => sum + (j.applications?.length || 0), 0);
  const stats = [
    { label: "Jobs Posted", value: jobs.length, icon: "📌", color: "bg-blue-50 text-blue-600" },
    { label: "Total Applicants", value: totalApps, icon: "👥", color: "bg-orange-50 text-orange-600" },
    { label: "Active Jobs", value: jobs.filter(j => j.is_active).length, icon: "✅", color: "bg-green-50 text-green-600" },
    { label: "Viewing Now", value: selectedJob ? applications.length : 0, icon: "👁️", color: "bg-purple-50 text-purple-600" },
  ];

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-xl"/>)}
      </div>
      <div className="skeleton h-96 rounded-xl"/>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-fadeInUp">
          <div>
            <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Sora, sans-serif' }}>
              Recruiter Dashboard
            </h1>
            <p className="text-slate-500 text-sm">Welcome back, {user?.full_name}</p>
          </div>
          <Link to="/post-job" className="btn-primary text-sm">+ Post New Job</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="card p-4 animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
              <div className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Sora, sans-serif' }}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Jobs List — 2 cols */}
          <div className={`lg:col-span-2 ${showApplicants ? "hidden lg:block" : "block"}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-700">📌 My Jobs ({jobs.length})</h2>
            </div>
            {jobs.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-sm text-slate-500 mb-3">No jobs posted yet</p>
                <Link to="/post-job" className="btn-primary text-sm inline-flex">Post First Job →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div key={job.id} onClick={() => viewApplications(job)}
                    className={`card p-4 cursor-pointer transition-all ${
                      selectedJob?.id === job.id
                        ? "border-blue-400 ring-2 ring-blue-200 bg-blue-50/30"
                        : "hover:border-blue-200"
                    }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-slate-800 truncate">{job.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{job.company} · {job.location}</p>
                      </div>
                      <span className={`badge shrink-0 ${job.is_active ? "badge-green" : "badge-gray"} text-xs`}>
                        {job.is_active ? "Active" : "Closed"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-slate-400">
                        {new Date(job.created_at).toLocaleDateString()}
                      </p>
                      <span className="text-xs text-blue-600 font-medium">View Applicants →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applicants Panel — 3 cols */}
          <div className={`lg:col-span-3 ${!showApplicants ? "hidden lg:block" : "block"}`}>
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setShowApplicants(false)} className="lg:hidden text-sm text-blue-600 hover:underline flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Back
              </button>
              <h2 className="text-base font-semibold text-slate-700">
                👥 {selectedJob ? `Applicants — ${selectedJob.title}` : "Select a job to view applicants"}
              </h2>
            </div>

            {!selectedJob ? (
              <div className="card p-12 text-center">
                <div className="text-5xl mb-4">👈</div>
                <p className="text-sm text-slate-400">Select a job from the left to view its applicants</p>
              </div>
            ) : appLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-xl"/>)}
              </div>
            ) : applications.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-sm text-slate-400">No applications yet for this job</p>
              </div>
            ) : (
              <div className="space-y-3">
                {applications
                  .sort((a, b) => b.match_percentage - a.match_percentage)
                  .map((app, i) => (
                  <div key={app.id} className="card p-4 animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {app.applicant_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{app.applicant_name}</p>
                          <p className="text-xs text-slate-400 truncate">{app.applicant_email}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`text-lg font-bold ${app.match_percentage >= 70 ? "text-green-600" : app.match_percentage >= 40 ? "text-orange-500" : "text-slate-400"}`} style={{ fontFamily: 'Sora, sans-serif' }}>
                          {app.match_percentage}%
                        </div>
                        <div className="text-xs text-slate-400">match</div>
                      </div>
                    </div>

                    <div className="match-bar-track my-3">
                      <div className="match-bar-fill" style={{ width: `${app.match_percentage}%` }} />
                    </div>

                    {app.cover_letter && (
                      <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2 mb-3 line-clamp-2">
                        "{app.cover_letter}"
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <span className={`badge ${STATUS_CONFIG[app.status]?.color || "badge-gray"} text-xs`}>
                        {STATUS_CONFIG[app.status]?.label || app.status}
                      </span>
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className="input-field text-xs py-1.5 px-2 w-auto"
                      >
                        {["applied","reviewing","shortlisted","rejected","hired"].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}