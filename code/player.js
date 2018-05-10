import {Actor} from './actor.js';

let editMode = true;

class Player extends Actor {
  constructor(world) {
    super(world, 'sphere');

    this.speed = 0.2;
    
    return this;
  }
  
  input(strat) {
    strat
      .when('move', (dir) => this.move(dir), this.removers)
      .when('action', () => this.action(), this.removers)
      .when('hold', () => this.hold(), this.removers)
      .when('release', () => this.release(), this.removers);

    return this.with(strat);
  }
  
  move(dir) {
    this.model.move(dir.multiplyScalar(this.speed));
    //this.world.socket.emit('move', {x: this.model.obj.position.x, y: this.model.obj.position.y, z: this.model.obj.position.z});
  }
  
  action() {
    
  }
  
  hold() {
    if(editMode) {
      let brush = {
        x: this.model.obj.position.x,
        y: this.model.obj.position.z,
        r: 1.5,
      };
      this.world.activeLayer.paint(brush);
    }
  }
  
  release() {
    
  }
}

export {Player};
