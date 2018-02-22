const keyboard = {};
const keys = ['left','right','up','down','a','b'];
const state = keys.reduce((p,c) => Object.assign(p, {[c]: 0.0}), {});
const keyboardMap = {
  'ArrowLeft': 'left',
  'ArrowRight': 'right',
  'ArrowUp': 'up',
  'ArrowDown': 'down',
  'x': 'a',
  'c': 'b',
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
    'a': state['a'],
    'b': state['b'],
  };
};

export {keyboard};
