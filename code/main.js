import {THREE} from './libs.js';
import world from './world.js';

world.init();
world.build();

const play = () => {
  requestAnimationFrame(play);
  world.render();
};
play();
