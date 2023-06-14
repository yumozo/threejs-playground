import * as three from 'three'
import { ObjectControls } from '@game/controls/object-controls'
import { TileType } from '@game/objects/tile-object'
import { Updatable } from '@game/system/updatable'
import { ModelLoader } from '@game/system/model-loader'
import { AnimatedModel } from '@game/system/rendering/mesh'

export interface GameObjectConfig {
  name: string
  // model?: three.Object3D | string
  speed?: number
  position?: three.Vector3
}

export class GameObject implements Updatable {
  public readonly name: string
  public readonly loader: any
  public readonly controls: ObjectControls | undefined = undefined

  protected position: three.Vector3
  protected type: any | TileType
  protected modelLoader: ModelLoader
  protected lookDirection: three.Vector3
  protected model: three.Object3D | undefined = undefined

  constructor(config: GameObjectConfig) {
    // BINDS
    this.update = this.update.bind(this)
    this.onModelLoad = this.onModelLoad.bind(this)
    this.getPosition = this.getPosition.bind(this)
    this.setPosition = this.setPosition.bind(this)

    this.modelLoader = ModelLoader.getInstance()

    // Settings
    this.name = config.name || 'noname'
    // fucin use the clone method, I've lost two weeks on that!
    this.position = config.position ? config.position.clone() : new three.Vector3()
    // this.model = this.modelLoader.models.get(this.name)

    // Look forward at spawn
    this.lookDirection = new three.Vector3(1, 1, 0)
    this.lookDirection.normalize()
  }

  public loadModel(url: string, scene: three.Scene) {
    this.modelLoader.loadModel(url, this, scene, this.onModelLoad)
  }

  protected onModelLoad(): void {
    const model = this.modelLoader.getModel(this.name)
    console.log(
      `[GameObject/onModelLoad] ${this.name}: Pos as prop -> (${this.position.x} ${this.position.y} ${this.position.z})`
    )
    model.position.copy(this.position)
    this.model = model
    if (this.position && this.model) {
      this.model.position.copy(this.position)
      console.log(
        `[GameObject/onModelLoad] ${this.name}: Pos of model -> (${this.model.position.x} ${this.model.position.y} ${this.model.position.z})`
      )
    } else {
      throw new Error(`[GameObject/onModelLoad] ${this.name}: No position or model provided.`)
    }
  }

  public getPosition(): three.Vector3 {
    if (this.model === undefined) {
      return this.position
    } else {
      return new three.Vector3(this.model.position.x, this.model.position.y, this.model.position.z)
    }
  }

  public setPosition(value: three.Vector3) {
    this.position = new three.Vector3(value.x, value.y, value.z)
    if (this.model) {
      this.model.position.copy(this.position)
    } else {
      throw new Error(`[GameObject/setPosition] ${this.name}: No model loaded.`)
    }
  }

  /**
   * Update frame...
   */
  public update(time: number): void {
    if (this.model) {
      if (this.model.position !== this.position) {
        this.controls?.update(time)
      }
    } else {
      console.warn(`[GameObject/update] ${this.name}: No model loaded.`)
    }
  }

  public addTo(scene: three.Scene): void {
    if (this.model) {
      scene.add(this.model)
    } else {
      throw new Error(`[GameObject/addTo] ${this.name}: Model is undefined`)
    }
  }
}
