const express = require("express")
const {createride, acceptride , showallride} = require("../controllers/ridecontroller")
const authenticateUser = require("../middleware/authenticateUser")
const authenticateUdriver = require("../middleware/authenticatedriver");
const authenticatedriver = require("../middleware/authenticatedriver");
const route = express.Router();

route.post("/makeride",authenticateUser,createride);
route.get("/showallrides",authenticatedriver,showallride);
route.post("/acceptride",authenticatedriver,acceptride);
console.log("ride route");
module.exports = route;