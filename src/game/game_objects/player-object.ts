import * as three from 'three'
import { GameObjectConfig, GameObject } from './game-object'
import { PlayerControl as PlayerControls } from '@game/controls/player-controls'
import { GameCamera } from '@game/components/game-camera'

interface PlayerConfig extends GameObjectConfig {
  camera: GameCamera
}

/**
 * Player object controlled by the user.
 * @description Player object has the main camera following it.
 * @param camera Camera to be attached to the player object. Is optional parameter.
 */
export class PlayerObject extends GameObject {
  public controls: PlayerControls | undefined
  private camera: GameCamera

  constructor(config: PlayerConfig) {
    super(config)

    // BINDS
    this.onModelLoad = this.onModelLoad.bind(this)
    this.update = this.update.bind(this)
    // this.attachCamera = this.attachCamera.bind(this)

    this.camera = config.camera
  }

  public override update() {
    if (this.model) {
      // this.camera.setPosition(this.model.position)
      const camera = this.camera.getCamera()
      const playerPosition = this.model.position.clone()
      // const shift = 
      const cameraPosition = playerPosition.add(new three.Vector3(5, 5, -5))
      camera.position.copy(cameraPosition)
    } else {
      console.warn('[PlayerObject/moveTo]: model is not provided.')
    }
  }

  protected override onModelLoad(): void {
    this.model = this.modelLoader.models.get(this.name)
    // this.model.attach(this.camera.getCamera())
    if (this.model) {
      this.controls = new PlayerControls(this.model)
      this.controls.setupControls()
    } else {
      throw new Error('[PlayerObject/onModelLoad]: model is not provided.')
    }
  }

  // /**
  //  * Attach new camera instance, that is replacing the exisiting one.
  //  * @param camera New camera instance
  //  */
  // public attachCamera(camera: three.Camera) {
  //   // Remove old camera
  //   this.model.remove(this.camera.getCamera())
  //   // Attach new one
  //   this.model.attach(camera)
  // }

  public moveTo(position: three.Vector3) {
    if (this.model) {
      this.model.position.copy(position)
    } else {
      throw new Error('[PlayerObject/moveTo]: model is not provided.')
    }
  }
}
