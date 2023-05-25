import * as three from 'three'

export enum Tile {
  Nothing = 0,
  Floor, // Red colored tile
  Grass,
  Water,
  Dirt
}

export interface TileOptions {
  position: three.Vector2
  type: number | Tile
  size?: number
}

/**
 * Tile Object3D instance to put it into the scene. Please use hte addTo
 * method for it
 * @todo Should get tile model instead of the default plane that is
 * rotated to face positive Z.
 */
export class TileModel {
  public readonly type: Tile
  private readonly model: three.Mesh

  constructor(options: TileOptions) {
    const geometry = new three.PlaneGeometry(
      options.size ? options.size : 1,
      options.size ? options.size : 1
    )
    this.type = options.type

    const color = `#${(this.type * 10).toString().repeat(2)}${this.type * 20}`
    console.log('tile color: ', color)
    const material = new three.MeshToonMaterial({
      color
    })
    this.model = new three.Mesh(geometry, material)
    this.model.up.set(0, 0, 1)
    this.model.rotateX(three.MathUtils.degToRad(-90))
    const pos = new three.Vector3(options.position.x, 0, options.position.y)
    this.model.position.copy(pos) // Ignore the error
  }

  public get position(): three.Vector2 {
    return new three.Vector2(this.model.position.x, this.model.position.y)
  }

  public set position(value: three.Vector2) {
    const pos = new three.Vector3(value.x, value.y, 0)
    this.model.position.copy(pos) // Ignore the error
  }

  public get size(): number {
    const { x } = this.model.scale
    return x
  }

  public set size(value: number) {
    this.model.scale.set(value, value, 1)
  }

  public addTo(scene: three.Scene): void {
    scene.add(this.model)
  }

  public removeFrom(scene: three.Scene): void {
    scene.remove(this.model)
  }
}
