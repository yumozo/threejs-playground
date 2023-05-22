import * as three from 'three'
import { Config, GameObject } from './game-object'

interface PlayerConfig extends Config {
  speed: number
}

export class PlayerObject extends GameObject {
  constructor(config: PlayerConfig) {
    super(config)
  }

  public update() {
    // You can include any update code here
    // For example, you might want to check if the player has collided with anything
  }

  public moveTo(position: three.Vector3) {
    this.model.position.copy(position)
  }
}
