import {THREE} from './libs.js';
import {World} from './world.js';

const world = new World();

const play = () => {
  requestAnimationFrame(play);
  world.render();
};
play();
