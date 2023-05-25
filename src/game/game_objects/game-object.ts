import * as three from 'three'

export interface Config {
  name?: string
  model?: three.Object3D
  speed?: number
}

export class GameObject {
  public name: string
  public loader: any

  protected speed: number
  protected lookDirection: three.Vector3
  protected model: three.Object3D

  // controls

  constructor(config?: Config) {
    // BINDS
    this.moveForward = this.moveForward.bind(this)
    this.moveBackward = this.moveBackward.bind(this)
    this.moveRight = this.moveRight.bind(this)
    this.moveLeft = this.moveLeft.bind(this)

    // Settings
    this.name = config.name || 'noname'
    this.model =
      config.model ||
      (() => {
        const geo = new three.BoxGeometry(1)
        const mat = new three.MeshToonMaterial()
        const model = new three.Mesh(geo, mat)
        return model
      })()
    this.speed = config.speed || 0.1

    // Look forward at spawn
    this.lookDirection = new three.Vector3(1, 1, 0)
    this.lookDirection.normalize()
  }

  public update(): void { }

  /**
   * Moves object to the target position
   * @param position Movement target position
   */
  public moveTo(position: three.Vector3): void {
    this.model.position.copy(position)
  }

  protected move(movement: Function, movementVector: three.Vector3) {
    const movementDirection = new three.Vector3()
    movementDirection.subVectors(movementVector, this.model.position)

    console.log('movement direction: ', movementDirection)

    const whereToLook = new three.Vector3()
    
    // Make a move
    movement()
    // Current position + mov.dir. = look direction
    whereToLook.addVectors(this.model.position, movementDirection)
    whereToLook.y = this.model.position.y
    console.log('where to look: ', whereToLook)
    this.model.lookAt(whereToLook)
    console.log('prev pos: ', this.model.position)


    // console.log('current pos: ', this.model.position, '\n')
    // console.log('rot x: ', three.MathUtils.radToDeg(this.model.rotation.x))
    // console.log('rot y: ', three.MathUtils.radToDeg(this.model.rotation.y))
    // console.log('rot z: ', three.MathUtils.radToDeg(this.model.rotation.z))
    // console.log('---')
  }

  moveForward(): void {
    const movementVector = this.model.position.clone()
    // movementVector.x += this.speed
    movementVector.z += this.speed

    const movement = () => {
      this.model.position.copy(movementVector)
    }
    this.move(movement, movementVector)
  }
  moveBackward(): void {
    const movementVector = this.model.position.clone()
    // movementVector.x -= this.speed
    movementVector.z -= this.speed

    const movement = () => {
      this.model.position.copy(movementVector)
    }
    this.move(movement, movementVector)
  }
  moveRight(): void {
    const movementVector = this.model.position.clone()
    // movementVector.x += this.speed
    movementVector.x -= this.speed
    // movementVector.z -= this.speed

    const movement = () => {
      this.model.position.copy(movementVector)
    }
    this.move(movement, movementVector)
  }
  moveLeft(): void {
    const movementVector = this.model.position.clone()
    // movementVector.x -= this.speed
    movementVector.x += this.speed
    // movementVector.z += this.speed

    const movement = () => {
      this.model.position.copy(movementVector)
    }
    this.move(movement, movementVector)
  }

  public spawn(scene: three.Scene): void {
    scene.add(this.model)
  }
}
