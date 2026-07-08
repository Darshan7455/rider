const express = require("express");
const dbconn = require("./config/db.config")
const userroute = require("./routes/userroute")
const driverroute = require("./routes/driverroute")
const rideroute = require("./routes/rideroute")
require("dotenv").config();
const cors = require("cors");
const app = express()
const port = process.env.PORT || 5000;

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "https://rider-git-main-darshanshinde7455-5116s-projects.vercel.app",
].filter(Boolean);

const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());


// Health-check — Render pings this to confirm the server is running
app.get("/", (req, res) => {
    res.status(200).json({ status: "ok", message: "Rider API is running" });
});

app.use("/api/v1", userroute);
app.use("/api/v1", driverroute);
app.use("/api/v1", rideroute);

// Listen on 0.0.0.0 so Render's load balancer can reach the server
app.listen(port, "0.0.0.0", async () => {
    console.log(`Server started on port ${port}`);
    try {
        await dbconn();
    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
});

