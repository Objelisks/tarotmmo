import {Thing} from './thing.js';
import {Model} from './model.js';

class Actor extends Thing {
  constructor(world, modelName) {
    super();

    this.world = world;
    this.model = new Model(modelName);
    this.removers = [];

    return this.with(this.model);
  }
  
  join(place) {
    this.model.when('mesh', (obj) => place.scene.add(obj), this.removers);
    place.when('update', (context) => this.update(context), this.removers);
    return this;
  }
  
  leave(place) {
    this.model.when('mesh', (obj) => place.scene.remove(obj), this.removers);
    this.removers.forEach(remover => remover());
    return this;
  }
}

export {Actor};
