import {THREE} from './libs.js';
import {devices} from './singletons.js';

const CAMERA_FORWARD = new THREE.Vector3(-0.7071, 0, -0.7071);
const UP = new THREE.Vector3(0,1,0);
const NORTH = new THREE.Vector3(0,0,1);
const CAMERA_ROTATION = new THREE.Quaternion().setFromUnitVectors(NORTH, CAMERA_FORWARD);

class Input {
  constructor(thing) {
    this.thing = thing;
  }

  update(context) {
    const delta = devices.delta();
    const camera = context.camera;
    const move = new THREE.Vector3(delta.left - delta.right, 0, delta.up - delta.down);
    move.applyQuaternion(CAMERA_ROTATION);
    move.normalize();
    move.multiplyScalar(1.0);
    this.thing.send('move', move);
  }
}

export {Input};
