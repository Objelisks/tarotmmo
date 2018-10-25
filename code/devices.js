import {keyboard} from './devices/keyboard.js';
import {gamepad} from './devices/gamepad.js';
import {KEYS} from './constants.js';

const data = {};
const methods = [keyboard, gamepad].filter(method => method.supported);

const clamp = (x) => x > 1.0 ? 1.0 : x < -1.0 ? -1.0 : x;

class Devices {
  update(context) {
    const delta = methods.map(method => method.update());
    const signals = delta
      .map(methodDelta => KEYS.reduce((p,c) => p + Math.abs(methodDelta[c] || 0), 0));
    const filtered = signals
      .map(x => isNaN(x) ? -1 : x);
    const maxSignalIndex = filtered
      .reduce((p,c,i) => Math.max(...filtered) == c ? i : p, -2);

    KEYS.forEach(key => {
      data[key] = clamp(delta[maxSignalIndex][key]) || 0;
    });
  }

  delta() {
    return data;
  }
}

export {Devices, KEYS};
