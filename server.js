const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const app = express(); // initializes an express server
const port =  process.env.PORT || 3000;
const {createAndAddUser, getUser, deleteUser, getUsers} = require('./utils/users')
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
        const user = createAndAddUser(username, socket.id, roomname);
        //send welcome information
        socket.join(user.roomname);
        socket.emit('welcome', {name: "My-Chat-App Bot", message: 'Welcome to the chat room!'})
        socket.broadcast.to(user.roomname).emit('join-message', user.username)

        //send room information
        /*users not being updated in real time*/
        const userlist = getUsers(user.roomname);
        let users;
        const index = userlist.findIndex(item => item.username === user.username);
        if (index !== -1) {
            users = userlist.splice(index, 1);
        }
        socket.emit('new-user', userlist)

    });


    socket.on('chat message', (message) => {
        const user = getUser(socket.id);
        socket.broadcast.to(user.roomname).emit('message', message);
    })
    
   socket.on('disconnect', () => {
       const user = deleteUser(socket.id);
       if (user) {
           io.to(user.roomname).emit('disconnection', user.username);
       }
   })
})

server.listen(port, ()=> {
    console.log(`Example App listening on port ${port}`)
})