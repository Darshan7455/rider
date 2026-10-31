const express = require("express");
const dbconn = require("./config/db.config")
const userroute = require("./routes/userroute")
const driverroute = require("./routes/driverroute")
const rideroute = require("./routes/rideroute")
require("dotenv").config();
const app = express()
const port = process.env.PORT || 5000;

const cors = require("cors");

const allowedOrigins = new Set([
    "https://rider-blue.vercel.app",
    "https://rider-opal-delta.vercel.app",
    "http://localhost:5173",
    ...(process.env.FRONTEND_URL || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
]);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`CORS origin not allowed: ${origin}`));
    },
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ status: "ok", message: "Rider API is running" });
});

app.use("/api/v1", userroute);
app.use("/api/v1", driverroute);
app.use("/api/v1", rideroute);

app.listen(port, "0.0.0.0", async () => {
    console.log(`Server started on port ${port}`);
    try {
        await dbconn();
    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
});
