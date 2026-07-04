const mongoose = require("mongoose");
const user = require("./userschema");

const rideschema = new mongoose.Schema({
    username : {
        type: mongoose.Schema.Types.ObjectId,
        required : false
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
    },
    pickup : {
        type: String,
        required : true
    },
    destination : {
        type: String,
        required : true
    },
    pickupcoords: {
        lat: Number,
        lng: Number
    },

    destinationcoords: {
        lat: Number,
        lng: Number
    },
    status :{
        type : String ,
        required : true,
        enum : ["pending","complete","accepted","cancelled"]
    },
    skippedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "driver",
        default: []
    }]

})

const ride = mongoose.model("ride",rideschema);
module.exports = ride;