import {Thing} from './thing.js';
import {Input} from './input.js';

class Painter extends Thing {
  constructor(world) {
    super();
    world.when('update', (context) => this.update(context));

    const input = new Input()
      .when('point', (dir) => this.model.move(dir.multiplyScalar(this.speed)));

    return this.with(input);
    // indicator
    // paint method
      // modify layer
    // stroke callbacks
    // target layer
    // switch layer

    // pointer input method
  }

  update() {

  }
}

export {Painter};
