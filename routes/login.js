var express = require('express');
const dbo = require('../utils/conn')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
var router = express.Router();

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
              response.status(401).send("Username/Passwords do not match");
            } else {
              response.status(200).send("Login Successful! Redirecting User...")
            }
          })
        } else {
          response.status(401).send("Username/Passwords do not match");
        }
      }
    } catch(error) {
      response.status(500).send("An Error Occured");
    }
  });
module.exports = router;