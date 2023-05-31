import { IUpdatable } from '@game/system/interface/IUpdatable'
import * as three from 'three'

export class ObjectControls implements IUpdatable {
  // Define initial position and velocity
  protected object: three.Object3D
  protected position: three.Vector3
  protected velocity: three.Vector3
  // For debugging purpose, remove this later.
  // There should be velocity only. remove this later.
  protected speed = 0.1

  protected horizontalAxis: number
  protected verticalAxis: number

  // Constructor to initialize position and velocity
  constructor(object: three.Object3D) {
    // BINDS
    this.moveForward = this.moveForward.bind(this)
    this.moveBackward = this.moveBackward.bind(this)
    this.moveRight = this.moveRight.bind(this)
    this.moveLeft = this.moveLeft.bind(this)

    this.object = object

    // this.position = initialPosition
    this.velocity = new three.Vector3()

    this.horizontalAxis = 0
    this.verticalAxis = 0
  }

  // Updates the position of object based on input
  public update(time: number /* input: Input */) {
    // Implement the logic for moving the object here using user's input
  }

  // WIP ⬇️

  /**
   * Moves object to the target position
   * @param position Movement target position
   */
  public moveTo(position: three.Vector3): void {
    this.object.position.copy(position)
  }

  protected move(movement: Function, movementVector: three.Vector3) {
    const movementDirection = new three.Vector3()
    movementDirection.subVectors(movementVector, this.object.position)

    console.log('movement direction: ', movementDirection)

    const whereToLook = new three.Vector3()

    // Make a move
    movement()
    // Current position + mov.dir. = look direction
    whereToLook.addVectors(this.object.position, movementDirection)
    whereToLook.y = this.object.position.y
    console.log('where to look: ', whereToLook)
    this.object.lookAt(whereToLook)
    console.log('prev pos: ', this.object.position)

    // console.log('current pos: ', this.object.position, '\n')
    // console.log('rot x: ', three.MathUtils.radToDeg(this.object.rotation.x))
    // console.log('rot y: ', three.MathUtils.radToDeg(this.object.rotation.y))
    // console.log('rot z: ', three.MathUtils.radToDeg(this.object.rotation.z))
    // console.log('---')
  }

  moveBy(axisVector: three.Vector2 | three.Vector3): void {
    if (
      !(
        axisVector instanceof three.Vector2 ||
        axisVector instanceof three.Vector3
      )
    ) {
      return
    }
    if (axisVector.x === 0 && axisVector.x === axisVector.y) {
      return
    }
    if (axisVector instanceof three.Vector2) {
      const movementVector = this.object.position.clone()
      movementVector.x += movementVector.x * this.speed
      movementVector.z += movementVector.y * this.speed

      const movement = () => {
        this.object.position.copy(movementVector)
      }
      this.move(movement, movementVector)
    }
    if (axisVector instanceof three.Vector3) {
      console.warn(
        '[GameObject/moveBy]: Moving in 3D is not implemented yet. Please use two-dimensional vector instance.'
      )
    }
  }

  moveForward(): void {
    const movementVector = this.object.position.clone()
    // movementVector.x += this.speed
    movementVector.z += this.speed

    const movement = () => {
      this.object.position.copy(movementVector)
    }
    this.move(movement, movementVector)
  }
  moveBackward(): void {
    const movementVector = this.object.position.clone()
    // movementVector.x -= this.speed
    movementVector.z -= this.speed

    const movement = () => {
      this.object.position.copy(movementVector)
    }
    this.move(movement, movementVector)
  }
  moveRight(): void {
    const movementVector = this.object.position.clone()
    // movementVector.x += this.speed
    movementVector.x -= this.speed
    // movementVector.z -= this.speed

    const movement = () => {
      this.object.position.copy(movementVector)
    }
    this.move(movement, movementVector)
  }
  moveLeft(): void {
    const movementVector = this.object.position.clone()
    // movementVector.x -= this.speed
    movementVector.x += this.speed
    // movementVector.z += this.speed

    const movement = () => {
      this.object.position.copy(movementVector)
    }
    this.move(movement, movementVector)
  }
}
