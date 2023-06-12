import { InputManager } from '@game/system/input/input-manager'
import { ObjectControls } from './object-controls'
import * as three from 'three'
import { GameCamera } from '@game/components/game-camera'

/**
 * @todo Can't reach this.object on init because of camera load takes for too long (I believe).
 */
export class CameraContols extends ObjectControls {
  private readonly camera: GameCamera

  constructor(camera: GameCamera) {
    super(camera.getCamera())
    // BINDS
    this.rotateCameraOnCenter = this.rotateCameraOnCenter.bind(this)

    // Settings
    this.camera = camera
    // document.addEventListener('mousemove', this.onMouseMove)
    this.handleWheel()
    this.setupControls()
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

    // CHECK THE PlayerObject update FUNCTION❗❗❗

    // this.object.applyQuaternion(qm)
    // this.object.quaternion.normalize()
    // this.object.position.applyQuaternion(qm)
    // this.object.position.normalize()
    const camera = this.camera.getCamera()
    const position = camera.position.clone()
    // const rotation = camera.rotation.clone()

    // camera.position.set(0, 0, 0)

    camera.applyQuaternion(qm)
    camera.quaternion.normalize()

    // console.log('init: ', position)
    position.applyQuaternion(qm)
    console.log(position)
    camera.position.copy(position)

    // console.log('after: ', position, camera.position)

    // this.camera.getCamera().position.applyQuaternion(qm)
    // this.camera.getCamera().position.normalize()

    // this.camera.getCamera().

    // Preserve the distance of the camera from the origin
    // this.object.position.multiplyScalar(new three.Vector3(5, 5, 5).length())
    // this.camera.getCamera().position.multiplyScalar(new three.Vector3(5, 5, 5).length())

    // console.log(this.object.position)
    // console.log(this.object.rotation, '---\n')
  }

  public setupControls() {
    const inputManager = InputManager.getInstance()
    // KEYBOARD
    inputManager.registerKeyDown('y', () => {
      this.rotateCameraOnCenter('left')
    })
    inputManager.registerKeyDown('o', () => {
      this.rotateCameraOnCenter('right')
    })
    // XBOX CONTROLLER
    inputManager.registerKeyDown('LB', () => this.rotateCameraOnCenter('left'), true, true)
    inputManager.registerKeyDown('RB', () => this.rotateCameraOnCenter('right'), true, true)
  }

  private handleWheel() {
    // WHEEL
    let scaleSpeed = 0.0
    window.addEventListener('wheel', (e) => {
      scaleSpeed = e.deltaY * (Math.PI / 180) * 0.2
      this.camera.getCamera().zoom += -1.0 * scaleSpeed
    })
  }
}
