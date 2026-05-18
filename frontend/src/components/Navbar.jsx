// src/components/Navbar.jsx

import { useNavigate } from "react-router-dom";

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
        <h1 className="text-2xl font-bold tracking-tight">
          Auth System
        </h1>

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