import {KEYS} from '../constants.js';

const keyboard = {};
const state = KEYS.reduce((p,c) => Object.assign(p, {[c]: 0.0}), {});

window.addEventListener('keydown', (e) => {
  state[e.code] = 1.0;
  e.preventDefault();
});

window.addEventListener('keyup', (e) => {
  state[e.code] = 0.0;
  e.preventDefault();
});

keyboard.update = function() {
  return {
    'horizontal': (state['ArrowLeft'] || 0) - (state['ArrowRight'] || 0),
    'vertical': (state['ArrowUp'] || 0) - (state['ArrowDown'] || 0),
    'a': state['KeyX'],
    'b': state['KeyC'],
    'save': state['KeyP'],
    'cycleleft': state['Digit1'],
    'cycleright': state['KeyQ'],
    'create': state['KeyA'],
    'changemode': state['Tab']
  };
};

keyboard.supported = true;

export {keyboard};
