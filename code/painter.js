import {Thing} from './thing.js';
import {Local} from './input.js';

class Painter extends Thing {
  constructor(world) {
    super();
    
    world.when('update', (context) => this.update(context));
    this.world = world;

    const input = new Local()
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
  
  paint(brush) {
    this.world.activeLayer.paint(brush);
  }
}

export {Painter};
