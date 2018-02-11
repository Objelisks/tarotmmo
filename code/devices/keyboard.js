const keyboard = {};
const keys = ['left','right','up','down','a','b'];
const state = keys.reduce((p,c) => Object.assign(p, {[c]: false}), {});
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
    state[keyboardMap[e.key]] = true;
  }
});

window.addEventListener('keyup', (e) => {
  if(keyboardMap[e.key]) {
    state[keyboardMap[e.key]] = false;
  }
});

keyboard.update = function() {
  return keys.reduce((p,c) =>
      Object.assign(p, {[c]: state[c] ? 1.0 : 0.0}), {});
};

export default keyboard;
