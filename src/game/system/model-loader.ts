import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { TileObject, TileType } from '@game/game_objects/tile-object'
import default_tile_model from '@assets/tiles/default_tile.gltf'
import grass_tile_model from '@assets/tiles/grass_tile.gltf'
import water_tile_model from '@assets/tiles/water_tile.gltf'
import dirt_tile_model from '@assets/tiles/dirt_tile.gltf'
import * as three from 'three'
import { GameObject } from '@game/game_objects/game-object'

/**
 * Fixes webpack troubles with GLTF assets loading
 * @todo singleton or static?
 */
export class ModelLoader {
  /**
   * @todo idk yet get model by object's name or by object itself.
   */
  public models: Map<GameObject | string, three.Object3D>

  private static instance: ModelLoader
  private tileModels: Map<TileType, three.Object3D>
  private scene: three.Scene | undefined = undefined
  private loader: GLTFLoader

  private constructor() {
    this.loadModel = this.loadModel.bind(this)
    this.loadTileModel = this.loadTileModel.bind(this)
    // this.loadTiles = this.loadTiles.bind(this)

    this.models = new Map()
    this.tileModels = new Map()
    this.loader = new GLTFLoader()
  }

  public static getInstance(): ModelLoader {
    if (!ModelLoader.instance) {
      ModelLoader.instance = new ModelLoader()
    }
    return ModelLoader.instance
  }

  public loadModel(
    url: string,
    gameObject: GameObject,
    scene?: three.Scene,
    callback?: Function
  ): undefined | three.Object3D {
    // Check this type of tile has already loaded as a model

    if (gameObject instanceof TileObject && this.tileModels.get(gameObject.type) !== undefined) {
      const model = this.tileModels.get(gameObject.type)
      if (model && scene) {
        console.log(model, 'already loaded')

        this.models.set(gameObject.name, model.clone())

        scene.add(this.models.get(gameObject.name))

        callback()
      } else {
        throw new Error('[ModelLoader/loadModel]: something goes wrong.')
      }
      return
    }

    this.loader.load(
      url,
      (gltf) => {
        const model = this.models.get(gameObject.name)
        // Dispose of old model if one was loaded for this game object
        if (model !== undefined) {
          this.disposeModel(model)
        }

        // In case if object is instance of TileObject add it to the
        // separate container
        if (gameObject instanceof TileObject && !this.tileModels.get(gameObject.type)) {
          this.tileModels.set(gameObject.type, gltf.scene)
        }

        // Otherwise add the new model to the scene and update the models object
        if (scene !== undefined) {
          scene.add(gltf.scene)
        } else if (this.scene !== undefined) {
          this.scene.add(gltf.scene)
        } else {
          throw new Error("[ModelLoader/loadModel]: Scene isn't provided")
        }

        this.models.set(gameObject.name, gltf.scene)
        callback()
        return gltf.scene
      },
      undefined,
      (err) => {
        console.error(err)
      }
    )
  }

  public loadTileModel(tileObject: TileObject, scene?: three.Scene, callback?: Function) {
    let model: three.Object3D | undefined
    switch (tileObject.type) {
      case TileType.Nothing:
        const box = new three.BoxGeometry(0.5, 0.5, 0.5)
        const material = new three.MeshBasicMaterial({ color: '#ff00ff' })
        model = new three.Mesh(box, material)
        if (this.models.get(tileObject.name)) {
          this.disposeModel(this.models.get(tileObject.name))
          this.models.set(tileObject.name, model)
        }
        this.scene?.add(model)
        break
      case TileType.Ground:
        model = this.loadModel(default_tile_model, tileObject, this.scene, callback)
        if (model) {
          this.tileModels.set(TileType.Ground, model)
        }
        break
      case TileType.Grass:
        model = this.loadModel(grass_tile_model, tileObject, this.scene, callback)
        if (model) {
          this.tileModels.set(TileType.Grass, model)
        }
        break
      case TileType.Dirt:
        model = this.loadModel(dirt_tile_model, tileObject, this.scene, callback)
        if (model) {
          this.tileModels.set(TileType.Dirt, model)
        }
        break
      case TileType.Water:
        model = this.loadModel(water_tile_model, tileObject, this.scene, callback)
        if (model) {
          this.tileModels.set(TileType.Water, model)
        }
        break
      default:
        throw new Error('[ModelLoader/loadTileModel]: Invalid tile type.')
    }
  }

  disposeModel(model: three.Object3D) {
    model.traverse((object: three.Mesh) => {
      if (object.isMesh) {
        object.geometry.dispose()
        object.material.dispose()
      }
    })

    this.scene?.remove(model)
  }

  public disposeAllModels() {
    for (let gameObject in this.models) {
      this.disposeModel(this.models.get(gameObject))
    }

    this.models.clear()
  }

  public setScene(scene: three.Scene) {
    this.scene = scene
  }
}
