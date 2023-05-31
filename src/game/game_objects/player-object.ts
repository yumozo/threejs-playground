import * as three from 'three'
import { GameObjectConfig, GameObject } from './game-object'
import { PlayerControl as PlayerControls } from '@game/controls/player-controls'
import { GameCamera } from '@game/components/game-camera'

interface PlayerConfig extends GameObjectConfig {
  // speed: number
  // camera?: three.Camera
  camera: GameCamera
}

/**
 * Player object controlled by the user.
 * @description Player object has the main camera following it.
 * @param camera Camera to be attached to the player object. Is optional parameter.
 */
export class PlayerObject extends GameObject {
  public controls: PlayerControls
  private camera: GameCamera

  constructor(config: PlayerConfig) {
    super(config)

    // BINDS
    this.onModelLoad = this.onModelLoad.bind(this)
    this.attachCamera = this.attachCamera.bind(this)

    // Adding CAMERA if provided
    this.camera = config.camera
  }

  public update() {
    if (this.model) {
      this.camera.setPosition(this.model.position)
    }
    // You can include any update code here
    // For example, you might want to check if the player has collided with anything
  }

  protected override onModelLoad(): void {
    this.model = this.modelLoader.models.get(this.name)
    this.model.attach(this.camera.getCamera())
    this.controls = new PlayerControls(this.model)
    this.controls.setupControls()
  }

  /**
   * Attach new camera instance, that is replacing the exisiting one.
   * @param camera New camera instance
   */
  public attachCamera(camera: three.Camera) {
    // Remove old camera
    this.model.remove(this.camera.getCamera())
    // Attach new one
    this.model.attach(camera)
  }

  public moveTo(position: three.Vector3) {
    this.model.position.copy(position)
  }
}
