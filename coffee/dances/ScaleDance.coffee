# Controls the mesh of the provided Dancer's body
class window.ScaleDance
  @params:
    [
      {
        name: 'smoothingFactor'
        default: 0.5
      }, 
      {
        name: 'min'
        default: [0.5, 0.5, 0.5]
      },
      {
        name: 'max'
        default: [1, 1, 1]
      }
    ]

  constructor: (options) ->
    if options? then { @smoothingFactor, min, max } = options
    @smoothingFactor ?= 0.5
    @averageDb = 0
    @min = if min then new THREE.Vector3(min[0], min[1], min[2]) else new THREE.Vector3(0.5, 0.5, 0.5)
    @max = if max then new THREE.Vector3(max[0], max[1], max[2]) else new THREE.Vector3(1, 1, 1)
    @scale = new THREE.Vector3()

  update: (audioWindow, dancer) ->
    # update the Dancer's body mesh to reflect the audio event
    if (audioWindow.averageDb < @averageDb)
    	@averageDb = audioWindow.averageDb * @smoothingFactor + (1 - @smoothingFactor) * @averageDb
    else 
    	smoothingFactor = Math.max(1, @smoothingFactor * 4)
    	@averageDb = audioWindow.averageDb * smoothingFactor + (1 - smoothingFactor) * @averageDb

    @scale.copy(@min)

    @scale.lerp(@max, @averageDb)

    dancer.body.scale.set(@scale.x, @scale.y, @scale.z)
	
  reset: (dancer) ->
  	dancer.body.scale.set(1, 1, 1)
