import {THREE} from '../libs.js';

const subsystem = (s) => s;
const clone = (c) => {
  let newContext = {};
  newContext.scale = c.scale;
  newContext.state = c.state;
  newContext.added = c.added;
  newContext.pos = c.pos.clone();
  newContext.rot = c.rot.clone();
  return newContext;
};
let UP = new THREE.Vector3(0,1,0);
let LEFT = new THREE.Vector3(0,0,1);
let offset = new THREE.Vector3();
let rotation = new THREE.Quaternion();
const actions = {
  stem: (f, c) => {c.added.push(f.stem(c)); return c;},
  flower: (f, c) => {c.added.push(f.flower()); return c;},
  leaf: (f, c) => {c.added.push(f.leaf()); return c;},
  grow: (fac) => (f, c) => {c.scale *= fac; return c;},
  offset: (x,y,z) => (f, c) => {c.pos.add(offset.set(x,y,z).multiplyScalar(c.scale).applyQuaternion(c.rot)); return c;},
  rotate: (angle) => (f, c) => {c.rot.multiply(rotation.setFromAxisAngle(UP, angle)); return c;},
  gravity: (amt) => (f, c) => {c.rot.multiply(rotation.setFromAxisAngle(LEFT, amt)); return c;},
  push: (f, c) => {c.state.push(clone(c)); return c;},
  pop: (f, c) => {let p = c.state.pop(); return p;},
};

export const flower = {
  start: '[RRRRRR]S',
  S: '[RRRRRR]s^s^s^gS',
  R: '([vs^vgs^,]',
  s: actions.stem,
  'g': actions.grow(0.7),
  ',': actions.grow(2),
  f: actions.flower,
  '^': actions.offset(0,1,0),
  'v': actions.gravity(0.4),
  '(': actions.rotate(Math.PI/3),
  ')': actions.rotate(-Math.PI/3),
  '[': actions.push,
  ']': actions.pop,
};

/**
  start: 'sSf',
  S: 's[vl+vl]^S',
  G: '^G',
  f: subsystem({
    // flower
    start: '[^vt]+[^vt]+[^t]+[^t]+[^t]+[^t]+',
    t: actions.flower,
    '^': actions.offset(0,0,0.3),
    'v': actions.gravity(1.0),
    '+': actions.rotate(Math.PI/3),
    '[': actions.push,
    ']': actions.pop,
  }),


*/