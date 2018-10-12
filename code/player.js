import {THREE} from './libs.js';
import {Keyvent} from './input.js';
import {Model} from './model.js';

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
  }
  pos() { return this.model().position; }
  rot() { return this.model().quaternion; }
  model() { return this.mesh.obj; }
  update() { }
  
  move(dir) {
    this.pos().add(movement.copy(dir).multiplyScalar(this.speed));
  }
  
  action() {
    
  }
  
  hold() {
    if(editMode) {
      let brush = {
        x: this.pos().x,
        y: this.pos().z,
        r: 1.5,
      };
      this.world.getActiveLayer().paint(brush);
    }
  }
  
  release() {
    this.world.getActiveLayer().finish();
  }
}


export {player};
