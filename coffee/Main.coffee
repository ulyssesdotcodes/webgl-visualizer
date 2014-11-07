# Require all the shit
require './Visualizer.coffee'
require '../javascript/OrbitControls'
require './Viewer.coffee'
require './interface/DatGUIInterface.coffee'

class window.Main
  # Construct the scene
  constructor: (isVisualizer) ->
    @scene = new THREE.Scene()
    @renderer = new THREE.WebGLRenderer( { antialias: true, alpha: false } )
    @renderer.setSize( window.innerWidth, window.innerHeight )
    @renderer.autoClear = false

    @camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
    @controls = new THREE.OrbitControls( @camera, @renderer.domElement )
    @controls.damping = 0.2

    controlChange = () =>
      @render()

    @controls.addEventListener( 'change', controlChange )

    @camera.position.z = -4
    @camera.position.y = 3
    @controls.target = new THREE.Vector3( 0, 0, 0 )

    window.addEventListener( 'resize', @onWindowResize, false )

    document.body.appendChild(@renderer.domElement)

    @viewer = new Viewer(@scene, @camera)
    if isVisualizer
      @visualizer = new Visualizer(@viewer, new DatGUIInterface())
      window.addEventListener('keydown', @visualizer.onKeyDown.bind(@visualizer), false)
    else
      @domain = window.location.protocol + '//' + window.location.host
      window.addEventListener 'message', (event) =>
        if event.origin != @domain then return
        sentObj = event.data
        if sentObj.type == 'render'
          @viewer.render sentObj.data
        if sentObj.type == 'choreography'
          @viewer.receiveChoreography sentObj.data

  animate: () ->
    @render()
    @controls.update()

  render: () ->
    @visualizer?.render()  

    @scene.updateMatrixWorld()
    @camera.updateProjectionMatrix()
    @renderer.clear()
    @renderer.render(@scene, @camera)
    return

  onWindowResize: () =>
    @camera.aspect = window.innerWidth / window.innerHeight
    @camera.updateProjectionMatrix()
    @renderer.setSize( window.innerWidth, window.innerHeight )

window.animate = () ->
  requestAnimationFrame(window.animate)
  window.app.animate()

$ ->
  dat.GUI.prototype.removeFolder = (name) ->
    folder =  this.__folders[name]
    if !folder
      return
    folder.close()
    this.__ul.removeChild(folder.domElement.parentNode)
    delete this.__folders[name]
    this.onResize()