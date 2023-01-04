var express = require('express');
const path = require('path');
const dbo = require('../utils/conn')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
var router = express.Router();
require('dotenv').config();

router.post('/user', async (req, response) => {
    const dbConnect = dbo.getDb();  
    var username = req.body.username;
    var password = req.body.password;
    try {
      const user = await dbConnect.collection("user").findOne({username: username})
      console.log(user)
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
              // store refresh token into database to cross reference
              let accessToken = jwt.sign({name: username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
              let refreshToken = jwt.sign({name: username}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '24h'})
              response.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
              response.status(200).json(
                {
                  message:"Login Successful! Redirecting User...",
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