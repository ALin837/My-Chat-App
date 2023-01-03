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
              response.status(401).send("Username/Passwords may be incorrect");
            } else {
              // create token 
              console.log("success");
              let token = jwt.sign({name: username}, 'temporarysecretvalue', {expiresIn: '1h'})
              console.log(token)
              response.status(200).json(
                {
                  message:"Login Successful! Redirecting User...",
                  token : token
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