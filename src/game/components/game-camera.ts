import { CameraContols } from '@game/controls/camera-controls'
import * as three from 'three'

export class GameCamera {
  public positionX: number
  public positionY: number
  private width: number
  private height: number
  private aspectRatio: number
  private viewSize: number
  private controls: CameraContols
  private readonly camera: three.OrthographicCamera

  constructor(
    width: number,
    height: number,
    viewSize = 40,
    aspectRatio = width / height
  ) {
    // BINDS
    this.getCamera = this.getCamera.bind(this)
    this.updateView = this.updateView.bind(this)

    // Setup
    this.controls = new CameraContols(this.camera)

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

  public updateView(canvas: HTMLCanvasElement) {
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

  public getCamera() {
    return this.camera
  }
}
