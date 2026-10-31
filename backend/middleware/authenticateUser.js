const user = require("../models/userschema");
const { verifyJWT } = require("../utils/jwt.token");

async function authenticateUser(req, res, next) {
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

    const currentUser = await user.findOne({ email: decoded.email });

    if (!currentUser) {
        return res.status(401).json({
            success: false,
            message: "user not found",
        });
    }

    req.user = currentUser;
    next();
}

module.exports = authenticateUser;