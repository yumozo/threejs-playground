import * as three from 'three'
import { ObjectControls } from './object-controls'
import { InputManager } from '../system/input/input-manager'

export class PlayerControl extends ObjectControls {
  private isJumping: boolean
  private isMovingLeft: boolean
  private isMovingRight: boolean

  constructor(object: three.Object3D) {
    super(object)

    // BINDS
    this.update = this.update.bind(this)
    this.setJumping = this.setJumping.bind(this)
    this.setMovingLeft = this.setMovingLeft.bind(this)
    this.setMovingRight = this.setMovingRight.bind(this)

    // this.input = input
    this.isJumping = false
    this.isMovingLeft = false
    this.isMovingRight = false
  }
  update(time: number) {
    // Apply gravity
    this.velocity.y -= 9.8 * time

    // Move left/right
    const acceleration = 10 * time
    if (this.isMovingLeft) {
      this.velocity.x -= acceleration
    }
    if (this.isMovingRight) {
      this.velocity.x += acceleration
    }

    // Jumping logic
    if (this.isJumping && !this.isFalling()) {
      this.velocity.y = 10
    }

    // Set the object position based on the computed velocity
    this.position.add(this.velocity.clone().multiplyScalar(time))
  }

  public setupControls() {
    const inputManager = InputManager.getInstance()
    // KEYBOARD
    inputManager.registerKeyDown('ArrowUp', this.moveForward)
    inputManager.registerKeyDown('ArrowDown', this.moveBackward)
    inputManager.registerKeyDown('ArrowRight', this.moveRight)
    inputManager.registerKeyDown('ArrowLeft', this.moveLeft)
    // inputManager.onKeyUp('ArrowUp', this.arrowUpRelease)

    // XBOX CONTROLLER
    // inputManager.registerKeyDown('LS_HORI', this.ph_moveBackward, false, false, true)
    // inputManager.registerKeyDown('LS_VERT', this.ph_moveLeft, false, false, true)
    // testing this one
    inputManager.registerGamepadStick('LS_HORI', 'LS_VERT', this.ph_move)

    inputManager.registerKeyDown('DPAD_UP', this.moveForward, true, true)
    inputManager.registerKeyDown('DPAD_DOWN', this.moveBackward, true)
    inputManager.registerKeyDown('DPAD_RIGHT', this.moveRight, true)
    inputManager.registerKeyDown('DPAD_LEFT', this.moveLeft, true)
    inputManager.registerKeyDown('X', () => this.setJumping(true), true)
    inputManager.registerKeyDown(
      'BACK',
      () => {
        location.reload()
      },
      true,
      true
    )
  }

  // Setter methods to set state based on user input
  public setJumping(jumping: boolean) {
    this.isJumping = jumping
  }
  public setMovingLeft(movingLeft: boolean) {
    this.isMovingLeft = movingLeft
  }
  public setMovingRight(movingRight: boolean) {
    this.isMovingRight = movingRight
  }

  // Checks if the object is currently falling
  private isFalling() {
    return this.velocity.y < 0
  }

  // dispose() {
  //   document.removeEventListener('keydown', this.onKeyDown)
  // }
}
