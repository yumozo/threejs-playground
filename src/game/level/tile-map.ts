import { Coordinates, RowFirstCoordinates } from './coordinates'
import { Tile } from './tile-model'

/**
 * Used to represent an area without having to carry around a tile array.
 * Select starting point with <x, y> and set the size by width and height.
 * @todo Idk neither the width nor the height in which direction go yet.
 * @example // Create a region with x, y, width, and height
 * const regionB = {
 *   x:     1, y:      1,
 *   width: 2, height: 2
 * };
 */
interface IRegion {
  x: number
  y: number
  width: number
  height: number
}

interface ITileMap {
  width: number
  height: number
  tiles: Tile[]
  coords: Coordinates
  getRegion: (region: IRegion) => ITileMap
  fillRegion: (region: IRegion, contents: Tile) => ITileMap
  applyProcessors: (processors: TileMapProcessor[]) => ITileMap
}

type TileMapProcessor = {
  (tileMap: ITileMap): ITileMap
}

export class TileMap implements ITileMap {
  public coords: RowFirstCoordinates
  public readonly tiles: Tile[]
  public readonly height: number
  public readonly width: number

  /**
   * Fills new instance of TileMap with provided tiles array and returns the instance
   * @param tiles Reqtangular array of tiles (see next param)
   * @param width Must meet tiles.length % width === 0
   */
  constructor(tiles: Tile[], width: number) {
    // assert(tiles.length % width === 0)
    if (!(tiles.length % width === 0)) {
      throw new Error('[Map/ctor]Something wrong with your tileset size')
    }
    this.width = width
    this.height = tiles.length / width
    this.coords = new RowFirstCoordinates(width)
    this.tiles = tiles
  }

  /**
   * Create new empty TileMap instance
   */
  public static CreateEmpty(width: number, height: number) {
    const length = width * height
    // const tiles: Tile[] = zeroedArray(length)
    const tiles: Tile[] = new Array<Tile>(length)
    tiles.fill(0)
    return new TileMap(tiles, width)
  }

  // Get a part of this TileMap object
  /**
   * ...
   * @param region Selection region to return as a new TileMap
   * @returns New instance of TileMap with selected region tiles
   */
  public getRegion(region: IRegion): TileMap {
    const { x, y, width, height } = region
    // assert(x + width <= this.width && y + height <= this.height)
    if (!(x + width <= this.width && y + height <= this.height)) {
      throw new Error('[Map/getRegion]Something wrong with your tileset')
    }
    const regionTiles = this.tiles.filter((tile, i) => {
      const tileX = this.coords.getX(i)
      const tileY = this.coords.getY(i)
      if (tileX >= x && tileX < x + width && tileY >= y && tileY < y + height) {
        return true
      } else {
        return false
      }
    })

    return new TileMap(regionTiles, width)
  }

  /**
   * ...
   * @param region Selected region to fill in
   * @param contents idk
   * @returns New TileMap instance of filled region
   */
  public fillRegion(region: IRegion, contents: number): TileMap {
    const { x, y, width, height } = region
    // assert(x + width <= this.width && y + height <= this.height)
    if (!(x + width <= this.width && y + height <= this.height)) {
      throw new Error('[Map/fillRegion]Something wrong with your tileset')
    }
    const newTiles = this.tiles.map((tile, i) => {
      const tileX = this.coords.getX(i)
      const tileY = this.coords.getY(i)
      if (tileX >= x && tileX < x + width && tileY >= y && tileY < y + height) {
        return contents
      } else {
        return tile
      }
    })

    return new TileMap(newTiles, this.width)
  }

  // Idk what's this
  public applyProcessors(processors: TileMapProcessor[]): ITileMap {
    return processors.reduce((map, processor) => processor(map), this)
  }
}