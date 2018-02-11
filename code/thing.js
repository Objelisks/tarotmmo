import {Events} from './events.js';

class Thing {
  constructor() {
    this.components = [];
    return this
      .with(Events);
  }

  with(component) {
    const m = new component(this);
    this.components.push(m);
    return this;
  }

  update(context) {
    this.components
      .filter(component => !!component.update)
      .forEach(component => component.update(context));
    return this;
  }
}

export {Thing};
