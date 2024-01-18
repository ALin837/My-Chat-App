var express = require('express');
const dbo = require('../utils/conn')
const jwt = require('jsonwebtoken')
var router = express.Router();
require('dotenv').config();
// deletes the refreshToken in the db
const deleteRefreshToken =  async (username) => {
  const dbConnect = dbo.getDb(); 
  await dbConnect.collection("user").updateOne({username: username}, {$set: {refreshToken: ""}})
  console.log("db modified")

}

router.get('/', async (req, res) => {
    // client side, delete access Token
    const dbConnect = dbo.getDb();  
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204);
    const reFreshToken = cookies.jwt;
    console.log(reFreshToken)
    try {
        const foundUser = await dbConnect.collection("user").findOne({refreshToken: {$eq: reFreshToken}})
        console.log(foundUser)
        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: false, sameSite: 'None'});
            console.log("cleared refresh Token");
            return res.sendStatus(204)
        }
        deleteRefreshToken(foundUser.username)
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: false, sameSite: 'None'});
        console.log("cleared refresh Token");
        return res.sendStatus(204)
    } catch {
        res.status(500).send("An Error Occured");
    }
  });


module.exports = router;