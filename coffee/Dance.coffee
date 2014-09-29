# Controls the mesh of the provided Dancer's body
class window.Dance
  constructor: () ->
    # default scale Effect.


  update: (audioWindow, dancer) ->
    # update the Dancer's body mesh to reflect the audio event
    averageDb = audioWindow.averageDb
    dancer.body.scale.set(averageDb, averageDb, averageDb)
	