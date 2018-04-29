import {THREE, PolyBool} from './libs.js';

/*
// polygon format
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
  constructor() {
    this.gon = {regions: [circle(1, 4)], inverted: false};
    this.display = new THREE.Object3D();
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
    this.display.children.forEach(child => this.display.remove(child));
    this.display.add(new THREE.Mesh(toShapeGeo(this.gon), displayMat));
  }

  collide(p, r) {

  }
  
  show(world) {
    world.scene.add(this.display);
  }
}

const displayMat = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true});

const circle = (r, segments, offset = [0, 0]) => {
  let pts = [];
  let p2 = Math.PI * 2;
  for(let i=0; i<segments; i++) {
    pts.push([Math.cos(i*p2/segments) * r+offset[0], Math.sin(i*p2/segments) * r+offset[1]]);
  }
  return pts;
};

const toShapeGeo = (polygon) => new THREE.ShapeGeometry(polygon.regions.map(
    region => new THREE.Shape(region.map(
        pt => new THREE.Vector2(pt[0], pt[1])))), 1);

export {Layer};
