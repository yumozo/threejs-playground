import { ShaderMaterial } from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

const myShaderMaterial = new ShaderMaterial({
  // Shader material parameters
})

class MyShaderPass extends ShaderPass {
  constructor() {
    super(myShaderMaterial)
  }

  // MyShaderPass methods, such as uniforms and render method
}

export default {myShaderMaterial, MyShaderPass}
