import React from 'react'
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const auth = () => {
    navigate("/auth");
  }
  const handleLogout = () => {
        try{
          localStorage.clear();
          navigate("/UserAuth");
        }catch(error){
          toast.error("please login")
        }
    };
  
  return (
    <div className=' flex items-center justify-center gap-200 bg-amber-300 h-12 w-full'>
      <div>
        <h1>navbar</h1>
      </div>
      <div className='w-70  flex justify-between'>
        <button className=' hover:cursor-pointer relative right-7' type='button'>Help</button>
        <button className=' hover:cursor-pointer relative right-7' type='button'>about</button>
        <button onClick={auth} className=' relative right-7' type='button'>Login/Sinup</button>
        <button onClick={handleLogout} className=' relative right-7' type='button'>Logout</button>
      </div>
    </div>
  )
}

export default Navbar