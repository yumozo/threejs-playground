import * as three from 'three'
import { GameObject } from '@game/game_objects/game-object'
import { IUpdatable } from '@game/system/interface/IUpdatable'

export class GameScene implements IUpdatable {
  private readonly scene: three.Scene | null
  private readonly updatables: IUpdatable[]

  constructor(scene?: three.Scene) {
    this.scene = scene || null
    this.updatables = []
  }

  // public addScene(scene: three.Scene) {
  //   this.scene = scene
  // }

  public addUpdatable(object: IUpdatable) {
    this.updatables.push(object)
  }

  public update(time: number) {
    for (const object of this.updatables.values()) {
      object.update(time);
    }
  }

  public getScene() {
    return this.scene
  }

  // public render(renderer, camera) {
  //   this.objects.forEach((object) => object.render(renderer.camera))
  // }
}