import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}/`);
        setJob(data);
      } catch { toast.error("Job not found"); navigate("/jobs"); }
      finally { setLoading(false); }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await api.post(`/jobs/${id}/apply/`, { cover_letter: coverLetter });
      toast.success("Application submitted! 🎉");
      setApplied(true);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to apply");
    } finally { setApplying(false); }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card p-8">
        <div className="skeleton h-8 w-64 mb-4" />
        <div className="skeleton h-4 w-48 mb-8" />
        <div className="skeleton h-32 w-full" />
      </div>
    </div>
  );
  if (!job) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 mb-4 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header Card */}
            <div className="card p-6 animate-fadeInUp">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 shrink-0" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {job.company?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {job.title}
                  </h1>
                  <p className="text-slate-500 text-sm mb-3">
                    🏢 {job.company} &nbsp;·&nbsp; 📍 {job.location}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge badge-blue">{job.job_type.replace("_", " ")}</span>
                    <span className="badge badge-orange capitalize">{job.experience_level}</span>
                    {job.salary_min && (
                      <span className="badge badge-green">
                        ₹{job.salary_min} LPA - ₹{job.salary_max} LPA
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card p-6 animate-fadeInUp delay-100">
              <h2 className="text-base font-semibold text-slate-800 mb-3">Job Description</h2>
              <div className="divider" />
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Skills Required */}
            <div className="card p-6 animate-fadeInUp delay-200">
              <h2 className="text-base font-semibold text-slate-800 mb-3">Required Skills</h2>
              <div className="divider" />
              <div className="flex flex-wrap gap-2">
                {job.required_skills.map((skill) => (
                  <span key={skill} className="badge badge-blue text-sm px-3 py-1">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Apply Card */}
            {user?.role === "seeker" && (
              <div className="card p-6 animate-fadeInUp delay-100">
                {applied ? (
                  <div className="text-center py-4">
                    <div className="text-5xl mb-3">🎉</div>
                    <h3 className="font-bold text-green-600 mb-1">Applied!</h3>
                    <p className="text-sm text-slate-500">Your application was submitted. Track it on your dashboard.</p>
                    <Link to="/dashboard" className="btn-primary w-full justify-center mt-4 text-sm">
                      View Dashboard →
                    </Link>
                  </div>
                ) : (
                  <>
                    <h2 className="text-base font-semibold text-slate-800 mb-4">Apply for this Job</h2>
                    <form onSubmit={handleApply} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">
                          Cover Letter <span className="text-slate-400">(optional)</span>
                        </label>
                        <textarea
                          rows={5} value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          placeholder="Tell the recruiter why you're a great fit..."
                          className="input-field resize-none text-sm"
                        />
                      </div>
                      <button type="submit" disabled={applying} className="btn-primary w-full justify-center py-3">
                        {applying ? (
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                        ) : "Submit Application →"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}

            {/* Job Summary */}
            <div className="card p-6 animate-fadeInUp delay-200">
              <h2 className="text-base font-semibold text-slate-800 mb-4">Job Summary</h2>
              <div className="space-y-3">
                {[
                  { icon: "💼", label: "Job Type", value: job.job_type.replace("_", " ") },
                  { icon: "📈", label: "Experience", value: job.experience_level },
                  { icon: "📍", label: "Location", value: job.location },
                  { icon: "🗓️", label: "Posted", value: new Date(job.created_at).toLocaleDateString() },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500">{icon} {label}</span>
                    <span className="text-sm font-medium text-slate-700 capitalize">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}