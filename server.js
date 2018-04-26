const express = require('express');
const http = require('http');
const socketio = require('socket.io');

let app = express();
let server = http.Server(app);
let io = socketio(server);

app.use(express.static('code'));
app.use('/data/', express.static('data'));

io.on('connection', (socket) => {
  console.log('user connected');
  socket.on('move', (move) => {
    // console.log(move);
  });
});

server.listen(3000, () => console.log('app running'));
