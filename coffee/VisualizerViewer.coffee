class window.VisualizerViewer
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
    # @play('audio/Go.mp3')
    # @play('audio/Glasser.mp3')
    # @play('audio/OnMyMind.mp3')

    @createLiveInput()

  receiveChoreography: ({id, dancer, dance, danceMaterial }) ->
    if id == -1
      for dancer in @dancers
        @scene.remove(dancer.body)
      @dancers = []
      return
    if @dancers[id]?
      # Test everything else
      currentDancer = @dancers[id]

      # If no parameters are set, but an id is, then remove the object
      if !dancer? && !dance && !danceMaterial
        @scene.remove(currentDancer.body)
        @dancers.splice(@dancers.indexOf(id), 1)

      if dance? 
        if !dancer? && !danceMaterial?
          currentDancer.reset()
          currentDancer.dance = new Visualizer.danceTypes[dance.type](dance.params)
          return
        else
          newDance = new Visualizer.danceTypes[dance.type](dance.params)
      else
        newDance = currentDancer.dance

      addDancer = (newDance, newMaterial) =>
        if dancer?
          newDancer = new Visualizer.dancerTypes[dancer.type](newDance, newMaterial, dancer.params)
        else
          newDancer = new currentDancer.constructor(newDance, newMaterial)

        currentDancer.reset()
        @scene.remove(currentDancer.body)
        @dancers[id] = newDancer
        @scene.add(newDancer.body)

      if danceMaterial?
        # Special case for shaders because it has to load the shader file
        # This is a really hacky way of checking if it's a shader. Should change.
        if danceMaterial.type.indexOf('Shader') > -1
          newMaterial = new Visualizer.danceMaterialTypes[danceMaterial.type](@shaderLoader)
          newMaterial.loadShader @audioWindow, (shaderMaterial) =>
            addDancer newDance, shaderMaterial
          return

        newMaterial = new Visualizer.danceMaterialTypes[danceMaterial.type](danceMaterial.params)
      else
        newMaterial = currentDancer.danceMaterial

      addDancer(newDance, newMaterial)

      return
    else if id?
      @dancers[id] = new Visualizer.dancerTypes[dancer.type](new Visualizer.danceTypes[dance.type](dance.params), new Visualizer.danceMaterialTypes[danceMaterial.type](danceMaterial.params), dancer.params)
      @scene.add @dancers[id].body
      return
    else
      return

  getDancer: (id) ->
    @dancers[id]
    

  # Render the scene by going through the AudioObject array and calling update(audioEvent) on each one
  render: () ->
    if !@playing
      return
    
    @audioWindow.update(@analyser, @audioContext.currentTime)
    # Create event
    for id in Object.keys(@dancers)
      @dancers[id].update(@audioWindow)

  pause: () ->
    @source.stop()
    @playing = false
    @startOffset += @audioContext.currentTime - @startTime


  # Utility methods

  createLiveInput: () ->
    gotStream = (stream) =>
      @playing = true  
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

  # Removes the last dancer, returns the dancer's dance
  removeLastDancer: () ->
    prevDancer = @dancers.pop()
    @scene.remove(prevDancer.body) 
    return prevDancer.dance

  loadFromBuffer: (buffer) ->
    @startTime = @audioContext.currentTime
    @source = @audioContext.createBufferSource()
    @source.buffer = buffer
    @source.connect(@analyser)
    @source.connect(@audioContext.destination)
    @playing = true
    @source.start(0, @startOffset)