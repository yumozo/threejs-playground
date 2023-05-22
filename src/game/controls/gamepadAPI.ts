export const gamepadAPI = {
  controller: {},
  turbo: false,
  connect(e: GamepadEvent) {
    gamepadAPI.controller = e.gamepad
    gamepadAPI.turbo = true
    console.log('Gamepad connected.')
  },
  disconnect() {
    gamepadAPI.turbo = false
    delete gamepadAPI.controller
    console.log('Gamepad disconnected.')
  },
  update() {
    // Clear the buttons cache
    gamepadAPI.buttonsCache = []

    // Move the buttons status from the previous frame to the cache
    for (let k = 0; k < gamepadAPI.buttonsStatus.length; k++) {
      gamepadAPI.buttonsCache[k] = gamepadAPI.buttonsStatus[k]
    }

    // Clear the buttons status
    gamepadAPI.buttonsStatus = []

    // Get the gamepad object
    let c
    if (gamepadAPI.controller) {
      c = gamepadAPI.controller as Gamepad
    } else {
      c = {}
    }

    // Loop through buttons and push the pressed ones to the array
    const pressed = []
    if (c.buttons) {
      for (let b = 0; b < c.buttons.length; b++) {
        if (c.buttons[b].pressed) {
          pressed.push(gamepadAPI.buttons[b])
        }
      }
    }

    // Loop through axes and push their values to the array
    const axes = []
    if (c.axes) {
      for (let a = 0; a < c.axes.length; a++) {
        axes.push(c.axes[a].toFixed(2))
      }
    }

    // Assign received values
    gamepadAPI.axesStatus = axes
    gamepadAPI.buttonsStatus = pressed

    // Return buttons for debugging purposes
    return pressed
  },
  buttonPressed(button: any, hold = false) {
    let newPress = false

    // Loop through pressed buttons
    for (let i = 0; i < gamepadAPI.buttonsStatus.length; i++) {
      // If we found the button we're looking for
      if (gamepadAPI.buttonsStatus[i] === button) {
        // Set the boolean variable to true
        newPress = true

        // If we want to check the single press
        if (!hold) {
          // Loop through the cached states from the previous frame
          for (let j = 0; j < gamepadAPI.buttonsCache.length; j++) {
            // If the button was already pressed, ignore new press
            newPress = gamepadAPI.buttonsCache[j] !== button
          }
        }
      }
    }
    return newPress
  },
  buttons: [
    'A',
    'B',
    'X',
    'Y',
    'LB',
    'RB',
    'LT',
    'RT',
    'BACK',
    'START',
    'LS_PRESS',
    'RS_PRESS',
    'DPAD_UP',
    'DPAD_DOWN',
    'DPAD_LEFT',
    'DPAD_RIGHT',
    'GUIDE'
  ],
  buttonsCache: [],
  buttonsStatus: [],
  axesStatus: []
}
