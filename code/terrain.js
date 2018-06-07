import {THREE} from './libs.js';
import {Layer} from './layer.js';
import {Thing} from './thing.js';

const terrainMat = new THREE.MeshLambertMaterial({color:0x009900});

class Terrain extends Thing {
  constructor(world) {
    super();
    
    this.obj = new THREE.Object3D();
    this.ground = new THREE.PlaneGeometry(1,1,1);
    this.ground.rotateX(-Math.PI/2);
    this.groundMesh = new THREE.Mesh(this.ground, terrainMat);
    this.decor = [];
    this.collide = new Layer();
    this.nav = new Layer();
    this.spaces = [];
    
    this.obj.add(this.groundMesh);
    this.obj.position.y = -1.5;
    
    world.scene.add(this.obj);
    
    this.nav.show(world);
  }
  
  update() {
    
  }
  
  constructGround() {
    let geos = this.nav.gon.regions.map(region => {
      let shape = new THREE.Shape(region.map(pt => new THREE.Vector2(pt[0], pt[1])));
      return new THREE.ExtrudeGeometry(shape, {
        amount: 0.5,
        bevelThickness: 1.0,
        bevelSize: 1.0,
        bevelSegments: 2,
      });
    });
    let geo = geos.reduce((p, c) => { p.merge(c); return p; }, geos[0]);
    geo.rotateX(Math.PI/2);
    let newMesh = new THREE.Mesh(geo, terrainMat);
    this.obj.remove(this.groundMesh);
    this.groundMesh = newMesh;
    this.obj.add(this.groundMesh);
  }
}

export {Terrain};
