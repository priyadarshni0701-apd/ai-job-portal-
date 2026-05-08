import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaBriefcase,
  FaUsers,
  FaRocket,
  FaSearch,
} from "react-icons/fa";

import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen">

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 px-6 lg:px-20 py-20">

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >

            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              Trusted by 10,000+ users
            </span>

            <h1 className="text-4xl md:text-7xl font-bold leading-tight text-slate-900 mt-6">

              Find Your Dream Job With

              <span className="text-blue-600">
                {" "}JobNova
              </span>

            </h1>

            <p className="text-base md:text-xl text-slate-600 mt-6 leading-relaxed">

              Discover top companies, apply instantly,
              and build your future with our modern
              AI-powered job platform.

            </p>

            {/* SEARCH BAR */}
            <div className="bg-white mt-8 rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden w-full">

              <input
                type="text"
                placeholder="Search jobs, companies, skills..."
                className="w-full px-5 py-4 outline-none"
              />

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 transition duration-300">
                Search
              </button>

            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">

              <Link
                to="/jobs"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition duration-300 text-center"
              >
                Browse Jobs
              </Link>

              <Link
                to="/register"
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition duration-300 text-center"
              >
                Get Started
              </Link>

            </div>

          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >

            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop"
              alt="hero"
              className="w-full rounded-3xl shadow-2xl"
            />

          </motion.div>

        </div>

      </section>

      {/* FEATURES SECTION */}
      <section className="px-6 lg:px-20 py-20">

        <div className="max-w-7xl mx-auto text-center">

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Why Choose JobNova?
          </h2>

          <p className="text-slate-600 mt-4 text-lg">
            Everything you need to land your dream job.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">

            {/* CARD 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-2xl transition duration-300">

              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">

                <FaBriefcase className="text-blue-600 text-2xl" />

              </div>

              <h3 className="text-2xl font-bold mt-6">
                Top Companies
              </h3>

              <p className="text-slate-600 mt-4">
                Discover opportunities from top companies worldwide.
              </p>

            </div>

            {/* CARD 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-2xl transition duration-300">

              <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">

                <FaUsers className="text-indigo-600 text-2xl" />

              </div>

              <h3 className="text-2xl font-bold mt-6">
                Easy Hiring
              </h3>

              <p className="text-slate-600 mt-4">
                Employers can easily hire talented candidates.
              </p>

            </div>

            {/* CARD 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-2xl transition duration-300">

              <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">

                <FaRocket className="text-green-600 text-2xl" />

              </div>

              <h3 className="text-2xl font-bold mt-6">
                Career Growth
              </h3>

              <p className="text-slate-600 mt-4">
                Build your future with AI-powered recommendations.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* POPULAR CATEGORIES */}
      <section className="bg-white px-6 lg:px-20 py-20">

        <div className="max-w-7xl mx-auto text-center">

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Popular Categories
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12">

            {[
              "Frontend Developer",
              "Backend Developer",
              "AI Engineer",
              "Data Scientist",
              "UI/UX Designer",
              "Cloud Engineer",
              "Cyber Security",
              "DevOps Engineer",
            ].map((item, index) => (

              <div
                key={index}
                className="bg-slate-50 hover:bg-blue-600 hover:text-white transition duration-300 p-6 rounded-2xl shadow-sm cursor-pointer"
              >

                <FaSearch className="mx-auto text-2xl mb-4" />

                <h3 className="font-semibold text-lg">
                  {item}
                </h3>

              </div>

            ))}

          </div>

        </div>

      </section>

      <Footer />

    </div>
  );
}