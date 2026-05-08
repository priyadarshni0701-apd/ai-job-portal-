import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-20">

      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-14 grid md:grid-cols-3 gap-10">

        {/* LEFT */}
        <div>

          <h1 className="text-3xl font-bold text-blue-400">
            JobNova
          </h1>

          <p className="text-slate-400 mt-4 leading-relaxed">
            Find your dream job and connect with top companies
            using our modern JobNova.
          </p>

        </div>

        {/* CENTER */}
        <div>

          <h2 className="text-xl font-semibold mb-4">
            Quick Links
          </h2>

          <ul className="space-y-3 text-slate-400">

            <li className="hover:text-white cursor-pointer">
              Home
            </li>

            <li className="hover:text-white cursor-pointer">
              Jobs
            </li>

            <li className="hover:text-white cursor-pointer">
              Login
            </li>

            <li className="hover:text-white cursor-pointer">
              Register
            </li>

          </ul>

        </div>

        {/* RIGHT */}
        <div>

          <h2 className="text-xl font-semibold mb-4">
            Connect
          </h2>

          <div className="flex gap-5 text-2xl">

            <FaGithub className="hover:text-blue-400 cursor-pointer" />

            <FaLinkedin className="hover:text-blue-400 cursor-pointer" />

            <FaInstagram className="hover:text-pink-400 cursor-pointer" />

          </div>

          <p className="text-slate-400 mt-5">
            Chennai, India
          </p>

        </div>

      </div>

      <div className="border-t border-slate-800 text-center py-5 text-slate-500">
        © 2026 JobNova. All rights reserved.
      </div>

    </footer>
  );
}