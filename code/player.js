import {THREE} from './libs.js';
import {Model} from './model.js';

const CAMERA_FORWARD = new THREE.Vector3(-0.7071, 0, -0.7071);
const UP = new THREE.Vector3(0,1,0);
const NORTH = new THREE.Vector3(0,0,1);
const CAMERA_ROTATION = new THREE.Quaternion().setFromUnitVectors(NORTH, CAMERA_FORWARD);

let editMode = true;
let movement = new THREE.Vector3();

// class Player extends Actor {
//   constructor(world) {
//     super(world, 'sphere');

//     this.speed = 0.2;
    
//     return this;
//   }
  
//   input(strat) {
//     strat
//       .when('move', (dir) => this.move(dir), this.removers)
//       .when('action', (e) => {
//           switch(e) {
//             case Keyvent.PRESSED: this.action(); break;
//             case Keyvent.HELD: this.hold(); break;
//             case Keyvent.RELEASED: this.release(); break;
//           }
//         }, this.removers);

//     return this.with(strat);
//   }
  
// }

//const playerDefaultMesh = () => new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshLambertMaterial())
const playerDefaultMesh = () => new Model('sphere')

class player {
  constructor(id) {
    this.id = id;
    this.mesh = playerDefaultMesh();
    this.speed = 0.2
  }
  pos() { return this.model().position; }
  rot() { return this.model().quaternion; }
  model() { return this.mesh.obj; }
  
  applyDelta(context, delta) {
    const move = new THREE.Vector3(delta.held.horizontal, 0, delta.held.vertical);
    move.applyQuaternion(CAMERA_ROTATION);
    move.multiplyScalar(this.speed);
    this.pos().add(move);
  }
}


export {player};
