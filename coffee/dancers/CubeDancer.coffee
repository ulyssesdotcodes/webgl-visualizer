# Contains an Object3D of some kind, with a mesh determined by subclasses.
# It has an Effect and a DanceMaterial which operate on the transform and the material of the Object3D respectivly
class window.CubeDancer extends Dancer
  @name: "CubeDancer"
  
  constructor: (dance, danceMaterial, options) ->
    if options? then { position, scale } = options
    super(new THREE.BoxGeometry(1, 1, 1), dance, danceMaterial, position, scale)