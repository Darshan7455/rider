import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Displayrides = () => {
    const [allrides, setallridesdata] = useState([]);

    useEffect(() => {
        fatchrides();
        acceptride();
    }, []);

    const fatchrides = async () => {
     try {
        const token = localStorage.getItem("driverToken");
      if (!token) {
        toast.error("Please login as a driver first");
        return;
      }
      const res = await axios.get(
        "http://localhost:5000/api/v1/showallrides",
        {
          headers : {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      setallridesdata(res.data.allrides || [])
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message || "Failed to load rides");
      } 
    }
    const acceptride = async (rideid) => {

    try {

        const token = localStorage.getItem("driverToken");

        const res = await axios.post(
            "http://localhost:5000/api/v1/acceptride",

            // body
            { rideid },

            // config
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        toast.success(res.data.message);

    } catch (error) {

        toast.error(
            error?.response?.data?.message ||
            error.message ||
            "Failed to accept ride"
        );
    }
}

  return (
        <div>
            <h1>Pending Rides</h1>
            <div className='flex flex-col w-80 justify-between overflow-y-scroll overflow-x-hidden scrollbar-none h-110'>
              {
                allrides.map((ride,index) => (
                  <div key={ride._id} className=" w-full flex justify-between">
                    <div className=" w-full flex justify-between ">
                        <span className='font-bold'>{index+1}.</span>
                        <span className='font-bold'>pickup: {ride.pickup}</span>
                        <span className='font-bold'>Destination: {ride.destination}</span>
                        <span className='font-bold'>Status: {ride.status}</span>
                    </div>
                    <div>
                        <button onClick={() => acceptride(ride._id)} type='button'>accept</button>
                        <button type='button'>skip</button>
                    </div>
                  </div>
                ))
              }
            </div>
        </div>
  )
}

    
export default Displayrides