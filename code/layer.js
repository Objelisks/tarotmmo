import {THREE, PolyBool} from './libs.js';

/*
// polygon format (PolyBool)
{
  regions: [ // list of regions
    // each region is a list of points
    [[50,50], [150,150], [190,50]],
    [[130,50], [290,150], [290,50]]
  ],
  inverted: false // is this polygon inverted?
}
*/

class Layer {
  constructor(color = 0xff0000) {
    const displayMat = new THREE.MeshBasicMaterial({color: color, wireframe: true});
    this.gon = {regions: [circle(1, 4)], inverted: false};
    this.display = new THREE.Mesh(new THREE.Geometry(), displayMat);
    this.refreshDisplay();
    this.display.rotateX(Math.PI/2);
  }

  findPath(p1, p2) {

  }

  getRandomPoint() {

  }

  getSetOfPoints(seed = 0) {

  }

  paint(brush) {
    let brushgon = {
      regions: [
        circle(brush.r, 8, [brush.x, brush.y])
      ],
      inverted: false,
    };
    this.gon = PolyBool.union(this.gon, brushgon);
    this.refreshDisplay();
  }
  
  refreshDisplay() {
    // todo: probably less wasteful way of doing this
    let newGeo = new THREE.ShapeBufferGeometry(toShapes(this.gon), 1);
    this.display.geometry.dispose();
    this.display.geometry = newGeo;
  }

  collide(p, r) {

  }
  
  show(world) {
    world.scene.add(this.display);
  }
}

const circle = (r, segments, offset = [0, 0]) => {
  let pts = [];
  let p2 = Math.PI * 2;
  for(let i=0; i<segments; i++) {
    pts.push([Math.cos(i*p2/segments) * r + offset[0], Math.sin(i*p2/segments) * r + offset[1]]);
  }
  return pts;
};

const toShapes = (polygon) => polygon.regions.map(
    region => new THREE.Shape(region.map(
        pt => new THREE.Vector2(pt[0], pt[1]))));

export {Layer};
