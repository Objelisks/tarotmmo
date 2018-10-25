import {THREE} from './libs.js';
import {devices, network} from './singletons.js';
import {KEYS} from './devices.js';

const CAMERA_FORWARD = new THREE.Vector3(-0.7071, 0, -0.7071);
const UP = new THREE.Vector3(0,1,0);
const NORTH = new THREE.Vector3(0,0,1);
const CAMERA_ROTATION = new THREE.Quaternion().setFromUnitVectors(NORTH, CAMERA_FORWARD);

class Input {
  constructor() {
    this.held = {}; 
  }
  
  update(context) {
    let delta = this.delta();
    const steps = {
      pressed: {},
      held: {},
      released: {},
    };
    KEYS.forEach((key) => this.handle(delta, key, steps));
    return steps;
  }
  
  delta() { return null; }
  
  handle(delta, event, steps) {
    if(delta[event]) {
      if(!this.held[event]) {
        steps.pressed[event] = delta[event];
      }
      
      this.held[event] = true;
      steps.held[event] = delta[event];
    } else if(!delta[event] && this.held[event]) {
      this.held[event] = false;
      steps.released[event] = true;
    }
  }
}

/*
  Looks at the device state and emits events.
*/
class Local extends Input {
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
