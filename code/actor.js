import {Thing} from './thing.js';
import {Model} from './model.js';
import {Input} from './input.js';

class Actor extends Thing {
  constructor(world) {
    super();
    world.when('update', (context) => this.update(context));
    return this
      .with(Model)
      .with(Input)
      .when('mesh', (mesh) => world.scene.add(mesh));
  }
}

export {Actor};
