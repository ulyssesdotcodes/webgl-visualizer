class window.Visualizer
  # Get those keys set up
  keys: { PAUSE: 32, SCALE_DANCE: 83, POSITION_DANCE: 68, SHADER: 49, COLOR: 50, SPHERE: 51, CUBE: 52, NEXT: 78 }

  # Set up the scene based on a Main object which contains the scene.
  constructor: (scene, camera) ->
    @scene = scene
    @dancers = new Array()
    @shaderLoader = new ShaderLoader()

    @setupGUI()


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

    # simpleFreqShader = new SimpleFrequencyShader(@shaderLoader)
    # simpleFreqShader.loadShader @audioWindow, (danceMaterial) =>
    #   defaultDancer = new CubeDancer(new PositionDance(0.2), danceMaterial)
    #   @dancers.push(defaultDancer)
    #   @scene.add(defaultDancer.body)
    @choreography = [
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

    @choreographyBeat = 0

    @nextChoreography()

  setupGUI: () ->
    currentMove = new ChoreographyMove()
    currentMove.visualizer = @

    gui = new dat.GUI()
    gui.add(currentMove, 'id')
    dancerController  = gui.add(currentMove, 'dancer', Object.keys(@dancerTypes))
    dancerFolder = gui.addFolder('Dancer parameters')
    dancerFolder.open()
    dancerController.onFinishChange (value) =>
      if !@dancerTypes[value]?
        return

      while dancerFolder.__controllers[0]?
        dancerFolder.remove(dancerFolder.__controllers[0])

      for param in @dancerTypes[value].params
        currentMove.dancerParams[param.name] = param.default
        dancerFolder.add(currentMove.dancerParams, param.name)

    danceController = gui.add(currentMove, 'dance', Object.keys(@danceTypes))
    danceFolder = gui.addFolder('Dance parameters')
    danceFolder.open()
    danceController.onChange (value) =>
      if !@danceTypes[value]?
        return

      while danceFolder.__controllers[0]?
        danceFolder.remove(danceFolder.__controllers[0])

      for param in @danceTypes[value].params
        currentMove.danceParams[param.name] = param.default
        danceFolder.add(currentMove.danceParams, param.name)
    
    danceMaterialController = gui.add(currentMove, 'danceMaterial', Object.keys(@danceMaterialTypes))

    danceMaterialFolder = gui.addFolder('Dance material parameters')
    danceMaterialFolder.open()
    danceMaterialController.onChange (value) =>
      if !@danceMaterialTypes[value]?
        return

      while danceMaterialFolder.__controllers[0]?
        danceMaterialFolder.remove(danceMaterialFolder.__controllers[0])

      for param in @danceMaterialTypes[value].params
        currentMove.danceMaterialParams[param.name] = param.default
        danceMaterialFolder.add(currentMove.danceMaterialParams, param.name)

    gui.add(currentMove, 'move')

  # Render the scene by going through the AudioObject array and calling update(audioEvent) on each one
  render: () ->
    if !@playing
      return
    
    @audioWindow.update(@analyser, @audioContext.currentTime)
    # Create event
    for dancer in @dancers
      dancer.update(@audioWindow)

  pause: () ->
    @source.stop()
    @playing = false
    @startOffset += @audioContext.currentTime - @startTime

  #Event methods
  onKeyDown: (event) ->
    return
    switch event.keyCode
      when @keys.PAUSE
        if @playing then @pause() else @play(@currentlyPlaying)

      when @keys.SCALE_DANCE
        @receiveChoreography({ id: 0, dance: { type: 'ScaleDance', params: { smoothingFactor: 0.5 } } })

      when @keys.POSITION_DANCE
        @receiveChoreography({ id: 0, dance: { type: 'PositionDance', params: { smoothingFactor: 0.2, direction: [0, 2.0, 0] } } })

      when @keys.COLOR
        @receiveChoreography
          id: 1
          danceMaterial:
            type: 'ColorDanceMaterial'
            params:
              smoothingFactor: 0.5

      when @keys.SHADER
        @receiveChoreography
          id: 1
          danceMaterial:
            type: 'SimpleFrequencyShader'

      when @keys.SPHERE
        @receiveChoreography
          id: 1
          dancer:
            type: 'SphereDancer'

      when @keys.CUBE
        @receiveChoreography
          id: 1
          dancer:
            type: 'CubeDancer'

      when @keys.NEXT
        @nextChoreography()

  nextChoreography: () ->
    if @choreographyBeat == @choreography.length
      @choreographyBeat = 0

    moment = @choreography[@choreographyBeat++]
    for change in moment
      @receiveChoreography change

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
          currentDancer.dance = new @danceTypes[dance.type](dance.params)
          return
        else
          newDance = new @danceTypes[dance.type](dance.params)
      else
        newDance = currentDancer.dance

      addDancer = (newDance, newMaterial) =>
        if dancer?
          newDancer = new @dancerTypes[dancer.type](newDance, newMaterial, dancer.params)
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
          newMaterial = new @danceMaterialTypes[danceMaterial.type](@shaderLoader)
          newMaterial.loadShader @audioWindow, (shaderMaterial) =>
            addDancer newDance, shaderMaterial
          return

        newMaterial = new @danceMaterialTypes[danceMaterial.type](danceMaterial.params)
      else
        newMaterial = currentDancer.danceMaterial

      addDancer(newDance, newMaterial)

      return
    else if id?
      @dancers[id] = new @dancerTypes[dancer.type](new @danceTypes[dance.type](dance.params), new @danceMaterialTypes[danceMaterial.type](danceMaterial.params), dancer.params)
      @scene.add @dancers[id].body
      return
    else
      return



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

  dancerTypes:
    CubeDancer: CubeDancer
    SphereDancer: SphereDancer
    PointCloudDancer: PointCloudDancer

  danceTypes:
    ScaleDance: ScaleDance
    PositionDance: PositionDance

  danceMaterialTypes:
    ColorDanceMaterial: ColorDanceMaterial
    SimpleFrequencyShader: SimpleFrequencyShader
