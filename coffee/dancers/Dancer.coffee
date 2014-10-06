class window.Dancer
  @type = Dancer

  constructor: (geometry, dance, danceMaterial, position, scale) ->
    # Construct a default Dancer using @body as the Object3D
    material = danceMaterial.material;
    @dance = dance
    @danceMaterial = danceMaterial;
    @body = new THREE.Mesh(geometry, material);
    @body.position = if position? then position else new THREE.Vector3(0, 0, 0)
    @body.scale = if scale? then scale else new THREE.Vector3(1, 1, 1)

  geometry: () ->
    new THREE.PlaneGeometry(1, 1)

  reset: () ->
    @dance.reset(@)

  update: (audioWindow) ->
    # React to the audio event by pumping it through Effect and Shader
    @dance.update(audioWindow, @)
    @danceMaterial.update(audioWindow, @)