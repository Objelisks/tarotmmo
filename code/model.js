import {THREE} from './libs.js';

const vec = new THREE.Vector3();

class model {
  constructor(thing) {
    this.thing = thing;

    const geo = new THREE.SphereGeometry(1);
    const mat = new THREE.MeshLambertMaterial({color: 0xC3E3AC});
    this.mesh = new THREE.Mesh(geo, mat);
    this.thing.send('mesh', this.mesh);

    this.thing.when('move', (e) => this.move(e));
  }

  move(xOrVec, y, z) {
    if(xOrVec instanceof THREE.Vector3) {
      this.mesh.position.add(xOrVec);
    } else {
      this.mesh.position.add(vec.set(x, y, z));
    }
  }
}

export default model;
