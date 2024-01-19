var express = require('express');
const dbo = require('../utils/conn')
var router = express.Router();

// This method takes a sender and reciever and creates a new conversation in the database
router.post('/',  async (req, response) => {
    response.setHeader("Access-Control-Allow-Origin", 'https://mychatapp-xqyr.onrender.com')
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Max-Age", "1800");
    response.setHeader("Access-Control-Allow-Headers", "content-type, Authorization");
    const dbConnect = dbo.getDb();  
    const message = {
        sender: req.body.sender, // will be by id of the sender
        members : req.body.members, // array of receivers (in id form)
        time: req.body.time, // use a library for time
        message: req.body.message,
        chatId : req.body.chatId
    }
    dbConnect.collection("messages").insertOne(message, function(err,result) {
    if (err) {
        response.status(500).send("Error inserting message!");
    } else {
        //console.log(`Added a new message with id ${result.insertedId}`);
        response.status(200).send("Success!")
    }
    })
});

// this method takes a chat_id and returns all the messages
// GET: CHAT_ID
router.get('/:chatId',  async (req, response) => {
    response.setHeader("Access-Control-Allow-Origin", 'https://mychatapp-xqyr.onrender.com')
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Max-Age", "1800");
    response.setHeader("Access-Control-Allow-Headers", "content-type, Authorization");
    console.log(req.params.chatId);
    const dbConnect = dbo.getDb();  
    try {
        const chatId = req.params.chatId
        const chatMessages = await dbConnect.collection("messages").find({chatId :chatId}).toArray()
        if (!chatMessages) {
            response.status(401).send("No chat exists with chatId:"+ chatId);
        }
        console.log(chatMessages)
        response.status(200).json({chat: chatMessages})
    } catch {
        response.status(500).send("Error");
    }
});




module.exports = router;