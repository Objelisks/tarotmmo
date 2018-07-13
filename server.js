const express = require('express');
const http = require('http');
const Server = require('socket.io');
const fs = require('fs');

let adminMode = true; // allows destructive edits to world
let app = express();
let server = http.Server(app);
let io = new Server(server);

app.use(express.static('code'));
app.use('/data/', express.static('data'));


io.on('connection', (socket) => {
  console.log('user connected');
  // what room are you in
  // tell me abt yr character
  // would you like to tell yr friends you've arrived?
  // i'm going to let the folx in the room yr in know yr here
  
  socket.room = 'tutorial';
  socket.join(socket.room);
  socket.to(socket.room).emit('new', {id: socket.id});
  socket.on('new', () => {
    socket.to(socket.room).emit('new', {id: socket.id});
  });
  socket.on('move', (move) => {
    move.id = socket.id;
    socket.to(socket.room).emit('moved', move);
  });
  if(adminMode) {
    socket.on('save', (data) => {
      console.log('saving', data.name);
      fs.writeFile(`./data/places/${data.name}.json`, JSON.stringify(data));
    });
  }
  socket.on('disconnecting', () => {
    socket.to(socket.room).emit('leave', {id: socket.id});
  });
});

server.listen(3000, () => console.log('app running'));
