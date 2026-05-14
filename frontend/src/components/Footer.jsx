import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">


        <div>
        <div className="flex items-center gap-2">
        <img src={logo} alt="JobNova" className="w-10 h-10 object-contain />
          <h1 className="text-2xl font-bold text-blue-400">
            JobNova
          </h1>
          </div>

          <p className="mt-4 text-gray-400">
            Find jobs, connect with recruiters, and build your future with JobNova.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">
            Quick Links
          </h2>

          <ul className="space-y-2 text-gray-400">
            <li>Home</li>
            <li>Jobs</li>
            <li>Login</li>
            <li>Register</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">
            Contact
          </h2>

          <p className="text-gray-400">
            support@jobnova.com
          </p>

          <p className="text-gray-400 mt-2">
            Chennai, India
          </p>
        </div>

      </div>

      <div className="text-center text-gray-500 mt-10">
        © 2026 JobNova. All rights reserved.
      </div>
    </footer>
  );
}