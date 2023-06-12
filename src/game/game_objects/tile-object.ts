import { GameObject, GameObjectConfig } from '@game/game_objects/game-object'
import { Updatable } from '@game/system/updatable'
import { ModelLoader } from '@game/system/model-loader'
import * as three from 'three'

export enum TileType {
  Nothing = 0,
  Ground, // Red colored tile
  Grass,
  Water,
  Dirt
}

export interface TileOptions extends GameObjectConfig {
  type: number | TileType
  size?: number
}

/**
 * Represents a tile in the game world.
 */
export class TileObject extends GameObject {
  public readonly type: TileType

  constructor(options: TileOptions) {
    super(options)

    // BINDS
    this.getPosition = this.getPosition.bind(this)
    this.setPosition = this.setPosition.bind(this)

    // SETTINGS
    this.type = options.type || null
  }

  public get size(): number {
    const { x } = this.model.scale
    return x
  }

  public set size(value: number) {
    this.model.scale.set(value, value, 1)
  }

  public override loadModel(url: string, scene: three.Scene) {
    this.modelLoader.loadTileModel(this, scene, this.onModelLoad)
  }

  protected override onModelLoad(): void {
    this.model = this.modelLoader.models.get(this.name)
    this.model.position.copy(this.position)
  }

  /**
   * @todo It would be nice to update the model somehow.
   */
  public update(): void {}

  public addTo(scene: three.Scene): void {
    scene.add(this.model)
  }

  public removeFrom(scene: three.Scene): void {
    scene.remove(this.model)
  }
}
