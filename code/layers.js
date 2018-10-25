import {THREE} from './libs.js';
import {Layer} from './layer.js';
import {Thing} from './thing.js';
import {Plant} from './things/plant.js';
import * as protos from './things/plant_data.js';
import {blueNoisePolygonGen, areaInsideRegion} from './util.js';

const terrainMat = new THREE.MeshLambertMaterial({color:0x009900});

class Doing {
  constructor(type) {
    this.type = type;
    this.obj = new THREE.Object3D();
  }
  paint() {}
  finish(layer) {}
  show(scene) {
    scene.add(this.obj);
    return this;
  }
  serialize() { return {type: 'write a serializer'}; }
}

export class Exit extends Doing {
  constructor(zoneName) {
    super('Exit');
    this.targetZone = zoneName || prompt('zone name??');
  }
  
  update(context, layer) {
    layer.collision(context, this);
  }
  
  enter(context, player) {
    if(context.vars.mode == 'play' && player === context.local) {
      context.world.load(this.targetZone);
    }
  }
  
  exit(context, player) {
    
  }
  
  serialize() {
    return { type: this.type, args: [this.targetZone] };
  }
}

export class Terrain extends Doing {
  constructor() {
    super('Terrain');
    
    this.ground = new THREE.PlaneGeometry(1,1,1);
    this.ground.rotateX(-Math.PI/2);
    this.groundMesh = new THREE.Mesh(this.ground, terrainMat);
    
    this.obj.add(this.groundMesh);
    this.obj.position.y = -1.5;
  }
  
  finish(layer) {
    let geos = layer.regions.map(region => {
      let shape = new THREE.Shape(region.map(pt => new THREE.Vector2(pt[0], pt[1])));
      return new THREE.ExtrudeGeometry(shape, {
        amount: 0.5,
        bevelThickness: 1.0,
        bevelSize: 1.0,
        bevelSegments: 2,
      });
    });
    if(geos.length > 0) {
      let geo = geos.reduce((p, c) => { p.merge(c); return p; }, geos[0]);
      geo.rotateX(Math.PI/2);
      let newMesh = new THREE.Mesh(geo, terrainMat);
      this.obj.remove(this.groundMesh);
      this.groundMesh = newMesh;
      this.obj.add(this.groundMesh);
    }
  }
  
  serialize() {
    return { type: this.type, args: [] };
  }
}

export class Plants extends Doing {
  constructor(proto, density) {
    super('Plants');
    
    this.proto = proto;
    this.density = density;
  }
  
  finish(layer) {
    this.obj.children.splice(0, this.obj.children.length);
    layer.regions.forEach((region) => {
      let gen = blueNoisePolygonGen(region, 1.0 / this.density);
      let pts = new Array(Math.floor(areaInsideRegion(region)*this.density)).fill(0).map(_ => gen());
      pts.forEach(([x, y]) => {
        const plant = new Plant(protos[this.proto]);
        plant.obj.position.set(x, 0, y);
        plant.obj.rotateY(Math.random()*Math.PI*2);
        this.obj.add(plant.obj);
      });
    });
  }
  
  serialize() {
    return { type: this.type, args: [this.proto, this.density] };
  }
}