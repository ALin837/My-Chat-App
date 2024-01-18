const allowedOrigins = require("../config/allowed")

const check = (req, res, next) => {
    const origin = req.headers['origin'];
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', origin);
    }
    next()
}
module.exports = check;