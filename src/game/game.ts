import * as three from 'three'

import { createRenderer } from './system/renderer'
import { GameCamera } from './components/game-camera'
import { createGizmo } from './components/gizmo'
import { createLight as createDirectionalLight } from './components/light'
import { InputManager } from './system/input/input-manager'

import LevelEditor from './level-editor/level-editor'

import girl_model from '@assets/girl/rigged_girl.glb'
import slime_model from '@assets/slime/slime.glb'
import { JSON_map_example } from './JSON_map_example'
import { Loop } from '@game/system/loop'
import { TileMap } from '@game/level-editor/tile-map'
import { PlayerObject } from '@game/game_objects/player-object'
import { ModelLoader } from './system/model-loader'
import { GameObject } from './game_objects/game-object'
import {GameScene} from "./system/game-scene"

export class Game {
  public updatables: any[]

  // Should be in the camera class ⬇️
  private width: number
  private height: number
  private aspectRatio: number
  // Should be in the renderer class ⬇️
  private canvas: HTMLCanvasElement
  private sceneContainer: HTMLElement
  // OK ⬇️
  private loop: Loop
  private inputManager: InputManager
  private readonly viewSize: number // ❔ to the camera
  private readonly renderer: three.WebGLRenderer
  private readonly scene: three.Scene
  private readonly camera: GameCamera
  private readonly levelEditor: LevelEditor

  constructor(container: HTMLElement) {
    // BINDS
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)

    // SETTINGS
    // Settings container element to put the canvas there
    this.sceneContainer = container
    // Viewport settings
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.aspectRatio = this.width / this.height
    this.viewSize = 40

    // SCENE
    this.scene = new three.Scene()
    this.inputManager = InputManager.getInstance()

    // CAMERA
    this.camera = new GameCamera(
      this.width,
      this.height,
      this.viewSize,
      this.aspectRatio
    )

    // RENDERER
    this.renderer = createRenderer()

    // GAME LOOP
    const gameScene = new GameScene(this.scene)
    this.loop = new Loop(this.camera, gameScene, this.renderer)
    this.loop.setInputManager(this.inputManager)

    // LEVEL
    this.levelEditor = new LevelEditor(this.scene)
    const map = new TileMap(JSON_map_example.layers[0].data, 10)
    this.levelEditor.setMap(map)

    // LIGHT
    const light = createDirectionalLight()
    this.scene.add(light)
    this.scene.add(light.target)
  }

  start(): void {
    this.updatables = []

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

    // Start game loop
    this.loop.start()
  }

  stop(): void {
    this.loop.stop()
  }

  private renderLevel() {
    this.levelEditor.populateMap()
    const modelLoader = ModelLoader.getInstance()

    console.log(this.scene.children)
  }
}
