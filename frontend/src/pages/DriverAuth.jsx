import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function driverAuth( {type}) {
    const [driverdata, setdriverdata] = useState({
    name: "",
    email: "",
    password: "",
  });
  async function handleAuth(e) {
    e.preventDefault();
     try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/${type}`,
         driverdata
      );
      const token = res.data.driver.token;
      console.log(res);
      localStorage.setItem("driverToken", token);
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    } 
  }
      const navigate = useNavigate();
      const foruserlogin = () => {
        navigate("/UserAuth");
      };
      const fordriverlogin = () => {
        navigate("/DriverAuth");
      };
      const fordriversignup = () => {
        navigate("/driversignup");
      };
      const forhome = () => {
        navigate("/");
      }; 
      const handleLogout = () => {
        try{
          localStorage.clear();
          navigate("/UserAuth");
        }catch(error){
          toast.error("please login")
        }
    };
 return (
   <form className="bg-gray-400 h-screen " onSubmit={handleAuth}>
      <button type="button" onClick={forhome} className="bg-gray-600 w-30 hover:bg-gray-300 h-10 relative top-20 border-b-4 rounded-bl-2xl rounded-tr-2xl placeholder: text-center font-medium">
        home
      </button>
      <button type="button" onClick={handleLogout} className="bg-gray-600 w-30 hover:bg-gray-300 h-10 relative top-20 border-b-4 rounded-bl-2xl rounded-tr-2xl placeholder: text-center font-medium">
        logout
      </button>
    <div className="flex justify-center items-center shadow-2xs bg-black-50 min-h-screen w-screen ">
      <div className=" bg-gray-500  rounded-2xl h-100 w-100 shadow-2xs flex flex-col items-center ">
        <div className="flex w-100 h-13 relative bottom-1  items-center justify-around">
          <button type="button" onClick={foruserlogin} className="hover:bg-gray-300 border-b-4 bg-gray-600 rounded-2xl w-[50%] font-serif text-2xl h-11 flex items-center justify-center ">user login</button>
          <button type="button" onClick={fordriverlogin} className="hover:bg-gray-300 border-b-4 bg-gray-600 rounded-2xl w-[50%] font-serif text-2xl h-11 flex items-center justify-center ">driver login</button>
        </div>
        {type === "driversignup" && <input
          className="bg-gray-600 w-60 h-10 hover:bg-gray-300 relative top-7 border-b-4 rounded-bl-2xl rounded-tr-2xl placeholder: text-center font-medium"
          type="name"
          placeholder="name"
          onChange={(e) =>
            setdriverdata((prev) => ({ ...prev, name: e.target.value }))
          }
        /> }
        <br />
         <input
          className="bg-gray-600 w-60 h-10 relative hover:bg-gray-300 top-7 border-b-4 rounded-bl-2xl rounded-tr-2xl placeholder: text-center font-medium"
          type="email"
          placeholder="email"
          onChange={(e) =>
            setdriverdata((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <br />
        <input
          className="bg-gray-600 w-60 h-10 relative hover:bg-gray-300 top-7 border-b-4 rounded-bl-2xl rounded-tr-2xl placeholder:  text-center font-medium"
          type="password"
          placeholder="password"
          onChange={(e) =>
            setdriverdata((prev) => ({ ...prev, password: e.target.value }))
          }
        />
        <br />
        {type === "driversignup" ? (
          <button
            type="submit"
            className="bg-gray-600  w-30 h-10 relative top-7 hover:bg-gray-300 border-b-4 rounded-bl-2xl rounded-tr-2xl placeholder: text-center font-medium"
          >
            driversignup
          </button>
        ) : (
          <button
            type="submit"
            className="bg-gray-600  w-30 h-10 relative top-7 hover:bg-gray-300 border-b-4 rounded-bl-2xl rounded-tr-2xl placeholder: text-center font-medium"
          >
            driverlogin
          </button>
        )}
        <br />
        <p className=" relative top-3 underline font-bold" onClick={fordriversignup}>Signup ?</p>
      </div>
    </div>
    </form>
  )
   
}

export default driverAuth