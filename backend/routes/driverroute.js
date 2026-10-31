const express = require("express")
const {createdriver , driverlogin , verifyEmail} =  require("../controllers/drivercontroller");
const route = express.Router();

route.post("/driversignup",createdriver);
route.post("/driverlogin",driverlogin);
route.get("/driververify-email/:verificationToken", verifyEmail);
console.log("route clear");
module.exports = route;