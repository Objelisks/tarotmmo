import {THREE} from './libs.js';
import {Thing} from './thing.js';

const vec = new THREE.Vector3();
const loader = new THREE.JSONLoader();

class Model extends Thing {
  constructor(modelName) {
    super();
    this.obj = new THREE.Object3D();
    this.emit('mesh', this.obj);

    if(modelName == 'sphere') {
      const geo = new THREE.SphereGeometry(1);
      const mat = new THREE.MeshLambertMaterial({color: 0xC3E3AC});
      this.mesh = new THREE.Mesh(geo, mat);
      this.obj.add(this.mesh);
      this.emit('loaded', this.mesh);
    } else {
      loader.load(`./data/${modelName}`, (geo, mats) => {
        this.mesh = new THREE.Mesh(geo, mats);
        this.obj.add(this.mesh);
        this.emit('loaded', this.mesh);
      });
    }
  }

  move(vec) {
    if(!this.obj) return;

    this.obj.position.add(vec);
  }

  rotate(quat) {
    this.obj.applyQuaternion(quat);
  }
}

export {Model};
