var express = require('express');
const dbo = require('../utils/conn')
var router = express.Router();

router.get('/all', async (req, response) => {
  response.setHeader("Access-Control-Allow-Origin", 'https://mychatapp-xqyr.onrender.com')
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Max-Age", "1800");
  response.setHeader("Access-Control-Allow-Headers", "content-type");
    const dbConnect = dbo.getDb();  
    try {
      const user = await dbConnect.collection("user").find({}).project( {username : 1, _id: 1}).toArray();
      //console.log(user)
      if (!user) {
        response.status(401).send("Not successful");
      } else {
        response.status(200).json({users: user})
      }
    } catch(error) {
      response.status(500).send("An Error Occured");
    }
  });


router.get('/:userId', async (req, response) => {
  response.setHeader("Access-Control-Allow-Origin", 'https://mychatapp-xqyr.onrender.com')
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Max-Age", "1800");
  response.setHeader("Access-Control-Allow-Headers", "content-type");
    const dbConnect = dbo.getDb();  
    try {
      const user = await dbConnect.collection("user").find({_id: req.params.userId});
      //console.log(user)
      if (!user) {
        response.status(401).send("Not successful");
      } else {
        response.status(200).json({users: user})
      }
    } catch(error) {
      response.status(500).send("An Error Occured");
    }
  });
module.exports = router;