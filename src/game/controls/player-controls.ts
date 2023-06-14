import * as three from 'three'
import { ObjectControls } from './object-controls'
import { InputManager } from '../system/input/input-manager'

export class PlayerControl extends ObjectControls {
  private isJumping: boolean
  private isMovingLeft: boolean
  private isMovingRight: boolean
  private isFalling: boolean

  private GROUND_LEVEL: number = 0

  constructor(object: three.Object3D) {
    super(object)

    // BINDS
    this.update = this.update.bind(this)
    this.setJumping = this.setJumping.bind(this)
    // this.isFalling = this.isFalling.bind(this)
    this.setMovingLeft = this.setMovingLeft.bind(this)
    this.setMovingRight = this.setMovingRight.bind(this)
    this.setupControls = this.setupControls.bind(this)

    // this.input = input
    this.isJumping = false
    this.isMovingLeft = false
    this.isMovingRight = false
    this.isFalling = false
  }
  public override update(time: number) {
    super.update(time)

    // If above the ground don't allow to jump
    if (this.position.y > 0) {
      this.isJumping = false
    }

    // Apply gravity and check for falling status
    if (this.position.y > this.GROUND_LEVEL || this.velocity.y > 0) {
      // Only apply gravity if the player is above the ground or moving upwards

      this.velocity.y -= 9.8 * time
    } else {
      // If the player is below the ground, stop its velocity and reset falling status
      this.velocity.y = 0
      this.position.y = this.GROUND_LEVEL
      /* this.falling = false */
    }

    if (this.velocity.y < 0) {
      // If the player is moving downwards and is not already falling, set falling to true
      this.isFalling = true
    } else {
      this.isFalling = false
    }

    // Jumping logic
    if (this.isJumping && !this.isFalling) {
      this.velocity.y = 5
      this.isJumping = false
    }

    // Set the object position based on the computed velocity
    const vel = this.velocity.clone()
    this.position.add(vel.multiplyScalar(time))
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
    inputManager.registerKeyDown('A', () => this.setJumping(true), true, true)
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
  // private isFalling() {
  //   return this.velocity.y < 0
  // }

  // dispose() {
  //   document.removeEventListener('keydown', this.onKeyDown)
  // }
}
