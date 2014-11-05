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
    @routines = []

    @reset()

  loadRoutineById: (id, next) ->
    $.ajax
      url: Config.server + '/routines/' + id
      type: "GET"
      success: (routine) =>
        _this.routines[id].data = routine.data
        next(_this.routines[routine.id])

  queueRoutine: (id) ->
    Array::push.apply @routine, JSON.parse(@routines[id].data)
    @updateText()

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

  refreshRoutines: (next) ->
    $.ajax
      url: Config.server + '/routines'
      type: 'GET'
      success: (data) =>
        for routine in data
          @routines[routine.id] = routine
        next()

  pushCurrentRoutine: (name, next) ->
    $.ajax
      url: Config.server + '/routines'
      type: 'POST'
      data: JSON.stringify
        name: name
        data: JSON.stringify(@routine)
      success: next

  updateDancer: (dancer) ->
    @dancer = dancer.constructor.name
    @danceMaterial = dancer.danceMaterial.constructor.name
    @dance = dancer.dance.constructor.name

