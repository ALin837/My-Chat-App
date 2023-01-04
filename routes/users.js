var express = require('express');
const dbo = require('../utils/conn')
var router = express.Router();
const auth = require('../middleware/authenticate')

router.get('/all',auth, async (req, response) => {
    const dbConnect = dbo.getDb();  
    try {
      const user = await dbConnect.collection("user").find({}, {username : 1})
      console.log(user)
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