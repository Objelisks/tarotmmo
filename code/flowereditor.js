import {THREE} from './libs.js';
import {Actor} from './actor.js';
import {devices, network} from './singletons.js';
import {Player} from './player.js';
import {Local, Remote} from './input.js';
import {Painter} from './painter.js';
import {Terrain} from './terrain.js';
import {Thing} from './thing.js';
import {Plant} from './things/plant.js';
import {flower} from './things/plant_data.js';

const width = 640;
const height = 480;
const aspectRatio = width/height;

class FlowerEditor extends Thing {
  constructor() {
    super();

    this.scene = new THREE.Scene();
    //let camera = new THREE.OrthographicCamera(-25*aspectRatio, 25*aspectRatio, 25, -25, 0.1, 100);
    this.camera = new THREE.PerspectiveCamera(30, aspectRatio, 1, 1000);
    
    const direct = new THREE.DirectionalLight({color: 0xffffff});
    direct.position.set(0.1, 1, 0.5);
    this.scene.add(direct);

    const ambient = new THREE.AmbientLight(0x95C4D6, 0.2);
    this.scene.add(ambient);
    
    this.plants = [];
    for(let i=0; i<1; i++) {
      const plant = new Plant(this, flower).join(this);
      plant.obj.position.set(Math.random()*10-5, 0, Math.random()*10-5);
      plant.obj.rotateY(Math.random()*Math.PI*2);
      this.plants.push(plant);
    }

    this.camera.position.x = 20;
    this.camera.position.y = 20;
    this.camera.position.z = 20;
    this.camera.lookAt(new THREE.Vector3());
  }

  render(renderer) {
    devices.update();
    this.emit('update', this);
    renderer.render(this.scene, this.camera);
  }
}

export {FlowerEditor};
