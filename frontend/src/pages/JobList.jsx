import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const JOB_TYPES = ["All", "full_time", "part_time", "contract", "internship", "remote"];
const EXPERIENCE = ["All", "entry", "mid", "senior", "lead"];

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("All");
  const [experience, setExperience] = useState("All");
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);

  const fetchJobs = async (q = "") => {
    setLoading(true);
    try {
      const { data } = await api.get(`/jobs/${q ? `?search=${q}` : ""}`);
      setJobs(data.results || data);
    } catch { toast.error("Failed to load jobs"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchJobs(search); };
  const toggleSave = (id) => setSavedJobs((prev) => prev.includes(id) ? prev.filter((j) => j !== id) : [...prev, id]);

  const filtered = jobs.filter((j) => {
    if (jobType !== "All" && j.job_type !== jobType) return false;
    if (experience !== "All" && j.experience_level !== experience) return false;
    return true;
  });

  const typeColor = {
    full_time: "badge-blue", part_time: "badge-purple",
    contract: "badge-orange", internship: "badge-green", remote: "badge-gray",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center" style={{ fontFamily: 'Sora, sans-serif' }}>
            Find Your Next Opportunity
          </h1>
          <p className="text-blue-200 text-center text-sm mb-6">
            {jobs.length} jobs available right now
          </p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>
              <input
                type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Job title, skill, company..."
                className="input-field pl-10 bg-white"
              />
            </div>
            <button type="submit" className="btn-accent px-6">Search</button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Type:</span>
            {JOB_TYPES.map((t) => (
              <button key={t} onClick={() => setJobType(t)}
                className={`badge cursor-pointer transition-all ${jobType === t ? "badge-blue ring-2 ring-blue-300" : "badge-gray hover:badge-blue"}`}>
                {t === "All" ? "All" : t.replace("_", " ")}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Level:</span>
            {EXPERIENCE.map((e) => (
              <button key={e} onClick={() => setExperience(e)}
                className={`badge cursor-pointer transition-all ${experience === e ? "badge-orange ring-2 ring-orange-300" : "badge-gray hover:badge-orange"}`}>
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-4">
          Showing <span className="font-semibold text-slate-700">{filtered.length}</span> jobs
        </p>

        {/* Job Cards */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="card p-6">
                <div className="skeleton h-5 w-48 mb-3" />
                <div className="skeleton h-4 w-32 mb-4" />
                <div className="flex gap-2">
                  <div className="skeleton h-6 w-20 rounded-full" />
                  <div className="skeleton h-6 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No jobs found</h3>
            <p className="text-slate-400 text-sm">Try different keywords or clear filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((job, i) => (
              <div key={job.id} className="card p-5 sm:p-6 animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1 min-w-0">
                    {/* Company Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-xl font-bold text-blue-600" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {job.company?.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="text-base font-semibold text-slate-800">{job.title}</h2>
                        <span className={`badge ${typeColor[job.job_type] || "badge-gray"}`}>
                          {job.job_type.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mb-3">
                        🏢 {job.company} &nbsp;·&nbsp; 📍 {job.location} &nbsp;·&nbsp;
                        <span className="capitalize">📈 {job.experience_level}</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.required_skills.slice(0, 5).map((s) => (
                          <span key={s} className="badge badge-gray text-xs">{s}</span>
                        ))}
                        {job.required_skills.length > 5 && (
                          <span className="badge badge-gray text-xs">+{job.required_skills.length - 5}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <button onClick={() => toggleSave(job.id)}
                      className={`p-2 rounded-lg transition-all ${savedJobs.includes(job.id) ? "text-orange-500 bg-orange-50" : "text-slate-300 hover:text-orange-400 hover:bg-orange-50"}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={savedJobs.includes(job.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                    </button>
                    {job.salary_min && (
                      <p className="text-xs text-green-600 font-semibold whitespace-nowrap">
                        ₹{Number(job.salary_min).toLocaleString()}+
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400">
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </p>
                  <Link to={`/jobs/${job.id}`} className="btn-primary text-sm px-5 py-2">
                    View & Apply →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}