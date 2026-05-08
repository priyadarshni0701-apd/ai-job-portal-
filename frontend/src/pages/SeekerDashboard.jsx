import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function SeekerDashboard() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recRes, appRes] = await Promise.all([
          api.get("/resumes/recommended-jobs/"),
          api.get("/jobs/my-applications/"),
        ]);
        setRecommendations(recRes.data.results || []);
        setApplications(appRes.data.results || appRes.data);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusColor = {
    applied: "bg-blue-100 text-blue-600",
    reviewing: "bg-yellow-100 text-yellow-600",
    shortlisted: "bg-purple-100 text-purple-600",
    rejected: "bg-red-100 text-red-600",
    hired: "bg-green-100 text-green-600",
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
      Loading dashboard...
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">
        Welcome, {user?.full_name} 👋
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        Your personalized job recommendations and applications.
      </p>

      {/* Recommended Jobs */}
      <section className="mb-10">
        <h2 className="text-base sm:text-lg font-semibold text-slate-700 mb-4">
          🤖 AI Recommended Jobs
        </h2>
        {recommendations.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700">
            No recommendations yet.{" "}
            <Link to="/resume" className="underline font-medium">
              Upload your resume
            </Link>{" "}
            to get matched with jobs.
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map(({ job, match_percentage }) => (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-800 truncate">{job.title}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{job.company} · {job.location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">
                      {match_percentage}%
                    </div>
                    <div className="text-xs text-slate-400">match</div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${match_percentage}%` }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {job.required_skills.slice(0, 3).map((s) => (
                      <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
                  >
                    Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My Applications */}
      <section>
        <h2 className="text-base sm:text-lg font-semibold text-slate-700 mb-4">
          📋 My Applications
        </h2>
        {applications.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-500">
            You haven't applied to any jobs yet.{" "}
            <Link to="/jobs" className="text-blue-600 underline">Browse jobs</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <h3 className="font-medium text-slate-800">{app.job.title}</h3>
                  <p className="text-sm text-slate-500">{app.job.company}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Applied: {new Date(app.applied_at).toLocaleDateString()} ·{" "}
                    Match:{" "}
                    <span className="text-blue-600 font-medium">{app.match_percentage}%</span>
                  </p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize self-start sm:self-center ${statusColor[app.status]}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}