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
      console.log('i am:', this.socket.id);
    });
    this.socket.on('hi im new', (player) => {
      this.playerJoin(player);
      this.socket.emit('hi new im', this.socket.id);
    });
    this.socket.on('hi new im', (player) => {
      this.playerJoin(player);
    });
    this.socket.on('im leaving', (player) => {
      console.log('a player is leaving', player.id);
      delete this.actors[player.id];
      this.emit('player left', player);
    });
    this.socket.on('i moved', (move) => {
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
  
  send(...args) {
    this.socket.emit(...args);
  }
  
  playerJoin(player, isResponse) {
    console.log('a new player is visible:', player.id);
    if(!this.actors[player.id] && player.id != this.socket.id) {
      this.actors[player.id] = new DeltaTracker(player.id);
      this.emit('new player', player);
    }
  }
}

export {Network};