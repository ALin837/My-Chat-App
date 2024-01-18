const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const app = express(); // initializes an express server
const port =  process.env.PORT || 9000;
const {createAndAddUser, getUser, deleteUser, getUsers, containUser} = require('./utils/users')
const server = http.createServer(app);
const io = socketio(server)
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
    extended: false
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(express.json());

// use cookies
app.use(cookieParser())

// cors
// use cors
//app.use(allow)
//app.use(cors(corsOptions))


app.use(cors(
    {
        origin: [
            'http://localhost:3000',
            'http://localhost:9000',
            'https://mychatapp-rho.vercel.app'
        ],
        methods:["POST", "GET"],
        credentials: true
    }
))

app.get("/",(req, res) => {
    res.json("Hello")
})
// Routes
app.use('/api/register', register)
app.use('/api/refresh', refresh)
app.use('/api/logout', logout)
app.use('/api/login', login)
app.use(authenticate)
app.use('/api/users', users)
app.use('/api/conversation', conversation)
app.use('/api/messages', messages)


//Run when the client connects

io.on('connection', (socket) => {
    console.log("user has connected with" + socket.id)
    socket.on('joinRoom', ({username}) => {
        //create a user and push the user onto the stack.
        const user = createAndAddUser(username, socket.id);
        //Send room information
        const userlist = getUsers();
        console.log(userlist)
        io.emit('userlist', userlist)

    });


    socket.on('chat message', ({senderID, receiverID, message}) => {
        const receiver = getUser(receiverID);
        const sender = getUser(senderID);
        const date = new Date();
        let local = date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
        const messageObj = {
            time: local,
            message: message,
        }

        if (receiver && sender) {
            io.to(receiver.id).emit("message", {name: sender.username, message: messageObj});
        }
    })
    
   socket.on('disconnect', () => {
       const user = deleteUser(socket.id);
       if (user) {
        console.log("user has disconnected")
       }
   })
})

server.listen(port, ()=> {
    console.log(`Example App listening on port ${port}`)
})