import {quadtree} from './libs.js';

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

const findMinMax = (arr) => arr
  .reduce((p, c) => [Math.min(p[0], c), Math.max(p[1], c)], [0, 0]);

let id = 0;
let eps = 0.0001;

export const inlog = (...args) => {
  console.log(...args);
  return Promise.resolve();
};

// stole from polybool code
export const pointInsideRegion = (pt, region) => {
  var x = pt[0];
  var y = pt[1];
  var last_x = region[region.length - 1][0];
  var last_y = region[region.length - 1][1];
  var inside = false;
  for (var i = 0; i < region.length; i++){
    var curr_x = region[i][0];
    var curr_y = region[i][1];

    // if y is between curr_y and last_y, and
    // x is to the right of the boundary created by the line
    if ((curr_y - y > eps) != (last_y - y > eps) &&
      (last_x - curr_x) * (y - curr_y) / (last_y - curr_y) + curr_x - x > eps)
      inside = !inside

    last_x = curr_x;
    last_y = curr_y;
  }
  return inside;
};

// https://www.wikihow.com/Calculate-the-Area-of-a-Polygon
export const areaInsideRegion = (region) => {
  let next = (i) => mod(i+1, region.length);
  return Math.abs(region
    .map(([x, y], i) => [x*region[next(i)][1], y*region[next(i)][0]])
    .reduce((p, c) => p + (c[0] - c[1]) / 2, 0));
};

// https://gist.github.com/mbostock/1893974#file-index-html-L59
// https://github.com/d3/d3-quadtree
export const blueNoisePolygonGen = (region, padding) => {
  let wmm = findMinMax(region.map(pt => pt[0]));
  let hmm = findMinMax(region.map(pt => pt[1]));
  let w = wmm[1] - wmm[0];
  let h = hmm[1] - hmm[0];
  let tree = quadtree().extent([[wmm[0], hmm[0]], [wmm[1], hmm[1]]]);
  
  region.forEach(pt => tree.cover(...pt));
  
  // TODO: update to return no point if full
  return (k=100) => {
    let bestX = 0;
    let bestY = 0;
    let bestDist = 0;
    
    for(let i=0; i<k; i++) {
      let x = Math.random()*w+wmm[0];
      let y = Math.random()*h+hmm[0];
      if(!pointInsideRegion([x, y], region)) continue;
      
      let minDist = Math.max(w, h);
      
      tree.visit(({point:p}, x1, y1, x2, y2) => {
        if(p) {
          let dx = p[0] - x;
          let dy = p[1] - y;
          let d2 = dx*dx + dy*dy;
          let d = Math.sqrt(d2) - p[2];
          if(d < minDist) minDist = d;
        }
        return !minDist || x1 > x || x2 < x || y1 > y || y2 < y;
      });
      
      if(minDist > bestDist) {
        bestX = x;
        bestY = y;
        bestDist = minDist;
      }
    }
    
    let best = [bestX, bestY, bestDist - padding];
    tree.add(best);
    return best;
  };
};

export const mod = (x, y) => (x+y)%y;