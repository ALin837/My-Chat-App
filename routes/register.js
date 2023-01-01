var express = require('express');
const dbo = require('../utils/conn')
var router = express.Router();

router.post('/user',function (req, res) {
    const dbConnect = dbo.getDb();  
    const matchUser = {
      username: req.body.Username,
      password: req.body.Password,
      friends: [],
      chats: []
    };
    dbConnect
      .collection("user")
      .findOne({username: req.body.Username}).then((user)=> {
        if (user) {
          res.status(400).send("Username already taken!");
        } else {
            dbConnect.collection("user").insertOne(matchUser, function(err,result) {
                if (err) 
                {
                    res.status(400).send("Error inserting matches!");
                } else {
                    console.log(`Added a new user with id ${result.insertedId}`);
                    res.status(204).send();
                }
            })
        }
      });
  });


module.exports = router;