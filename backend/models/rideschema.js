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
    status :{
        type : String ,
        required : true,
        enum : ["pending","complete","accepted","cancelled"]
    }

})

const ride = mongoose.model("ride",rideschema);
module.exports = ride;