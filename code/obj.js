import {THREE} from './libs.js';

class obj {
  constructor(thing) {
    this.thing = thing;
    const geo = new THREE.SphereGeometry(1);
    const mat = new THREE.MeshLambertMaterial({color: 0xC3E3AC});
    this.thing.obj = new THREE.Mesh(geo, mat);
  }
}

export default obj;
