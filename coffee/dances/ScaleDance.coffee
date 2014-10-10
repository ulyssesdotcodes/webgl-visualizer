# Controls the mesh of the provided Dancer's body
class window.ScaleDance
  constructor: (options) ->
    { @smoothingFactor, @min, @max } = options
    @averageDb = 0
    @min ?= new THREE.Vector3(0.5, 0.5, 0.5)
    @max ?= new THREE.Vector3(1.5, 1.5, 1.5)
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
