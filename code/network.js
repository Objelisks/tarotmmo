/* globals io */
import {Thing} from './thing.js';
import * as state from './state.js';

class Network extends Thing {
  constructor() {
    super();
    
    this.packets = {};
    
    this._connectedResolver = null;
    this._connected = new Promise((resolve) => this._connectedResolver = resolve);
    
    this.socket = io();
    this.socket.on('connect', (connection) => {
      console.log('connected');
      console.log('i am:', this.socket.id);
      this._connectedResolver(this.socket.id);
    });
    this.socket.on('state', (packet) => {
      // store a history of packets received from each peer
      this.packets[packet.id] = [packet];//, ...(this.packets[packet.id] || [])];
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
      this.emit('player left', player);
    });
  }
  
  connected() {
    return this._connected;
  }
  
  id() {
    return this.socket.id || 'MISSING_NETWORK_ID';
  }
  
  state() {
    return Object.keys(this.packets).length == 0 ? null : state.combinePackets(this.packets);
  }
  
  send(...args) {
    this.socket.emit(...args);
  }
  
  playerJoin(player, isResponse) {
    console.log('a new player is visible:', player.id);
    if(player.id != this.socket.id) {
      this.emit('new player', player);
    }
  }
}

export {Network};