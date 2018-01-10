import thing from './thing.js';
import input from './input.js';
import obj from './obj.js';

class actor extends thing {
  constructor() {
    super();
    return this
      .with(input);
  }
}

export default actor;
