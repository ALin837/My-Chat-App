var express = require('express');
const jwt = require('jsonwebtoken')
const dbo = require('../utils/conn')
var router = express.Router();
require('dotenv').config
router.get("/", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", 'https://mychatapp-xqyr.onrender.com')
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type, Authorization");
    const dbConnect = dbo.getDb();  
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401);
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    try {
        const foundUser = await dbConnect.collection("user").findOne({refreshToken: {$eq: refreshToken}})
        if (!foundUser) {return res.sendStatus(403)}
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err || foundUser.username != decoded.username) {return res.sendStatus(403) }
            const accessToken = jwt.sign({username: foundUser.username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'}) 
            res.json({token : accessToken})       
        })
    } catch {
        res.status(500).send("An Error Occured");
    }
})
module.exports = router;