// import the shader.js module
import CustomShader from './shaders/test-shader'

const ShaderPassFactory = function <T extends { new(...args: any[]): any }>(
  shaderClass: T,
  options: object
): InstanceType<T> {
  return new shaderClass(options)
}

export const createTestPass = function () {
  // Set any options necessary for the shader pass
  const options = {} 
  // Create a new instance of MyShaderPass
  return ShaderPassFactory(CustomShader.MyShaderPass, options) 
}
