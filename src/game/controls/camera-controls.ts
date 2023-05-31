import { InputManager } from '@game/system/input/input-manager'
import { ObjectControls } from './object-controls'
import * as three from 'three'

export class CameraContols extends ObjectControls {
  constructor(camera: three.Camera) {
    super(camera)

    // BINDS
    this.rotateCameraOnCenter = this.rotateCameraOnCenter.bind(this)

    // Settings
    // document.addEventListener('mousemove', this.onMouseMove)
    this.handleWheel()
  }

  public rotateCameraOnCenter(direction: string): void {
    // Y axis to rotate around
    let y: number
    if (direction === 'left') {
      y = -1
    } else if (direction === 'right') {
      y = 1
    } else {
      throw new Error('Invalid argument passed to rotateCameraOnCenter')
    }
    const qm = new three.Quaternion(0, y, 0)

    this.object.applyQuaternion(qm)
    this.object.quaternion.normalize()
    this.object.position.applyQuaternion(qm)
    this.object.position.normalize()

    // Preserve the distance of the camera from the origin
    this.object.position.multiplyScalar(new three.Vector3(5, 5, 5).length())

    console.log(this.object.position)
    console.log(this.object.rotation, '---\n')
  }

  public setupControls() {
    const inputManager = InputManager.getInstance()
    // KEYBOARD
    inputManager.registerKeyDown('y', () => {
      this.object.rotateCameraOnCenter('left')
    })
    inputManager.registerKeyDown('o', () => {
      this.object.rotateCameraOnCenter('right')
    })
    // XBOX CONTROLLER
    inputManager.registerKeyDown(
      'LB',
      () => this.object.rotateCameraOnCenter('left'),
      true,
      true
    )
    inputManager.registerKeyDown(
      'RB',
      () => this.object.rotateCameraOnCenter('right'),
      true,
      true
    )
  }

  private handleWheel() {
    // WHEEL
    let scaleSpeed = 0.0
    window.addEventListener('wheel', (e) => {
      scaleSpeed = e.deltaY * (Math.PI / 180) * 0.2
      this.object.getCamera().zoom += -1.0 * scaleSpeed
    })
  }
}
