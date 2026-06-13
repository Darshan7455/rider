const express = require("express")
const {createuser , login , verifyEmail} =  require("../controllers/usercontroller");
const route = express.Router();

route.post("/usersignup",createuser);
route.post("/userlogin",login);
route.get("/userverify-email/:verificationToken", verifyEmail);
console.log("route clear");
module.exports = route;