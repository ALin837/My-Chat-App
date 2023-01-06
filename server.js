const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const app = express(); // initializes an express server
const port =  process.env.PORT || 9000;
const {createAndAddUser, getUser, deleteUser, getUsers, containUser} = require('./utils/users')
const server = http.createServer(app);
const io = socketio(server);
const dbo = require('./utils/conn')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const cors = require('cors')
const corsOptions = require('./config/corsoptions')
dbo.connectToServer(()=>{})
// routes
const register = require("./routes/register")
const login = require("./routes/login")
const logout = require("./routes/logout")
const users = require("./routes/users")
const conversation = require("./routes/conversation")
const messages = require("./routes/messages")
const refresh = require("./routes/refresh")

// middleware
const authenticate = require("./middleware/authenticate")
const allow = require("./middleware/allow")

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

// use cookies
app.use(cookieParser())


app.use(allow())

// use cors
app.use(cors(corsOptions))

// Routes
app.use('/api/register', register)
app.use('/api/login', login)
app.use('/api/logout', logout)
app.use('/api/refresh', refresh)

app.use(authenticate)
app.use('/api/users', users)
app.use('/api/conversation', conversation)
app.use('/api/messages', messages)



//Run when the client connects
/*
io.on('connection', (socket) => {
    socket.on('joinRoom', ({username, roomname}) => {
        //create a user and push the user onto the stack.
        if (containUser(roomname, username)) {
            socket.emit('My Error', 'The username has already been taken')
        } else {
            const user = createAndAddUser(username, socket.id, roomname);
            //send welcome information
            socket.join(user.roomname);
            socket.emit('welcome', {name: "My-Chat-App Bot", message: 'Welcome to the chat room!'})
            socket.broadcast.to(user.roomname).emit('join-message', user.username)
    
           //Send room information
            const userlist = getUsers(user.roomname);
            io.to(user.roomname).emit('new-user', userlist)
        }

    });


    socket.on('chat message', (message) => {
        const user = getUser(socket.id);
        if (user) {
            socket.broadcast.to(user.roomname).emit('message', message);
        }
    })
    
   socket.on('disconnect', () => {
       const user = deleteUser(socket.id);
       if (user) {
           const userlist = getUsers(user.roomname);
           io.to(user.roomname).emit('disconnection', user.username);
           io.to(user.roomname).emit('new-user', userlist)
        }
   })
})
*/
server.listen(port, ()=> {
    console.log(`Example App listening on port ${port}`)
})