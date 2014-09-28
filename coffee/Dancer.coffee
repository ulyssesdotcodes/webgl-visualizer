# Contains an Object3D of some kind, with a mesh determined by subclasses.
# It has an Effect and a DanceMaterial which operate on the transform and the material of the Object3D respectivly
class window.Dancer

  constructor: () ->
    # Construct a default Dancer using @body as the Object3D
    geometry = new THREE.BoxGeometry( 1, 1, 1 );
    material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    @body = new THREE.Mesh(geometry, material);
    @body.position = new THREE.Vector3( 0, 0, 0 );

  update: (audioEvent) ->
    # Rect to the audio event by pumping it through Effect and Shader