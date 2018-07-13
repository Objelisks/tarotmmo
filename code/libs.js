/* global THREE, d3 */

let THREE_module = THREE;

import PolyBool from './libs/polybool/polybool.js';
import simplify from './libs/simplify/simplify.js';
let quadtree = d3.quadtree;

export {
  THREE_module as THREE,
  PolyBool,
  simplify,
  quadtree,
};
