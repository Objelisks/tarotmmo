import thing from './thing.js';
import input from './input.js';

class actor extends thing {
  constructor(scene) {
    super();
    return this
      .with(input)
      .when('mesh', (mesh) => scene.add(mesh));
  }
}

export default actor;
