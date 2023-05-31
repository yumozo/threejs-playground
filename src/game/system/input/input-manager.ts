// import { gamepadAPI } from './gamepad-API'
import { mapping } from '../config/GP_KEYMAP'
import { GamepadInput } from './gamepad-input'

/**
 * Manages keyboard and gamepad input events and* provides event registration
 * methods.
 * @todo *Separate into two
 */
export class InputManager {
  private static instance: InputManager
  /**
   * A set to store the strings of keys that were registered using the
   * `registerKeyDown()` method.
   */
  private readonly savedOnDownKeysAsStr: Set<string>
  /**
   * A set to store the numerical codes of keys that were registered using
   * the `registerKeyDown()` method.
   */
  private readonly savedOnDownKeysAsNum: Set<number>
  private readonly savedAxis: Set<number>
  private readonly savedOnReleaseKeys: Set<string>
  /**
   * An object that maps strings representing gamepad button keys to action
   * functions that should be called when the button is first pressed down
   * ("down" event).
   */
  private readonly savedGamepadButtonsDown: Map<string, Function>
  /**
   * An object that maps strings representing gamepad button keys to action
   * functions that should be called when the button is held down ("pressed"
   * event).
   */
  private readonly savedGamepadButtonsPress: Map<string, Function>
  /**
   * The state of the gamepad buttons from the previous frame.
   */
  private readonly prevGamepadState: Map<string, boolean>
  /**
   * The gamepad input object for processing gamepad events.
   */
  private readonly gamepadInput: GamepadInput

  private readonly adrStr: string

  private constructor() {
    // BINDS
    this.update = this.update.bind(this)
    this.registerKeyDown = this.registerKeyDown.bind(this)

    this.adrStr = '[InputManager]: '

    this.gamepadInput = new GamepadInput(mapping)

    this.savedOnDownKeysAsStr = new Set()
    this.savedOnDownKeysAsNum = new Set()
    this.savedOnReleaseKeys = new Set()
    this.savedGamepadButtonsPress = new Map()
    this.savedGamepadButtonsDown = new Map()
    this.prevGamepadState = new Map()

    // HANDLE GAMEPAD CONNECTION
    window.addEventListener('gamepadconnected', (e) => {
      const controller = e.gamepad
      this.gamepadInput.connectGamepad(controller)
    })
    window.addEventListener('gamepaddisconnected', (e) => {
      const controller = e.gamepad
      this.gamepadInput.disconnectGamepad(controller)
    })
  }

  public static getInstance() {
    if (!InputManager.instance) {
      InputManager.instance = new InputManager()
    }
    return InputManager.instance
  }

  /**
   * Updates the input manager object and checks for newly occurred events.
   * @todo Is too fast. Need to sleep a little after each frame.
   * Overall input rate should be identical to keyboard.
   * Check {@link https://gameprogrammingpatterns.com/game-loop.html#take-a-little-nap take a little nap}
   */
  update() {
    // Save a copy of the current gamepad button state
    // this.prevGamepadState = { ...this.gamepadInput.buttons }

    this.gamepadInput.update()

    // Checking each gamepad button
    for (const button in this.savedGamepadButtonsPress) {
      // If pressed
      if (this.gamepadInput.isButtonPressed(button)) {
        // get the action
        const action = this.savedGamepadButtonsPress[button]
        // and call it
        action()
      }
    }
    for (const button in this.savedGamepadButtonsDown) {
      const isPressed = this.gamepadInput.isButtonPressed(button)
      const wasPressed = this.prevGamepadState[button]
      // If pressed and was not in the previous frame
      if (isPressed && !wasPressed) {
        // get the action
        const action = this.savedGamepadButtonsDown[button]
        // and call it
        action()

        // Set the button was pressed this time
        this.prevGamepadState[button] = true
      } else if (!isPressed) {
        // Set the button was not pressed this time
        this.prevGamepadState[button] = false
      }
    }
  }

  /**
   * Registers a new keydown event listener for a specified key or gamepad button.
   * @param key The key or button to listen for.
   * @param action The function to call when the specified key or button is
   * pressed
   * @param gamepadKey Optional indicator whether the key is a gamepad button.
   * Default to false.
   * @param gamepadDown Optional indicator whether the gamepad button fires
   * only once when pressed down. Default to false.
   * @throws An error if the `key` argument has an invalid type.
   */
  registerKeyDown(
    key: string | number,
    action: Function,
    gamepadKey = false,
    gamepadDown = false
  ) {
    // Check for key type
    if (typeof key === 'string') {
      // Check if for gamepad
      if (gamepadKey) {
        // pressed down, but not held down: event fires once button was pressed
        if (gamepadDown) {
          if (this.savedGamepadButtonsDown[key]) return
          this.savedGamepadButtonsDown[key] = action
        } else {
          if (this.savedGamepadButtonsPress[key]) return
          this.savedGamepadButtonsPress[key] = action
        }
      } else {
        if (this.savedOnDownKeysAsStr.has(key)) return
        window.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === key) {
            action()
          }
        })
        this.savedOnDownKeysAsStr.add(key)
      }
      // Check for key type
    } else if (typeof key === 'number') {
      if (this.savedOnDownKeysAsNum.has(key)) return
      window.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.keyCode === key) {
          action()
        }
      })
      this.savedOnDownKeysAsNum.add(key)
      // Invalid key type
    } else {
      throw new Error('[InputManager/registerKeyDown]: Invalid key value.')
    }
    console.log(this.adrStr + `key ${key} registered.`)
  }

  // WIP⬇️

  /**
   * ...
   * @param key
   * @param gamepadAxis Gamepad axis ID. An Xbox controller has 4 axes IDs,
   * where the first two for the left stick and the last two for the right
   * one.
   * @param action Event handler as a callback
   * @returns
   */
  registerAxis(gamepadAxis: number, action: Function): void {
    // Registering on gamepad axis
    if (gamepadAPI.turbo) {
      const axisStatus = gamepadAPI.axesStatus[gamepadAxis]
      if (gamepadAPI.buttonPressed(axisStatus !== 0)) {
        action()
        console.log('Gamepad button pressed: ', axisStatus)
      }
    } else {
      throw new Error('[InputManager/registerAxis]: No any gamepad connected.')
    }
    if (this.savedAxis.has(gamepadAxis)) {
      return
    }
    // window.addEventListener('keydown', (e: KeyboardEvent) => {
    //   if (e.key === key) {
    //     func()
    //   }
    // })
    this.savedAxis.add(gamepadAxis)

    console.log(this.adrStr + `Axis ${gamepadAxis} registered.`)
  }

  removeOnKeyDown(key: string) {
    if (this.savedOnDownKeys.has(key)) {
      this.savedOnDownKeys.delete(key)
    } else console.warn(this.adrStr + 'no such key registered on press.')
  }

  onKeyUp(key: string, func: Function) {
    if (this.savedOnReleaseKeys.has(key)) return
    window.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.which === key) {
        func()
      }
    })
    this.savedOnReleaseKeys.add(key)
    console.log(this.adrStr + `key ${key} registered on release.`)
  }

  removeOnKeyUp(key: string) {
    if (this.savedOnReleaseKeys.has(key)) {
      this.savedOnReleaseKeys.delete(key)
    } else console.warn(this.adrStr + 'no such key registered.')
  }
}
