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
    this.handle(delta, 'action');
    this.handle(delta, 'switchleft');
    this.handle(delta, 'switchright');
    this.handle(delta, 'save');
  }
  
  delta() { return {}; }
  
  handle(delta, event) {
    if(delta[event]) { 
      if(this.held[event]) {
        this.emit(event, Keyvent.HELD);
      } else {
        this.emit(event, Keyvent.PRESSED);
        this.held[event] = true;
      }
    } else if(!delta[event] && this.held[event]) {
      this.emit(event, Keyvent.RELEASED);
      this.held[event] = false;
    }
  }
}

/*
  Looks at the device state and emits events.
*/
class Local extends Input {
  update(context) {
    Input.prototype.update.call(this, context);
    network.send('i moved', this.delta());
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

const Keyvent = {
  PRESSED: 0,
  HELD: 1,
  RELEASED: 2,
  onPress: (cb) => (e) => e == Keyvent.PRESSED ? cb() : null,
  onHeld: (cb) => (e) => e == Keyvent.HELD ? cb() : null,
  onRelease: (cb) => (e) => e == Keyvent.RELEASED ? cb() : null,
};

export {Local, Remote, Keyvent};
