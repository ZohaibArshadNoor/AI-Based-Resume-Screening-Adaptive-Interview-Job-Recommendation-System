// src/pages/LoginPage.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/");

    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-white">
        <Navbar />
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-6xl grid md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden border border-gray-200">

        {/* LEFT SIDE */}
        <div className="bg-black text-white p-14 flex flex-col justify-center">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Welcome Back
          </h1>

          <p className="text-gray-300 text-lg leading-relaxed">
            Login to continue accessing your dashboard,
            manage your profile, and explore the platform.
          </p>

          <div className="mt-10 space-y-4">
            <div className="border border-gray-700 rounded-2xl p-4">
              Secure Authentication
            </div>

            <div className="border border-gray-700 rounded-2xl p-4">
              JWT Protected Routes
            </div>

            <div className="border border-gray-700 rounded-2xl p-4">
              Modern Minimal UI
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white p-14 flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-2">
            Login
          </h2>

          <p className="text-gray-500 mb-10">
            Enter your credentials
          </p>

          <form
            onSubmit={submitHandler}
            className="space-y-6"
          >
            <div>
              <label className="block mb-2 font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={changeHandler}
                placeholder="Enter email"
                className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-black transition"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={changeHandler}
                placeholder="Enter password"
                className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-black transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:opacity-90 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-8 text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-black"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}