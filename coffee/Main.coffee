# Constructor to set up the business side of stuff. It shouldn't contain any of the visualization code.

class window.Main
  # Construct the scene
  constructor: () ->
    @scene = new THREE.Scene()
    @renderer = new THREE.WebGLRenderer( { antialias: true, alpha: false } )
    @renderer.setClearColor(0x9C9C9C)
    @renderer.setSize( window.innerWidth, window.innerHeight )

    @camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

    window.addEventListener( 'resize', @onWindowResize, false )

    document.body.appendChild(@renderer.domElement)

    visualizer = new Visualizer()

  render: () ->
    visualizer.render()


    @scene.updateMatrixWorld()
    @renderer.clear()
    @renderer.render(@scene, @camera)
    return

  onWindowResize: () =>
    @camera.aspect = window.innerWidth / window.innerHeight
    @camera.updateProjectionMatrix()
    @renderer.setSize( window.innerWidth, window.innerHeight )

window.animate = () ->
  requestAnimationFrame(window.animate)
  window.app.render()

$ ->
  window.app = new Main()

  window.animate()