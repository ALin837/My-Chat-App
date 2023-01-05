var express = require('express');
const dbo = require('../utils/conn')
var router = express.Router();
router.post('/',  async (req, response) => {
    const dbConnect = dbo.getDb();  
    const conversation = {
        members : [req.body.sender, req.body.reciever] 
    }
    dbConnect.collection("conversations").insertOne(conversation, function(err,result) {
    if (err) {
        res.status(500).send("Error inserting conversation!");
    } else {
        console.log(`Added a new conversation with id ${result.insertedId}`);
        res.status(200).send("Success!")
    }
    })
});

router.get('/:userId', async (req, response) => {
    const dbConnect = dbo.getDb();  
    try {
        const conversation = await dbConnect.collection("conversations").find({
            members : {$in: [req.params.userId] }})
        res.status(200).json(conversation)
    } catch {
        res.status(500).send("Error");
    }
});

module.exports = router;