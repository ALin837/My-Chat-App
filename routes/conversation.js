var express = require('express');
const dbo = require('../utils/conn')
var router = express.Router();

// This method takes a sender and reciever and creates a new conversation in the database
router.post('/',  async (req, response) => {
    const dbConnect = dbo.getDb();  
    const conversation = {
        name: req.body.name, // on default it will be the persons name that you want to talk to
        members : req.body.members // put all the users in the conversation in one array and save it (INCLUDING YOURSELF)
    }
    dbConnect.collection("conversations").insertOne(conversation, function(err,result) {
    if (err) {
        response.status(500).send("Error inserting conversation!");
    } else {
        console.log(`Added a new conversation with id ${result.insertedId}`);
        response.status(200).json({chat_id: result.insertedId})
    }
    })
});


// This method takes a userId and returns all the conversations based off of that
router.get('/:userId', async (req, response) => {
    const dbConnect = dbo.getDb();  
    try {
        const conversations = await dbConnect.collection("conversations").find({
            members : {$in: [req.params.userId] }}).toArray()
        response.status(200).json({conversations: conversations})
    } catch {
        response.status(500).send("Error");
    }
});

module.exports = router;