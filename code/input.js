import {THREE} from './libs.js';
import devices from './devices.js';

class input {
  constructor(thing) {
    this.thing = thing;
  }

  update(context) {
    const camera = context.camera;
    const move = new THREE.Vector3();
    move.x += 1.0 * devices.left;
    move.z += 1.0 * devices.up;
    this.thing.send('move', move);
  }
}

export default input;
