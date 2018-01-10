class input {
  constructor(thing) {
    this.thing = thing;
  }

  update() {
    this.thing.obj.position.x += 1;
  }
}

export default input;
