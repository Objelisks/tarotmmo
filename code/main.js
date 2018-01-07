import {THREE} from './libs.js';
import world from './world.js';

const a = 1;
console.log('hello world', THREE.BoxGeometry);

world.init();
world.build();

console.log(world);

const play = () => {
  requestAnimationFrame(play);
  world.render();
};
play();
