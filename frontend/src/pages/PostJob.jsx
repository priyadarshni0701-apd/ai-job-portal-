import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", company: "", location: "", job_type: "full_time",
    experience_level: "entry", description: "", salary_min: "", salary_max: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillInput("");
    }
  };

  const removeSkill = (s) => setSkills(skills.filter((sk) => sk !== s));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (skills.length === 0) { toast.error("Add at least one required skill"); return; }
    setLoading(true);
    try {
      await api.post("/jobs/", { ...form, required_skills: skills });
      toast.success("Job posted successfully!");
      navigate("/dashboard");
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        Object.values(errors).forEach((msg) => toast.error(Array.isArray(msg) ? msg[0] : msg));
      } else {
        toast.error("Failed to post job");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Post a New Job</h1>
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "Job Title", key: "title", type: "text", placeholder: "e.g. Senior Backend Developer" },
            { label: "Company", key: "company", type: "text", placeholder: "e.g. Tech Corp" },
            { label: "Location", key: "location", type: "text", placeholder: "e.g. Remote, New York" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
              <input
                type={type} required value={form[key]} placeholder={placeholder}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Type</label>
              <select
                value={form.job_type}
                onChange={(e) => setForm({ ...form, job_type: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {["full_time", "part_time", "contract", "internship", "remote"].map((t) => (
                  <option key={t} value={t}>{t.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Experience Level</label>
              <select
                value={form.experience_level}
                onChange={(e) => setForm({ ...form, experience_level: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {["entry", "mid", "senior", "lead"].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Min Salary ($)</label>
              <input
                type="number" value={form.salary_min} placeholder="e.g. 50000"
                onChange={(e) => setForm({ ...form, salary_min: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Max Salary ($)</label>
              <input
                type="number" value={form.salary_max} placeholder="e.g. 90000"
                onChange={(e) => setForm({ ...form, salary_max: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows={5} required value={form.description} placeholder="Describe the role and responsibilities..."
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Required Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text" value={skillInput} placeholder="e.g. Python"
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={addSkill}
                className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-lg text-sm hover:bg-slate-200 transition">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                  {s}
                  <button type="button" onClick={() => removeSkill(s)} className="text-blue-400 hover:text-blue-700">×</button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}