import model from './model.js';

class thing {
  constructor() {
    this.mods = [];
    this.listens = {};
    this.queued = {};
    return this
      .with(model);
  }

  with(mod) {
    const m = new mod(this);
    this.mods.push(m);
    return this;
  }

  when(type, callback) {
    const list = this.listens[type];
    if(!list && this.queued[type]) {
      this.queued[type].forEach((data) => callback(data));
      delete this.queued[type];
    }
    this.listens[type] = (list || []).concat([callback]);
    return this;
  }

  send(type, data) {
    const list = this.listens[type];
    if(list) {
      list.forEach((listen) => listen(data));
    } else {
      this.queued[type] = (this.listens[type] || []).concat([data]);
    }
    return this;
  }

  update(context) {
    this.mods
      .filter(mod => !!mod.update)
      .forEach(mod => mod.update(context));
    return this;
  }
}

export default thing;
