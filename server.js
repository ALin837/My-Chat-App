const path = require('path')
const express = require('express')
const app = express()
const http = require('http')
const port = 3000 || process.env.port
const server = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, 'HTML')))

//Run when client connects
io.on('connection', (socket) => {
    console.log("new connection")
})

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})