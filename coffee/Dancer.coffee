# Contains an Object3D of some kind, with a mesh determined by subclasses.
# It has an Effect and a DanceMaterial which operate on the transform and the material of the Object3D respectivly
class window.Dancer

  constructor: () ->
    # Construct a default Dancer using @body as the Object3D

  rendeer: (audioEvent) ->
    # Rect to the audio event by pumping it through Effect and Shader