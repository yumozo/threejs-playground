import * as three from 'three'
import { ModelLoader } from '@game/system/model-loader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class AnimatedModel {
  private model: three.Mesh | three.Object3D | null
  private clips: three.AnimationClip[]
  private mixer: three.AnimationMixer

  constructor(model?: three.Mesh | three.Object3D) {
    if (!model) {
      this.model = null
    }
    if (model instanceof three.Mesh || model instanceof three.Object3D) {
      this.model = model
    } else if (typeof model === "string") {
      this.loadModel(model)
    } else {
      throw new Error("[Object3D]: Invalid type provided.")
    }
  }

  public setModel(model: three.Mesh | three.Object3D): void {
    this.model = model
  }

  public getModel(): three.Mesh | three.Object3D | null {
    return this.model
  }

  update(time: number): void {
    this.mixer.update(time)
  }

  /**
   * Set and play a specific animation.
   * @param name Clip name
   */
  setClip(name: string) {
    // Check if animations loaded
    if (!this.clips || this.clips.length === 0) {
      console.warn('[Mesh/setClip]: No animations loaded')
    }

    // Gettings specific animation to play
    const clip = three.AnimationClip.findByName(this.clips, name)
    if (!clip) {
      console.warn('[Mesh/setClip]: No such clip in the animations set')
    }

    // Play
    const action = this.mixer.clipAction(clip)
    action.play()
  }

  public loadModel(path: string): void {
    if (!path) {
      throw new Error('[Mesh/loadModel]: Invalid path')
    }

    const loader = new GLTFLoader()
    loader.load(
      path,
      (gltf) => {
        // LOAD CHARACTER
        this.model = gltf.scene
        const clips = gltf.animations

        if (clips) {
          this.clips = clips
          this.mixer = new three.AnimationMixer(this.model)
        }

        console.log(
          '[Mesh/loadModel]: model animations',
          clips,
          '\nmodel rotation',
          this.model.rotation
        )
      },
      undefined,
      (err) => {
        console.error(err)
      }
    )
  }
}
