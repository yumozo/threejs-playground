import { Clock, Scene, WebGLRenderer } from 'three'
import Stats from 'stats.js'
import { GameCamera } from '@game/components/camera'
import { gamepadAPI } from '../controls/gamepadAPI'

export class Loop {
  private camera: GameCamera
  private scene: Scene
  private renderer: WebGLRenderer
  private readonly updatables: []
  private readonly clock: Clock
  // DEV TOOLS
  private statsFPS: Stats
  private statsMS: Stats

  constructor(camera: GameCamera, scene: Scene, renderer: WebGLRenderer) {
    this.camera = camera
    this.scene = scene
    this.renderer = renderer
    this.clock = new Clock()

    this.updatables = []

    // DEV TOOLS
    // STATISTICS: FPS, ms
    this.statsFPS = new Stats()
    this.statsMS = new Stats()
    this.statsFPS.showPanel(0)
    this.statsMS.showPanel(1)

    document.body.appendChild(this.statsFPS.dom)
    this.statsMS.dom.style.left = '80px'
    document.body.appendChild(this.statsMS.dom)
  }

  public start() {
    this.renderer.setAnimationLoop(() => {
      // Start stats
      this.statsFPS.begin()
      this.statsMS.begin()

      this.tick()

      this.statsFPS.end()
      this.statsMS.end()
      // End stats
    })
  }

  public stop() {
    this.renderer.setAnimationLoop(null)
  }

  private tick() {
    // Only call the getDelta function once per frame!
    const time = this.clock.getDelta()

    gamepadAPI.update()

    const canvas = this.renderer.domElement

    this.camera.update(canvas)

    for (const object of this.updatables) {
      // object.update()
    }

    // Render a frame
    this.renderer.render(this.scene, this.camera.getCamera())
  }
}
