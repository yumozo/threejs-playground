import * as three from 'three'
import { GameObject } from './game_objects/game-object'

class Game {
  private player: GameObject
  private enemies: three.Object3D[]
  private items: three.Object3D[]

  constructor() {
    this.player = new GameObject()
    this.enemies = []
    this.items = []
  }

  update() {
    this.player.update()
    this.enemies.forEach((enemy) => enemy.update())
    this.items.forEach((item) => item.update())

    // etc.
  }
}
