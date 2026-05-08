import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
      } catch {
        toast.error("Job not found");
        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await api.post(`/jobs/${id}/apply/`, { cover_letter: coverLetter });
      toast.success("Application submitted!");
      setApplied(true);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="text-center text-slate-400 py-20">Loading...</div>;
  if (!job) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{job.title}</h1>
            <p className="text-slate-500 mt-1">{job.company} · {job.location}</p>
          </div>
          <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full capitalize">
            {job.job_type.replace("_", " ")}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {job.required_skills.map((skill) => (
            <span key={skill} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>

        <div className="prose text-sm text-slate-700 mb-6">
          <h3 className="font-semibold text-slate-800 mb-2">Job Description</h3>
          <p className="whitespace-pre-line">{job.description}</p>
        </div>

        {job.salary_min && (
          <p className="text-sm text-slate-500 mb-6">
            💰 Salary: ${Number(job.salary_min).toLocaleString()} – ${Number(job.salary_max).toLocaleString()}
          </p>
        )}

        {user?.role === "seeker" && !applied && (
          <form onSubmit={handleApply} className="border-t border-slate-100 pt-6">
            <h3 className="font-semibold text-slate-800 mb-2">Apply for this position</h3>
            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write a short cover letter (optional)..."
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <button
              type="submit" disabled={applying}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {applying ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        )}

        {applied && (
          <div className="border-t border-slate-100 pt-6">
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
              ✅ Your application has been submitted successfully!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}