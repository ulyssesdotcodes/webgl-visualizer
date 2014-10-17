class window.PointCloudDancer extends Dancer
  @params: 
    [
      {
        name: 'minDistance',
        default: 5.0
      }, 
      {
        name: 'maxDistance',
        default: 10.0
      }, 
      {
        name: 'count',
        default: 500
      }
    ]

  @name: "PointCloudDancer"

  constructor: (@dance, @danceMaterial, @options) ->
    if @options? then { @minDistance, @maxDistance, @count } = @options
    @minDistance ?= 5.0
    @maxDistance ?= 10.0
    @count ?= 500

    direction = new THREE.Vector3()
    position = new THREE.Vector3(0, 0, 0)

    geometry = new THREE.BufferGeometry()
    positions = new Float32Array(@count * 3)

    for i in [0...@count]
      direction.set(Math.random() - 0.5, Math.random() - 0.5, Math.random()- 0.5)
      direction.normalize()
      direction.multiplyScalar(@minDistance + Math.random() * (@maxDistance - @minDistance))

      positions[3 * i] = position.x + direction.x
      positions[3 * i + 1] = position.y + direction.y
      positions[3 * i + 2] = position.z + direction.z

    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.computeBoundingBox()

    material = new THREE.PointCloudMaterial({ size: 0.5, color: @danceMaterial.color })
    @body = new THREE.PointCloud( geometry, material )