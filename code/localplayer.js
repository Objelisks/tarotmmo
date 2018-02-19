import {Actor} from './actor.js';
import {Input} from './input.js';

class LocalPlayer extends Actor {
  constructor(world) {
    super(world, 'sphere');

    this.speed = 0.5;

    const input = new Input()
      .when('move', (dir) => this.model.move(dir.multiplyScalar(this.speed)));

    return this.with(input);
  }
}

export {LocalPlayer};
