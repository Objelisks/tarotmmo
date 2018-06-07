/* globals Map */
import {THREE} from '../libs.js';
import {Actor} from '../actor.js';

let pt = new THREE.Vector3();

class Plant extends Actor {
  constructor(world, proto) {
    super();
    
    this.proto = proto;
    this.iter = 7;
    this.obj = new THREE.Object3D();
    
    this.lines = new THREE.Geometry();
    
    let meshes = this.build(this.proto);
    meshes.forEach(mesh => this.lines.mergeMesh(mesh));
    world.scene.add(this.obj);
    
    // todo: move line geometry to global context so that its all one draw call
    const stemgeo = new THREE.LineSegmentsGeometry();
    stemgeo.setPositions(this.lines.vertices.reduce((p,c) => p.concat([c.x, c.y, c.z]), []));
    const stemmat = new THREE.LineMaterial({
      color: 0x00aa44,
      linewidth: 4,
      resolution: new THREE.Vector2(640,480),
    });
    this.lineMesh = new THREE.Line2(stemgeo, stemmat);
    this.lineMesh.computeLineDistances();
    this.obj.add(this.lineMesh);
    
    this.parts = [];
  }
  
  build(proto) {
    let system = proto.start.slice(0);
    let nonterminals = Object.keys(proto)
      .filter(key => typeof proto[key] == 'string');
    let terminals = Object.keys(proto)
      .filter(key => typeof proto[key] != 'string');
    
    // expand
    for(let i=0; i<this.iter; i++) {
      nonterminals.forEach(nt => {
        system = system.replace(new RegExp(nt, 'g'), proto[nt]);
      });
    }
    
    // builds each subsystem of this system into an object3d
    let subsystems = new Map(terminals
      .filter(t => proto[t].start != null)
      .map(t => [t, this.build(proto[t])
                     .reduce((obj, mesh) => obj.add(mesh), new THREE.Object3D())]));
    
    let meshes = [];
    let context = {
      added: [],
      scale: 1.0,
      pos: new THREE.Vector3(),
      rot: new THREE.Quaternion(),
      state: [],
    };
    let ops = system.split('')
      .filter(ch => terminals.includes(ch))
      .map(ch => [ch, proto[ch]])
      .forEach(([ch, op]) => {
        if(op.start != null) {
          context.added.push(subsystems.get(ch).clone());
        } else {
          context = op(this, context);
        }
        meshes = meshes.concat(context.added);
        context.added = [];
    });
    
    return meshes;
  }
  
  stem(context) {
    const geo = new THREE.Geometry();
    geo.setFromPoints([new THREE.Vector3(), new THREE.Vector3(0,1,0)]);
    const stemMesh = new THREE.Mesh(geo);
    return applyContext(stemMesh, context);
  }
  
  leaf() {
    const leafMesh = new THREE.Mesh(new THREE.PlaneGeometry(), new THREE.MeshBasicMaterial({color: 0x007700}));
    leafMesh.rotateX(-Math.PI/2);
    leafMesh.position.set(0.5, 0, 0);
    return leafMesh;
  }
  
  flower() {
    const flowerMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial());
    return flowerMesh;
  }
}

const applyContext = (mesh, context) => {
  mesh.position.add(context.pos);
  mesh.quaternion.multiply(context.rot);
  mesh.scale.multiplyScalar(context.scale);
  return mesh;
};

export {Plant};