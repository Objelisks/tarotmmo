import {THREE} from './libs.js';
import * as singletons from './singletons.js';
import {player} from './player.js';
import {Local, Remote, Keyvent} from './input.js';
import * as layers from './layers.js';
import {mod} from './util.js';
import {Layer} from './layer.js';
import {Plant} from './things/plant.js';
import {flower, grass} from './things/plant_data.js';

let {network} = singletons;

const width = 640;
const height = 480;
const aspectRatio = width/height;
const cameraOffset = new THREE.Vector3(20,20,20);

const placeholderLevel = {
  name: 'placeholder',
  layers: [],
  objects: []
};

class World {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(30, aspectRatio, 1, 1000);
    this.camera.position.set(20, 20, 20);
    this.camera.lookAt(new THREE.Vector3());
    
    this.players = {};
    this.layers = [];
    this.objects = [];
    this.scene = new THREE.Scene();
    
    this.input = new Local()
      .when('switchleft', Keyvent.onPress(() => this.rotateLayerSelection(true)))
      .when('switchright', Keyvent.onPress(() => this.rotateLayerSelection(false)))
      .when('save', Keyvent.onPress(() => this.load('test')));
    
    this.load('test').then(() => {
      network.when('new player', (p) => {
        this.players[p.id] = new player();
      });
      network.when('player left', (p) => {
        if(this.players[p.id]) {
          this.scene.remove(this.players[p.id].model());
          delete this.players[p.id];
        }
      });
    });
  }
  
  getActiveLayer() {
    return this.layers[this.activeLayerIndex];
  }
  
  rotateLayerSelection(left) {
    this.activeLayerIndex = mod(this.activeLayerIndex + (left ? -1 : 1), this.layers.length);
  }
  
  update() {
    Object.keys(singletons).forEach(id => singletons[id].update(this));
    Object.values(this.players).filter(player => player.update).forEach(player => player.update());
    this.layers.forEach(layer => layer.update(this));
    
    if(this.players.local) {
      this.camera.position.copy(this.players.local.pos()).add(cameraOffset);
    }
  }

  render(renderer) {
    this.update();
    renderer.render(this.scene, this.camera);
  }
  
  save() {
    const name = window.prompt('name:::', 'test') || 'test';
    console.log('saving', name);
    network.send('save', this.serialize(name));
  }
  
  load(name) {
    return new Promise((resolve, reject) => {
      network.send('load', name, (res, data) => {
        if(res == 'ok') {
          console.log('loading', name);
          resolve(this.parseLoad(JSON.parse(data))
            .then((newModel) => this.transitionTo(newModel)));
        } else {
          console.log('load error', data);
          reject(data);
        }
      });
    });
  }
  
  parseLoad(data) {
    const newScene = new THREE.Scene();
    
    const direct = new THREE.DirectionalLight({color: 0xffffff});
    direct.position.set(0.1, 1, 0.5);
    newScene.add(direct);

    const ambient = new THREE.AmbientLight(0x95C4D6, 0.2);
    newScene.add(ambient);

    return Promise.resolve({
      name: data.name,
      scene: newScene,
      layers: data.layers.map((layer) => 
          layer.doings.reduce((p, c) => 
              p.does(new layers[c.type](...c.args).show(newScene)),
              new Layer(layer.regions, layer.color)).show(newScene)),
      objects: data.objects,
    });
  }
  
  transitionTo(newModel) {
    //Object.keys(this.players).forEach(id => this.players[id].leave(this));
    Object.entries(this.players).forEach(([id, p]) => this.scene.remove(p.model()))
    this.players = {};
    
    this.name = newModel.name;
    this.scene = newModel.scene;
    this.layers = newModel.layers;
    this.objects = newModel.objects;
    
    this.activeLayerIndex = 0;
    
    this.players.local = new player();
    Object.keys(this.players).map(id => this.scene.add(this.players[id].model()));
    
    network.send('hi im new');
  }
  
  serialize(name) {
    return {
      name: name,
      layers: this.layers.map(layer => layer.serialize()),
      objects: [],
    };
  }
}

export {World};
