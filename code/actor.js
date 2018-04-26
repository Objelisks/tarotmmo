import {Thing} from './thing.js';
import {Model} from './model.js';

class Actor extends Thing {
  constructor(world, modelName) {
    super();

    this.world = world;
    this.model = new Model(modelName)
      .when('mesh', (mesh) => world.scene.add(mesh));
    world.when('update', (context) => this.update(context));

    return this.with(this.model);
  }
}

export {Actor};
