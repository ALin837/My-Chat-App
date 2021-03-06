const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const app = express(); // initializes an express server
const port =  process.env.PORT || 3000;
const {createAndAddUser, getUser, deleteUser, getUsers, containUser} = require('./utils/users')
const server = http.createServer(app);
const io = socketio(server);

// app.use -express.static allows you to server static files ex.png/html
// safer to use an absolute path so you use the path module
//
app.use(express.static(path.join(__dirname,'HTML')));
//Run when the client connects
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

server.listen(port, ()=> {
    console.log(`Example App listening on port ${port}`)
})