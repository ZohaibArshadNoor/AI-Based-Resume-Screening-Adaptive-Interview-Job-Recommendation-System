import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LEFT SIDE - BRAND + LINKS */}
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold tracking-tight">
            AI Resume System
          </h1>

          <div className="hidden md:flex gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-gray-600 transition">
              Landing
            </Link>

            <Link to="/predict-role" className="hover:text-gray-600 transition">
              Predict Role
            </Link>

            <Link to="/prediction-history">History</Link>

            <Link to="/interview-agent">Interview Agent</Link>

            <Link to="/dashboard">Dashboard</Link>

            <Link to="/jobs">Find Jobs</Link>
          </div>
        </div>

        {/* RIGHT SIDE - LOGOUT */}
        <button
          onClick={logoutHandler}
          className="px-5 py-2 rounded-xl border border-black text-black hover:bg-black hover:text-white transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
