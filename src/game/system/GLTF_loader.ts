import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface LoaderAssets {
  binPath?: string
  texturePath?: string
}

/**
 * Fixes webpack troubles with GLTF assets loading
 */
export class GLTFLoader_holdAssets {
  private loader: GLTFLoader

  constructor() {
    this.load = this.load.bind(this)

    this.loader = new GLTFLoader()
  }

  public load(
    url: string,
    assets: LoaderAssets,
    onLoad: (gltf: GLTF) => void,
    onProgress?: (event: ProgressEvent<EventTarget>) => void,
    onError?: (event: ErrorEvent) => void
  ) {
    this.loader.load(url, onLoad, onProgress, onError)

    // Access bin files using URL constructor
    // @note[23-05-2023] Actually there may be more than one texture or whatever. Add later
    if (assets.binPath) {
      const binPath = new URL(assets.binPath, import.meta.url).href
    }
    if (assets.texturePath) {
      const texturePath = new URL(assets.texturePath, import.meta.url).href
    }
  }
}
