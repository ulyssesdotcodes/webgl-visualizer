# Contains an Object3D of some kind, with a mesh determined by subclasses.
# It has an Effect and a DanceMaterial which operate on the transform and the material of the Object3D respectivly
class window.SphereDancer extends Dancer
  @constructor: () ->
    super(new THREE.SphereGeometry(1, 32, 24), dance, danceMaterial, position, scale)