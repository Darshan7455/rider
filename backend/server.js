const express = require("express");
const dbconn = require("./config/db.config")
const userroute = require("./routes/userroute")
const driverroute = require("./routes/driverroute")
const rideroute = require("./routes/rideroute")
require("dotenv").config();
const cors = require("cors");
const app = express()
const port = 5000;

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/api/v1", userroute);
app.use("/api/v1", driverroute);
app.use("/api/v1", rideroute);
app.listen(port,()=>{
    console.log("server started!!");
    dbconn();
})
