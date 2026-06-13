const mongoose = require("mongoose")
async function dbconn(){
    await mongoose.connect("mongodb://localhost:27017/rider");
    console.log("db conn");

}

module.exports=dbconn