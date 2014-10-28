class window.DatGUIInterface
  constructor: () ->
    @routineWindow = $('#routine')

  setup: (@player, @choreographyRoutine, @viewer) ->
    gui = new dat.GUI()

    gui.add(@player.audioWindow, 'responsiveness', 0.0, 5.0)
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

    @setupPopup()


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

  updateText: (json) ->
    @routineWindow.html(JSON.stringify(json, undefined, 2))
