import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    try {
      const { data } = await api.get("/resumes/");
      setResumes(data.results || data);
    } catch {
      toast.error("Failed to fetch resumes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResumes(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { toast.error("Please select a PDF file"); return; }
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const { data } = await api.post("/resumes/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Resume uploaded and skills extracted!");
      setFile(null);
      fetchResumes();
    } catch (err) {
      toast.error(err.response?.data?.file?.[0] || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/resumes/${id}/`);
      toast.success("Resume deleted");
      fetchResumes();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Resume Manager</h1>

      {/* Upload Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Upload New Resume</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-300 transition">
            <input
              type="file"
              accept=".pdf"
              id="resume-file"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="resume-file" className="cursor-pointer">
              <div className="text-4xl mb-3">📄</div>
              <p className="text-sm text-slate-600">
                {file ? file.name : "Click to select PDF (max 5MB)"}
              </p>
            </label>
          </div>
          <button
            type="submit" disabled={uploading || !file}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {uploading ? "Uploading & Processing..." : "Upload Resume"}
          </button>
        </form>
      </div>

      {/* Resumes List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-700">My Resumes</h2>
        {loading ? (
          <p className="text-slate-400 text-sm">Loading...</p>
        ) : resumes.length === 0 ? (
          <p className="text-slate-400 text-sm">No resumes uploaded yet.</p>
        ) : (
          resumes.map((resume) => (
            <div key={resume.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-slate-800">{resume.original_filename}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Uploaded: {new Date(resume.uploaded_at).toLocaleDateString()}
                    {resume.is_active && (
                      <span className="ml-2 bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs">
                        Active
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {resume.extracted_skills.length > 0 ? (
                  resume.extracted_skills.map((skill) => (
                    <span key={skill} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No skills extracted</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}