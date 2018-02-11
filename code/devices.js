import keyboard from './devices/keyboard.js';
import gamepad from './devices/gamepad.js';

const data = {};
const methods = [keyboard, gamepad];
const keys = ['left','right','up','down','a','b'];

const clamp = (x) => x > 1.0 ? 1.0 : x < -1.0 ? -1.0 : x;

class Devices {
  update() {
    const delta = methods.map(method => method.update());
    const signals = delta
      .map(methodDelta => keys.reduce((p,c) => p + methodDelta[c], 0))
      .map(x => isNaN(x) ? -1 : x);
    const maxSignalIndex = signals
      .reduce((p,c,i) => Math.max(...signals) == c ? i : p, -1);
      
    keys.forEach(key => {
      data[key] = clamp(delta[maxSignalIndex][key]);
    });
  }

  delta() {
    return data;
  }
}

export {Devices};
