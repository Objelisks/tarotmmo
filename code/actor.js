import {Thing} from './thing.js';
import {Model} from './model.js';

class Actor extends Thing {
  constructor(world, modelName) {
    super();

    this.world = world;
    this.model = new Model(modelName);
    this.removers = [];
    world.when('update', (context) => this.update(context), this.removers);

    return this.with(this.model);
  }
  
  join(world) {
    this.model.when('mesh', (obj) => world.scene.add(obj), this.removers);
    return this;
  }
  
  leave(world) {
    this.model.when('mesh', (obj) => world.scene.remove(obj), this.removers);
    this.removers.forEach(remover => remover());
    return this;
  }
}

export {Actor};
