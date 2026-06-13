const driver = require("../models/driverschema");
const { verifyJWT } = require("../utils/jwt.token");

async function authenticatedriver(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "authorization token missing",
        });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verifyJWT(token);

    if (!decoded || !decoded.email) {
        return res.status(401).json({
            success: false,
            message: "invalid token",
        });
    }

    const currentdriver = await driver.findOne({ email: decoded.email });

    if (!currentdriver) {
        return res.status(401).json({
            success: false,
            message: "driver not found",
        });
    }

    req.driver = currentdriver;
    next();
}

module.exports = authenticatedriver;