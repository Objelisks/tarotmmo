import {THREE} from './libs.js';
import {Actor} from './actor.js';
import {LocalPlayer} from './localplayer.js';
import {Terrain} from './terrain.js';
import {Thing} from './thing.js';
import {devices} from './singletons.js';

const width = 1024;
const height = 768;
const aspectRatio = width/height;

class World extends Thing {
  constructor() {
    super();

    this.scene = new THREE.Scene();
    //let camera = new THREE.OrthographicCamera(-25*aspectRatio, 25*aspectRatio, 25, -25, 0.1, 100);
    this.camera = new THREE.PerspectiveCamera(30, aspectRatio, 1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.player = new LocalPlayer(this);
    this.terrain = new Terrain(this);

    this.flowers = [];
    for(let i=0; i<30; i++) {
      let flower = new Actor(this, 'flowers/fragrant_water_lily_leaf.json');
      flower.model.move(new THREE.Vector3(Math.random()*20-10, 0, Math.random()*20-10));
      flower.model.rotate(new THREE.Quaternion().setFromAxisAngle(THREE.Object3D.DefaultUp, Math.random()*2*Math.PI));
      this.flowers.push(flower);
    }
    for(let i=0; i<15; i++) {
      let flower = new Actor(this, 'flowers/fragrant_water_lily_flower.json');
      flower.model.move(new THREE.Vector3(Math.random()*20-10, 0, Math.random()*20-10));
      flower.model.rotate(new THREE.Quaternion().setFromAxisAngle(THREE.Object3D.DefaultUp, Math.random()*2*Math.PI));
      this.flowers.push(flower);
    }
    for(let i=0; i<10; i++) {
      let flower = new Actor(this, 'flowers/largeflower_fairybell_plant.json');
      flower.model.move(new THREE.Vector3(Math.random()*20-10, 0, Math.random()*20-10));
      flower.model.rotate(new THREE.Quaternion().setFromAxisAngle(THREE.Object3D.DefaultUp, Math.random()*2*Math.PI));
      this.flowers.push(flower);
    }

    const direct = new THREE.DirectionalLight({color: 0xffffff});
    direct.position.set(0.1, 1, 0.5);
    this.scene.add(direct);

    const ambient = new THREE.AmbientLight(0x95C4D6, 0.2);
    this.scene.add(ambient);

    this.camera.position.x = 20;
    this.camera.position.y = 20;
    this.camera.position.z = 20;
    this.camera.lookAt(new THREE.Vector3());

    this.renderer.setSize(width, height);
    document.body.appendChild(this.renderer.domElement);
  }

  render() {
    devices.update();
    this.emit('update', this);
    this.renderer.render(this.scene, this.camera);
  }
}

export {World};
