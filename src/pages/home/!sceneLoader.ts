import * as three from 'three'

export class SceneLoader {
  private readonly renderer
  private readonly scene
  private readonly camera
  private readonly dodeca
  private readonly plane: three.Mesh<
    three.PlaneGeometry,
    three.MeshToonMaterial
  >

  constructor() {
    this.animate = this.animate.bind(this)

    this.scene = new three.Scene()
    this.camera = new three.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )

    this.renderer = new three.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor('#f8d9ff', 1)

    const dg = new three.DodecahedronGeometry(1, 1)
    const dm = new three.MeshToonMaterial({ color: '#231149' })
    this.dodeca = new three.Mesh(dg, dm)
    this.scene.add(this.dodeca)

    const pg = new three.PlaneGeometry(2, 2)
    const pm = new three.MeshToonMaterial({
      color: '#734179',
      side: three.DoubleSide,
    })
    this.plane = new three.Mesh(pg, pm)
    this.plane.position.setY(-1)
    this.plane.rotation.x = (-90 * Math.PI) / 180
    this.scene.add(this.plane)

    const light = new three.DirectionalLight('#fff', 1)
    light.position.set(0, 2, 0)
    light.target.position.set(-2, 0, 0)
    this.scene.add(light)
    this.scene.add(light.target)

    this.camera.position.z = 5

    // WHEEL
    let scroll_speed = 0.0
    window.addEventListener('wheel', (e) => {
      scroll_speed = e.deltaY * (Math.PI / 180) * 0.2

      // this.plane.rotation.x += -1.0 * scroll_speed
      if (this.dodeca.position.y > 7) {
        this.plane.position.y = -7 - 1
        this.dodeca.position.y = -7
      } else if (this.dodeca.position.y < -7) {
        this.plane.position.y = 7 - 1
        this.dodeca.position.y = 7
      } else {
        this.plane.position.y += -1.0 * scroll_speed
        this.dodeca.position.y += -1.0 * scroll_speed
      }
    })
  }

  public init() {
    if (!this.renderer.domElement) return
    const sceneEl = document.getElementById('scene')
    sceneEl.style.position = 'absolute'
    sceneEl.style.top = '0'
    sceneEl.style.left = '0'
    sceneEl.style.zIndex = '-999'
    sceneEl.appendChild(this.renderer.domElement)

    this.animate()
  }

  private animate() {
    requestAnimationFrame(this.animate)
    this.renderer.render(this.scene, this.camera)

    this.dodeca.rotation.x += 0.01
    this.dodeca.rotation.y += 0.01
  }

  public rotatePlane(degree: number) {
    if (!this.renderer) return
    const radians = degree * (Math.PI / 180)
    this.plane.rotation.x = radians
  }
}
