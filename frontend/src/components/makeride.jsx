import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

function Makeride({ onRideCreated }) {
  const [ridedetail, setridedetail] = useState({
    pickup: "",
    destination: "",
  });

  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchLocation = async (query, type) => {
    if (!query || query.length < 2) {
      if (type === "pickup") setPickupSuggestions([]);
      else setDestinationSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/search-location?query=${encodeURIComponent(query)}`
      );
      if (!res.ok) return;

      const result = await res.json();
      if (!result.success || !result.data) {
        if (type === "pickup") setPickupSuggestions([]);
        else setDestinationSuggestions([]);
        return;
      }

      if (type === "pickup") setPickupSuggestions(result.data);
      else setDestinationSuggestions(result.data);
    } catch (error) {
      console.error("Location search error:", error);
    }
  };

  async function bookride(e) {
    e.preventDefault();
    if (!ridedetail.pickup || !ridedetail.destination) {
      toast.error("Please enter both pickup and destination");
      return;
    }
    if (!pickupCoords || !destinationCoords) {
      toast.error("Please select locations from the suggestions list");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.error("Please login as a passenger first");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/v1/makeride",
        {
          pickup: ridedetail.pickup,
          destination: ridedetail.destination,
          pickupcoords: pickupCoords,
          destinationcoords: destinationCoords,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "Ride requested successfully!");
      setridedetail({ pickup: "", destination: "" });
      setPickupSuggestions([]);
      setDestinationSuggestions([]);
      setPickupCoords(null);
      setDestinationCoords(null);

      if (typeof onRideCreated === "function") onRideCreated();
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Ride booking failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm w-full max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">Request a Ride</h2>
        <p className="text-gray-500 text-sm mt-1">Get a driver in minutes</p>
      </div>

      <form className="space-y-5" onSubmit={bookride}>
        {/* PICKUP INPUT */}
        <div className="relative">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Pickup Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="w-2.5 h-2.5 rounded-full bg-black inline-block"></span>
            </div>
            <input
              type="text"
              className="block w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm font-medium"
              placeholder="Where should we pick you up?"
              value={ridedetail.pickup}
              onChange={(e) => {
                setridedetail((prev) => ({ ...prev, pickup: e.target.value }));
                searchLocation(e.target.value, "pickup");
              }}
            />
          </div>

          {pickupSuggestions.length > 0 && (
            <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto divide-y divide-gray-100">
              {pickupSuggestions.map((place, index) => (
                <div
                  key={index}
                  className="px-4 py-3 cursor-pointer hover:bg-gray-50 text-gray-700 hover:text-black transition-all text-xs font-medium"
                  onClick={() => {
                    setridedetail((prev) => ({ ...prev, pickup: place.display_name }));
                    setPickupCoords({ lat: Number(place.lat), lng: Number(place.lon) });
                    setPickupSuggestions([]);
                  }}
                >
                  {place.display_name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DESTINATION INPUT */}
        <div className="relative">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Dropoff Destination
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-500 inline-block"></span>
            </div>
            <input
              type="text"
              className="block w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm font-medium"
              placeholder="Where are you heading?"
              value={ridedetail.destination}
              onChange={(e) => {
                setridedetail((prev) => ({ ...prev, destination: e.target.value }));
                searchLocation(e.target.value, "destination");
              }}
            />
          </div>

          {destinationSuggestions.length > 0 && (
            <div className="absolute z-25 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto divide-y divide-gray-100">
              {destinationSuggestions.map((place, index) => (
                <div
                  key={index}
                  className="px-4 py-3 cursor-pointer hover:bg-gray-50 text-gray-700 hover:text-black transition-all text-xs font-medium"
                  onClick={() => {
                    setridedetail((prev) => ({ ...prev, destination: place.display_name }));
                    setDestinationCoords({ lat: Number(place.lat), lng: Number(place.lon) });
                    setDestinationSuggestions([]);
                  }}
                >
                  {place.display_name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SUBMIT */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black hover:bg-gray-900 active:bg-gray-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Booking Ride...
              </>
            ) : (
              "Schedule the Ride"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Makeride;