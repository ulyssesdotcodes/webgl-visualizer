class window.Dancer
  @params: ['position', 'scale']

  constructor: (geometry, dance, danceMaterial, position, scale) ->
    # Construct a default Dancer using @body as the Object3D
    material = danceMaterial.material;
    @dance = dance
    @danceMaterial = danceMaterial;
    @body = new THREE.Mesh(geometry, material);
    position ?= [0, 1, 0]
    @body.position.set(position[0], position[1], position[2])
    scale ?= [1, 1, 1]
    @body.scale.set(scale[0], scale[1], scale[2])

  geometry: () ->
    new THREE.PlaneGeometry(1, 1)

  reset: () ->
    @dance.reset(@)

  update: (audioWindow) ->
    # React to the audio event by pumping it through Effect and Shader
    @dance.update(audioWindow, @)
    @danceMaterial.update(audioWindow, @)