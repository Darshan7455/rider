const mongoose = require("mongoose")
async function dbconn(){
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/rider";
    await mongoose.connect(mongoUri);
    console.log("db conn");

}

module.exports=dbconn