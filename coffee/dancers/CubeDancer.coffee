# Contains an Object3D of some kind, with a mesh determined by subclasses.
# It has an Effect and a DanceMaterial which operate on the transform and the material of the Object3D respectivly
class window.CubeDancer

  constructor: (dance, danceMaterial) ->
    # Construct a default Dancer using @body as the Object3D
    geometry = new THREE.BoxGeometry(1, 1, 1);
    material = danceMaterial.material;
    @body = new THREE.Mesh(geometry, material);
    @body.position = new THREE.Vector3(0, 0, 0);
    @dance = dance
    @danceMaterial = danceMaterial;

  update: (audioWindow) ->
    # React to the audio event by pumping it through Effect and Shader
    @dance.update(audioWindow, @)
    @danceMaterial.update(audioWindow, @)