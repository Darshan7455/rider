const ride = require("../models/rideschema")
const user = require("../models/userschema")
const driver = require("../models/driverschema");
const { all } = require("../routes/userroute");

async function createride(req,res){
    try {
        const {pickup, destination} = req.body;

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
            username : req.user._id,
            pickup,
            destination,
            status: "pending",
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
    const allrides = await ride.find({status : "pending"});
    if(!allrides){
        return res.status(404).json({
            success : false,
            message : "No rides are pending",
        })
    }

    return res.status(200).json({
        success : true, 
        message : "here all pending rides",
        allrides
    })
}
const Ride = require("../models/rideschema");

async function acceptride(req, res) {
    try {
        const {_id} = req.body;

        const ridedata = await Ride.findOne(_id);

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

console.log("ridecontor");
module.exports = {createride, acceptride , showallride}