import * as three from 'three'

export interface TileOptions {
  position: three.Vector2
  size: number
  color: number | string
}

export class Tile {
  private readonly mesh: three.Mesh

  constructor(options: TileOptions) {
    const tileGeometry = new three.PlaneGeometry(options.size, options.size)
    const tileMaterial = new three.MeshToonMaterial({ color: options.color })
    this.mesh = new three.Mesh(tileGeometry, tileMaterial)
    this.mesh.position.copy(options.position)
  }
  public get position(): three.Vector2 {
    return new three.Vector2(this.mesh.position.x, this.mesh.position.y)
  }
  public set position(value: three.Vector2) {
    this.mesh.position.copy(value)
  }
  public get size(): number {
    const { x } = this.mesh.scale
    return x
  }
  public set size(value: number) {
    this.mesh.scale.set(value, value, 1)
  }
  public addTo(scene: three.Scene): void {
    scene.add(this.mesh)
  }
  public removeFrom(scene: three.Scene): void {
    scene.remove(this.mesh)
  }
}
