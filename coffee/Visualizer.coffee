class window.Visualizer
  # Get those keys set up
  keys: { PAUSE: 32, NEXT: 78 }

  # Set up the scene based on a Main object which contains the scene.
  constructor: (@viewer) ->
    @audioWindow = new AudioWindow(2048, 1);
    @loadedAudio = new Array()
    @startOffset = 0

    @setupAnalyser()

    # Load the sample audio
    # @play('audio/Go.mp3')
    # @play('audio/Glasser.mp3')
    # @play('audio/OnMyMind.mp3')

    @createLiveInput()

    @choreographyRoutine = new ChoreographyRoutine(@)

    @setupGUI()

    @choreographyRoutine.playNext()

  setupAnalyser: () ->
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    @audioContext = new AudioContext()
    @analyser = @audioContext.createAnalyser()
    @analyser.fftSize = 2048

  setupPopup: () ->
    $('#viewerButton').click (e) =>
      e.preventDefault()
      @domain = window.location.protocol + '//' + window.location.host
      popupURL = @domain + location.pathname + 'viewer.html'
      @popup = window.open(popupURL, 'myWindow')

      # We have to delay catching the window up because it has to load first.
      sendBeats = () =>
        routineBeat = @choreographyRoutine.routineBeat
        @choreographyRoutine.routineBeat = -1
        while @choreographyRoutine.routineBeat < routineBeat
          @choreographyRoutine.playNext()
      setTimeout sendBeats, 100

  setupGUI: () ->
    gui = new dat.GUI()

    gui.add(@audioWindow, 'responsiveness', 0.0, 5.0)
    idController = gui.add(@choreographyRoutine, 'id')

    setupFolder = (name, varName, keys) =>
      controller = gui.add(@choreographyRoutine, varName, keys)
      folder = gui.addFolder(name)
      folder.open()
      return [ controller, folder ]

    updateFolder = (types, folder, params, value, obj) ->
      if !types[value]?
        return

      while folder.__controllers[0]?
        folder.remove(folder.__controllers[0])

      for param in types[value].params
        params[param.name] =
          if obj?.options?[param.name]
            obj.options[param.name]
          else
            param.default

        folder.add(params, param.name)

    [dancerController, dancerFolder] = setupFolder('Dancer parameters', 'dancer', Object.keys(Visualizer.dancerTypes))

    dancerController.onChange (value, obj) =>
      updateFolder(Visualizer.dancerTypes, dancerFolder, @choreographyRoutine.dancerParams, value, obj)

    [danceController, danceFolder] = setupFolder('Dance parameters', 'dance', Object.keys(Visualizer.danceTypes))

    danceController.onChange (value, obj) =>
      updateFolder(Visualizer.danceTypes, danceFolder, @choreographyRoutine.danceParams, value, obj)

    [danceMaterialController, danceMaterialFolder] = setupFolder('Dance material paramaters', 'danceMaterial',
      Object.keys(Visualizer.danceMaterialTypes))

    danceMaterialController.onChange (value, obj) =>
      updateFolder(Visualizer.danceMaterialTypes, danceMaterialFolder, @choreographyRoutine.danceMaterialParams, value,
        obj)


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
      navigator.getUserMedia({ audio: true }, gotStream, (err) ->
        console.log(err))
    else if (navigator.webkitGetUserMedia )
      navigator.webkitGetUserMedia({ audio: true }, gotStream, (err) ->
        console.log(err))
    else if (navigator.mozGetUserMedia )
      navigator.mozGetUserMedia({ audio: true }, gotStream, (err) ->
        console.log(err))
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
      , (err) ->
        console.log(err)
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
