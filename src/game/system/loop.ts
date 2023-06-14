import { Clock, WebGLRenderer } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'

import Stats from 'stats.js'
import { GameCamera } from '@game/components/game-camera'
import { InputManager } from '@game/system/input/input-manager'
import { GameScene } from './game-scene'
import { Updatable } from './updatable'

/**
 * Game Loop. Keeps track of animated objects and renders the scene to the
 * camera on each frame.
 */
export class Loop {
  public updatables: Updatable[] = []
  private camera: GameCamera
  private scene: GameScene
  private renderer: WebGLRenderer
  private composer: EffectComposer | null
  private readonly clock: Clock
  /**
   * The first component is a function's name and the second is function itself.
   */
  private readonly registeredFunctions: Map<string, Function>
  // DEV TOOLS
  private statsFPS: Stats
  private statsMS: Stats
  // INPUTS
  private inputManager: InputManager

  constructor(
    camera: GameCamera,
    scene: GameScene,
    renderer: WebGLRenderer,
    composer?: EffectComposer
  ) {
    // BINDS
    this.registerFunction = this.registerFunction.bind(this)

    this.camera = camera
    this.scene = scene
    this.renderer = renderer
    this.inputManager = InputManager.getInstance()

    // Init functions to play
    this.registeredFunctions = new Map()

    // Init clock
    this.clock = new Clock()

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

    // Effect composer
    this.composer = composer ? composer : null
    if (this.composer) {
      console.log(`[Loop/ctor]: Composer added.`)
    } else if (this.composer === null) {
      console.log(`[Loop/ctor]: Composer not provided. Using default settings now.`)
    }
  }

  public registerFunction(func: Function) {
    // this.registeredFunctions.set(func.name, func)
    this.registerFunction[func.name] = func
  }

  public setInputManager(inputManger: InputManager) {
    this.inputManager = inputManger
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

  addUpdatable(updatable: Updatable) {
    this.updatables.push(updatable)
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

    // gamepadAPI.update()
    if (this.inputManager) {
      this.inputManager.update()
    }

    const canvas = this.renderer.domElement

    // console.log("[Loop/tick]: 'call' registered functions: ", this.registerFunction)
    for (const funcName in this.registeredFunctions) {
      const func = this.registeredFunctions.get(funcName)
      console.log(`[Loop/tick]: function ${func} should be played`)
      if (func) {
        func(time)
      }
    }

    for (const updatable in this.updatables) {
      const obj = this.updatables[updatable]
      if (obj) {
        obj.update(time)
      } else {
        console.log('[Loop/tick]: no such updatable in the array')
      }
    }

    // Should be in the GameScene
    this.camera.updateView(canvas)

    // Update all the objects in the scene
    this.scene.update(time)

    // Render a frame
    if (this.composer) {
      this.composer.render()
    } else {
      this.renderer.render(this.scene.getScene(), this.camera.getCamera())
    }
  }
}
