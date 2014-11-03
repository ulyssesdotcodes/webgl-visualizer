require('./Config.coffee')

class window.ChoreographyRoutine
  constructor: (@visualizer) ->
    @id = 0
    @dancer = "CubeDancer"
    @dance = "ScaleDance"
    @danceMaterial = "ColorDanceMaterial"
    @dancerParams = {}
    @danceParams = {}
    @danceMaterialParams = {}

    $.ajax
      url: Config.server + '/routines/1'
      type: "GET"
      success: (data) =>
        _this.loadFirstRoutine(data)

    @refreshRoutines()

  loadFirstRoutine: (firstRoutine) ->
    @reset()
    @routine = JSON.parse(firstRoutine.data)
    @updateText()
    @playNext()

#    The first routine. This should be added to the server before running it.
#
#    @routine = [
#      [
#        { id: -1 },
#        {
#          id: 2
#          dancer:
#            type: 'CubeDancer'
#          dance:
#            type: 'PositionDance'
#            params:
#              smoothingFactor: 0.5
#              direction: [0, 4.0, 0]
#          danceMaterial:
#            type: 'ColorDanceMaterial'
#            params:
#              smoothingFactor: 0.5
#        },
#        {
#          id: 0
#          dancer:
#            type: 'PointCloudDancer'
#          dance:
#            type: 'RotateDance'
#            params:
#              axis: [-1, -1, 0]
#          danceMaterial:
#            type: 'ColorDanceMaterial'
#            params:
#              smoothingFactor: 0.5
#              minL: 0.0
#        },
#        {
#          id: 1
#          dancer:
#            type: 'PointCloudDancer'
#          dance:
#            type: 'RotateDance'
#            params:
#              axis: [0, 1, 1]
#              speed: 0.5
#          danceMaterial:
#            type: 'ColorDanceMaterial'
#            params:
#              smoothingFactor: 0.5
#              minL: 0.0
#        }
#      ],
#      [
#        {
#          id: 2
#          dancer:
#            type: 'SphereDancer'
#            params:
#              position: [0.5, 0, 0.5]
#        },
#        {
#          id: 3
#          dancer:
#            type: 'SphereDancer'
#            params:
#              position: [0.5, 0, -0.5]
#          dance:
#            type: 'ScaleDance'
#            params:
#              smoothingFactor: 0.5
#          danceMaterial:
#            type: 'ColorDanceMaterial'
#            params:
#              smoothingFactor: 0.5
#              wireframe: true
#        },
#        {
#          id: 4
#          dancer:
#            type: 'SphereDancer'
#            params:
#              position: [-0.5, 0, 0.5]
#          dance:
#            type: 'ScaleDance'
#            params:
#              smoothingFactor: 0.5
#          danceMaterial:
#            type: 'ColorDanceMaterial'
#            params:
#              smoothingFactor: 0.5
#              wireframe: true
#        },
#        {
#          id: 5
#          dancer:
#            type: 'SphereDancer'
#            params:
#              position: [-0.5, 0, -0.5]
#          dance:
#            type: 'PositionDance'
#            params:
#              smoothingFactor: 0.5
#          danceMaterial:
#            type: 'ColorDanceMaterial'
#            params:
#              smoothingFactor: 0.5
#              wireframe: true
#        },
#      ]
#    ]

  preview: () ->
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

  add: () ->
    @routineMoment.push
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

    @updateText()

  insertBeat: () ->
    @routineMoment = []
    @routine.splice(++@routineBeat, 0, @routineMoment)
    @updateText()

  playNext: () ->
    if @routineBeat == @routine.length - 1
      @routineBeat = -1

    @routineMoment = @routine[++@routineBeat]
    for change in @routineMoment
      @visualizer.receiveChoreography change

  reset: () ->
    @routine = []
    @routineMoment = []
    @routineBeat = -1

  updateText: () ->
    @visualizer.interface.updateText(@routine)

  refreshRoutines: () ->
    $.ajax
      url: Config.server + '/routines'
      type: 'GET'
      success: (data) =>
        @routines = data


  updateDancer: (dancer) ->
    @dancer = dancer.constructor.name
    @danceMaterial = dancer.danceMaterial.constructor.name
    @dance = dancer.dance.constructor.name

