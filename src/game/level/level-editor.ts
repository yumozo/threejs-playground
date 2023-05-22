import * as three from 'three'
import { Tile } from './tile'

export default class LevelEditor {
  readonly selectedMaterial = new three.MeshBasicMaterial({ color: 0xff0000 })
  private readonly tiles: Tile[] = []
  readonly raycaster = new three.Raycaster()

  constructor(private readonly scene: three.Scene) {}

  public addTile(tile: Tile): void {
    this.tiles.push(tile)
    tile.addTo(this.scene)
  }

  public removeTile(tile: Tile): void {
    const index = this.tiles.indexOf(tile)
    if (index >= 0) {
      tile.removeFrom(this.scene)
      this.tiles.splice(index, 1)
    }
  }

  public clear(): void {
    for (const tile of this.tiles) {
      tile.removeFrom(this.scene)
    }
    this.tiles.splice(0, this.tiles.length)
  }

  // ---

  

  onMouseMove(event: MouseEvent) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    const mouse = new three.Vector2()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    // update the raycaster with the camera and mouse position
    this.raycaster.setFromCamera(mouse, this.camera.getCamera())

    // check for intersections with the tiles
    const intersects = this.raycaster.intersectObjects(this.tiles.children)

    // if there is an intersection, highlight the tile
    if (intersects.length > 0) {
      // TODO: highlight tile
    }
  }

  // buildLevel()
  // scene.add(this.tiles);
}
