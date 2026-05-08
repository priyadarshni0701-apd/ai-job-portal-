import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "", email: "", role: "seeker", password: "", password2: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        Object.values(errors).forEach((msg) => toast.error(Array.isArray(msg) ? msg[0] : msg));
      } else {
        toast.error("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

 return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 text-white flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold mb-4">JobNova 🚀</h1>
        <p className="text-lg text-center max-w-md">
          Build your career with JobNova and explore amazing opportunities.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

          {/* LOGO + TITLE */}
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-blue-600">JobNova</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Create Account ✨
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Start your journey with JobNova
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* FULL NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="John Doe"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="you@example.com"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="****"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={form.password2}
                onChange={(e) =>
                  setForm({ ...form, password2: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="****"
              />
            </div>

            {/* ROLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
              >
                <option value="seeker">Job Seeker 👤</option>
                <option value="recruiter">Recruiter 💼</option>
              </select>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:scale-105 transition"
            >
              Create Account
            </button>

          </form>

          {/* LOGIN LINK */}
          <p className="text-sm text-center mt-4 text-gray-500">
            Already have an account?
            <span className="text-blue-500 cursor-pointer hover:underline ml-1">
              Login
            </span>
          </p>

        </div>
      </div>

    </div>
  );
}  