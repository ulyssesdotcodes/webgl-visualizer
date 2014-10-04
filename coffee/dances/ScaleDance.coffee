# Controls the mesh of the provided Dancer's body
class window.ScaleDance
  constructor: (@smoothingFactor) ->
    # default scale Effect.
    @averageDb = 0

  update: (audioWindow, dancer) ->
    # update the Dancer's body mesh to reflect the audio event
    smoothingFactor = if audioWindow.averageDb < @averageDb then @smoothingFactor else Math.max(1, @smoothingFactor * 4)
    @averageDb = audioWindow.averageDb * smoothingFactor + (1 - smoothingFactor) * @averageDb

    dancer.body.scale.set(@averageDb, @averageDb, @averageDb)
  
  reset: (dancer) ->
    dancer.body.scale.set(1, 1, 1)