import {THREE} from './libs.js';
import {Actor} from './actor.js';
import {LocalPlayer} from './localplayer.js';
import {Terrain} from './terrain.js';
import {Thing} from './thing.js';
import {devices} from './singletons.js';

const width = 640;
const height = 420;
const aspectRatio = width/height;

class World extends Thing {
  constructor() {
    super();

    this.scene = new THREE.Scene();
    //let camera = new THREE.OrthographicCamera(-25*aspectRatio, 25*aspectRatio, 25, -25, 0.1, 100);
    this.camera = new THREE.PerspectiveCamera(30, aspectRatio, 1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.player = new LocalPlayer(this);
    this.terrain = new Terrain(this);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({color: 0xC3E3AC});
    const cube = new THREE.Mesh(geometry, material);

    this.scene.add(cube);

    this.flowers = [];
    for(let i=0; i<20; i++) {
      const flower = new Actor(this, 'flowers/fragrant_water_lily_leaf.json');
      flower.model.move(new THREE.Vector3(Math.random()*20-10, 0, Math.random()*20-10));
      flower.model.rotate(new THREE.Quaternion().setFromAxisAngle(THREE.Object3D.DefaultUp, Math.random()*2*Math.PI));
      this.flowers.push(flower);
    }

    const direct = new THREE.DirectionalLight({color: 0xffffff});
    direct.position.set(0.1, 1, 0.5);
    this.scene.add(direct);

    const ambient = new THREE.AmbientLight(0x95C4D6, 0.2);
    this.scene.add(ambient);

    this.camera.position.x = 50;
    this.camera.position.y = 50;
    this.camera.position.z = 50;
    this.camera.lookAt(cube.position);

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
