# Contains an Object3D of some kind, with a mesh determined by subclasses.
# It has an Effect and a DanceMaterial which operate on the transform and the material of the Object3D respectivly
class window.Dancer

  constructor: () ->
    # Construct a default Dancer using @body as the Object3D
    geometry = new THREE.BoxGeometry(1, 1, 1);
    material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    @body = new THREE.Mesh(geometry, material);
    @body.position = new THREE.Vector3(0, 0, 0);
    @dance = new ScaleDance(0.7)
    @danceMaterial = new ColorDanceMaterial(0.01);

  update: (audioWindow) ->
    # React to the audio event by pumping it through Effect and Shader
    @dance.update(audioWindow, @)
    @danceMaterial.update(audioWindow, @)