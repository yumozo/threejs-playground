import { WebGLRenderer, PCFSoftShadowMap } from 'three'

export function createRenderer() {
  const renderer = new WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor('#23192f', 1)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap

  return renderer
}
