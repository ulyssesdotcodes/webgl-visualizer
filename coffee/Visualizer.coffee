class window.Visualizer
  # Get those keys set up
  keys: { PAUSE: 80, SCALE_DANCE: 83, POSITION_DANCE: 68 }

  # Set up the scene based on a Main object which contains the scene.
  constructor: (scene, camera) ->
    @scene = scene
    @dancers = new Array()
    @shaderLoader = new ShaderLoader()


    # Create the audio context
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    @audioContext = new AudioContext()
    @audioWindow = new AudioWindow(2048, 1);
    @loadedAudio = new Array()
    @analyser = @audioContext.createAnalyser()
    @analyser.fftSize = 2048
    @startOffset = 0

    # Load the sample audio
    @play('audio/Glasser.mp3')

    # simpleFreqShader = new SimpleFrequencyShader(@shaderLoader)
    # simpleFreqShader.loadShader @audioWindow, (danceMaterial) =>
    #   defaultDancer = new CubeDancer(new PositionDance(0.2), danceMaterial)
    #   @dancers.push(defaultDancer)
    #   @scene.add(defaultDancer.body)
    
    defaultDancer = new CubeDancer(new PositionDance(0.2), new ColorDanceMaterial(0))
    @dancers.push(defaultDancer)
    @scene.add(defaultDancer.body)

  # Render the scene by going through the AudioObject array and calling update(audioEvent) on each one
  render: () ->
    if !@playing
      return
    
    @audioWindow.update(@analyser)
    # Create event
    for dancer in @dancers
      dancer.update(@audioWindow)

  pause: () ->
    @source.stop()
    @playing = false
    @startOffset += @audioContext.currentTime - @startTime

  #Event methods
  onKeyDown: (event) ->
    switch event.keyCode
      when @keys.PAUSE
        if @playing then @pause() else @play(@currentlyPlaying)
      when @keys.SCALE_DANCE
        @dancers[0].dance.reset(@dancers[0])
        @dancers[0].dance = new ScaleDance(0.5)
      when @keys.POSITION_DANCE
        @dancers[0].dance.reset(@dancers[0])
        @dancers[0].dance = new PositionDance(0.2)

  # Utility methods

  createLiveInput: () ->
    gotStream = (stream) =>
        @source = @audioContext.createMediaStreamSource stream
        @source.connect @analyser

    @dbSampleBuf = new Uint8Array(2048)

    if ( navigator.getUserMedia )
        navigator.getUserMedia({audio:true}, gotStream, (err) -> console.log(err) )
    else if (navigator.webkitGetUserMedia )
        navigator.webkitGetUserMedia({audio:true}, gotStream, (err) -> console.log(err) )
    else if (navigator.mozGetUserMedia )
        navigator.mozGetUserMedia({audio:true}, gotStream, (err) -> console.log(err) )
    else
        return(alert("Error: getUserMedia not supported!"));

  play: (url) ->
    @currentlyPlaying = url

    if @loadedAudio[url]?
      @loadFromBuffer(@loadedAudio[url])
      return

    request = new XMLHttpRequest()
    request.open("GET", url, true)
    request.responseType = 'arraybuffer'
    request.onload = () => 
      @audioContext.decodeAudioData request.response
          , (buffer) =>
            @loadedAudio[url] = buffer
            @loadFromBuffer(buffer)
          , (err) -> console.log(err)
      return

    request.send()
    return
  
  loadFromBuffer: (buffer) ->
    @startTime = @audioContext.currentTime
    @source = @audioContext.createBufferSource()
    @source.buffer = buffer
    @source.connect(@analyser)
    @source.connect(@audioContext.destination)
    @playing = true
    @source.start(0, @startOffset)