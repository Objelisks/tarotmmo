/* globals io */
import {Thing} from './thing.js';

class DeltaTracker {
  constructor(id) {
    this.id = id;
    this.delta_ = {horizontal: 0, vertical: 0};
  }
  
  delta() {
    return this.delta_;
  }
}

class Network extends Thing {
  constructor() {
    super();
    
    this.actors = {};
    this.local = {};
    this.socket = io();
    this.socket.on('connect', (connection) => {
      console.log('connected');
    });
    this.socket.on('new', (player) => {
      console.log('new', player.id, 'local', this.socket.id);
      if(!this.actors[player.id] && player.id != this.socket.id) {
        this.actors[player.id] = new DeltaTracker(player.id);
        this.emit('new', player);
        this.socket.emit('new');
      }
    });
    this.socket.on('leave', (player) => {
      console.log('leave', player.id);
      delete this.actors[player.id];
      this.emit('leave', player);
    });
    this.socket.on('moved', (move) => {
      // find corresponding actor
      // queue up movement delta
      if(this.actors[move.id]) {
        this.actors[move.id].delta_ = move;
      }
    });
  }
  
  get(id) {
    return this.actors[id];
  }
  
  send(type, data) {
    this.socket.emit(type, data);
  }
}

export {Network};