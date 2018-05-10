// basically an event emitter
// also holds components and updates them
// a component is anything with an update method
class Thing {
  constructor() {
    this.listens = {};
    this.components = [];
    this.promises = {};
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

  when(type, callback, removerList) {
    if(this.promises[type]) {
      this.promises[type].then(callback);
      return this;
    }
    
    const list = this.listens[type];
    this.listens[type] = (list || []).concat([callback]);
    if(removerList) {
      removerList.push(() => {
        let list = this.listens[type];
        let idx = list.indexOf(callback);
        if(idx >= 0) {
          list.splice(idx, 1);
        }
      });
    }
    return this;
  }

  emit(type, data) {
    const list = this.listens[type];
    if(list) {
      list.forEach((listen) => listen ? listen(data) : undefined);
    }
    return this;
  }
  
  resolve(type, data) {
    this.promises[type] = Promise.resolve(data);
    return this;
  }
}

export {Thing};
