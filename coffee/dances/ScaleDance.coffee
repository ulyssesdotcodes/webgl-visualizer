# Controls the mesh of the provided Dancer's body
class window.ScaleDance
  constructor: (options) ->
    { @smoothingFactor } = options
    @averageDb = 0

  update: (audioWindow, dancer) ->
    # update the Dancer's body mesh to reflect the audio event
    if (audioWindow.averageDb < @averageDb)
    	@averageDb = audioWindow.averageDb * @smoothingFactor + (1 - @smoothingFactor) * @averageDb
    else 
    	smoothingFactor = Math.max(1, @smoothingFactor * 4)
    	@averageDb = audioWindow.averageDb * smoothingFactor + (1 - smoothingFactor) * @averageDb
    dancer.body.scale.set(@averageDb, @averageDb, @averageDb)
	
  reset: (dancer) ->
  	dancer.body.scale.set(1, 1, 1)