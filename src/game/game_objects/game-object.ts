import { ObjectControls } from '@game/controls/object-controls'
import { TileType } from '@game/game_objects/tile-object'
import { IUpdatable } from '@game/system/interface/IUpdatable'
import { ModelLoader } from '@game/system/model-loader'
import { AnimatedModel } from '@game/system/rendering/mesh'
import * as three from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export interface GameObjectConfig {
  name?: string
  // model?: three.Object3D | string
  speed?: number
  position?: three.Vector3
}

export class GameObject implements IUpdatable {
  public readonly name: string
  public readonly loader: any
  public readonly controls: ObjectControls

  protected position: three.Vector3
  protected type: any | TileType
  protected modelLoader: ModelLoader
  protected lookDirection: three.Vector3
  protected model: three.Object3D

  constructor(config?: GameObjectConfig) {
    // BINDS
    this.update = this.update.bind(this)
    this.onModelLoad = this.onModelLoad.bind(this)

    this.modelLoader = ModelLoader.getInstance()

    // Settings
    this.name = config.name || 'noname'
    this.position = config.position || new three.Vector3()
    // this.model = this.modelLoader.models.get(this.name)

    // Look forward at spawn
    this.lookDirection = new three.Vector3(1, 1, 0)
    this.lookDirection.normalize()
  }

  public loadModel(url: string, scene: three.Scene) {
    this.modelLoader.loadModel(url, this, scene, this.onModelLoad)
  }
  
  protected onModelLoad(): void {
    this.model = this.modelLoader.models.get(this.name)
  }

  public getPosition(): three.Vector3 {
    if (!this.model) {
      return this.position
    } else {
      return new three.Vector3(
        this.model.position.x,
        this.model.position.y,
        this.model.position.z
      )
    }
  }

  public setPosition(value: three.Vector3) {
    this.position = new three.Vector3(value.x, value.y, value.z)
    if (this.model) {
      this.model.position.copy(this.position) // Ignore the error
    }
  }
  // public setModel(path: string): Promise<three.Object3D> {
  //   const loader = new GLTFLoader()
  //   return new Promise((resolve, reject) => {
  //     loader.load(
  //       path,
  //       (gltf) => {
  //         const model = gltf.scene
  //         this.model = model
  //         resolve(model)
  //       },
  //       undefined,
  //       (err) => reject(err)
  //     )
  //   })
  // }

  /**
   * Update frame...
   */
  public update(time: number): void {
    // Here, you can update the position, rotation, or any other property of the model.
    // For example, let's move the model to the right by 1 unit per second:
    // const speed = 1 // 1 unit per second
    // const movement = new three.Vector3(speed * time, 0, 0) // Multiply by timeDelta to make movement framerate independent
    // this.model.position.add(movement)
  }

  public addTo(scene: three.Scene): void {
    scene.add(this.model)
  }
}
