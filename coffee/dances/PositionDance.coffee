class window.PositionDance
  @params: 
    [
      {
        name: 'smoothingFactor'
        default: 0.2
      }, 
      {
        name: 'direction'
        default: [0, 1, 0]
      }
    ]

  @name: "PositionDance"

  constructor: (@options) ->
    if @options? then { @smoothingFactor, direction } = @options
    @smoothingFactor ?= 0.2
    
    direction ?= [0, 1, 0]
    @direction = new THREE.Vector3(direction[0], direction[1], direction[2])

    @directionCopy = new THREE.Vector3();
    @positionChange = 0

  update: (audioWindow, dancer) ->
    basePosition = new THREE.Vector3();
    @directionCopy.copy(@direction);
    basePosition.subVectors(dancer.body.position, @directionCopy.multiplyScalar(@positionChange))

    smoothingFactor = if audioWindow.averageDb < @positionChange then @smoothingFactor else Math.max(1, @smoothingFactor * 4)
    @positionChange = audioWindow.averageDb * smoothingFactor + (1 - smoothingFactor) * @positionChange

    @directionCopy.copy(@direction)
    newPosition = new THREE.Vector3()
    newPosition.addVectors(basePosition, @directionCopy.multiplyScalar(@positionChange))

    dancer.body.position.set(newPosition.x, newPosition.y, newPosition.z)

  reset: (dancer) ->
    @directionCopy.copy(@direction);
    basePosition = new THREE.Vector3();
    basePosition.subVectors(dancer.body.position, @directionCopy.multiplyScalar(@positionChange))
    dancer.body.position.set(basePosition.x, basePosition.y, basePosition.z)