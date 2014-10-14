class window.ChoreographyRoutine
  constructor: () ->
    @id = 0
    @dancer = "CubeDancer"
    @dance = "ScaleDance"
    @danceMaterial = "ColorDanceMaterial"
    @dancerParams = {}
    @danceParams = {}
    @danceMaterialParams = {}

    @reset()
    @routine = [
      [
        { id: -1 },
        {
          id: 1
          dancer: 
            type: 'CubeDancer'
          dance:
            type: 'PositionDance'
            params:
              smoothingFactor: 0.5
              direction: [0, 4.0, 0]
          danceMaterial:
            type: 'ColorDanceMaterial'
            params:
              smoothingFactor: 0.5
        }
        {
          id: 0
          dancer: 
            type: 'PointCloudDancer'
          dance:
            type: 'ScaleDance'
            params:
              smoothingFactor: 0.5
              min: [1.0, 1.0, 1.0]
              max: [1.2, 1.2, 1.2]
          danceMaterial:
            type: 'ColorDanceMaterial'
            params:
              smoothingFactor: 0.5
              minL: 0.0
        }
      ],
      [
        { 
          id: 1
          dancer:
            type: 'SphereDancer'
            params:
              position: [0.5, 0, 0.5]
        },
        { 
          id: 2
          dancer:
            type: 'SphereDancer'
            params:
              position: [0.5, 0, -0.5]
          dance:
            type: 'ScaleDance'
            params:
              smoothingFactor: 0.5
          danceMaterial:
            type: 'ColorDanceMaterial'
            params:
              smoothingFactor: 0.5
        },
        { 
          id: 3
          dancer:
            type: 'SphereDancer'
            params:
              position: [-0.5, 0, 0.5]
          dance:
            type: 'ScaleDance'
            params:
              smoothingFactor: 0.5
          danceMaterial:
            type: 'ColorDanceMaterial'
            params:
              smoothingFactor: 0.5
        },
        { 
          id: 4
          dancer:
            type: 'SphereDancer'
            params:
              position: [-0.5, 0, -0.5]
          dance:
            type: 'PositionDance'
            params:
              smoothingFactor: 0.5
          danceMaterial:
            type: 'ColorDanceMaterial'
            params:
              smoothingFactor: 0.5
        },
      ]
    ]

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

  insertBeat: () ->
    @routineMoment = []
    @routine.splice(++@routineBeat, 0, @routineMoment)

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
