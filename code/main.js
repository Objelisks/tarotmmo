import {THREE} from './libs.js';
import {World} from './world.js';
import {testMain} from './test.js';

testMain();

const world = new World();

const width = 640;
const height = 480;
const aspectRatio = width/height;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(width, height);
document.getElementById('game')
  .appendChild(renderer.domElement);

const play = () => {
  requestAnimationFrame(play);
  world.render(renderer);
};

play();