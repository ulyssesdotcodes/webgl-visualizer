# Contains an Object3D of some kind, with a mesh determined by subclasses.
# It has an Effect and a DanceMaterial which operate on the transform and the material of the Object3D respectivly

class window.Dancer
  @type = Dancer
  @params = [
    {
      name: 'position'
      default: [0, 0, 0]
    },
    {
      name: 'scale'
      default: [1, 1, 1]
    }
  ]

  constructor: (geometry, dance, danceMaterial, position, scale) ->
    # Construct a default Dancer using @body as the Object3D
    material = danceMaterial.material;
    @dance = dance
    @danceMaterial = danceMaterial;
    @body = new THREE.Mesh(geometry, material);
    if position? && position.length == 3 then @body.position.set(position[0], position[1], position[2])
    if scale? && scale.length == 3 then @body.scale.set(scale[0], scale[1], scale[2])

  geometry: () ->
    new THREE.PlaneGeometry(1, 1)

  reset: () ->
    @dance.reset(@)

  update: (audioWindow) ->
    # React to the audio event by pumping it through Effect and Shader
    @dance.update(audioWindow, @)
    @danceMaterial.update(audioWindow, @)