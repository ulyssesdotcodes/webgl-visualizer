require './Player.coffee'
require './SoundCloudLoader.coffee'
require './ChoreographyRoutine.coffee'
require './dancers/CubeDancer.coffee'
require './dancers/SphereDancer.coffee'
require './dancers/PointCloudDancer.coffee'
require './dances/ScaleDance.coffee'
require './dances/PositionDance.coffee'
require './dances/RotateDance.coffee'
require './danceMaterials/ColorDanceMaterial.coffee'
require './danceMaterials/ShaderMaterial.coffee'

class window.Visualizer
  # Get those keys set up
  keys: { PAUSE: 32, NEXT: 78 }

  # Set up the scene based on a Main object which contains the scene.
  constructor: (@viewer, @interface, @routinesController) ->
    @player = new Player()

    # Load the sample audio
    # @play('audio/Go.mp3')
    # @play('audio/Glasser.mp3')
    # @play('audio/OnMyMind.mp3')

    # @player.createLiveInput()

    @choreographyRoutine = new ChoreographyRoutine(@)

    @interface.setup @player, @choreographyRoutine, @viewer, (url) =>
      @soundCloudLoader.loadStream url, () ->
        console.log "playing " + url
   
    @soundCloudLoader = new SoundCloudLoader(@interface.audioView)

    url = 
      if window.location.hash != ""
        "https://soundcloud.com/" + window.location.hash.substring(1)
      else
        "https://soundcloud.com/redviolin/swing-tape-3"
    @soundCloudLoader.loadStream url, () =>
      console.log "Playing some music"

    @choreographyRoutine.playNext()

  receiveChoreography: (send, move) ->
    @viewer.receiveChoreography move
    if send && @interface.popup? then @interface.popup.postMessage(@wrapMessage('choreography', move), @interface.domain)

  render: () ->
    if !@player.playing && !@player.miked
      return

    @player.update()

    @viewer.render(@player.audioWindow)
    if @interface.popup? then @interface.popup.postMessage(@wrapMessage('render', @player.audioWindow), @interface.domain)

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
    ShaderMaterial: ShaderMaterial

  pause: () ->
    if @player.playing then @pause() else @play(@currentlyPlaying)
