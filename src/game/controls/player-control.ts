import * as three from 'three'

class ObjectControl {
  // Define initial position and velocity
  protected position: three.Vector3
  protected velocity: three.Vector3

  // Constructor to initialize position and velocity
  constructor(initialPosition: three.Vector3) {
    this.position = initialPosition
    this.velocity = new three.Vector3()
  }

  // Updates the position of object based on input
  update(deltaTime: number, input: Input) {
    // Implement the logic for moving the object here using user's input
  }
}

export class PlayerControl {
  private object: three.Object3D
  private input: Input
  private control: ObjectControl

  constructor(object: three.Object3D, input: Input) {
    this.object = object
    this.input = input
    this.control = new ObjectControl(object.position.clone())

    // Listen to keyboard input
    onkeydown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          this.control.velocity.y = -1
          break
        case 'KeyS':
          this.control.velocity.y = 1
          break
        case 'KeyA':
          this.control.velocity.x = -1
          break
        case 'KeyD':
          this.control.velocity.x = 1
          break
      }
    }
  }
  update(delta: number) {
    this.control.update(delta, this.input)
    this.object.position.copy(this.control.position)
    this.object.position.y = 0
  }
  dispose() {
    document.removeEventListener('keydown', this.onKeyDown)
  }
}
