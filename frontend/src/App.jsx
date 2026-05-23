import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";
import ScrollToTop from "./components/ScrollToTop";

import Home            from "./pages/Home";
import SeekerLogin     from "./pages/SeekerLogin";
import RecruiterLogin  from "./pages/RecruiterLogin";
import Register        from "./pages/Register";
import Dashboard       from "./pages/Dashboard";
import JobList         from "./pages/JobList";
import JobDetail       from "./pages/JobDetail";
import PostJob         from "./pages/PostJob";
import ResumeUpload    from "./pages/ResumeUpload";
import Profile         from "./pages/Profile";
import NotFound        from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            },
            success: {
              iconTheme: { primary: "#00a651", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#e02020", secondary: "#fff" },
            },
          }}
        />
        <ScrollToTop />
        <Navbar />
        <Routes>
          {/* ── Public ── */}
          <Route path="/"                element={<Home />} />
          <Route path="/login"           element={<SeekerLogin />} />
          <Route path="/login/recruiter" element={<RecruiterLogin />} />
          <Route path="/register"        element={<Register />} />

          {/* ── Semi-public (need login to apply) ── */}
          <Route path="/jobs"     element={<PrivateRoute><JobList /></PrivateRoute>} />
          <Route path="/jobs/:id" element={<PrivateRoute><JobDetail /></PrivateRoute>} />

          {/* ── Protected — all roles ── */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile"   element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* ── Protected — seeker only ── */}
          <Route
            path="/resume"
            element={<RoleRoute role="seeker"><ResumeUpload /></RoleRoute>}
          />

          {/* ── Protected — recruiter only ── */}
          <Route
            path="/post-job"
            element={<RoleRoute role="recruiter"><PostJob /></RoleRoute>}
          />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}