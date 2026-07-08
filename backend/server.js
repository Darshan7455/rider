const express = require("express");
const dbconn = require("./config/db.config")
const userroute = require("./routes/userroute")
const driverroute = require("./routes/driverroute")
const rideroute = require("./routes/rideroute")
require("dotenv").config();
const app = express()
const port = process.env.PORT || 5000;

const cors = require("cors");

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://rider-delta.vercel.app",
  "https://rider-theta.vercel.app",
  "https://rider-git-main-darshanshinde7455-5116s-projects.vercel.app",
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(
  cors(corsOptions)
);

app.options(/.*/, cors(corsOptions));

app.use(express.json());

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

