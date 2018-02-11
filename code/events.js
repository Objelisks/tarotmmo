class Events {
  constructor(obj) {
    obj.listens = {};
    obj.queued = {};

    obj.when = function(type, callback) {
      const list = this.listens[type];
      if(!list && this.queued[type] ) {
        if(callback) {
          this.queued[type].forEach((data) => callback(data));
        }
        delete this.queued[type];
      }
      this.listens[type] = (list || []).concat([callback]);
      return this;
    };

    obj.send = function(type, data) {
      const list = this.listens[type];
      if(list) {
        list.forEach((listen) => listen ? listen(data) : undefined);
      } else {
        this.queued[type] = (this.listens[type] || []).concat([data]);
      }
      return this;
    }
  }
};

export {Events};
