const ride = require("../models/rideschema")
const user = require("../models/userschema")
const driver = require("../models/driverschema");
const { all } = require("../routes/userroute");

async function createride(req,res){
    try {
        const {
                pickup,
                destination,
                pickupcoords,
                destinationcoords
               } = req.body;

        if(!req.user){
            return res.status(401).json({
                success : false,
                message : "login required"
            })
        }

        if(!pickup){
            return res.status(404).json({
                success : false,
                message : "enter the pickup point"
            })
        }
        if(!destination){
            return res.status(404).json({
                success : false,
                message : "enter the destination"
            })
        }
        const newride = await ride.create({
           username: req.user._id,
           pickup,
           destination,
           pickupcoords,
           destinationcoords,
           status: "pending"
        });
        return res.status(200).json({
           success  : true,
           message : "ride scheduled successfully",
           data: newride
        });
    } catch (error) {
        console.error("createride failed:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}
async function showallride(req,res){
    try {
        const allrides = await ride.find({
            status: "pending",
            skippedBy: { $ne: req.driver._id }
        });
        return res.status(200).json({
            success: true,
            message: "here all pending rides",
            allrides
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
const Ride = require("../models/rideschema");

async function acceptride(req, res) {

    try {

        const { rideid } = req.body;

        const existingRide = await Ride.findOne({
            driver: req.driver._id,
            status: "accepted"
        });

        if (existingRide) {

            return res.status(400).json({
                success: false,
                message: "Complete current ride first"
            });
        }
        const ridedata = await Ride.findById(rideid);

        if (!ridedata) {

            return res.status(404).json({
                success: false,
                message: "Ride not found"
            });
        }

        if (ridedata.status !== "pending") {

            return res.status(400).json({
                success: false,
                message: "Ride already accepted"
            });
        }

        if (!req.driver) {

            return res.status(404).json({
                success: false,
                message: "Driver not available"
            });
        }

        
        ridedata.driver = req.driver._id;

        ridedata.status = "accepted";

        await ridedata.save();

        return res.status(200).json({
            success: true,
            message: "Ride accepted",
            ride: ridedata
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
async function skipride(req, res) {

    try {

        const { rideid } = req.body;

        const ridedata = await ride.findById(rideid);

        if (!ridedata) {

            return res.status(404).json({
                success: false,
                message: "Ride not found"
            });
        }

        // add current driver into skippedBy
        ridedata.skippedBy.push(req.driver._id);

        await ridedata.save();

        return res.status(200).json({
            success: true,
            message: "Ride skipped"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function completeride(req, res) {
    try {
        const { rideid } = req.body;
        const ridedata = await ride.findById(rideid);

        if (!ridedata) {
            return res.status(404).json({
                success: false,
                message: "Ride not found"
            });
        }

        if (ridedata.status !== "accepted") {
            return res.status(400).json({
                success: false,
                message: "Ride cannot be completed from this status"
            });
        }

        if (ridedata.driver.toString() !== req.driver._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to complete this ride"
            });
        }

        ridedata.status = "complete";
        await ridedata.save();

        return res.status(200).json({
            success: true,
            message: "Ride completed successfully",
            ride: ridedata
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function cancelride(req, res) {
    try {
        const { rideid } = req.body;
        const ridedata = await ride.findById(rideid);

        if (!ridedata) {
            return res.status(404).json({
                success: false,
                message: "Ride not found"
            });
        }

        if (ridedata.status === "complete") {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel a completed ride"
            });
        }

        const isPassenger = req.user && ridedata.username && ridedata.username.toString() === req.user._id.toString();
        const isDriver = req.driver && ridedata.driver && ridedata.driver.toString() === req.driver._id.toString();

        if (!isPassenger && !isDriver) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to cancel this ride"
            });
        }

        ridedata.status = "cancelled";
        await ridedata.save();

        return res.status(200).json({
            success: true,
            message: "Ride cancelled successfully",
            ride: ridedata
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function getactiveride(req, res) {
    try {
        let activeRide = null;
        if (req.user) {
            activeRide = await ride.findOne({
                username: req.user._id,
                status: { $in: ["pending", "accepted"] }
            });
            if (activeRide && activeRide.driver) {
                const driverInfo = await driver.findById(activeRide.driver).select("name email");
                activeRide = activeRide.toObject();
                activeRide.driverInfo = driverInfo;
            }
        }
        return res.status(200).json({
            success: true,
            activeRide
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function getdriveractiveride(req, res) {
    try {
        const activeRide = await ride.findOne({
            driver: req.driver._id,
            status: "accepted"
        });
        return res.status(200).json({
            success: true,
            activeRide
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

console.log("ridecontor");
module.exports = {
    createride,
    acceptride,
    skipride,
    showallride,
    completeride,
    cancelride,
    getactiveride,
    getdriveractiveride
};