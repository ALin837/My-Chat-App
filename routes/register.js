var express = require('express');
const dbo = require('../utils/conn')
const bcrypt = require('bcrypt')
var router = express.Router();

router.post('/user', async (req, res) => {
    const dbConnect = dbo.getDb();  
    const encryptedPassword =  await bcrypt.hash(req.body.password, 10);
    const matchUser = {
      username: req.body.username,
      password: encryptedPassword,
      friends: [],
      chats: []
    };
    dbConnect
      .collection("user")
      .findOne({username: req.body.username}).then((user)=> {
        if (user) {
          res.status(400).send("Username already taken!");
        } else {
            dbConnect.collection("user").insertOne(matchUser, function(err,result) {
                if (err) 
                {
                    res.status(400).send("Error inserting matches!");
                } else {
                    console.log(`Added a new user with id ${result.insertedId}`);
                    res.status(200).send("Successful!");
                }
            })
        }
      });
  });


module.exports = router;