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

const inlog = (...args) => {
  console.log(...args);
  return Promise.resolve();
};
const ifok = (err, data, fn) => err ? fn('error', err) : fn('ok', data);

const events = [
  'hi im new',
  'hi new im',
  'i moved',
];

io.on('connection', (socket) => {
  console.log('user connected');
  // what room are you in
  // tell me abt yr character
  // would you like to tell yr friends you've arrived?
  // i'm going to let the folx in the room yr in know yr here
  
  socket.room = 'tutorial';
  socket.join(socket.room);
  //socket.to(socket.room).emit('hi im new', {id: socket.id});
  events.forEach(event => socket.on(event, (data={}) => {
    socket.to(socket.room).emit(event, {...data, id: socket.id});
  }));
  if(adminMode) {
    socket.on('save', (data) => {
      console.log('saving', data.name);
      fs.writeFile(`./data/places/${data.name}.json`, JSON.stringify(data));
    });
  }
  // todo: sanitize file path
  socket.on('load', (name, fn) => inlog(name, fn).then(() => 
      fs.readFile(`./data/places/${name}.json`, (err, data) => 
          ifok(err, data.toString('utf8'), fn))));
  socket.on('disconnecting', () => {
    socket.to(socket.room).emit('im leaving', {id: socket.id});
  });
});

server.listen(3000, () => console.log('app running'));
