const jwt = require("jsonwebtoken");
async function generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET);
}

async function verifyJWT(token) {
    try {
        let data = await jwt.verify(token,process.env.JWT_SECRET);
        return data;
    } catch (err) {
        return false;
    }
}
module.exports = {generateToken , verifyJWT};