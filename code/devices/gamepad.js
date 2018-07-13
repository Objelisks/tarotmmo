const gamepad = {};

const HORIZONTAL_AXIS = 0;
const VERTICAL_AXIS = 1;
const A_BUTTON = 0;
const B_BUTTON = 1;

let playerOne = null;
const deadzone = (input) => input > 0.2 ? input : input < -0.2 ? input : 0.0;

window.addEventListener('gamepadconnected', (e) => {
  const gamepad = navigator.getGamepads()[e.gamepad.index];
  if(!playerOne) {
    playerOne = gamepad.index;
    console.log('gamepad player one:', playerOne);
  }
});

window.addEventListener('gamepaddisconnected', (e) => {
  if(playerOne == e.gamepad.index) {
    playerOne = null;
  }
});

gamepad.update = function() {
  const gamepad = navigator.getGamepads()[playerOne];
  if(!gamepad) {
    playerOne = null;
    return {};
  }

  return {
    'horizontal': -deadzone(gamepad.axes[HORIZONTAL_AXIS]),
    'vertical': -deadzone(gamepad.axes[VERTICAL_AXIS]),
    'action': gamepad.buttons[A_BUTTON].value,
    'save': gamepad.buttons[B_BUTTON].value,
  };
};

export {gamepad};
