import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { apiUrl } from "../utiles/api";

function UserAuth({ type }) {
  const [userdata, setuserdata] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isSignup = type === "usersignup";

  async function handleAuth(e) {
    e.preventDefault();
    if (!userdata.email || !userdata.password || (isSignup && !userdata.name)) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(apiUrl(`${import.meta.env.VITE_BASE_URL}/api/v1/${type}`), userdata);
      const token = res?.data?.user?.token;
      if (token) {
        localStorage.setItem("userToken", token);
        toast.success(res.data.message || "Welcome to Rider!");
        navigate("/");
      } else {
        toast.error("Authentication failed. Invalid server response.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 relative font-sans">
      {/* Back */}
      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-gray-500 hover:text-black text-sm font-semibold transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Home
      </Link>

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        {/* Toggle Passenger / Driver */}
        <div className="flex bg-gray-100 border border-gray-200 rounded-xl p-1 mb-8">
          <button
            onClick={() => navigate(isSignup ? "/usersignup" : "/UserAuth")}
            className="flex-1 text-center py-2.5 rounded-lg text-xs font-bold bg-black text-white shadow-sm transition-all cursor-pointer"
          >
            Passenger
          </button>
          <button
            onClick={() => navigate(isSignup ? "/driversignup" : "/DriverAuth")}
            className="flex-1 text-center py-2.5 rounded-lg text-xs font-bold text-gray-500 hover:text-black transition-all cursor-pointer"
          >
            Driver
          </button>
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-black text-black tracking-tight">
            {isSignup ? "Create Passenger Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-500 text-xs mt-1">
            {isSignup ? "Sign up to start booking rides" : "Sign in to your passenger account"}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleAuth}>
          {isSignup && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                value={userdata.name}
                onChange={(e) => setuserdata((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              value={userdata.email}
              onChange={(e) => setuserdata((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              value={userdata.password}
              onChange={(e) => setuserdata((prev) => ({ ...prev, password: e.target.value }))}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 active:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer text-sm disabled:opacity-50"
            >
              {loading ? "Please wait..." : isSignup ? "Sign Up" : "Log In"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          {isSignup ? (
            <p className="text-xs text-gray-500">
              Already have an account?{" "}
              <Link to="/UserAuth" className="text-black font-semibold hover:underline">
                Log In
              </Link>
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              Don't have an account?{" "}
              <Link to="/usersignup" className="text-black font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserAuth;
