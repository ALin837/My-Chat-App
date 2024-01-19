var express = require('express');
const dbo = require('../utils/conn')
var router = express.Router();

// This method takes a sender and reciever and creates a new conversation in the database
router.post('/',  async (req, response) => {
    response.setHeader("Access-Control-Allow-Origin", 'https://mychatapp-xqyr.onrender.com')
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Max-Age", "1800");
    response.setHeader("Access-Control-Allow-Headers", "content-type");
    const dbConnect = dbo.getDb();  
    const conversation = {
        name: req.body.name, // on default it will be the persons name that you want to talk to
        members : req.body.members // put all the users in the conversation in one array and save it (INCLUDING YOURSELF)
    }

    if (req.body.members.length == 2) {
        const receiver = req.body.members[0];
        const sender = req.body.members[1];
        const user = await dbConnect.collection("conversations").findOne({$and: [{members: {$elemMatch: receiver}},{members: {$elemMatch: sender}}]})
        //console.log(user) 
        if (user) {
            response.status(200).json({chatId: user._id.valueOf()})
        } else {
            dbConnect.collection("conversations").insertOne(conversation, function(err,result) {
                if (err) {
                    response.status(500).send("Error inserting conversation!");
                } else {
                    console.log(`Added a new conversation with id ${result.insertedId}`);
                    response.status(200).json({chatId: result.insertedId})
                }
            })
        }
    }
});

// This method takes a userId and a second user id and returns all the conversations based off of that
router.get('/:user1Id/:user2Id', async (req, response) => {
    response.setHeader("Access-Control-Allow-Origin", 'https://mychatapp-xqyr.onrender.com')
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Max-Age", "1800");
    response.setHeader("Access-Control-Allow-Headers", "content-type");
    const dbConnect = dbo.getDb();  
    const receiver = req.params.user1Id;
    const sender = req.params.user2Id;
    console.log("receiver:" + receiver)
    console.log("sender:" + sender)
    try {
       //const conversations = await dbConnect.collection("conversations").find({"members.userId": {$all : [receiver, sender]}})
       const conversations = await dbConnect.collection("conversations").find({"members.userId": {$all : [receiver, sender]}}).toArray()
        if (conversations[0]._id) {
            console.log( conversations[0]._id.valueOf())
            response.status(200).json({chatId: conversations[0]._id.valueOf()})
        } else {
            response.status(404).json({chatId: 0})
        }
    } catch {
        response.status(500).send("Error");
    }
});

// This method takes a userId and returns all the conversations based off of that
router.get('/:userId', async (req, response) => {
    response.setHeader("Access-Control-Allow-Origin", 'https://mychatapp-xqyr.onrender.com')
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Max-Age", "1800");
    response.setHeader("Access-Control-Allow-Headers", "content-type");
    const dbConnect = dbo.getDb();  
    try {
        const conversations = await dbConnect.collection("conversations").find({
            members :  {$elemMatch: {userId: req.params.userId} }}).toArray()
        //console.log(conversations)
        response.status(200).json({conversations: conversations})
    } catch {
        response.status(500).send("Error");
    }
});

module.exports = router;