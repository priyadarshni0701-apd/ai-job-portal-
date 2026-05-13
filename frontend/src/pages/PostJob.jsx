import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const POPULAR_SKILLS = ["Python","JavaScript","React","Django","Node.js","SQL","AWS","Docker","TypeScript","Java","Flutter","Machine Learning"];

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", company: "", location: "", job_type: "full_time",
    experience_level: "mid", description: "", salary_min: "", salary_max: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const addSkill = (s) => {
    const trimmed = s?.trim() || skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
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
      toast.success("Job posted successfully! 🎉");
      navigate("/dashboard");
    } catch (err) {
      const errors = err.response?.data;
      if (errors) Object.values(errors).forEach((m) => toast.error(Array.isArray(m) ? m[0] : m));
      else toast.error("Failed to post job");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6 animate-fadeInUp">
          <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Sora, sans-serif' }}>
            Post a New Job
          </h1>
          <p className="text-slate-500 text-sm mt-1">Fill in the details to find the right candidate</p>
        </div>

        {/* Progress */}
        <div className="card p-4 mb-6 animate-fadeInUp">
          <div className="flex items-center gap-3">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                }`}>{s}</div>
                <span className={`text-xs font-medium ${step >= s ? "text-blue-600" : "text-slate-400"}`}>
                  {s === 1 ? "Job Details" : "Skills & Salary"}
                </span>
                {s < 2 && <div className={`flex-1 h-0.5 ${step > s ? "bg-blue-600" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1 */}
          {step === 1 && (
            <div className="card p-6 space-y-5 animate-fadeInUp">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Title *</label>
                <input type="text" required value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input-field" placeholder="e.g. Senior Backend Developer"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Company *</label>
                  <input type="text" required value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="input-field" placeholder="e.g. Tech Corp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Location *</label>
                  <input type="text" required value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="input-field" placeholder="e.g. Remote / Bangalore"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Type</label>
                  <select value={form.job_type} onChange={(e) => setForm({ ...form, job_type: e.target.value })} className="input-field">
                    {["full_time","part_time","contract","internship","remote"].map(t => (
                      <option key={t} value={t}>{t.replace("_"," ")}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Experience Level</label>
                  <select value={form.experience_level} onChange={(e) => setForm({ ...form, experience_level: e.target.value })} className="input-field">
                    {["entry","mid","senior","lead"].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Description *</label>
                <textarea rows={5} required value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field resize-none" placeholder="Describe the role, responsibilities, and requirements..."
                />
              </div>
              <button type="button" onClick={() => {
                if (!form.title || !form.company || !form.location || !form.description) {
                  toast.error("Please fill all required fields"); return;
                }
                setStep(2);
              }} className="btn-primary w-full justify-center py-3">
                Next: Skills & Salary →
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="card p-6 space-y-5 animate-fadeInUp">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Required Skills *</label>
                <div className="flex gap-2 mb-3">
                  <input type="text" value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    className="input-field flex-1" placeholder="Type a skill and press Enter"
                  />
                  <button type="button" onClick={() => addSkill()} className="btn-outline px-4">Add</button>
                </div>

                {/* Popular Skills */}
                <div className="mb-3">
                  <p className="text-xs text-slate-400 mb-2">Quick add popular skills:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SKILLS.filter(s => !skills.includes(s)).map(s => (
                      <button key={s} type="button" onClick={() => addSkill(s)}
                        className="badge badge-gray hover:badge-blue cursor-pointer text-xs transition-all">
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Skills */}
                {skills.length > 0 && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <p className="text-xs font-semibold text-blue-700 mb-2">Selected Skills ({skills.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map(s => (
                        <span key={s} className="badge badge-blue flex items-center gap-1">
                          {s}
                          <button type="button" onClick={() => removeSkill(s)} className="text-blue-400 hover:text-blue-700 ml-0.5">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Min Salary (₹ LPA)</label>
                  <input type="number" value={form.salary_min}
                    onChange={(e) => setForm({ ...form, salary_min: e.target.value })}
                    className="input-field" placeholder="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Max Salary (₹ LPA)</label>
                  <input type="number" value={form.salary_max}
                    onChange={(e) => setForm({ ...form, salary_max: e.target.value })}
                    className="input-field" placeholder="12"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1 justify-center py-3">
                  ← Back
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center py-3">
                  {loading ? (
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : "Post Job →"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}