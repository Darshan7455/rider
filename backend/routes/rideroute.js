const express = require("express")
const {
    createride,
    acceptride,
    skipride,
    showallride,
    completeride,
    cancelride,
    getactiveride,
    getdriveractiveride
} = require("../controllers/ridecontroller")
const authenticateUser = require("../middleware/authenticateUser")
const authenticatedriver = require("../middleware/authenticatedriver");
const route = express.Router();

route.post("/makeride", authenticateUser, createride);
route.get("/showallrides", authenticatedriver, showallride);
route.post("/acceptride", authenticatedriver, acceptride);
route.post("/skipride", authenticatedriver, skipride);
route.post("/completeride", authenticatedriver, completeride);
route.post("/cancelride", authenticateUser, cancelride);
route.post("/driver/cancelride", authenticatedriver, cancelride);
route.get("/getactiveride", authenticateUser, getactiveride);
route.get("/driver/getactiveride", authenticatedriver, getdriveractiveride);

console.log("ride route");
module.exports = route;