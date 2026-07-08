import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import Displayrides from "../components/displayrides";
import Makeride from "../components/makeride";
import RideMap from "../components/RideMap";
import axios from "axios";
import toast from "react-hot-toast";
import { apiUrl } from "../utiles/api";

function Home() {
  const navigate = useNavigate();
  const drivertoken = localStorage.getItem("driverToken");
  const usertoken = localStorage.getItem("userToken");

  const [activeRide, setActiveRide] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (usertoken && !drivertoken) {
      fetchActiveRide();
      const interval = setInterval(fetchActiveRide, 5000);
      return () => clearInterval(interval);
    }
  }, [usertoken, drivertoken]);

  const fetchActiveRide = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;
      const res = await axios.get(apiUrl(`${import.meta.env.VITE_BASE_URL}/api/v1/getactiveride`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setActiveRide(res.data.activeRide);
    } catch (error) {
      console.error("Error fetching active ride:", error);
    }
  };

  const cancelActiveRide = async () => {
    if (!activeRide) return;
    try {
      setCancelling(true);
      const token = localStorage.getItem("userToken");
      const res = await axios.post(
        apiUrl(`${import.meta.env.VITE_BASE_URL}/api/v1/cancelride`),
        { rideid: activeRide._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Ride cancelled successfully");
      setActiveRide(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to cancel ride");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        {drivertoken ? (
          /* Driver View */
          <div className="w-full max-w-5xl">
            <Displayrides />
          </div>
        ) : usertoken ? (
          /* Passenger View */
          <div className="w-full max-w-5xl">
            {activeRide ? (
              /* Active Ride Dashboard */
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row h-[calc(100vh-10rem)] min-h-[500px]">
                {/* Info Panel */}
                <div className="w-full md:w-96 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50">
                  <div className="space-y-6">
                    {/* Status */}
                    <div>
                      {activeRide.status === "pending" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-600 animate-pulse"></span>
                          Searching for Driver...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black text-white">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          Driver Dispatched
                        </span>
                      )}
                      <h2 className="text-2xl font-bold text-black mt-3">Your Ride</h2>
                    </div>

                    {/* Driver info */}
                    {activeRide.status === "accepted" && activeRide.driverInfo && (
                      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Driver Assigned</p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center font-extrabold text-white text-base">
                            {activeRide.driverInfo.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-black">{activeRide.driverInfo.name}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">{activeRide.driverInfo.email}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Route */}
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-black"></div>
                          <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pickup</h4>
                          <p className="text-xs font-medium text-black mt-0.5 line-clamp-2">{activeRide.pickup}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-3 h-3 rounded-full border-2 border-black"></div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Destination</h4>
                          <p className="text-xs font-medium text-black mt-0.5 line-clamp-2">{activeRide.destination}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={cancelActiveRide}
                      disabled={cancelling}
                      className="w-full border border-gray-300 hover:border-black hover:bg-white text-gray-600 hover:text-black font-bold py-3 px-4 rounded-xl transition-all cursor-pointer text-sm disabled:opacity-50"
                    >
                      {cancelling ? "Cancelling..." : "Cancel Request"}
                    </button>
                  </div>
                </div>

                {/* Map */}
                <div className="flex-grow h-64 md:h-full">
                  <RideMap pickup={activeRide.pickupcoords} destination={activeRide.destinationcoords} />
                </div>
              </div>
            ) : (
              /* Book Ride Form */
              <Makeride onRideCreated={fetchActiveRide} />
            )}
          </div>
        ) : (
          /* Guest Landing */
          <div className="w-full max-w-4xl text-center space-y-12 py-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-black">
                Go anywhere with Rider
              </h1>
              <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto font-medium">
                Request a ride in seconds, or sign up as a driver to earn on your own schedule.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Passenger Card */}
              <div
                onClick={() => navigate("/UserAuth")}
                className="group bg-white hover:bg-black border border-gray-200 rounded-2xl p-8 cursor-pointer transition-all duration-300 shadow-sm flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-gray-100 group-hover:bg-white flex items-center justify-center mb-5 transition-all">
                  <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black group-hover:text-white mb-2 transition-colors">Book a Ride</h3>
                <p className="text-gray-500 group-hover:text-gray-300 text-xs leading-relaxed transition-colors">
                  Log in as a passenger to schedule your trip and watch your driver arrive on the map.
                </p>
                <div className="mt-6 text-xs font-bold text-black group-hover:text-white flex items-center gap-1 transition-colors">
                  Book now
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>

              {/* Driver Card */}
              <div
                onClick={() => navigate("/DriverAuth")}
                className="group bg-black hover:bg-white borderborder-gray-200 shadow-sm  rounded-2xl p-8 cursor-pointer transition-all duration-300 shadow-sm flex flex-col items-center text-center hover:bg-gray-900"
              >
                <div className="w-14 h-14 rounded-xl bg-white group-hover:bg-gray-100 flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M21 16V10a2 2 0 00-2-2h-3V5a1 1 0 00-1-1H9v12m12 0h-1.5m-8.5 0H10m-3 0h1.5"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-black mb-2">Drive & Earn</h3>
                <p className="text-gray-400 text-xs group-hover:text-gray-300 leading-relaxed">
                  Log in as a driver to view passenger requests, accept trips, and view routes on the map.
                </p>
                <div className="mt-6 text-xs font-bold group-hover:text-black text-white flex items-center gap-1">
                  Drive now
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
