import * as three from 'three'

import { createRenderer } from './system/renderer'
import { GameCamera } from './components/game-camera'
import { createGizmo } from './components/gizmo'
import { createLight as createDirectionalLight } from './components/light'
import LevelEditor from './level-editor/level-editor'
import { Loop } from '@game/system/loop'
import { TileMap } from '@game/map/tile-map'
import { PlayerObject } from '@game/objects/player-object'
import { ModelLoader } from './system/model-loader'
import { GameObject } from './objects/game-object'
import { GameScene } from '@game/system/game-scene'

import girl_model from '@assets/girl/rigged_girl.glb'
import slime_model from '@assets/slime/slime.glb'
import { JSON_map_example } from './JSON_map_example'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { PassManager } from './system/post-processing/pass-manager'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass'
import { createTestPass } from './system/post-processing/pass-factory'

export class Game {
  // Should be in the camera class ⬇️
  private width: number
  private height: number
  private aspectRatio: number
  // Should be in the renderer class ⬇️
  private canvas: HTMLCanvasElement | undefined
  private sceneContainer: HTMLElement
  // OK ⬇️
  private loop: Loop
  private shaderPassManager: PassManager | undefined
  private readonly viewSize: number // ❔ to the camera
  private readonly renderer: three.WebGLRenderer
  private readonly scene: three.Scene
  private readonly camera: GameCamera
  private readonly levelEditor: LevelEditor
  private readonly composer: EffectComposer

  constructor(container: HTMLElement) {
    // BINDS
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)

    // SETTINGS
    // Setting container element to put the canvas in there
    this.sceneContainer = container
    // Viewport settings
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.aspectRatio = this.width / this.height
    this.viewSize = 40

    // SCENE
    this.scene = new three.Scene()

    // CAMERA
    this.camera = new GameCamera(this.width, this.height, this.viewSize, this.aspectRatio)

    // RENDERER
    this.renderer = createRenderer()

    // EFFECT COMPOSER
    this.composer = new EffectComposer(this.renderer)

    // GAME LOOP
    const gameScene = new GameScene(this.scene)
    this.loop = new Loop(this.camera, gameScene, this.renderer, this.composer)

    // LEVEL EDITOR
    this.levelEditor = new LevelEditor(this.scene)
    const map = new TileMap(JSON_map_example.layers[0].data, 10)
    this.levelEditor.setMap(map)

    // LIGHT
    const light = createDirectionalLight()
    this.scene.add(light)
    this.scene.add(light.target)
  }

  start(): void {
    if (!this.renderer.domElement) return

    // Attach scene to the document
    this.canvas = this.renderer.domElement
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    this.canvas.style.display = 'block'
    this.sceneContainer.appendChild(this.canvas)

    // GAME OBJECTS
    const player = new PlayerObject({ name: 'player', camera: this.camera })
    player.loadModel(girl_model, this.scene)
    const slime_NPC = new GameObject({ name: 'slime_npc' })
    slime_NPC.loadModel(slime_model, this.scene)
    // ModelLoader.getInstance().loadModel(slime_model, slime_NPC, this.scene)

    // GIZMO
    const gizmo = createGizmo()
    this.scene.add(gizmo)

    // LEVEL EDIT (but now is just build it)
    this.renderLevel()

    // EFFECT COMPOSER
    // Setup an EffectComposer for post-processing
    const renderPass = new RenderPass(this.scene, this.camera.getCamera())
    this.composer.addPass(renderPass)

    // Setup a ShaderPassManager to manage shader passes
    this.shaderPassManager = PassManager.getInstance(this.composer)
    // Add a bloom effect with given parameters to the ShaderPassManager
    const bloomPass = new UnrealBloomPass(
      new three.Vector2(window.innerWidth, window.innerHeight), // resolution
      0.2, // strength
      0.1, // radius
      0 // threshold
    )
    this.shaderPassManager.addPass('bloom', bloomPass)

    // Add Pixelation pass
    const renderPixelatedPass = new RenderPixelatedPass(
      2,
      this.scene,
      this.camera.getCamera()
    )
    this.shaderPassManager.addPass('pixel', renderPixelatedPass)

    // Add a custom shader effect to ShaderPassManager
    this.shaderPassManager.addPass(
      'custom_shader', // Identifier string
      createTestPass(/* params */) // Instance of a custom shader pass
    )

    // Remove the previously added custom shader effect from ShaderPassManager
    this.shaderPassManager.removePass('custom_shader')

    // START GAME LOOP
    this.loop.addUpdatable(player)
    this.loop.start()
  }

  stop(): void {
    this.loop.stop()
  }

  private renderLevel() {
    this.levelEditor.populateMap()
  }
}
