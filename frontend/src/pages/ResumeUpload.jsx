import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState(false);

  const fetchResumes = async () => {
    try {
      const { data } = await api.get("/resumes/");
      setResumes(data.results || data);
    } catch { toast.error("Failed to fetch resumes"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchResumes(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { toast.error("Please select a PDF file"); return; }
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      await api.post("/resumes/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Resume uploaded and skills extracted! 🎉");
      setFile(null);
      fetchResumes();
    } catch (err) {
      toast.error(err.response?.data?.file?.[0] || "Upload failed");
    } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/resumes/${id}/`);
      toast.success("Resume deleted");
      fetchResumes();
    } catch { toast.error("Failed to delete"); }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
    else toast.error("Please drop a PDF file");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6 animate-fadeInUp">
          <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Sora, sans-serif' }}>
            Resume Manager
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Upload your PDF resume. AI will extract your skills automatically.
          </p>
        </div>

        {/* Upload Card */}
        <div className="card p-6 mb-6 animate-fadeInUp">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Upload New Resume</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
                dragOver
                  ? "border-blue-400 bg-blue-50"
                  : file
                  ? "border-green-400 bg-green-50"
                  : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/30"
              }`}
            >
              <input type="file" accept=".pdf" id="resume-file" className="hidden"
                onChange={(e) => setFile(e.target.files[0])} />
              <label htmlFor="resume-file" className="cursor-pointer block">
                <div className="text-5xl mb-3">{file ? "✅" : "📄"}</div>
                <p className="text-sm font-medium text-slate-700">
                  {file ? file.name : "Drag & drop your PDF here"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "or click to browse — PDF only, max 5MB"}
                </p>
              </label>
            </div>

            {file && (
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
                <span className="text-2xl">📎</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB · PDF</p>
                </div>
                <button type="button" onClick={() => setFile(null)}
                  className="text-slate-400 hover:text-red-500 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            )}

            <button type="submit" disabled={uploading || !file} className="btn-primary w-full justify-center py-3">
              {uploading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Uploading & Extracting Skills...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Upload & Extract Skills
                </>
              )}
            </button>
          </form>
        </div>

        {/* Resumes List */}
        <div className="animate-fadeInUp delay-100">
          <h2 className="text-base font-semibold text-slate-700 mb-4">My Resumes</h2>
          {loading ? (
            <div className="space-y-3">
              {[1,2].map(i => <div key={i} className="skeleton h-32 rounded-xl"/>)}
            </div>
          ) : resumes.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm text-slate-400">No resumes uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {resumes.map((resume) => (
                <div key={resume.id} className="card p-5">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-xl shrink-0">📄</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{resume.original_filename}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-slate-400">
                            {new Date(resume.uploaded_at).toLocaleDateString()}
                          </p>
                          {resume.is_active && (
                            <span className="badge badge-green text-xs">Active</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(resume.id)}
                      className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>

                  {/* Skills */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Extracted Skills ({resume.extracted_skills.length})
                    </p>
                    {resume.extracted_skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {resume.extracted_skills.map((skill) => (
                          <span key={skill} className="badge badge-blue text-xs">{skill}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No skills extracted — try a more detailed resume</p>
                    )}
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