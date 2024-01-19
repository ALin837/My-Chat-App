const allowedOrigins = require("../config/allowed")

const check = (req, res, next) => {
    const origin = req.headers['origin'];
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Max-Age', 86400);
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
         // Handle preflight requests
        if (req.method === 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    } else {
        res.status(403).json({ error: 'Origin not allowed' });
    }
}
module.exports = check;