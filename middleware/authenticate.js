const jwt = require('jsonwebtoken')
require('dotenv').config();
const authenticate = (req, res, next) => {
    //console.log(req.headers.authorization)
    const authHeader = req.headers.authorization
    if (!authHeader) return res.sendStatus(401)
    //console.log(authHeader)
    const token = authHeader.split(' ')[1]
    //console.log(token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403) // invalid token
        req.user = decoded.username;
    })
    console.log('reach')
    next();
}
module.exports = authenticate;