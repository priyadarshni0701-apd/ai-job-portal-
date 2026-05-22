import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

const TABS = [
  { id: "basic",        label: "Basic Info",     icon: "👤" },
  { id: "professional", label: "Professional",   icon: "💼" },
  { id: "education",    label: "Education",      icon: "🎓" },
  { id: "skills",       label: "Skills & Links", icon: "🔗" },
  { id: "password",     label: "Change Password",icon: "🔒" },
];

const SKILLS_SUGGESTIONS = [
  "Python","JavaScript","React","Django","Node.js","TypeScript","Java",
  "SQL","AWS","Docker","Flutter","Machine Learning","Data Analysis",
  "Figma","Tailwind CSS","MongoDB","PostgreSQL","Git","REST API","GraphQL",
];

export default function Profile() {
  const { user, fetchProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const photoRef = useRef();
  const [skillInput, setSkillInput] = useState("");

  const [form, setForm] = useState({
    full_name: "", phone: "", date_of_birth: "", gender: "",
    city: "", state: "", country: "India", pincode: "",
    headline: "", summary: "", experience_years: "",
    current_company: "", current_designation: "",
    notice_period: "", expected_salary: "", current_salary: "",
    highest_education: "", college: "", graduation_year: "",
    skills: [],
    linkedin_url: "", github_url: "", portfolio_url: "",
    company_name: "", company_website: "", company_size: "", industry: "",
  });

  const [passwords, setPasswords] = useState({
    old_password: "", new_password: "", confirm_password: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        full_name:           user.full_name || "",
        phone:               user.phone || "",
        date_of_birth:       user.date_of_birth || "",
        gender:              user.gender || "",
        city:                user.city || "",
        state:               user.state || "",
        country:             user.country || "India",
        pincode:             user.pincode || "",
        headline:            user.headline || "",
        summary:             user.summary || "",
        experience_years:    user.experience_years || "",
        current_company:     user.current_company || "",
        current_designation: user.current_designation || "",
        notice_period:       user.notice_period || "",
        expected_salary:     user.expected_salary || "",
        current_salary:      user.current_salary || "",
        highest_education:   user.highest_education || "",
        college:             user.college || "",
        graduation_year:     user.graduation_year || "",
        skills:              user.skills || [],
        linkedin_url:        user.linkedin_url || "",
        github_url:          user.github_url || "",
        portfolio_url:       user.portfolio_url || "",
        company_name:        user.company_name || "",
        company_website:     user.company_website || "",
        company_size:        user.company_size || "",
        industry:            user.industry || "",
      });
    }
  }, [user]);

 const handleSave = async () => {
  setSaving(true);
  try {
    const cleaned = { ...profile };

    // Convert empty strings → null for fields that need it
    ["graduation_year", "total_experience_years", "date_of_birth"].forEach((field) => {
      if (cleaned[field] === "" || cleaned[field] === undefined) {
        cleaned[field] = null;
      }
    });

    const { data } = await api.patch("/auth/profile/", cleaned);
    setProfile(data.user);
    if (fetchProfile) await fetchProfile();
    toast.success("Profile updated successfully! ✅");
  } catch (err) {
    const errors = err.response?.data;
    if (errors) {
      Object.values(errors).forEach((m) =>
        toast.error(Array.isArray(m) ? m[0] : m)
      );
    } else {
      toast.error("Failed to save");
    }
  } finally {
    setSaving(false);
  }
};
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB"); return; }
    const formData = new FormData();
    formData.append("profile_photo", file);
    setPhotoLoading(true);
    try {
      await api.post("/auth/profile/photo/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchProfile();
      toast.success("Photo updated!");
    } catch { toast.error("Photo upload failed"); }
    finally { setPhotoLoading(false); }
  };

  const handlePasswordChange = async () => {
    if (passwords.new_password !== passwords.confirm_password) {
      toast.error("Passwords do not match"); return;
    }
    setLoading(true);
    try {
      await api.post("/auth/profile/change-password/", passwords);
      toast.success("Password changed successfully!");
      setPasswords({ old_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to change password");
    } finally { setLoading(false); }
  };

  const addSkill = (s) => {
    const skill = s?.trim() || skillInput.trim();
    if (skill && !form.skills.includes(skill)) {
      setForm({ ...form, skills: [...form.skills, skill] });
      setSkillInput("");
    }
  };

  const removeSkill = (s) => setForm({ ...form, skills: form.skills.filter((sk) => sk !== s) });

  const completion = user?.profile_completion || 0;

  const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4">

        {/* ── Profile Header Card ── */}
        <div className="card p-6 mb-6 animate-fadeInUp">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
                {user?.profile_photo ? (
                  <img src={user.profile_photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.full_name?.charAt(0).toUpperCase()
                )}
              </div>
              <button
                onClick={() => photoRef.current.click()}
                disabled={photoLoading}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-all"
              >
                {photoLoading ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                )}
              </button>
              <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-slate-800" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {user?.full_name}
                  </h1>
                  <p className="text-sm text-slate-500 mt-0.5">{user?.email}</p>
                  {user?.headline && (
                    <p className="text-sm text-blue-600 font-medium mt-1">{user.headline}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="badge badge-blue capitalize">{user?.role}</span>
                    {user?.city && <span className="badge badge-gray">📍 {user.city}</span>}
                    {user?.experience_years && <span className="badge badge-orange">💼 {user.experience_years} yrs</span>}
                  </div>
                </div>

                {/* Profile Completion */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-w-[160px]">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Profile Strength</p>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          completion >= 80 ? "bg-green-500" :
                          completion >= 50 ? "bg-orange-400" : "bg-red-400"
                        }`}
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{completion}%</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {completion >= 80 ? "🌟 Excellent!" : completion >= 50 ? "⚡ Good, keep going" : "📝 Complete your profile"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ── Sidebar Tabs ── */}
          <div className="lg:col-span-1">
            <div className="card p-2 animate-fadeInUp">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="lg:col-span-3">

            {/* ── BASIC INFO TAB ── */}
            {activeTab === "basic" && (
              <div className="card p-6 animate-fadeInUp">
                <h2 className="text-lg font-bold text-slate-800 mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Basic Information
                </h2>
                <p className="text-sm text-slate-500 mb-6">Your personal details and contact information</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input type="text" value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      className={inputClass} placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input type="tel" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={inputClass} placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input type="date" value={form.date_of_birth}
                      onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Gender</label>
                    <select value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="divider" />
                <h3 className="text-sm font-semibold text-slate-700 mb-4">📍 Location</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>City</label>
                    <input type="text" value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className={inputClass} placeholder="Bangalore"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input type="text" value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className={inputClass} placeholder="Karnataka"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Country</label>
                    <input type="text" value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className={inputClass} placeholder="India"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Pincode</label>
                    <input type="text" value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      className={inputClass} placeholder="560001"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button onClick={handleSave} disabled={loading} className="btn-primary px-8 py-3">
                    {loading ? "Saving..." : "Save Changes ✓"}
                  </button>
                </div>
              </div>
            )}

            {/* ── PROFESSIONAL TAB ── */}
            {activeTab === "professional" && (
              <div className="card p-6 animate-fadeInUp">
                <h2 className="text-lg font-bold text-slate-800 mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Professional Details
                </h2>
                <p className="text-sm text-slate-500 mb-6">Your work experience and current employment details</p>

                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Professional Headline</label>
                    <input type="text" value={form.headline}
                      onChange={(e) => setForm({ ...form, headline: e.target.value })}
                      className={inputClass}
                      placeholder="e.g. Senior Python Developer | Django | AWS"
                    />
                    <p className="text-xs text-slate-400 mt-1">This appears below your name — make it count!</p>
                  </div>

                  <div>
                    <label className={labelClass}>Professional Summary</label>
                    <textarea rows={4} value={form.summary}
                      onChange={(e) => setForm({ ...form, summary: e.target.value })}
                      className={`${inputClass} resize-none`}
                      placeholder="Write a short summary about yourself, your experience, and what you're looking for..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Years of Experience</label>
                      <select value={form.experience_years}
                        onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
                        className={inputClass}
                      >
                        <option value="">Select experience</option>
                        {["fresher","0-1","1-3","3-5","5-10","10+"].map(e => (
                          <option key={e} value={e}>{e === "fresher" ? "Fresher" : `${e} Years`}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Notice Period</label>
                      <input type="text" value={form.notice_period}
                        onChange={(e) => setForm({ ...form, notice_period: e.target.value })}
                        className={inputClass} placeholder="e.g. Immediate / 30 Days"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Current Company</label>
                      <input type="text" value={form.current_company}
                        onChange={(e) => setForm({ ...form, current_company: e.target.value })}
                        className={inputClass} placeholder="e.g. TechCorp"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Current Designation</label>
                      <input type="text" value={form.current_designation}
                        onChange={(e) => setForm({ ...form, current_designation: e.target.value })}
                        className={inputClass} placeholder="e.g. Software Engineer"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Current Salary</label>
                      <input type="text" value={form.current_salary}
                        onChange={(e) => setForm({ ...form, current_salary: e.target.value })}
                        className={inputClass} placeholder="e.g. 8 LPA"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Expected Salary</label>
                      <input type="text" value={form.expected_salary}
                        onChange={(e) => setForm({ ...form, expected_salary: e.target.value })}
                        className={inputClass} placeholder="e.g. 12 LPA"
                      />
                    </div>
                  </div>

                  {/* Recruiter-specific */}
                  {user?.role === "recruiter" && (
                    <>
                      <div className="divider" />
                      <h3 className="text-sm font-semibold text-slate-700 mb-4">🏢 Company Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className={labelClass}>Company Name</label>
                          <input type="text" value={form.company_name}
                            onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                            className={inputClass} placeholder="e.g. Tech Corp"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Company Website</label>
                          <input type="url" value={form.company_website}
                            onChange={(e) => setForm({ ...form, company_website: e.target.value })}
                            className={inputClass} placeholder="https://techcorp.com"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Company Size</label>
                          <select value={form.company_size}
                            onChange={(e) => setForm({ ...form, company_size: e.target.value })}
                            className={inputClass}
                          >
                            <option value="">Select size</option>
                            {["1-10","11-50","51-200","201-500","501-1000","1000+"].map(s => (
                              <option key={s} value={s}>{s} employees</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Industry</label>
                          <input type="text" value={form.industry}
                            onChange={(e) => setForm({ ...form, industry: e.target.value })}
                            className={inputClass} placeholder="e.g. Information Technology"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6">
                  <button onClick={handleSave} disabled={loading} className="btn-primary px-8 py-3">
                    {loading ? "Saving..." : "Save Changes ✓"}
                  </button>
                </div>
              </div>
            )}

            {/* ── EDUCATION TAB ── */}
            {activeTab === "education" && (
              <div className="card p-6 animate-fadeInUp">
                <h2 className="text-lg font-bold text-slate-800 mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Education
                </h2>
                <p className="text-sm text-slate-500 mb-6">Your academic qualifications</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Highest Education</label>
                    <input type="text" value={form.highest_education}
                      onChange={(e) => setForm({ ...form, highest_education: e.target.value })}
                      className={inputClass}
                      placeholder="e.g. B.Tech Computer Science / MBA / M.Sc"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>College / University</label>
                    <input type="text" value={form.college}
                      onChange={(e) => setForm({ ...form, college: e.target.value })}
                      className={inputClass}
                      placeholder="e.g. IIT Madras / Anna University"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Year of Graduation</label>
                    <input type="text" value={form.graduation_year}
                      onChange={(e) => setForm({ ...form, graduation_year: e.target.value })}
                      className={inputClass} placeholder="e.g. 2022"
                    />
                  </div>
                </div>

                {/* Education Display Card */}
                {(form.highest_education || form.college) && (
                  <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-2xl">🎓</span>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{form.highest_education || "—"}</p>
                      <p className="text-sm text-slate-600">{form.college || "—"}</p>
                      {form.graduation_year && (
                        <p className="text-xs text-slate-400 mt-0.5">Class of {form.graduation_year}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <button onClick={handleSave} disabled={loading} className="btn-primary px-8 py-3">
                    {loading ? "Saving..." : "Save Changes ✓"}
                  </button>
                </div>
              </div>
            )}

            {/* ── SKILLS & LINKS TAB ── */}
            {activeTab === "skills" && (
              <div className="card p-6 animate-fadeInUp">
                <h2 className="text-lg font-bold text-slate-800 mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Skills & Links
                </h2>
                <p className="text-sm text-slate-500 mb-6">Add your skills and professional profile links</p>

                {/* Skills */}
                <div className="mb-6">
                  <label className={labelClass}>Your Skills</label>
                  <div className="flex gap-2 mb-3">
                    <input type="text" value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      className={`${inputClass} flex-1`}
                      placeholder="Type a skill and press Enter"
                    />
                    <button type="button" onClick={() => addSkill()}
                      className="btn-outline px-4 text-sm">Add</button>
                  </div>

                  {/* Suggestions */}
                  <div className="mb-4">
                    <p className="text-xs text-slate-400 mb-2">Quick add:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SKILLS_SUGGESTIONS.filter(s => !form.skills.includes(s)).slice(0, 12).map(s => (
                        <button key={s} type="button" onClick={() => addSkill(s)}
                          className="badge badge-gray hover:badge-blue cursor-pointer text-xs transition-all">
                          + {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Skills */}
                  {form.skills.length > 0 ? (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <p className="text-xs font-semibold text-blue-700 mb-3">
                        Your Skills ({form.skills.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {form.skills.map(s => (
                          <span key={s} className="badge badge-blue flex items-center gap-1.5 py-1 px-3">
                            {s}
                            <button type="button" onClick={() => removeSkill(s)}
                              className="text-blue-400 hover:text-red-500 transition-colors font-bold">×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center">
                      <p className="text-sm text-slate-400">No skills added yet. Add skills to improve your job matches!</p>
                    </div>
                  )}
                </div>

                <div className="divider" />

                {/* Links */}
                <h3 className="text-sm font-semibold text-slate-700 mb-4">🔗 Professional Links</h3>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>LinkedIn Profile</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 font-bold text-xs">in</span>
                      <input type="url" value={form.linkedin_url}
                        onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                        className={`${inputClass} pl-9`}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>GitHub Profile</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </span>
                      <input type="url" value={form.github_url}
                        onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                        className={`${inputClass} pl-9`}
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Portfolio / Website</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                      </span>
                      <input type="url" value={form.portfolio_url}
                        onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })}
                        className={`${inputClass} pl-9`}
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button onClick={handleSave} disabled={loading} className="btn-primary px-8 py-3">
                    {loading ? "Saving..." : "Save Changes ✓"}
                  </button>
                </div>
              </div>
            )}

            {/* ── CHANGE PASSWORD TAB ── */}
            {activeTab === "password" && (
              <div className="card p-6 animate-fadeInUp">
                <h2 className="text-lg font-bold text-slate-800 mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Change Password
                </h2>
                <p className="text-sm text-slate-500 mb-6">Keep your account secure with a strong password</p>

                <div className="max-w-md space-y-5">
                  {[
                    { key: "old_password", label: "Current Password", placeholder: "Enter current password" },
                    { key: "new_password", label: "New Password", placeholder: "Min 8 characters" },
                    { key: "confirm_password", label: "Confirm New Password", placeholder: "Re-enter new password" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className={labelClass}>{label}</label>
                      <input
                        type="password"
                        value={passwords[key]}
                        onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                        className={inputClass}
                        placeholder={placeholder}
                      />
                    </div>
                  ))}

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-amber-700 mb-2">Password Tips:</p>
                    <ul className="text-xs text-amber-600 space-y-1">
                      <li>• Minimum 8 characters</li>
                      <li>• Use a mix of letters, numbers and symbols</li>
                      <li>• Don't reuse passwords from other sites</li>
                    </ul>
                  </div>

                  <button
                    onClick={handlePasswordChange}
                    disabled={loading || !passwords.old_password || !passwords.new_password}
                    className="btn-primary px-8 py-3"
                  >
                    {loading ? "Updating..." : "🔒 Update Password"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}