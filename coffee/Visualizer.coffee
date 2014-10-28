require './Player.coffee'
require './ChoreographyRoutine.coffee'
require './dancers/CubeDancer.coffee'
require './dancers/SphereDancer.coffee'
require './dancers/PointCloudDancer.coffee'
require './dances/ScaleDance.coffee'
require './dances/PositionDance.coffee'
require './dances/RotateDance.coffee'
require './danceMaterials/ColorDanceMaterial.coffee'
require './danceMaterials/SimpleFrequencyShader.coffee'

class window.Visualizer
  # Get those keys set up
  keys: { PAUSE: 32, NEXT: 78 }

  # Set up the scene based on a Main object which contains the scene.
  constructor: (@viewer, @interface) ->
    @player = new Player()

    # Load the sample audio
    # @play('audio/Go.mp3')
    # @play('audio/Glasser.mp3')
    # @play('audio/OnMyMind.mp3')

    @player.createLiveInput()

    @choreographyRoutine = new ChoreographyRoutine(@)

    @interface.setupPopup()
    @interface.setup(@player, @choreographyRoutine, @viewer)

    @choreographyRoutine.playNext()

  receiveChoreography: (move) ->
    @viewer.receiveChoreography move
    if @popup? then @popup.postMessage(@wrapMessage('choreography', move), @domain)

  render: () ->
    if !@player.playing
      return

    @player.update()

    @viewer.render(@player.audioWindow)
    if @popup? then @popup.postMessage(@wrapMessage('render', @player.audioWindow), @domain)

  wrapMessage: (type, data) ->
    type: type
    data: data

  #Event methods
  onKeyDown: (event) ->
    switch event.keyCode
      when @keys.PAUSE
        @player.pause()
      when @keys.NEXT
        @choreographyRoutine.playNext()

  @dancerTypes:
    CubeDancer: CubeDancer
    SphereDancer: SphereDancer
    PointCloudDancer: PointCloudDancer

  @danceTypes:
    ScaleDance: ScaleDance
    PositionDance: PositionDance
    RotateDance: RotateDance

  @danceMaterialTypes:
    ColorDanceMaterial: ColorDanceMaterial
    SimpleFrequencyShader: SimpleFrequencyShader
