import {THREE} from './libs.js';

class input {
  constructor(thing) {
    this.thing = thing;
  }

  update() {
    const move = new THREE.Vector3();
    move.y += 0.1;
    this.thing.send('move', move);
  }
}

export default input;
