class window.Visualizer
  # Get those keys set up
  keys: { PAUSE: 32, NEXT: 78 }

  # Set up the scene based on a Main object which contains the scene.
  constructor: (scene, camera) ->
    @viewer = new VisualizerViewer(scene, camera)
    
    @choreographyRoutine = new ChoreographyRoutine(@viewer)

    @setupGUI()

    @choreographyRoutine.playNext()

  setupGUI: () ->
    gui = new dat.GUI()

    gui.add(@viewer.audioWindow, 'responsiveness', 0.0, 5.0)
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
      if !@danceMaterialTypes[value]?
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

  #Event methods
  onKeyDown: (event) ->
    switch event.keyCode
      when @keys.PAUSE
        if @viewer.playing then @viewer.pause() else @viewer.play(@viewer.currentlyPlaying)

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
