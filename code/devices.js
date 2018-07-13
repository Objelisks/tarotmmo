import {keyboard} from './devices/keyboard.js';
import {gamepad} from './devices/gamepad.js';

const data = {};
const methods = [keyboard, gamepad]; // .filter(supported?)
const keys = ['horizontal','vertical','action','save','switchleft','switchright'];

const clamp = (x) => x > 1.0 ? 1.0 : x < -1.0 ? -1.0 : x;

class Devices {
  update() {
    const delta = methods.map(method => method.update());
    const signals = delta
      .map(methodDelta => keys.reduce((p,c) => p + Math.abs(methodDelta[c] || 0), 0));
    const filtered = signals
      .map(x => isNaN(x) ? -1 : x);
    const maxSignalIndex = filtered
      .reduce((p,c,i) => Math.max(...filtered) == c ? i : p, -2);

    keys.forEach(key => {
      data[key] = clamp(delta[maxSignalIndex][key]);
    });
  }

  delta() {
    return data;
  }
}

export {Devices};
