import {Actor} from './actor.js';
import {Input} from './input.js';

let editMode = true;

class LocalPlayer extends Actor {
  constructor(world) {
    super(world, 'sphere');

    this.speed = 0.2;

    const input = new Input()
      .when('move', (dir) => this.move(dir))
      .when('action', () => this.action())
      .when('hold', () => this.hold())
      .when('release', () => this.release());

    return this.with(input);
  }
  
  move(dir) {
    this.model.move(dir.multiplyScalar(this.speed));
    this.world.socket.emit('move', {x: this.model.obj.position.x, y: this.model.obj.position.y, z: this.model.obj.position.z});
  }
  
  action() {
  }
  
  hold() {
    if(editMode) {
      let brush = {
        x: this.model.obj.position.x,
        y: this.model.obj.position.z,
        r: 1.5
      };
      this.world.painter.paint(brush);
    }
  }
  
  release() {
    
  }
}

export {LocalPlayer};
