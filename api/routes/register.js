var express = require('express');
const dbo = require('../utils/conn')
const CONSTANTS = require('../utils/constants')
const bcryptjs = require('bcryptjs')
var router = express.Router();

router.post('/user', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", 'https://mychatapp-xqyr.onrender.com')
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
    const dbConnect = dbo.getDb();  
    const encryptedPassword =  await bcryptjs.hash(req.body.password, CONSTANTS.SALT_ROUNDS);
    const matchUser = {
      username: req.body.username,
      password: encryptedPassword,
      friends: [],
      chats: [],
      refreshToken: ""
    };
    dbConnect
      .collection("user")
      .findOne({username: req.body.username}).then((user)=> {
        if (user) {
          res.status(400).send("Username already taken!");
        } else {
            dbConnect.collection("user").insertOne(matchUser, function(err,result) {
                if (err) {
                    res.status(400).send("Error inserting matches!");
                } else {
                    console.log(`Added a new user with id ${result.insertedId}`);
                    res.status(200).send("Success! Redirecting user to Login Page!")
                }
            })
        }
      });
  });


module.exports = router;