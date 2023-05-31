import * as three from 'three'
import { ObjectControls } from './object-controls'
import { InputManager } from '../system/input/input-manager'

export class PlayerControl extends ObjectControls {
  // private input: Input
  private isJumping: boolean
  private isMovingLeft: boolean
  private isMovingRight: boolean

  constructor(object: three.Object3D /* input: Input */) {
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
    inputManager.registerKeyDown('y', () => {
      this.camera.rotateCameraOnCenter('left')
    })
    inputManager.registerKeyDown('o', () => {
      this.camera.rotateCameraOnCenter('right')
    })
    // XBOX CONTROLLER
    inputManager.registerKeyDown(
      'DPAD_UP',
      this.moveForward,
      true,
      true
    )
    inputManager.registerKeyDown('DPAD_DOWN', this.moveBackward, true)
    inputManager.registerKeyDown('DPAD_RIGHT', this.moveRight, true)
    inputManager.registerKeyDown('DPAD_LEFT', this.moveLeft, true)
    inputManager.registerKeyDown(
      'X',
      () => this.setJumping(true),
      true
    )
    inputManager.registerKeyDown(
      'LB',
      () => this.camera.rotateCameraOnCenter('left'),
      true,
      true
    )
    inputManager.registerKeyDown(
      'RB',
      () => this.camera.rotateCameraOnCenter('right'),
      true,
      true
    )
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
