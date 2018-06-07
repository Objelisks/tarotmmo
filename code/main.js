import {THREE} from './libs.js';
import {World} from './world.js';
import {FlowerEditor} from './flowereditor.js';

const world = new World();
const editor = new FlowerEditor();

const width = 640;
const height = 480;
const aspectRatio = width/height;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const play = () => {
  requestAnimationFrame(play);
  world.render(renderer);
  //editor.render(renderer);
};

play();