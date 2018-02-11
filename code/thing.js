class Thing {
  constructor() {
    this.listens = {};
    this.queued = {};
    this.components = [];
  }

  with(...added) {
    this.components = this.components.concat(added);
    return this;
  }

  update(context) {
    this.components
      .filter(component => !!component.update)
      .forEach(component => component.update(context));
    return this;
  }

  when(type, callback) {
    const list = this.listens[type];
    if(!list && this.queued[type] ) {
      this.queued[type].forEach((data) => callback(data));
      delete this.queued[type];
    }
    this.listens[type] = (list || []).concat([callback]);
    return this;
  }

  emit(type, data) {
    const list = this.listens[type];
    if(list) {
      list.forEach((listen) => listen ? listen(data) : undefined);
    } else {
      this.queued[type] = (this.listens[type] || []).concat([data]);
    }
    return this;
  }
}

export {Thing};
