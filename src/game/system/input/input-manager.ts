import { gamepad_mapping } from '@game/system/config/gp_mapping'
import { Updatable } from '@game/system/updatable'
import { GamepadInput, GamepadStick } from '@game/system/input/gamepad-input'

interface GamepadAxis {
  axis: number
  direction: 'positive' | 'negative'
}

/**
 * Manages keyboard and gamepad input events and* provides event registration
 * methods.
 * @todo *Separate into two
 */
export class InputManager implements Updatable {
  /**
   * The gamepad input object for processing gamepad events.
   */
  public readonly gamepadInput: GamepadInput

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
  private readonly savedGamepadAxes: Map<string, Function>
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
  private prevXValue = 0
  private prevYValue = 0

  private listeners: { [eventName: string]: ((...args: any[]) => void)[] } = {}

  private constructor() {
    // BINDINGS
    this.update = this.update.bind(this)
    this.registerKeyDown = this.registerKeyDown.bind(this)

    this.register = this.register.bind(this)
    this.unregister = this.unregister.bind(this)
    this.connectGamepad = this.connectGamepad.bind(this)
    this.disconnectGamepad = this.disconnectGamepad.bind(this)

    // SETTINGS
    this.gamepadInput = new GamepadInput(gamepad_mapping)
    this.savedOnDownKeysAsStr = new Set()
    this.savedOnDownKeysAsNum = new Set()
    this.savedOnReleaseKeys = new Set()
    this.savedGamepadButtonsPress = new Map()
    this.savedGamepadButtonsDown = new Map()
    this.prevGamepadState = new Map()
    this.savedGamepadAxes = new Map()

    // TESTING ⬇️
    // HANDLE GAMEPAD CONNECTION
    window.addEventListener('gamepadconnected', (e) => {
      // const controller = e.gamepad
      this.connectGamepad(e)
    })
    window.addEventListener('gamepaddisconnected', (e) => {
      // const controller = e.gamepad
      this.disconnectGamepad(e)
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
    // if (this.gamepadInput.hasLeftStick()) {
    //   const x = this.gamepadInput.getAxis('leftStickX')
    //   const y = this.gamepadInput.getAxis('leftStickY')
    //   if (x !== 0 || y !== 0) {
    //     this.playerControl.ph_move(x, -y)
    //   }
    // } else
    for (const axis in this.savedGamepadAxes) {
      const value = this.gamepadInput.getAxis(axis)
      console.log('[InputManager/update]: axis value is ', value)
      if (value !== 0) {
        const action = this.savedGamepadAxes[axis]
        if (action) {
          action(value)
          console.log('action is ', action, ' and the value is ', value)
        } else {
          // console.log(action)
        }
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
  public registerKeyDown(
    key: string | number | GamepadAxis,
    action: Function,
    gamepadKey = false,
    gamepadDown = false,
    axis = false
  ) {
    // Check for key type
    if (typeof key === 'string') {
      // Check if for gamepad
      if (gamepadKey) {
        // pressed down, but not held down: event fires once button was pressed
        if (gamepadDown) {
          if (this.savedGamepadButtonsDown.has(key)) return
          this.savedGamepadButtonsDown[key] = action
        } else {
          if (this.savedGamepadButtonsPress.has(key)) return
          this.savedGamepadButtonsPress[key] = action
        }
      } else if (axis) {
        // const { axis, direction } = key

        // if (this.savedGamepadAxes.has(axis + direction)) return
        if (this.savedGamepadAxes.has(key)) return

        // const sign = direction === 'negative' ? -1 : 1
        // this.savedGamepadAxes.set(axis + direction, () => action(sign * this.gamepad.axes[axis]))

        this.savedGamepadAxes[key] = action
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
      // } else if (typeof key === 'object' && 'axis' in key) {
      // } else if (typeof key === 'string') {
    } else {
      throw new Error('[InputManager/registerKeyDown]: Invalid key value.')
    }
    console.log('[InputManager]: ' + `key ${key} registered.`)
  }

  public registerGamepadStick(
    // stick: GamepadStick,
    xAxis: string,
    yAxis: string,
    action: Function,
    deadzone: number = 0.1
  ): void {
    // const xAxis = `${stick}.x`
    // const yAxis = `${stick}.y`
    let xValue: number
    let yValue: number

    this.registerKeyDown(
      xAxis,
      (value: number) => {
        xValue = Math.abs(value) < deadzone ? 0 : value
        if (0 === xValue && 0 === yValue) return
        this.prevXValue = xValue
        action(this.prevXValue, this.prevYValue)
      },
      false,
      false,
      true
    )

    this.registerKeyDown(
      yAxis,
      (value: number) => {
        yValue = Math.abs(value) < deadzone ? 0 : -value
        if (0 === yValue && 0 === xValue) return
        this.prevYValue = yValue
        action(this.prevXValue, this.prevYValue)
      },
      false,
      false,
      true
    )
  }

  // public registerGamepadStick(
  //   gamepadStick: GamepadStick,
  //   action: (x: number, y: number) => {}
  // ): void {
  //   // Check for key type

  //   if (this.savedAxis.has(gamepadAxis)) return // savedAxis
  //   // if (this.savedAxis[gamepadAxis]) return

  //   this.savedAxis[gamepadAxis] = action

  //   // Add axis to saved
  //   this.savedAxis.add(gamepadAxis)
  //   console.log('[InputManager/registerGamepadStick]: ' + `Axis ${gamepadAxis} registered.`)
  //   // } else {
  //   //   // Invalid key type
  //   //   throw new Error('[InputManager/registerGamepadStick]: Invalid gamepadStick argument value.')
  //   // }
  // }

  /**
   *  @todo not implemented. Check if the button was registered, reset. If wasn't throw an error.
   */
  public resetKeyDown(
    key: string | number | GamepadAxis,
    action: Function,
    gamepadKey = false,
    gamepadDown = false
  ) {}

  /**
   * @todo Not implemented. Save current controls settings into JSON or whatever.
   */
  public saveSettings() {}

  // WIP⬇️

  public removeOnKeyDown(key: string) {
    if (this.savedOnDownKeys.has(key)) {
      this.savedOnDownKeys.delete(key)
    } else console.warn('[InputManager]: ' + 'no such key registered on press.')
  }

  public onKeyUp(key: string, func: Function) {
    if (this.savedOnReleaseKeys.has(key)) return
    window.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.which === key) {
        func()
      }
    })
    this.savedOnReleaseKeys.add(key)
    console.log('[InputManager]: ' + `key ${key} registered on release.`)
  }

  public removeOnKeyUp(key: string) {
    if (this.savedOnReleaseKeys.has(key)) {
      this.savedOnReleaseKeys.delete(key)
    } else console.warn('[InputManager]: ' + 'no such key registered.')
  }

  // ---

  public register(eventType: string, listener: (...args: any[]) => void) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = []
    }
    this.listeners[eventType].push(listener)
    console.log('on register: ', this.listeners[eventType])
  }

  public unregister(eventType: string, listener: (...args: any[]) => void) {
    if (this.listeners[eventType]) {
      this.listeners[eventType] = this.listeners[eventType].filter((l) => l !== listener)
    }
    console.log('on unregister: ', this.listeners[eventType])
  }

  public connectGamepad = (event: GamepadEvent) => {
    this.gamepadInput.connectGamepad(event.gamepad)
    this.emit('gamepadconnected', event)
  }

  public disconnectGamepad = (event: GamepadEvent) => {
    this.gamepadInput.disconnectGamepad(event.gamepad)
    this.emit('gamepaddisconnected', event)
  }

  private emit(eventName: string, ...args: any[]) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach((listener) => {
        listener(...args)
      })
    }
  }
}
