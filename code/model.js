import {THREE} from './libs.js';

const vec = new THREE.Vector3();
const loader = new THREE.JSONLoader();

const convertMaterialsToStandard = (mats) => {
  return mats.map((mat) => new THREE.MeshStandardMaterial({
    color: mat.color,
    metalness: 0.0,
    roughness: 1.0,
    side: THREE.DoubleSide,
  }));
};

class Model {
  constructor(modelName) {
    this.obj = new THREE.Object3D();
    this.loaded = false;

    if(modelName == 'sphere') {
      const geo = new THREE.SphereGeometry(1);
      const mat = new THREE.MeshLambertMaterial({color: 0xC3E3AC});
      this.mesh = new THREE.Mesh(geo, mat);
      this.obj.add(this.mesh);
      this.loaded = true;
    } else {
      loader.load(`./data/${modelName}`, (geo, mats) => {
        this.mesh = new THREE.Mesh(geo, convertMaterialsToStandard(mats));
        this.obj.add(this.mesh);
        this.loaded = true;
      });
    }
  }
}

export {Model};
