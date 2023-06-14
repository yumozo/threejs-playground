import { EffectComposer, Pass } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

type PassMap = { [name: string]: any }

/**
 * Provides an easy-to-use interface for adding and removing shader passes to
 * and from an EffectComposer instance in Three.js.
 */
export class PassManager {
  private static instance: PassManager

  public static getInstance(composer?: EffectComposer) {
    if (!PassManager.instance) {
      if (composer === undefined) {
        throw new Error('[PassManager/getInstance]: No composer provided yet.')
      }
      PassManager.instance = new PassManager(composer)
    }
    return PassManager.instance
  }

  private readonly composer: EffectComposer
  private readonly passes: PassMap

  private constructor(composer: EffectComposer) {
    this.composer = composer
    this.passes = {}
  }

  /**
   * Adds a custom shader pass to the EffectComposer and to the internal
   * passes map, using the provided name as the identifier. The shader
   * pass should be an instance of ShaderPass or a subclass of it.
   * @param name String identifier
   * @param shaderPass The shader pass
   */
  public addPass(name: string, shaderPass: Pass | ShaderPass): void {
    if (this.passes[name] === undefined) {
      this.passes[name] = shaderPass
      this.composer.addPass(shaderPass)
      console.log(`[PassManager/addPass]: '${name}' pass added.`)
    } else {
      console.warn(`[PassManager/addPass]: Pass with name '${name}' is already exists.`)
    }
  }

  /**
   * Method removes a custom shader pass from the EffectComposer and from the
   * internal passes map, using the provided name as the identifier.
   * @param name String identifier
   */
  public removePass(name: string): void {
    if (this.passes[name] !== undefined) {
      this.composer.removePass(this.passes[name])
      delete this.passes[name]
    }
  }

  /**
   * returns the shader pass object from the internal passes map, using the
   * provided name as the identifier.
   * @param name String identifier
   * @returns The shader pass
   */
  public getPass(name: string): ShaderPass {
    return this.passes[name]
  }

  /**
   * Returns  If the value is true, then the pass exists; if the value is
   * false, then the pass does not exist.
   * @param name String identifier
   * @returns a boolean value indicating whether a shader pass with the
   * provided name exists in the internal passes map
   */
  public hasPass(name: string): boolean {
    return this.passes[name] !== undefined
  }

  public turnOnPass(name: string) {
    if (this.hasPass(name)) {
      if (!this.isPassOn(name)) {
        console.warn(`[PassManager/turnOnPass]: Pass with name '${name}' is already on.`)
        return
      }
      this.composer.addPass(this.passes[name])
    } else {
      console.warn(`[PassManager/turnOnPass]: No such pass with name '${name}'.`)
    }
  }

  public turnOffPass(name: string) {
    if (this.hasPass(name)) {
      if (this.isPassOn(name)) {
        this.composer.removePass(this.passes[name])
      } else {
        console.warn(`[PassManager/turnOffPass]: Pass with name '${name}' is already off.`)
      }
    } else {
      console.warn(`[PassManager/turnOffPass]: No such pass with name '${name}'.`)
    }
  }

  public isPassOn(name: string): boolean {
    return this.passes[name] in this.composer.passes
  }
}
