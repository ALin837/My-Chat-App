const allowedOrigins = require("../config/allowed")

const check = (req, res, next) => {
    const origin = req.headers['origin'];
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', origin);
        res.set('Access-Control-Allow-Origin', origin);
        //res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
        //res.header(
        //  'Access-Control-Allow-Headers',
        //  'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        //)
    }
    next()
}
module.exports = check;