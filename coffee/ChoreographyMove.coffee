class window.ChoreographyMove
  constructor: () ->
    @id = 0
    @dancer = "CubeDancer"
    @dance = "ScaleDance"
    @danceMaterial = "ColorDanceMaterial"

  move: () ->
    @visualizer.receiveChoreography
      id: @id
      dancer:
        type: @dancer
        params: @dancerParams
      dance:
        type: @dance
        params: @danceParams
      danceMaterial:
        type: @danceMaterial
        params: @danceMaterialParams
