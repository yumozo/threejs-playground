import { Updatable } from '@game/system/updatable'
import * as three from 'three'

export class ObjectControls implements Updatable {
  protected object: three.Object3D
  protected position: three.Vector3 = new three.Vector3()
  protected velocity: three.Vector3 // Not used yet
  protected speed = 0.02

  // protected horizontalAxis: number
  // protected verticalAxis: number

  // Constructor to initialize position and velocity
  constructor(object: three.Object3D) {
    // BINDS
    this.moveForward = this.moveForward.bind(this)
    this.moveBackward = this.moveBackward.bind(this)
    this.moveRight = this.moveRight.bind(this)
    this.moveLeft = this.moveLeft.bind(this)
    this.move = this.move.bind(this)
    // experimental
    this.ph_move = this.ph_move.bind(this)
    this.ph_moveForward = this.ph_moveForward.bind(this)
    this.ph_moveBackward = this.ph_moveBackward.bind(this)
    this.ph_moveLeft = this.ph_moveLeft.bind(this)
    this.ph_moveRight = this.ph_moveRight.bind(this)

    this.object = object

    // this.position = initialPosition
    this.velocity = new three.Vector3()

    // this.horizontalAxis = 0
    // this.verticalAxis = 0
  }

  // Updates the position of object based on input
  public update(time: number /* input: Input */) {
    this.object.position.copy(this.position)
  }

  // WIP ⬇️

  /**
   * Moves object to the target position
   * @param position Movement target position
   */
  public moveTo(position: three.Vector3): void {
    this.object.position.copy(position)
  }

  protected move(movement: Function, nextPosition: three.Vector3) {
    const direction = new three.Vector3()
    direction.copy(nextPosition)

    // Calculate the movement vector
    // const currentPosition = this.object.position.clone()
    const currentPosition = this.position
    const movementVector = direction.sub(currentPosition)

    console.log('direction: ', movementVector)

    // Make a move
    movement()

    if (movementVector.length() < 0.01) return
    const whereToLook = new three.Vector3()
    // Current position + movementVector  = look direction
    // whereToLook.addVectors(this.object.position.clone(), movementVector)
    whereToLook.addVectors(this.position, movementVector)

    // Set the rotation
    this.object.lookAt(whereToLook)
  }

  // moveBy(axisVector: three.Vector2 | three.Vector3): void {
  //   if (!(axisVector instanceof three.Vector2 || axisVector instanceof three.Vector3)) {
  //     return
  //   }
  //   if (axisVector.x === 0 && axisVector.x === axisVector.y) {
  //     return
  //   }
  //   if (axisVector instanceof three.Vector2) {
  //     const movementVector = this.object.position.clone()
  //     movementVector.x += movementVector.x * this.speed
  //     movementVector.z += movementVector.y * this.speed

  //     const movement = () => {
  //       this.object.position.copy(movementVector)
  //     }
  //     this.move(movement, movementVector)
  //   }
  //   if (axisVector instanceof three.Vector3) {
  //     console.warn(
  //       '[GameObject/moveBy]: Moving in 3D is not implemented yet. Please use two-dimensional vector instance.'
  //     )
  //   }
  // }

  moveForward(): void {
    // const movementVector = this.object.position.clone()
    const movementVector = this.position.clone()
    movementVector.z += this.speed

    const movement = () => {
      // this.object.position.copy(movementVector)
      this.position.copy(movementVector)
    }
    this.move(movement, movementVector)
  }
  moveBackward(): void {
    // const movementVector = this.object.position.clone()
    const movementVector = this.position.clone()
    movementVector.z -= this.speed

    const movement = () => {
      // this.object.position.copy(movementVector)
      this.position.copy(movementVector)
    }
    this.move(movement, movementVector)
  }
  moveRight(): void {
    // const movementVector = this.object.position.clone()
    const movementVector = this.position.clone()
    movementVector.x -= this.speed

    const movement = () => {
      // this.object.position.copy(movementVector)
      this.position.copy(movementVector)
    }
    this.move(movement, movementVector)
  }
  moveLeft(): void {
    // const movementVector = this.object.position.clone()
    const movementVector = this.position.clone()
    movementVector.x += this.speed

    const movement = () => {
      // this.object.position.copy(movementVector)
      this.position.copy(movementVector)
    }
    this.move(movement, movementVector)
  }

  // VELOCITY
  public ph_move(x: number, y: number): void {
    const velocity = new three.Vector3(-x, 0, y)
    velocity.multiplyScalar(this.speed)

    const movement = () => {
      // this.object.position.add(velocity)
      this.position.add(velocity)
    }

    // this.animate(movement)
    const currentPos = this.object.position.clone()
    const nextPositionVector = currentPos.add(velocity)
    this.move(movement, nextPositionVector)
  }

  public ph_moveForward(value: number): void {
    // const velocity = new three.Vector3(0, 0, -this.speed * value)
    this.ph_move(0, -value)
  }

  public ph_moveBackward(value: number): void {
    // const velocity = new three.Vector3(0, 0, this.speed * value)
    this.ph_move(0, value)
  }

  public ph_moveLeft(value: number): void {
    // const velocity = new three.Vector3(-this.speed * value, 0, 0)
    this.ph_move(-value, 0)
  }

  public ph_moveRight(value: number): void {
    // const velocity = new three.Vector3(this.speed * value, 0, 0)
    this.ph_move(value, 0)
  }
}
