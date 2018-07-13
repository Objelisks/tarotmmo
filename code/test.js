import {blueNoisePolygonGen, areaInsideRegion} from './util.js';

let runtests = false;

let tests = {
  blueNoise: () => {
    let gen = blueNoisePolygonGen([[0,0], [0, 1], [1, 1], [1, 0], [0, 0]], 0.2);
    console.log({generated:gen(5)});
  },
  regionArea: () => {
    let region = [[0,0], [0, 2], [2, 2], [2, 0]];
    console.log(4, {area:areaInsideRegion(region)});
  }
};

export function testMain() {
  if(!runtests) return;
  Object.keys(tests).forEach(testName => {
    console.log(`~~~~~ ${testName} start ~~~~~`);
    tests[testName]();
    console.log(`~~~~~ ${testName} end ~~~~~`);
  });
};