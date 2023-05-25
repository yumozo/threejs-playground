import * as three from 'three'

export class GameCamera {
  public positionX: number
  public positionY: number
  private width: number
  private height: number
  private aspectRatio: number
  private viewSize: number
  private readonly camera: three.OrthographicCamera

  constructor(
    width: number,
    height: number,
    viewSize = 40,
    aspectRatio = width / height
  ) {
    // BINDS
    this.rotateCameraOnCenter = this.rotateCameraOnCenter.bind(this)
    this.getCamera = this.getCamera.bind(this)
    this.update = this.update.bind(this)
    this.moveCameraUp = this.moveCameraUp.bind(this)
    this.moveCameraDown = this.moveCameraDown.bind(this)
    this.moveCameraRight = this.moveCameraRight.bind(this)
    this.moveCameraLeft = this.moveCameraLeft.bind(this)
    this.add = this.add.bind(this)

    // SETTINGS
    this.width = width
    this.height = height
    this.aspectRatio = aspectRatio
    this.viewSize = viewSize

    // Creating camera object
    this.camera = new three.OrthographicCamera(
      (this.width / -this.viewSize) * this.aspectRatio,
      (this.width / this.viewSize) * this.aspectRatio,
      (this.height / this.viewSize) * this.aspectRatio,
      (this.height / -this.viewSize) * this.aspectRatio,
      0.1,
      50
    )

    this.camera.position.set(5, 5, -5)
    this.camera.up.set(0, 1, 0)
    // this.camera
    // this.camera.position.set(-5, -5, 5)
    // this.camera.rotation.set(90, 0, 10)
    this.camera.lookAt(0, 0, 0)
    this.camera.zoom = 3
  }

  public update(canvas) {
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const aspect = canvas.clientWidth / canvas.clientHeight

    this.camera.left = (width / -this.viewSize) * aspect
    this.camera.right = (width / this.viewSize) * aspect
    this.camera.top = (height / this.viewSize) * aspect
    this.camera.bottom = (height / -this.viewSize) * aspect
    this.camera.updateProjectionMatrix()
  }

  public setPosition(target: any) {
    if (arguments[0] instanceof three.Vector3) {
      this.camera.position.copy(target as three.Vector3)
    } else if (
      arguments.length === 3 &&
      typeof arguments[0] &&
      typeof arguments[1] &&
      typeof arguments[2] === 'number'
    ) {
      let [x, y, z] = arguments
      this.camera.position.set(x, y, z)
    }
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

    this.camera.applyQuaternion(qm)
    this.camera.quaternion.normalize()
    this.camera.position.applyQuaternion(qm)
    this.camera.position.normalize()

    // Preserve the distance of the camera from the origin
    this.camera.position.multiplyScalar(new three.Vector3(5, 5, 5).length())

    console.log(this.camera.position)
    console.log(this.camera.rotation, '---\n')
  }

  public moveCameraUp() {
    this.camera.position.z -= 0.1
    this.camera.position.x += 0.1

    console.log(this.camera.position)
    console.log(this.camera.rotation, '---\n')
  }
  public moveCameraDown() {
    this.camera.position.z += 0.1
    this.camera.position.x -= 0.1

    console.log(this.camera.position)
    console.log(this.camera.rotation, '---\n')
  }
  public moveCameraRight() {
    this.camera.position.x -= 0.1
    this.camera.position.z -= 0.1

    console.log(this.camera.position)
    console.log(this.camera.rotation, '---\n')
  }
  public moveCameraLeft() {
    this.camera.position.x += 0.1
    this.camera.position.z += 0.1

    console.log(this.camera.position)
    console.log(this.camera.rotation, '---\n')
  }

  public add(target: any) {
    this.camera.add(target)
  }

  public getCamera() {
    return this.camera
  }
}
