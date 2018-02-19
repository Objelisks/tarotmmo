import {THREE} from './libs.js';
import {Layer} from './layer.js';

class Terrain {
  constructor(world) {
    this.ground = [];
    this.decor = [];
    this.collide = new Layer();
    this.nav = new Layer();
    this.spaces = [];
  }
}

export {Terrain};
