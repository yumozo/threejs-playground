import * as three from 'three'

/**
 * Creates a gizmo object. Rendering over all other objects (not yet).
 * @returns Gizmo object
 */
export function createGizmo(): three.Object3D {
  const axisPointerGeo = new three.ConeGeometry(0.1, 0.5, 4)
  const axisPointerMat = new three.MeshBasicMaterial()

  // Make it overlay part 1
  axisPointerMat.depthTest = false

  const xAxisMat = axisPointerMat.clone()
  xAxisMat.color = new three.Color(0xff2211)
  const yAxisMat = axisPointerMat.clone()
  yAxisMat.color = new three.Color(0x30ff30)
  const zAxisMat = axisPointerMat.clone()
  zAxisMat.color = new three.Color(0x1144ff)

  // Settings X axis pointer
  const xaxis = new three.Mesh(axisPointerGeo, xAxisMat)
  xaxis.position.set(2, 0, 0)
  xaxis.rotation.z = three.MathUtils.degToRad(-90)
  
  // Settings Y axis pointer
  const yaxis = new three.Mesh(axisPointerGeo, yAxisMat)
  yaxis.position.set(0, 2, 0)
  
  // Settings Z axis pointer
  const zaxis = new three.Mesh(axisPointerGeo, zAxisMat)
  zaxis.position.set(0, 0, 2)
  zaxis.rotation.x = three.MathUtils.degToRad(90)

  const gizmo = new three.Group()
  gizmo.add(xaxis)
  gizmo.add(yaxis)
  gizmo.add(zaxis)

  // Make it overlay part 2
  gizmo.renderOrder = 999

  return gizmo
}
