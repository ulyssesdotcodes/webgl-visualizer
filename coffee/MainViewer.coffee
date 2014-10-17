class window.MainViewer
  # Construct the scene
  constructor: () ->
    # @scene = new THREE.Scene()
    # @renderer = new THREE.WebGLRenderer( { antialias: true, alpha: false } )
    # @renderer.setSize( window.innerWidth, window.innerHeight )
    # @renderer.autoClear = false

    # @camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
    # @controls = new THREE.OrbitControls( @camera, @renderer.domElement )
    # @controls.damping = 0.2

    # controlChange = () =>
    #   @render()

    # @controls.addEventListener( 'change', controlChange )

    # @camera.position.z = -4
    # @camera.position.y = 3
    # @controls.target = new THREE.Vector3( 0, 0, 0 )

    # window.addEventListener( 'resize', @onWindowResize, false )

    # document.body.appendChild(@renderer.domElement)

    # @visualizerViewer = new VisualizerViewer(@scene, @camera)

    # window.addEventListener('keydown', @visualizer.onKeyDown.bind(@visualizer), false)

    @visualizerViewer = new VisualizerViewer()
    @visualizerViewer.addEventListener()

#   animate: () ->
#     @render()
#     @controls.update()

#   render: () ->
#     @visualizer.render()  

#     @scene.updateMatrixWorld()
#     @camera.updateProjectionMatrix()
#     @renderer.clear()
#     @renderer.render(@scene, @camera)
#     return

#   onWindowResize: () =>
#     @camera.aspect = window.innerWidth / window.innerHeight
#     @camera.updateProjectionMatrix()
#     @renderer.setSize( window.innerWidth, window.innerHeight )

# window.animate = () ->
#   requestAnimationFrame(window.animate)
#   window.app.animate()

$ ->
  window.app = new MainViewer()

  # window.animate()

  dat.GUI.prototype.removeFolder = (name) ->
    folder =  this.__folders[name]
    if !folder
      return
    folder.close()
    this.__ul.removeChild(folder.domElement.parentNode)
    delete this.__folders[name]
    this.onResize()