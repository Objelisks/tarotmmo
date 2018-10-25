import {THREE} from './libs.js';
import * as singletons from './singletons.js';
import {player} from './player.js';
import {Local, Remote} from './input.js';
import * as layers from './layers.js';
import {mod, out} from './util.js';
import {Layer} from './layer.js';
import * as actions from './actions.js';

let {network} = singletons;

const width = 640;
const height = 480;
const aspectRatio = width/height;
const cameraOffset = new THREE.Vector3(20,20,20);
const contextVars = {mode: 'edit'}

const localAvatarId = () => `${network.id()}-avatar`

const parseLoad = (data) => {
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

class World {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(30, aspectRatio, 1, 1000);
    this.camera.position.set(20, 20, 20);
    this.camera.lookAt(new THREE.Vector3());
    
    this.players = {};
    this.layers = [];
    this.objects = [];
    this.scene = new THREE.Scene();
    
    this.input = new Local();
    
    this.load('test').then(() => {
      network.when('new player', (p) => {
        this.players[`${p.id}-avatar`] = new player(`${p.id}-avatar`);
      });
      network.when('player left', (p) => {
        if(this.players[`${p.id}-avatar`]) {
          this.scene.remove(this.players[`${p.id}-avatar`].model());
          delete this.players[`${p.id}-avatar`];
        }
      });
    });
  }
  
  handlePressed(pressed) {
    pressed['save'] && this.save();
    pressed['cycleleft'] && this.rotateLayerSelection(false);
    pressed['cycleright'] && this.rotateLayerSelection(true);
  }
  
  update() {
    const context = {
      vars: contextVars,
      world: this,
      local: this.players[localAvatarId()],
      players: this.players
    };
    
    singletons.devices.update();
    const inputDelta = this.input.update();
    this.handlePressed(inputDelta.pressed);
    
    const outsideState = network.state();
    if(outsideState) {
      Object.entries(outsideState.objects).forEach(([objectId, object]) => {
        const obj = this.players[`${objectId}`];
        if(obj) {
          obj.pos().set(...object.pos);
          obj.rot().set(...object.rot);
        }
      });
    }
    
    this.layers.forEach(layer => layer.update(context));
    
    if(context.local) {
      context.local.applyDelta(context, inputDelta);
      actions.applyDelta(context, inputDelta);
      this.camera.position.copy(context.local.pos()).add(cameraOffset);
    }
    
    network.send('state', this.networkState());
  }

  render(renderer) {
    this.update();
    renderer.render(this.scene, this.camera);
  }
  
  networkState() {
    return {
      id: network.id(),
      objects: Object.entries(this.players).reduce((pre, [id, cur]) => ({
        ...pre,
        [id]: {id, pos: cur.pos().toArray(), rot: cur.rot().toArray()},
      }), {}),
      events: { }
    }
  }
  
  getActiveLayer() {
    return this.layers[this.activeLayerIndex];
  }
  
  rotateLayerSelection(right) {
    this.getActiveLayer().unhighlight()
    this.activeLayerIndex = mod(this.activeLayerIndex + (right ? 1 : -1), this.layers.length);
    this.getActiveLayer().highlight()
    out({activeLayer: {
      index: this.activeLayerIndex,
      doings: this.getActiveLayer().doings
        .map(d => d.type).join(', ')
    }});
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
          resolve(parseLoad(JSON.parse(data))
            .then((newModel) => this.transitionTo(newModel)));
        } else {
          console.log('load error', data);
          reject(data);
        }
      });
    });
  }
  
  transitionTo(newModel) {
    Object.values(this.players).forEach((player) => this.scene.remove(player.model()))
    this.players = {};
    
    this.name = newModel.name;
    this.scene = newModel.scene;
    this.layers = newModel.layers;
    this.objects = newModel.objects;
    
    this.activeLayerIndex = 0;
    
    network.connected().then(() => {
      const newLocalPlayer = new player(localAvatarId());
      this.players[localAvatarId()] = newLocalPlayer;
      this.scene.add(newLocalPlayer.model());
    });
    
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
