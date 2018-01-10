import obj from './obj.js';

class thing {
  constructor() {
    this.has = [];
    return this
      .with(obj);
  }

  with(mod) {
    this.has.push(new mod(this));
    return this;
  }

  update() {
    this.has
      .filter(mod => !!mod.update)
      .forEach(mod => mod.update());
  }

  addTo(scene) {
    scene.add(this.obj);
  }
}

export default thing;
