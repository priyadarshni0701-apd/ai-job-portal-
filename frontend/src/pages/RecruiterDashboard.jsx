import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appLoading, setAppLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get("/jobs/my-jobs/");
        setJobs(data.results || data);
      } catch {
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const viewApplications = async (job) => {
    setSelectedJob(job);
    setAppLoading(true);
    try {
      const { data } = await api.get(`/jobs/${job.id}/applications/`);
      setApplications(data.results || data);
    } catch {
      toast.error("Failed to load applications");
    } finally {
      setAppLoading(false);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await api.patch(`/jobs/applications/${appId}/status/`, { status });
      toast.success("Status updated");
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status } : a))
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  const statusColor = {
    applied: "bg-blue-100 text-blue-600",
    reviewing: "bg-yellow-100 text-yellow-600",
    shortlisted: "bg-purple-100 text-purple-600",
    rejected: "bg-red-100 text-red-600",
    hired: "bg-green-100 text-green-600",
  };

  if (loading) return <div className="text-center text-slate-400 py-20">Loading dashboard...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Recruiter Dashboard</h1>
          <p className="text-slate-500">Welcome, {user?.full_name}</p>
        </div>
        <Link
          to="/post-job"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          + Post New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posted Jobs */}
        <div>
          <h2 className="text-lg font-semibold text-slate-700 mb-4">📌 Posted Jobs ({jobs.length})</h2>
          {jobs.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-500">
              No jobs posted yet.{" "}
              <Link to="/post-job" className="text-blue-600 underline">Post your first job</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => viewApplications(job)}
                  className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition ${
                    selectedJob?.id === job.id ? "border-blue-400 ring-1 ring-blue-300" : "border-slate-200"
                  }`}
                >
                  <h3 className="font-semibold text-slate-800">{job.title}</h3>
                  <p className="text-sm text-slate-500">{job.company} · {job.location}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Posted: {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Applications Panel */}
        <div>
          <h2 className="text-lg font-semibold text-slate-700 mb-4">
            👥 {selectedJob ? `Applicants for "${selectedJob.title}"` : "Select a job to view applicants"}
          </h2>
          {!selectedJob ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-400">
              Click on a job to see its applications.
            </div>
          ) : appLoading ? (
            <div className="text-slate-400 text-sm py-4">Loading...</div>
          ) : applications.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-500">
              No applications yet for this job.
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-800">{app.applicant_name}</p>
                      <p className="text-xs text-slate-500">{app.applicant_email}</p>
                      <p className="text-xs text-blue-600 mt-0.5 font-medium">
                        Match: {app.match_percentage}%
                      </p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColor[app.status]}`}>
                      {app.status}
                    </span>
                  </div>
                  {app.cover_letter && (
                    <p className="text-xs text-slate-500 mt-2 border-t border-slate-100 pt-2 line-clamp-2">
                      {app.cover_letter}
                    </p>
                  )}
                  <div className="mt-3">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    >
                      {["applied", "reviewing", "shortlisted", "rejected", "hired"].map((s) => (
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
  );
}