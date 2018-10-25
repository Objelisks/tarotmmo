import {Layer} from './layer.js';
import {Exit, Terrain} from './layers.js';
import {contextMap} from './contextmap.js';
import {out} from './util.js';

const actions = {
  paint: {
    held(context) {
        let brush = {
          x: context.local.pos().x,
          y: context.local.pos().z,
          r: 1.5,
        };
        context.world.getActiveLayer().paint(brush);
    },
    released(context) {
      context.world.getActiveLayer().finish();
    }
  },
  erase: {
    held(context) {
      let brush = {
        x: context.local.pos().x,
        y: context.local.pos().z,
        r: 1.5,
        erase: true,
      };
      context.world.getActiveLayer().paint(brush);
    },
    released(context) {
      context.world.getActiveLayer().finish();
    }
  },
  create: {
    pressed(context) {
      context.world.layers.push(new Layer().does(new Exit().show(context.world.scene)).show(context.world.scene));
    }
  },
  changemode: {
    pressed(context) {
      context.vars.mode = context.vars.mode == 'edit' ? 'play' : 'edit';
      out({mode: context.vars.mode});
    }
  }
};

const applyDelta = (context, delta) => 
  ['pressed', 'held', 'released']
    .map(set => Object.keys(delta[set])
      .map(key => contextMap[context.vars.mode] && contextMap[context.vars.mode][key] || key)
      .forEach((key) => actions[key] && actions[key][set] ? actions[key][set](context) : null))

export {
  applyDelta
}