var express = require('express');
const path = require('path');
const dbo = require('../utils/conn')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
var router = express.Router();
require('dotenv').config();

const helper =  async (username, token) => {
  const dbConnect = dbo.getDb(); 
  try {
    const user = await dbConnect.collection("user").updateOne({username: username}, {$set: {refreshToken:token}})
  } catch {
    response.status(500).send("An Error Occured");
  }

}

router.post('/user', async (req, response) => {
    const dbConnect = dbo.getDb();  
    var username = req.body.username;
    var password = req.body.password;
    try {
      const user = await dbConnect.collection("user").findOne({username: username})
      if (!user) {
        response.status(401).send("Login not successful");
      } else {
        if (username == user.username) {
        bcrypt.compare(password, user.password, (err, res) => {
            if (!res) {
              response.status(401).send("Username/Passwords may be incorrect");
            } else {
              // create token 
              console.log("success");
              let accessToken = jwt.sign({username: username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})              
              let refreshToken = jwt.sign({username: username}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '24h'})
              // stores the refresh token into the database to cross reference
              helper(username, refreshToken);
              response.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: false})
              // returns the accesstoken to the client
              console.log(user._id.valueOf())
              response.status(200).json(
                {
                  message:"Login Successful! Redirecting User...",
                  userId : user._id.valueOf(),
                  token : accessToken
                }
              )
            }
          })
        } else {
          response.status(401).send("Username/Passwords may be incorrect");
        }
      }
    } catch(error) {
      response.status(500).send("An Error Occured");
    }
  });


module.exports = router;