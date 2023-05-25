import * as three from 'three'
import { Config, GameObject } from './game-object'

interface PlayerConfig extends Config {
  // speed: number
  camera?: three.Camera
}

/**
 * Player object controlled by the user.
 * @description Player object has the main camera following it.
 * @param camera Camera to be attached to the player object. Is optional parameter.
 */
export class PlayerObject extends GameObject {
  private camera: three.Camera

  constructor(config: PlayerConfig) {
    super(config)

    // Adding camera if provided
    this.camera = config.camera || null
    // Check if not
    if (this.camera) {
      // Attach camera to the model, again if provided
      this.model.attach(this.camera)
    }
  }

  /**
   * Update frame...
   */
  public update() {
    // You can include any update code here
    // For example, you might want to check if the player has collided with anything
  }

  /**
   * Attach new camera instance, that is replacing the exisiting one.
   * @param camera New camera instance
   */
  public attachCamera(camera: three.Camera) {
    // Remove old camera
    this.model.remove(this.camera)
    // Attach new one
    this.model.attach(camera)
  }

  public moveTo(position: three.Vector3) {
    this.model.position.copy(position)
  }
}
