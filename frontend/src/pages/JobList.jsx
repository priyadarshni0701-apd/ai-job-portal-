import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchJobs = async (q = "") => {
    setLoading(true);
    try {
      const { data } = await api.get(`/jobs${q ? `?search=${q}` : ""}`);
      setJobs(data.results || data);
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(search);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Browse Jobs</h1>
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, skill, location..."
          className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {loading ? (
        <div className="text-center text-slate-400 py-20">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center text-slate-400 py-20">No jobs found.</div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">{job.title}</h2>
                  <p className="text-sm text-slate-500 mt-0.5">{job.company} · {job.location}</p>
                </div>
                <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full capitalize">
                  {job.job_type.replace("_", " ")}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {job.required_skills.slice(0, 5).map((skill) => (
                  <span key={skill} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-slate-400">
                  {job.salary_min && job.salary_max
                    ? `$${Number(job.salary_min).toLocaleString()} – $${Number(job.salary_max).toLocaleString()}`
                    : "Salary not specified"}
                </span>
                <Link
                  to={`/jobs/${job.id}`}
                  className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
                >
                  View & Apply
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}