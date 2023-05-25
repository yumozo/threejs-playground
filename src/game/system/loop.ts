import { Clock, Scene, Vector2, WebGLRenderer } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

import Stats from 'stats.js'
import { GameCamera } from '@game/components/camera'
import { gamepadAPI } from '../controls/gamepadAPI'
import { ShaderPassManager } from './post-processing/shader-pass-manager'
import { createTestPass } from './post-processing/shader-pass-factory'

/**
 * Game Loop. Keeps track of animated objects and renders the scene to the
 * camera on each frame.
 */
export class Loop {
  private camera: GameCamera
  private scene: Scene
  private renderer: WebGLRenderer
  private composer: EffectComposer
  private shaderPassManager: ShaderPassManager
  private readonly updatables: []
  private readonly clock: Clock
  // DEV TOOLS
  private statsFPS: Stats
  private statsMS: Stats

  constructor(camera: GameCamera, scene: Scene, renderer: WebGLRenderer) {
    this.camera = camera
    this.scene = scene
    this.renderer = renderer

    // Setup an EffectComposer for post-processing
    this.composer = new EffectComposer(this.renderer)
    const renderPass = new RenderPass(this.scene, this.camera.getCamera())
    this.composer.addPass(renderPass)

    // Setup a ShaderPassManager to manage shader passes
    this.shaderPassManager = new ShaderPassManager(this.composer)

    // Add a bloom effect with given parameters to the ShaderPassManager
    const bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight), // resolution
      0.2, // strength
      0.1, // radius
      0 // threshold
    )
    this.shaderPassManager.addPass('bloom', bloomPass)

    // Add a custom shader effect to the ShaderPassManager
    this.shaderPassManager.addPass(
      'custom_shader', // Identifier string
      createTestPass(/* params */) // Instance of custom shader pass
    )

    /**
     * Remove the previously added custom shader effect from the
     * ShaderPassManager
     */
    this.shaderPassManager.removePass('custom_shader')

    // Init clock
    this.clock = new Clock()

    // Init updatable objects in scene
    this.updatables = []

    // DEV TOOLS
    // STATISTICS: FPS, ms
    this.statsFPS = new Stats()
    this.statsMS = new Stats()
    this.statsFPS.showPanel(0)
    this.statsMS.showPanel(1)

    // Add stats monitors
    document.body.appendChild(this.statsFPS.dom)
    this.statsMS.dom.style.left = '80px'
    document.body.appendChild(this.statsMS.dom)
  }

  /**
   * Sets the animation loop of the renderer and calls the tick() function on
   * each frame, and renders a frame of the scene to the camera.
   */
  public start(): void {
    // Start the game loop
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

  /**
   * Stops the animation loop.
   */
  public stop(): void {
    this.renderer.setAnimationLoop(null)
  }

  /**
   * Calls the function getDelta() from the "clock" object, which returns the
   * time elapsed since the last call of getDelta() and allows an animation to
   * be frame rate independent. The tick() function then calls the tick(delta)
   * function on each object in the updatables array.
   */
  private tick(): void {
    // Only call the getDelta function once per frame!
    const time = this.clock.getDelta()

    gamepadAPI.update()

    const canvas = this.renderer.domElement

    this.camera.update(canvas)

    for (const object of this.updatables) {
      // object.update()
    }

    // Render a frame
    // this.renderer.render(this.scene, this.camera.getCamera())
    this.composer.render()
  }
}
