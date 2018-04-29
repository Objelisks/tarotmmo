import {THREE} from './libs.js';
import {Layer} from './layer.js';
import {Thing} from './thing.js';

class Terrain extends Thing {
  constructor(world) {
    super();
    
    this.ground = new THREE.PlaneGeometry(1,1,1);
    this.ground.rotateX(-Math.PI/2);
    this.groundMesh = new THREE.Mesh(this.ground, new THREE.MeshBasicMaterial({color:0x00ff00}));
    this.groundMesh2 = new THREE.Mesh(this.ground, new THREE.MeshBasicMaterial({color:0xff0000, wireframe: true}));
    this.decor = [];
    this.collide = new Layer();
    this.nav = new Layer();
    this.spaces = [];
    
    world.scene.add(this.groundMesh);
    world.scene.add(this.groundMesh2);
    
    this.nav.show(world);
  }
  
  update() {
    
  }
}

export {Terrain};
