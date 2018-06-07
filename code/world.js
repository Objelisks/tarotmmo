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

class World extends Thing {
  constructor() {
    super();

    this.scene = new THREE.Scene();
    //let camera = new THREE.OrthographicCamera(-25*aspectRatio, 25*aspectRatio, 25, -25, 0.1, 100);
    this.camera = new THREE.PerspectiveCamera(30, aspectRatio, 1, 1000);
    
    this.player = new Player(this)
      .input(new Local())
      .join(this);
    this.terrain = new Terrain(this);
    this.activeLayer = this.terrain.nav;
    this.players = {};

    /*
    const filenames = [
      'fragrant_water_lily_flower.json',
      'fragrant_water_lily_leaf.json',
      'fremonts_death_camas.json',
      'glacier_fawn_lily.json',
      'largeflower_fairybell_plant.json',
      'washington_lily.json',
      'narrow_leaf_soap_plant.json',
    ];
    this.flowers = [];
    filenames.forEach((filename) => {
      for(let i=0; i<10; i++) {
        let flower = new Actor(this, `flowers/${filename}`).join(this);
        flower.model.move(new THREE.Vector3(Math.random()*20-10, 0, Math.random()*20-10));
        flower.model.rotate(new THREE.Quaternion().setFromAxisAngle(THREE.Object3D.DefaultUp, Math.random()*2*Math.PI));
        this.flowers.push(flower);
      }
    });
    */
    
    this.plants = [];
    for(let i=0; i<15; i++) {
      const plant = new Plant(this, flower).join(this);
      plant.obj.position.set(Math.random()*20-10, 0, Math.random()*20-10);
      plant.obj.rotateY(Math.random()*Math.PI*2);
      this.plants.push(plant);
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

    network.when('new', (player) => {
      this.players[player.id] = new Player(this)
        .input(new Remote(player.id))
        .join(this);
    });
    network.when('leave', (player) => {
      this.players[player.id].leave(this);
      delete this.players[player.id];
    });
  }

  render(renderer) {
    devices.update();
    this.emit('update', this);
    this.camera.position.x = this.player.model.obj.position.x+20;
    this.camera.position.y = this.player.model.obj.position.y+20;
    this.camera.position.z = this.player.model.obj.position.z+20;
    renderer.render(this.scene, this.camera);
  }
}

export {World};
