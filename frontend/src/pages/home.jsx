import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";
import Displayrides from "../components/displayrides";
import Makeride from "../components/makeride";
function home() {
  const drivertoken = localStorage.getItem("driverToken");
  return (
  <>
    <Navbar />
    <div className="w-full flex min-h-screen bg-gray-400 ">
      <div className=" w-full flex items-center justify-center gap-50 p-20 ">
      { drivertoken && <div className="bg-amber-800 w-100 h-130 p-5">
      <Displayrides />
      </div>}
      <div className="bg-amber-800 w-100 min-h-130 p-5">
      <Makeride />
      </div>
      </div>
    </div>
  </>
  )
}

export default home

