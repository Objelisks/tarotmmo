import {THREE} from './libs.js';
import {Thing} from './thing.js';

const vec = new THREE.Vector3();

class Model extends Thing {
  constructor(modelName) {
    super();
    const geo = new THREE.SphereGeometry(1);
    const mat = new THREE.MeshLambertMaterial({color: 0xC3E3AC});
    this.mesh = new THREE.Mesh(geo, mat);
    this.emit('mesh', this.mesh);
  }

  move(xOrVec, y, z) {
    if(xOrVec instanceof THREE.Vector3) {
      this.mesh.position.add(xOrVec);
    } else {
      this.mesh.position.add(vec.set(x, y, z));
    }
  }
}

export {Model};
