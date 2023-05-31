import * as three from 'three'

class Material {
  private material: three.Material

  constructor(material?: three.Material) {
    if (material) {
      this.material = material
    } else {
      this.material = new three.MeshBasicMaterial({ color: '#ff00ff' })
    }
  }

  public get shader() {
    return null // Somehow return material's shader
  }
  public set shader(value: string) {
    // Somehow apply the shader
  }
}
