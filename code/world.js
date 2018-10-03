import {THREE} from './libs.js';
import {Actor} from './actor.js';
import * as singletons from './singletons.js';
import {Player, player} from './player.js';
import {Local, Remote, Keyvent} from './input.js';
import {Painter} from './painter.js';
import * as layers from './layers.js';
import {inlog, mod} from './util.js';
import {Layer} from './layer.js';
import {Thing} from './thing.js';
import {Plant} from './things/plant.js';
import {flower, grass} from './things/plant_data.js';

let {network} = singletons;

const width = 640;
const height = 480;
const aspectRatio = width/height;

class World extends Thing {
  constructor() {
    super();

    this.scene = new THREE.Scene();
    //let camera = new THREE.OrthographicCamera(-25*aspectRatio, 25*aspectRatio, 25, -25, 0.1, 100);
    this.camera = new THREE.PerspectiveCamera(30, aspectRatio, 1, 1000);
    this.input = new Local()
      .when('switchleft', Keyvent.onPress(() => this.rotateLayerSelection(true)))
      .when('switchright', Keyvent.onPress(() => this.rotateLayerSelection(false)))
      .when('save', Keyvent.onPress(() => this.load('test')));
  
    this.name = 'temp';
    this.activeLayerIndex = 0;
    this.players = {
//      'local': new Player(this).input(this.input).join(this),
      'local': player()
    };
    Object.keys(this.players).map(id => this.scene.add(player.mesh(this.players[id])));
    
    this.layers = [];
    
    this.camera.position.x = 20;
    this.camera.position.y = 20;
    this.camera.position.z = 20;
    this.camera.lookAt(new THREE.Vector3());

    network.when('new player', (p) => {
      // this.players[player.id] = new Player(this)
      //   .input(new Remote(player.id))
      //   .join(this);
      this.players[p.id] = player();
    });
    network.when('player left', (p) => {
      if(this.players[p.id]) {
        this.scene.remove(player.mesh(this.players[p.id]));
        delete this.players[p.id];
      }
    });
    
    this.load('test');
  }
  
  getActiveLayer() {
    return this.layers[this.activeLayerIndex];
  }
  
  rotateLayerSelection(left) {
    this.activeLayerIndex = mod(this.activeLayerIndex + (left ? -1 : 1), this.layers.length);
  }
  
  update() {
    Object.keys(singletons).forEach(id => singletons[id].update(this));
    //Object.keys(this.players).forEach(id => this.players[id].update(this));
    Object.values(this.players).forEach(player.update);
    this.layers.forEach(layer => layer.update(this));
    
    if(this.players.local) {
      this.camera.position.x = this.players.local.model.obj.position.x+20;
      this.camera.position.y = this.players.local.model.obj.position.y+20;
      this.camera.position.z = this.players.local.model.obj.position.z+20;
    }
  }

  render(renderer) {
    this.update();
    renderer.render(this.scene, this.camera);
  }
  
  save() {
    let name = window.prompt('name:::', 'test') || 'test';
    console.log('saving', name);
    network.send('save', this.serialize(name));
  }
  
  load(name) {
    network.send('load', name, (res, data) => {
      if(res == 'ok') {
        console.log('loading', name);
        this.parseLoad(JSON.parse(data))
          .then((newModel) => this.transitionTo(newModel));
      } else {
        console.log('load error', data);
      }
    });
  }
  
  parseLoad(data) {
    let newScene = new THREE.Scene();
    
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
    Object.entries(this.players).forEach(([id, p]) => this.scene.remove(player.mesh(p)))
    this.players = {};
    
    this.name = newModel.name;
    this.scene = newModel.scene;
    this.layers = newModel.layers;
    this.objects = newModel.objects;
    
    this.activeLayerIndex = 0;
    this.players['local'] = new Player(this)
      .input(this.input)
      .join(this);
    
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
