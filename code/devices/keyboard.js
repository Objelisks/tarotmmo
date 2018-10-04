const keyboard = {};
const keys = ['left','right','up','down','action','save'];
const state = keys.reduce((p,c) => Object.assign(p, {[c]: 0.0}), {});
const keyboardMap = {
  'ArrowLeft': 'left',
  'ArrowRight': 'right',
  'ArrowUp': 'up',
  'ArrowDown': 'down',
  'x': 'action',
  'p': 'save',
  '1': 'switchleft',
  'q': 'switchright',
};

window.addEventListener('keydown', (e) => {
  if(keyboardMap[e.key]) {
    state[keyboardMap[e.key]] = 1.0;
  }
});

window.addEventListener('keyup', (e) => {
  if(keyboardMap[e.key]) {
    state[keyboardMap[e.key]] = 0.0;
  }
});

keyboard.update = function() {
  return {
    'horizontal': state['left'] - state['right'],
    'vertical': state['up'] - state['down'],
    'action': state['action'],
    'save': state['save'],
    'switchleft': state['switchleft'],
    'switchright': state['switchright'],
  };
};

keyboard.supported = true;

export {keyboard};
