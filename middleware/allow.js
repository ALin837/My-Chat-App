const allowedOrigins = require("../config/allowed")

const check = (req, res, next) => {
    const origin = req.headers['origin'];
    console.log("check:" + origin)
    console.log(req)
    if (allowedOrigins.includes(origin)) {
        console.log("checkAllowCred:" + origin)
        res.header('Access-Control-Allow-Credentials', true);
    }
    next()
}
module.exports = check;