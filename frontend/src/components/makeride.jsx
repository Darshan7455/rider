import React from 'react'
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

function Makeride() {
  const [ridedetail,setridedetail] = useState(
    {
      pickup : "",
      destination : "",
    }
  )
  async function bookride(e) {
    e.preventDefault();
     try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.error("Please login first");
        return;
      }
      const res = await axios.post(
        "http://localhost:5000/api/v1/makeride",
        ridedetail,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || error?.message || "ride booking failed";
      toast.error(status ? `${status}: ${message}` : message);
      }
  }
  return (
    <div className='flex flex-col '>
        <input type="text" className='bg-amber-100' placeholder='pickup' 
         onChange={(e) =>
          setridedetail ((prev) =>({...prev, pickup : e.target.value}))
         }/>
        <br />
        <br />
        <input type="text" className='bg-amber-100' placeholder='destination'
        onChange={(e) =>
          setridedetail ((prev) =>({...prev, destination : e.target.value}))
         }/>
        <br />
        <br />
        <button onClick={bookride}>schedule the ride</button>
    </div>
  )

}


export default Makeride