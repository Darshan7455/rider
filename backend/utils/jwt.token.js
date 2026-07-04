const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET || "dev-rider-secret";

async function generateToken(payload) {
    return jwt.sign(payload, jwtSecret, { expiresIn: "7d" });
}

async function verifyJWT(token) {
    try {
        let data = await jwt.verify(token, jwtSecret);
        return data;
    } catch (err) {
        return false;
    }
}
module.exports = { generateToken, verifyJWT };