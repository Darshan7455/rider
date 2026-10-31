import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");
  const driverToken = localStorage.getItem("driverToken");

  const auth = () => {
    navigate("/UserAuth");
  };

  const handleLogout = () => {
    try {
      localStorage.clear();
      toast.success("Logged out successfully");
      navigate("/UserAuth");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-black border-b border-gray-800 px-6 py-3 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
        <div className="bg-white p-2 rounded-lg text-black">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <span className="font-extrabold text-xl text-white tracking-wide">Rider</span>
      </div>

      {/* Mode Badge */}
      <div className="hidden md:flex items-center gap-2">
        {driverToken ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-black border border-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
            Driver Mode
          </span>
        ) : userToken ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-black border border-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
            Passenger Mode
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-900 text-gray-400 border border-gray-700">
            Guest Mode
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => toast.success("Help center coming soon!", { icon: "ℹ️" })}
          className="text-gray-400 hover:text-white transition-colors text-sm font-medium px-3 py-1.5 cursor-pointer"
        >
          Help
        </button>

        {!userToken && !driverToken ? (
          <button
            onClick={auth}
            className="bg-white hover:bg-gray-100 active:bg-gray-200 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer"
          >
            Login / Signup
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="border border-gray-700 hover:border-white hover:bg-white hover:text-black text-gray-300 text-sm font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;