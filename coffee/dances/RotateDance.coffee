class window.RotateDance
  @name: "RotateDance"

  @params:
    [
      {
        name: 'axis'
        default: [0, 1, 0]
      },
      {
        name: 'minRotation'
        default: 0.05
      },
      {
        name: 'speed'
        default: 1
      },
    ]

  constructor: (@options) ->
    if @options? then { axis, @minRotation, @speed } = @options
    @minRotation ?= 0.05
    @speed ?= 1

    axis ?= [0, 1, 0]
    @axis = new THREE.Vector3(axis[0], axis[1], axis[2])

    @time = 0

  update: (audioWindow, dancer) ->
    absRotation = audioWindow.averageDb * @speed

    dancer.body.rotateOnAxis @axis, (@minRotation + absRotation * (0.9)) * Math.PI * ((audioWindow.time - @time) / 1000)

    @time = audioWindow.time

  reset: (dancer) ->
    dancer.body.rotation.set(0, 0, 0)
