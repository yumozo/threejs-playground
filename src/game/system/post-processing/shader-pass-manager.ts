import {
  EffectComposer,
  Pass
} from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

type PassMap = { [name: string]: any }

/**
 * Provides an easy-to-use interface for adding and removing shader passes to
 * and from an EffectComposer instance in Three.js.
 */
export class ShaderPassManager {
  private readonly composer: EffectComposer
  private readonly passes: PassMap

  constructor(composer: EffectComposer) {
    this.composer = composer
    this.passes = {}
  }

  /**
   * Adds a custom shader pass to the EffectComposer and to the internal
   * passes map, using the provided name as the identifier. The shader
   * pass should be an instance of ShaderPass or a subclass of it.
   * @param name String identifier
   * @param shaderPass The shader pass -- shader
   */
  addPass(name: string, shaderPass: Pass | ShaderPass) {
    if (this.passes[name] === undefined) {
      this.passes[name] = shaderPass
      this.composer.addPass(shaderPass)
    }
  }

  /**
   * Method removes a custom shader pass from the EffectComposer and from the
   * internal passes map, using the provided name as the identifier.
   * @param name String identifier
   */
  removePass(name: string) {
    if (this.passes[name] !== undefined) {
      this.composer.removePass(this.passes[name])
      delete this.passes[name]
    }
  }

  /**
   * returns the shader pass object from the internal passes map, using the
   * provided name as the identifier.
   * @param name String identifier
   * @returns The shader pass -- shader
   */
  getPass(name: string): ShaderPass {
    return this.passes[name]
  }

  /**
   * Returns  If the value is true, then the pass exists; if the value is
   * false, then the pass does not exist.
   * @param name String identifier
   * @returns a boolean value indicating whether a shader pass with the
   * provided name exists in the internal passes map
   */
  hasPass(name: string): boolean {
    return this.passes[name] !== undefined
  }
}
