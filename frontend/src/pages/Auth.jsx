import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { apiUrl } from "../utiles/api";
function Auth({type}) {
    const [userdata, setuserdata] = useState({
    name: "",
    email: "",
    password: "",
  });
  async function handleAuth(e) {
    e.preventDefault();
     try {
      const res = await axios.post(
        apiUrl(`${import.meta.env.VITE_BASE_URL}/api/v1/${type}`),
         userdata
      );
      toast.success(res.data.message); 
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
      const forusersignup = () => {
        navigate("/usersignup");
      };
      const forhome = () => {
        navigate("/");
      };
      const handleLogout = () => {
          localStorage.clear();
          navigate("/UserAuth");
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
        {type === "usersignup" && <input
          className="bg-gray-600 w-60 h-10 hover:bg-gray-300 relative top-7 border-b-4 rounded-bl-2xl rounded-tr-2xl placeholder: text-center font-medium"
          type="name"
          placeholder="name"
          onChange={(e) =>
            setuserdata((prev) => ({ ...prev, name: e.target.value }))
          }
        /> }
        <br />
         <input
          className="bg-gray-600 w-60 h-10 relative hover:bg-gray-300 top-7 border-b-4 rounded-bl-2xl rounded-tr-2xl placeholder: text-center font-medium"
          type="email"
          placeholder="email"
          onChange={(e) =>
            setuserdata((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <br />
        <input
          className="bg-gray-600 w-60 h-10 relative hover:bg-gray-300 top-7 border-b-4 rounded-bl-2xl rounded-tr-2xl placeholder:  text-center font-medium"
          type="password"
          placeholder="password"
          onChange={(e) =>
            setuserdata((prev) => ({ ...prev, password: e.target.value }))
          }
        />
        <br />
        {type === "usersignup" ? (
          <button
            type="submit"
            className="bg-gray-600  w-30 h-10 relative top-7 hover:bg-gray-300 border-b-4 rounded-bl-2xl rounded-tr-2xl placeholder: text-center font-medium"
          >
            usersignup
          </button>
        ) : (
          <button
            type="submit"
            className="bg-gray-600  w-30 h-10 relative top-7 hover:bg-gray-300 border-b-4 rounded-bl-2xl rounded-tr-2xl placeholder: text-center font-medium"
          >
            userlogin
          </button>
        )}
        <br />
        <p className=" relative top-3 underline font-bold" onClick={forusersignup}>Signup ?</p>
      </div>
    </div>
    </form>
)}

export default Auth