import {Thing} from './thing.js';
import {Model} from './model.js';
import {Input} from './input.js';

class Actor extends Thing {
  constructor(world, modelName) {
    super();
    const model = new Model(modelName)
      .when('mesh', (mesh) => world.scene.add(mesh));
    const input = new Input()
      .when('move', (...args) => model.move(...args));
    world.when('update', (context) => this.update(context));

    return this.with(model, input);
  }
}

export {Actor};
