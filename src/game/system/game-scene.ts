import * as three from 'three'
import { Updatable } from '@game/system/updatable'

export class GameScene implements Updatable {
  private readonly scene: three.Scene
  private readonly updatables: Updatable[]

  constructor(scene: three.Scene) {
    this.scene = scene
    this.updatables = []
  }

  // public addScene(scene: three.Scene) {
  //   this.scene = scene
  // }

  public addUpdatable(object: Updatable) {
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