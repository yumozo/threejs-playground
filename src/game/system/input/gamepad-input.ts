import { IUpdatable } from "@game/system/interface/IUpdatable"

export interface GamepadMapping {
  [key: string]: string
}

/**
 * provides methods to check the state of gamepad buttons and axes, as well as
 * update the input in real-time.
 * Stores the state of both buttons and axes in separate objects.
 */
export class GamepadInput implements IUpdatable {
  private controller: Gamepad | null = null
  private readonly mapping: GamepadMapping
  private readonly axesData: { [axis: string]: number } = {}
  private readonly buttonsPressed: { [button: string]: boolean } = {}

  constructor(mapping: GamepadMapping) {
    // BINDS
    this.connectGamepad = this.connectGamepad.bind(this)
    this.disconnectGamepad = this.disconnectGamepad.bind(this)
    this.isButtonPressed = this.isButtonPressed.bind(this)
    this.getAxis = this.getAxis.bind(this)

    this.mapping = mapping
  }

  public update() {
    // console.log('Gamepad button pressed: ', this.buttonsPressed)
    if (this.controller) {
      this.setAxes(this.controller.axes as number[])
      this.controller.buttons.forEach((button, index) => {
        this.setButtonPressed(index, button.pressed)
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
    // console.log('[GamepadInput]: button name: ', buttonName)
    // console.log('[GamepadInput]: is button pressed: ', !!this.buttonsPressed[buttonName])
    return !!this.buttonsPressed[buttonName]
  }

  public getAxis(axisName: string): number {
    console.log('[GamepadInput]: axis name: ', axisName)
    return this.axesData[axisName] || 0
  }

  private setAxes(axes: Array<number>) {
    // update axes data
    axes.forEach((axisValue, index) => {
      this.axesData['GamepadAxis' + index] = axisValue
    })
  }

  private setButtonPressed(buttonIndex: number, pressed: boolean) {
    // update button pressed data
    const buttonName = this.mapping['GamepadButton' + buttonIndex]
    if (buttonName) {
      this.buttonsPressed[buttonName] = pressed
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
