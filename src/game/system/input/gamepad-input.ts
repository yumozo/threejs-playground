import { Updatable } from '@game/system/updatable'

export interface GamepadMapping {
  [key: string]: string
}

export type GamepadStick = 'left' | 'right'

/**
 * provides methods to check the state of gamepad buttons and axes, as well as
 * update the input in real-time.
 * Stores the state of both buttons and axes in separate objects.
 */
export class GamepadInput implements Updatable {
  public controller: Gamepad | null = null
  public readonly mapping: GamepadMapping
  private readonly axesData: { [axis: string]: number } = {}
  private readonly buttonsData: { [button: string]: number } = {}

  private hasLeftStick: boolean = false
  private hasRightStick: boolean = false

  constructor(mapping: GamepadMapping) {
    // BINDINGS
    this.update = this.update.bind(this)
    this.connectGamepad = this.connectGamepad.bind(this)
    this.disconnectGamepad = this.disconnectGamepad.bind(this)
    this.isButtonPressed = this.isButtonPressed.bind(this)
    this.getAxis = this.getAxis.bind(this)
    this.getButton = this.getButton.bind(this)
    this.setAxes = this.setAxes.bind(this)
    this.setButton = this.setButton.bind(this)

    // SETTINGS
    this.mapping = mapping

    // HANDLE GAMEPAD CONNECTION
    window.addEventListener('gamepadconnected', (e) => {
      const controller = e.gamepad
      this.connectGamepad(controller)
    })
    window.addEventListener('gamepaddisconnected', (e) => {
      const controller = e.gamepad
      this.disconnectGamepad(controller)
    })
  }

  public update() {
    if (this.controller) {
      this.setAxes(this.controller.axes as number[])
      this.controller.buttons.forEach((button, index) => {
        this.setButton(index, button.value)
      })
    }
  }

  public connectGamepad(controller: Gamepad) {
    if (controller.mapping === 'standard') {
      this.controller = controller
      // add an update loop to handle gamepad input
      // requestAnimationFrame(() => this.updateGamepadInput())
    }
  }

  public disconnectGamepad(controller: Gamepad) {
    if (controller === this.controller) {
      this.controller = null
    }
  }

  public isButtonPressed(buttonName: string): boolean {
    return !!this.buttonsData[buttonName]
  }

  public getButton(buttonName: string): number {
    return this.buttonsData[buttonName]
  }

  public getAxis(axisName: string): number {
    return this.axesData[axisName] || 0
  }

  private setAxes(axes: Array<number>) {
    // update axes data
    axes.forEach((axisValue, axisIndex) => {
      const axisName = this.mapping['GamepadAxis' + axisIndex]
      if (axisName) {
        this.axesData[axisName] = axisValue
      } else {
        throw new Error('[GamepadInput/setButtonPressed]: button is not found in the mapping.')
      }

      // ---

      // this.axesData['GamepadAxis' + index] = axisValue
    })
  }

  /**
   * @todo Is not implemented yet.
   */
  private setStick(stick: GamepadStick) {
    for (const axis in this.axesData) {
      if (stick === 'left' && axis.startsWith('LS_')) {
        // set the left stick
      } else if (stick === 'right' && axis.startsWith('RS_')) {
        // set the right stick
      }
    }
  }

  private setButton(buttonIndex: number, pressed: number) {
    // update button pressed data
    const buttonName = this.mapping['GamepadButton' + buttonIndex]
    if (buttonName) {
      this.buttonsData[buttonName] = pressed
    } else {
      throw new Error('[GamepadInput/setButtonPressed]: button is not found in the mapping.')
    }
  }

  // /**
  //  * Start update loop
  //  */
  // private updateGamepadInput() {
  //   console.log('Gamepad button pressed: ', this.buttonsPressed)
  //   if (this.controller) {
  //     this.setAxes(this.controller.axes as number[])
  //     this.controller.buttons.forEach((button, index) => {
  //       this.setButtonPressed(index, button.pressed)
  //     })
  //   }
  //   requestAnimationFrame(() => this.updateGamepadInput())
  // }
}
