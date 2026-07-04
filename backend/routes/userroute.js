const express = require("express")
const {createuser , login , verifyEmail, searchLocation} =  require("../controllers/usercontroller");
const route = express.Router();

route.post("/usersignup",createuser);
route.post("/userlogin",login);
route.get("/userverify-email/:verificationToken", verifyEmail);
route.get("/search-location", searchLocation);
console.log("route clear");
module.exports = route;