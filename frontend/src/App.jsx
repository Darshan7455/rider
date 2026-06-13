
import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import UserAuth from "./pages/UserAuth";
import DriverAuth from "./pages/DriverAuth";
import Navbar from "./components/Navbar";
import Home from "./pages/home";
function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/auth" element={<Auth type={ "usersignup" }/>}/>
      <Route path="/usersignup" element={<UserAuth type={ "usersignup" } />}/>
      <Route path="/driversignup" element={<DriverAuth type={ "driversignup" }/>}/>
      <Route path="/UserAuth" element={<UserAuth  type={ "userlogin" }/>}/>
      <Route path="/DriverAuth" element={<DriverAuth type={ "driverlogin" }/>}/>
    </Routes>
  )
}

export default App
