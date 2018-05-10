import {THREE} from '../libs.js';
import {devices, network} from '../singletons.js';
import {Thing} from '../thing.js';

const CAMERA_FORWARD = new THREE.Vector3(-0.7071, 0, -0.7071);
const UP = new THREE.Vector3(0,1,0);
const NORTH = new THREE.Vector3(0,0,1);
const CAMERA_ROTATION = new THREE.Quaternion().setFromUnitVectors(NORTH, CAMERA_FORWARD);

class Input extends Thing {
  constructor() {
    super();
    
    this.held = {}; 
  }
  
  update(context) {
    const delta = this.delta();
    const camera = context.camera;
    const move = new THREE.Vector3(delta.horizontal, 0, delta.vertical);
    move.applyQuaternion(CAMERA_ROTATION);
    if(move.lengthSq() > 0) {
      this.emit('move', move);
    }
    if(delta.a && this.held.a) {
      this.emit('hold');
    }
    if(delta.a && !this.held.a) {
      this.held.a = true;
      this.emit('action');
    } else if(!delta.a) {
      if(this.held.a) {
        this.emit('release');
      }
      this.held.a = false;
    }
  }
  delta() { return {}; }
}

/*
  Looks at the device state and emits events.
*/
class Local extends Input {
  update(context) {
    Input.prototype.update.call(this, context);
    network.send('move', this.delta());
  }
  
  delta() {
    return devices.delta();
  }
}

/*
  Looks at the device state and emits events.
*/
class Remote extends Input {
  constructor(id) {
    super();
    
    this.id = id;
  }
  
  delta() {
    return network.get(this.id).delta();
  }
}

export {Local, Remote};
