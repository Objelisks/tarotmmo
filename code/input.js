import {THREE} from './libs.js';
import {Thing} from './thing.js';
import {devices} from './singletons.js';

const CAMERA_FORWARD = new THREE.Vector3(-0.7071, 0, -0.7071);
const UP = new THREE.Vector3(0,1,0);
const NORTH = new THREE.Vector3(0,0,1);
const CAMERA_ROTATION = new THREE.Quaternion().setFromUnitVectors(NORTH, CAMERA_FORWARD);

class Input extends Thing {
  update(context) {
    const delta = devices.delta();
    const camera = context.camera;
    const move = new THREE.Vector3(delta.horizontal, 0, delta.vertical);
    move.applyQuaternion(CAMERA_ROTATION);
    this.emit('move', move);
  }
}

export {Input};
