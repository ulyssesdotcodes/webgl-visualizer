class window.Visualizer
  # Get those keys set up
  keys: { PAUSE: 32, NEXT: 78 }

  # Set up the scene based on a Main object which contains the scene.
  constructor: (scene, camera) ->
    @viewer = new VisualizerViewer(scene, camera)

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
    @play('audio/Glasser.mp3')
    # @play('audio/OnMyMind.mp3')

    # @createLiveInput()
    
    @choreographyRoutine = new ChoreographyRoutine(@)

    @setupGUI()

    @choreographyRoutine.playNext()

    $('#viewerButton').click (e) =>
      e.preventDefault()
      @domain = window.location.protocol + '//' + window.location.host
      popupURL = @domain + location.pathname + 'viewer.html'
      @popup = window.open(popupURL, 'myWindow')
      routineBeat = @choreographyRoutine.routineBeat
      @choreographyRoutine.routineBeat = -1
      while @choreographyRoutine.routineBeat < routineBeat
        @choreographyRoutine.playNext()

  setupGUI: () ->
    gui = new dat.GUI()

    gui.add(@audioWindow, 'responsiveness', 0.0, 5.0)
    idController = gui.add(@choreographyRoutine, 'id')

    dancerController  = gui.add(@choreographyRoutine, 'dancer', Object.keys(Visualizer.dancerTypes))
    dancerFolder = gui.addFolder('Dancer parameters')
    dancerFolder.open()
    updateDancerFolder = (value, obj) =>
      if !Visualizer.dancerTypes[value]?
        return

      while dancerFolder.__controllers[0]?
        dancerFolder.remove(dancerFolder.__controllers[0])

      for param in Visualizer.dancerTypes[value].params
        @choreographyRoutine.dancerParams[param.name] = 
          if obj?.options?[param.name]
            obj.options[param.name]
          else
            param.default

        dancerFolder.add(@choreographyRoutine.dancerParams, param.name) 

    dancerController.onFinishChange updateDancerFolder

    danceController = gui.add(@choreographyRoutine, 'dance', Object.keys(Visualizer.danceTypes))
    danceFolder = gui.addFolder('Dance parameters')
    danceFolder.open()
    updateDanceFolder = (value, obj) =>
      if !Visualizer.danceTypes[value]?
        return

      while danceFolder.__controllers[0]?
        danceFolder.remove(danceFolder.__controllers[0])

      for param in Visualizer.danceTypes[value].params
        @choreographyRoutine.danceParams[param.name] = 
          if obj?.options?[param.name]
            obj.options[param.name]
          else
            param.default
        danceFolder.add(@choreographyRoutine.danceParams, param.name)
    danceController.onChange updateDanceFolder
    
    danceMaterialController = gui.add(@choreographyRoutine, 'danceMaterial', Object.keys(Visualizer.danceMaterialTypes))

    danceMaterialFolder = gui.addFolder('Dance material parameters')
    danceMaterialFolder.open()
    updateDanceMaterialFolder = (value, obj) =>
      if !Visualizer.danceMaterialTypes[value]?
        return

      while danceMaterialFolder.__controllers[0]?
        danceMaterialFolder.remove(danceMaterialFolder.__controllers[0])

      for param in Visualizer.danceMaterialTypes[value].params
        @choreographyRoutine.danceMaterialParams[param.name] = 
          if obj?.options?[param.name]
            obj.options[param.name]
          else
            param.default
        danceMaterialFolder.add(@choreographyRoutine.danceMaterialParams, param.name)
    danceMaterialController.onChange updateDanceMaterialFolder

    idController.onChange (value) =>
      idDancer = @viewer.getDancer(value)
      if idDancer?
        @choreographyRoutine.updateDancer idDancer
        for controller in gui.__controllers
          controller.updateDisplay()
        
        updateDancerFolder(@choreographyRoutine.dancer, idDancer)
        updateDanceMaterialFolder(@choreographyRoutine.danceMaterial, idDancer.danceMaterial)
        updateDanceFolder(@choreographyRoutine.dance, idDancer.dance)

    gui.add(@choreographyRoutine, 'preview')
    gui.add(@choreographyRoutine, 'add')
    gui.add(@choreographyRoutine, 'insertBeat')
    gui.add(@choreographyRoutine, 'playNext')
    gui.add(@choreographyRoutine, 'reset')

  receiveChoreography: (move) ->
    @viewer.receiveChoreography move
    if @popup? then @popup.postMessage(@wrapMessage('choreography', move), @domain)

  render: () ->
    if !@playing
      return
    
    @audioWindow.update(@analyser, @audioContext.currentTime)

    @viewer.render(@audioWindow)
    if @popup? then @popup.postMessage(@wrapMessage('render', @audioWindow), @domain)

  wrapMessage: (type, data) ->
    {
      type: type
      data: data
    }

  #Event methods
  onKeyDown: (event) ->
    switch event.keyCode
      when @keys.PAUSE
        if @playing then @pause() else @play(@currentlyPlaying)

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

  loadFromBuffer: (buffer) ->
    @startTime = @audioContext.currentTime
    @source = @audioContext.createBufferSource()
    @source.buffer = buffer
    @source.connect(@analyser)
    @source.connect(@audioContext.destination)
    @playing = true
    @source.start(0, @startOffset)
