import {THREE} from './libs.js';
import {Layer} from './layer.js';
import {Thing} from './thing.js';

class Terrain extends Thing {
  constructor(world) {
    super();
    
    this.ground = new THREE.PlaneGeometry(1,1,1);
    this.ground.rotateX(-Math.PI/2);
    this.groundMesh = new THREE.Mesh(this.ground, new THREE.MeshBasicMaterial({color:0x00ff00}));
    this.decor = [];
    this.collide = new Layer();
    this.nav = new Layer();
    this.spaces = [];
    
    world.scene.add(this.groundMesh);
    
    this.nav.show(world);
  }
  
  update() {
    
  }
  
  constructGround() {
    let collision = this.nav.gon.splice(0);
  }
}

export {Terrain};
