import { GameObject, GameObjectConfig } from '@game/objects/game-object'
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

    // SETTINGS
    this.type = options.type
  }

  public get size(): number {
    if (this.model) {
      const { x } = this.model.scale
      return x
    } else {
      throw new Error('[TileObject/get size]: No model loaded.')
    }
  }

  public set size(value: number) {
    if (this.model) {
      this.model.scale.set(value, value, 1)
    } else {
      throw new Error('[TileObject/set size]: No model loaded.')
    }
  }

  public override loadModel(url: string | undefined, scene: three.Scene) {
    this.modelLoader.loadTileModel(this, scene, this.onModelLoad)
  }

  // protected override onModelLoad(): void {
  //   this.model = this.modelLoader.getModel(this.name)
  //   if (this.position && this.model) {
  //     this.model.position.copy(this.position)
  //     console.log(`[TileObject/onModelLoad]: Pos ${this.name} -> ${this.model.position}`)
  //   } else {
  //     throw new Error('[TileObject/onModelLoad]: No model provided.')
  //   }
  // }

  /**
   * @todo It would be nice to update the model somehow.
   */
  public override update(time: number): void {
    if (this.model) {
      // this.position = this.model?.position
      this.model.position.copy(this.position)
    } else {
      throw new Error('[TileObject/update]: No model loaded.')
    }
  }

  public addTo(scene: three.Scene): void {
    if (this.model) {
      scene.add(this.model)
    } else {
      throw new Error('[TileObject/addTo]: No model loaded.')
    }
  }

  public removeFrom(scene: three.Scene): void {
    if (this.model) {
      scene.remove(this.model)
    } else {
      throw new Error('[TileObject/removeFrom]: No model loaded.')
    }
  }
}
