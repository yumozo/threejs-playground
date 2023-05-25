import * as three from 'three'

import { createRenderer } from './system/renderer'
import { GameCamera } from './components/camera'
import { createGizmo } from './components/gizmo'
import { createLight as createDirectionalLight } from './components/light'
import { GameObject } from './game_objects/game-object'
import { GameControls } from './controls/controls'

import { TileModel } from './level/tile-model'
import LevelEditor from './level/level-editor'

import girl_model from '@assets/girl/scene.gltf'
import { JSON_map_example } from './JSON_map_example'
import { GLTFLoader_holdAssets } from './system/GLTF_loader'
import { Loop } from './system/loop'
import { TileMap } from './level/tile-map'
import { PlayerObject } from './game_objects/player-object'

export class Game {
  private readonly renderer: three.WebGLRenderer
  private canvas: HTMLCanvasElement
  private readonly scene: three.Scene
  private readonly camera: GameCamera
  private readonly viewSize: number
  private width: number
  private height: number
  private aspectRatio: number
  private readonly levelEditor: LevelEditor
  private controls: GameControls
  private sceneContainer: HTMLElement
  private loop: Loop

  constructor(container: HTMLElement) {
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)

    this.sceneContainer = container

    // SETTINGS
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.aspectRatio = this.width / this.height
    this.viewSize = 40

    // SCENE
    this.scene = new three.Scene()
    this.controls = new GameControls()

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
    this.loop = new Loop(this.camera, this.scene, this.renderer)

    // LEVEL
    this.levelEditor = new LevelEditor(this.scene)
    const map = new TileMap(JSON_map_example.layers[0].data, 10)
    this.levelEditor.setMap(map)
    // const gg = new three.PlaneGeometry(10, 10)
    // const gm = new three.MeshToonMaterial({
    //   color: '#fafef1',
    //   side: three.DoubleSide
    // })
    // const plane = new three.Mesh(gg, gm)
    // plane.receiveShadow = true
    // this.scene.add(plane)

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
    const loader = new GLTFLoader_holdAssets()
    loader.load(
      girl_model,
      {
        binPath: '../assets/girl/scene.bin',
        texturePath: '../assets/girl/textures/Material_baseColor.png'
      },
      (gltf) => {
        // LOAD CHARACTER
        const model = gltf.scene
        console.log(model.rotation)
        const player = new PlayerObject({ name: 'player', model })
        player.attachCamera(this.camera.getCamera())
        player.spawn(this.scene)

        // SETUP CONTROLS
        // Keyboard
        this.controls.registerKeyDown('ArrowUp', player.moveForward)
        this.controls.registerKeyDown('ArrowDown', player.moveBackward)
        this.controls.registerKeyDown('ArrowRight', player.moveRight)
        this.controls.registerKeyDown('ArrowLeft', player.moveLeft)
        this.controls.onKeyUp('ArrowUp', this.arrowUpRelease)
        this.controls.registerKeyDown('y', () => {
          this.camera.rotateCameraOnCenter('left')
        })
        this.controls.registerKeyDown('o', () => {
          this.camera.rotateCameraOnCenter('right')
        })
        // Xbox controller
        this.controls.registerKeyDown('DPAD_UP', player.moveForward, true)
        this.controls.registerKeyDown('DPAD_DOWN', player.moveBackward, true)
        this.controls.registerKeyDown('DPAD_RIGHT', player.moveRight, true)
        this.controls.registerKeyDown('DPAD_LEFT', player.moveLeft, true)
        this.controls.registerKeyDown(
          'LB',
          () => this.camera.rotateCameraOnCenter('left'),
          true
        )
        this.controls.registerKeyDown(
          'RB',
          () => this.camera.rotateCameraOnCenter('right'),
          true
        )
        this.controls.registerKeyDown(
          'BACK',
          () => {
            location.reload()
          },
          true
        )
      },
      undefined,
      (err) => {
        console.error(err)
      }
    )

    // GIZMO
    const gizmo = createGizmo()
    this.scene.add(gizmo)

    // MOUSE
    // document.addEventListener('mousemove', this.onMouseMove)
    this.handleWheel()

    // LEVEL EDIT (but now is just build it)
    this.renderLevel()

    console.log(this.camera.getCamera().position)
    console.log(this.camera.getCamera().rotation, '---\n')

    // Start game loop
    this.loop.start()
  }

  stop(): void {
    this.loop.stop()
  }

  private arrowUpRelease() {
    const buttonW = document.getElementById('overlay-up')
    buttonW.style.backgroundColor = 'var(--steel-blue)'
    buttonW.style.fontSize = '2.25rem'
  }
  private handleWheel() {
    // WHEEL
    let scaleSpeed = 0.0
    window.addEventListener('wheel', (e) => {
      scaleSpeed = e.deltaY * (Math.PI / 180) * 0.2
      this.camera.getCamera().zoom += -1.0 * scaleSpeed
    })
  }

  private renderLevel() {
    this.levelEditor.render()

    console.log(this.scene.children)
  }
}
