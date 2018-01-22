import {THREE} from './libs.js';
import devices from './devices.js';

const CAMERA_FORWARD = new THREE.Vector3(-0.7071, 0, -0.7071);
const UP = new THREE.Vector3(0,1,0);
const NORTH = new THREE.Vector3(0,0,1);
const CAMERA_ROTATION = new THREE.Quaternion().setFromUnitVectors(NORTH, CAMERA_FORWARD);

class input {
  constructor(thing) {
    this.thing = thing;
  }

  update(context) {
    const camera = context.camera;
    const move = new THREE.Vector3(devices.left - devices.right, 0, devices.up - devices.down);
    move.applyQuaternion(CAMERA_ROTATION);
    move.normalize();
    move.multiplyScalar(1.0);
    this.thing.send('move', move);
  }
}

export default input;
