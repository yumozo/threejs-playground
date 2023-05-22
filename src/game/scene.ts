import { GameObject } from './game_objects/game-object'

class Scene {
  private objects: GameObject[]

  constructor() {
    this.objects = []
  }

  addObject(object: GameObject) {
    this.objects.push(object)
  }

  update(time) {
    this.objects.forEach((object) => object.update(time))
  }

  render(renderer, camera) {
    this.objects.forEach((object) => object.render(renderer.camera))
  }
}
