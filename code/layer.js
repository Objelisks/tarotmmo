import {THREE, PolyBool, simplify} from './libs.js';

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
  constructor(regions = [], color = 0xff0000) {
    this.color = color;
    const displayMat = new THREE.MeshBasicMaterial({color: color, wireframe: true});
    this.gon = {regions: regions, inverted: false};
    this.display = new THREE.Mesh(new THREE.Geometry(), displayMat);
    this.refreshDebug();
    this.display.rotateX(Math.PI/2);
    this.doings = [];
  }

  does(strat) {
    this.doings.push(strat);
    return this;
  }
  
  update(context) {
    this.doings.forEach((doing) => doing.update ? doing.update(context, this.gon) : null);
  }

  paint(brush) {
    let brushgon = {
      regions: [
        circle(brush.r, 8, [brush.x, brush.y])
      ],
      inverted: false,
    };
    this.gon = PolyBool.union(this.gon, brushgon);
    this.simplifySelf();
    this.doings.forEach((doing) => doing.paint ? doing.paint(this.gon) : null);
    this.refreshDebug();
  }
  
  finish() {
    this.doings.forEach((doing) => doing.finish ? doing.finish(this.gon) : null);
  }
  
  simplifySelf() {
    this.gon = {
      regions: this.gon.regions.map(region => dxy(simplify(xy(region), 0.25))),
      inverted: this.gon.inverted,
    };
  }  
  refreshDebug() {
    // todo: probably less wasteful way of doing this
    let newGeo = new THREE.ShapeBufferGeometry(toShapes(this.gon), 1);
    this.display.geometry.dispose();
    this.display.geometry = newGeo;
  }
  
  show(scene) {
    this.finish();
    scene.add(this.display);
    return this;
  }
  
  serialize() {
    return {
      regions: this.gon.regions,
      color: this.color,
      doings: this.doings.map(doing => doing.serialize()),
    };
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

const xy = (points) => points.map(point => ({x: point[0], y: point[1]}));
const dxy = (points) => points.map(point => [point.x, point.y]);

export {Layer};
