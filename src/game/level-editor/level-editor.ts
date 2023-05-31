import * as three from 'three'
import { TileObject } from '../game_objects/tile-object'
import { TileMap } from './tile-map'
import { ModelLoader } from '@game/system/model-loader'

export default class LevelEditor {
  private map: TileMap
  private readonly scene: three.Scene
  private readonly selectedMaterial = new three.MeshBasicMaterial({
    color: 0xff0000
  })
  private readonly raycaster = new three.Raycaster()

  constructor(scene: three.Scene, width = 10, height = 10) {
    // BINDS
    this.populateMap = this.populateMap.bind(this)

    this.map = TileMap.CreateEmpty(width, height)
    this.scene = scene
  }

  public setMap(map: TileMap): void {
    this.map = map
  }

  public populateMap(): void {
    const region = {
      x: 0,
      y: 0,
      width: this.map.width,
      height: this.map.height
    }
    const { tiles } = this.map.getRegion(region)
    console.log('to check tiles count: ', tiles)

    const position = new three.Vector3(0, 0, 0)
    for (const tileIndex in tiles) {
      const tileType = tiles[tileIndex]

      if (position.x > this.map.width - 1) {
        position.z++
        position.x = 0
      }

      // Create a 3D tile model
      const tileObject = new TileObject({
        name: "tile" + position.x + position.z,
        position,
        type: tileType
      })
      const modelLoader = ModelLoader.getInstance()
      modelLoader.setScene(this.scene)
      // modelLoader.loadTileModel(tileObject)
      tileObject.loadModel(undefined, this.scene)
      // ...then add it to the scene
      // tileModel.addTo(this.scene)

      position.x++
    }

    console.log(
      '[LevelEditor/render]: Level has initianted and rendered!'
    )
  }

  public addTile(tile: TileObject): void {
    // this.map.push(tile)
    tile.addTo(this.scene)
  }

  public removeTile(tile: TileObject): void {
    // const index = this.map.indexOf(tile)
    // if (index >= 0) {
    //   tile.removeFrom(this.scene)
    //   this.map.splice(index, 1)
    // }
  }

  public clear(): void {
    // for (const tile of this.map) {
    //   tile.removeFrom(this.scene)
    // }
    // this.map.splice(0, this.map.length)
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
    const intersects = this.raycaster.intersectObjects(this.map.children)

    // if there is an intersection, highlight the tile
    if (intersects.length > 0) {
      // TODO: highlight tile
    }
  }

  // buildLevel()
  // scene.add(this.tiles);
}
