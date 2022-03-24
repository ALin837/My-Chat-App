const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const app = express(); // initializes an express server
const port = 3000;

const server = http.createServer(app);
const io = socketio(server);

// app.use -express.static allows you to server static files ex.png/html
// safer to use an absolute path so you use the path module
//
app.use(express.static(path.join(__dirname,'HTML')));
//Run whn the client connects
io.on('connection', (socket) => {
    console.log('User Connected');
    socket.on('disconnect', () => {
        console.log('User Disconnected')
    })
    socket.emit('message','Welcome to the chat room!')
})

server.listen(port, ()=> {
    console.log(`Example App listening on port ${port}`)
})