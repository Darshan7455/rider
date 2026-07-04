import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import RideMap from "./RideMap";
import { apiUrl } from "../utiles/api";

const Displayrides = () => {
  const [acceptedRide, setAcceptedRide] = useState(null);
  const [allrides, setallridesdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRideId, setLoadingRideId] = useState(null);

  useEffect(() => {
    checkActiveRide();
  }, []);

  const checkActiveRide = async () => {
    try {
      const token = localStorage.getItem("driverToken");
      if (!token) return;

      const res = await axios.get(apiUrl("/api/v1/driver/getactiveride"), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success && res.data.activeRide) {
        setAcceptedRide(res.data.activeRide);
      } else {
        fetchrides();
      }
    } catch (error) {
      console.error("Error checking active ride:", error);
      fetchrides();
    }
  };

  const fetchrides = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("driverToken");
      if (!token) {
        toast.error("Please login as a driver first");
        return;
      }
      const res = await axios.get(apiUrl("/api/v1/showallrides"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setallridesdata(res.data.allrides || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to load rides");
    } finally {
      setLoading(false);
    }
  };

  const acceptride = async (rideid) => {
    if (loadingRideId === rideid) return;
    try {
      setLoadingRideId(rideid);
      const token = localStorage.getItem("driverToken");
      const res = await axios.post(
        apiUrl("/api/v1/acceptride"),
        { rideid },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAcceptedRide(res.data.ride);
      toast.success(res.data.message || "Ride accepted!");
      setallridesdata((prev) => prev.filter((ride) => ride._id !== rideid));
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to accept ride");
    } finally {
      setLoadingRideId(null);
    }
  };

  const skipride = async (rideid) => {
    try {
      const token = localStorage.getItem("driverToken");
      const res = await axios.post(
        apiUrl("/api/v1/skipride"),
        { rideid },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Ride skipped");
      setallridesdata((prev) => prev.filter((ride) => ride._id !== rideid));
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to skip ride");
    }
  };

  const completeRide = async () => {
    if (!acceptedRide) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("driverToken");
      const res = await axios.post(
        apiUrl("/api/v1/completeride"),
        { rideid: acceptedRide._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Ride completed!");
      setAcceptedRide(null);
      fetchrides();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to complete ride");
    } finally {
      setLoading(false);
    }
  };

  const cancelRide = async () => {
    if (!acceptedRide) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("driverToken");
      const res = await axios.post(
        apiUrl("/api/v1/driver/cancelride"),
        { rideid: acceptedRide._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Ride cancelled");
      setAcceptedRide(null);
      fetchrides();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to cancel ride");
    } finally {
      setLoading(false);
    }
  };

  if (acceptedRide) {
    return (
      <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-white overflow-hidden">
        {/* Map */}
        <div className="flex-grow h-2/3 md:h-full relative">
          <RideMap pickup={acceptedRide.pickupcoords} destination={acceptedRide.destinationcoords} />
        </div>

        {/* Controls Panel */}
        <div className="w-full md:w-96 bg-white border-t md:border-t-0 md:border-l border-gray-200 p-6 flex flex-col justify-between shadow-lg z-20">
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-black text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                Active Ride
              </span>
              <h2 className="text-xl font-bold text-black mt-2">Current Trip</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-black border border-gray-300"></div>
                  <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pickup</h4>
                  <p className="text-sm font-medium text-black mt-1">{acceptedRide.pickup}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full border-2 border-black"></div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Dropoff</h4>
                  <p className="text-sm font-medium text-black mt-1">{acceptedRide.destination}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <button
              onClick={completeRide}
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 active:bg-gray-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all cursor-pointer text-sm disabled:opacity-50"
            >
              {loading ? "Processing..." : "Complete Ride"}
            </button>
            <button
              onClick={cancelRide}
              disabled={loading}
              className="w-full border border-gray-300 hover:border-black hover:bg-gray-50 text-gray-600 hover:text-black font-bold py-3 px-4 rounded-xl transition-all cursor-pointer text-sm disabled:opacity-50"
            >
              Cancel Ride
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm w-full max-w-xl mx-auto min-h-[400px] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-black">Available Requests</h2>
            <p className="text-gray-500 text-xs mt-1">Accept a request to start driving</p>
          </div>
          <button
            onClick={fetchrides}
            className="p-2 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100 transition-all cursor-pointer border border-gray-200"
            title="Refresh list"
          >
            <svg
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12"></path>
            </svg>
          </button>
        </div>

        {loading && allrides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 space-y-3">
            <svg className="animate-spin h-8 w-8 text-black" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm font-medium">Loading requests...</p>
          </div>
        ) : allrides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 border border-dashed border-gray-300 rounded-xl bg-gray-50">
            <svg className="w-10 h-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-sm font-medium text-gray-500">No pending requests right now</p>
            <button
              onClick={fetchrides}
              className="mt-3 text-xs bg-black text-white font-bold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer hover:bg-gray-800"
            >
              Check Again
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
            {allrides.map((ride, index) => (
              <div
                key={ride._id}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-4 flex flex-col gap-4 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-grow pr-3">
                    <div className="flex gap-2.5 items-start">
                      <span className="w-2 h-2 rounded-full bg-black mt-1.5 flex-shrink-0"></span>
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pickup</span>
                        <p className="text-xs font-semibold text-black mt-0.5 line-clamp-1">{ride.pickup}</p>
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <span className="w-2 h-2 rounded-full border-2 border-black mt-1.5 flex-shrink-0"></span>
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Destination</span>
                        <p className="text-xs font-semibold text-black mt-0.5 line-clamp-1">{ride.destination}</p>
                      </div>
                    </div>
                  </div>
                  <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full capitalize flex-shrink-0">
                    {ride.status}
                  </span>
                </div>

                <div className="flex gap-2 border-t border-gray-200 pt-3">
                  <button
                    onClick={() => acceptride(ride._id)}
                    disabled={loadingRideId === ride._id}
                    className="flex-1 bg-black hover:bg-gray-900 text-white font-bold py-2 rounded-lg text-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingRideId === ride._id ? "Accepting..." : "Accept Request"}
                  </button>
                  <button
                    onClick={() => skipride(ride._id)}
                    className="px-4 py-2 border border-gray-300 hover:border-black hover:bg-gray-100 text-gray-600 hover:text-black font-bold rounded-lg text-xs transition-all cursor-pointer"
                  >
                    Skip
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Displayrides;