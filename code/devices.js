
import keyboard from './keyboard.js';
import gamepad from './gamepad.js';

const devices = {};
const methods = [keyboard, gamepad];
const keys = ['left','right','up','down','a','b'];


const clamp = (x) => x > 1.0 ? 1.0 : x < -1.0 ? -1.0 : x;

devices.update = function() {
  const delta = methods.map(method => method.update());
  const signals = delta.map(methodDelta => keys.reduce((p,c) => p + methodDelta[c], 0)).map(x => isNaN(x) ? -1 : x);
  const maxSignalIndex = signals.reduce((p,c,i) => Math.max(...signals) == c ? i : p, -1);
  console.log(delta, signals, maxSignalIndex);
  keys.forEach(key => {
    devices[key] = clamp(delta[maxSignalIndex][key]);
  });
}

export default devices;
