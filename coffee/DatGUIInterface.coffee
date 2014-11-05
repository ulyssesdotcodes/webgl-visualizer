class window.DatGUIInterface
  constructor: () ->
    @routineWindow = $('#routine')
    @routineStage = $('#routineStage')

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

    updateDancerFolder = (value, obj) =>
      updateFolder(Visualizer.dancerTypes, dancerFolder, @choreographyRoutine.dancerParams, value, obj)
    dancerController.onChange updateDancerFolder

    [danceController, danceFolder] = setupFolder('Dance parameters', 'dance', Object.keys(Visualizer.danceTypes))

    updateDanceFolder = (value, obj) =>
      updateFolder(Visualizer.danceTypes, danceFolder, @choreographyRoutine.danceParams, value, obj)
    danceController.onChange updateDanceFolder

    [danceMaterialController, danceMaterialFolder] = setupFolder('Dance material paramaters', 'danceMaterial',
      Object.keys(Visualizer.danceMaterialTypes))

    updateDanceMaterialFolder = (value, obj) =>
      updateFolder(Visualizer.danceMaterialTypes, danceMaterialFolder, @choreographyRoutine.danceMaterialParams, value,
        obj)
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

  setupRoutineStage: () ->
    @refreshRoutines()
    $('#routinePush').click (e) =>
      e.preventDefault()
      @choreographyRoutine.pushCurrentRoutine $('#pushName').val(), () =>
        @refreshRoutines()

    $('#routineSelect').change (e) =>
      @currentRoutineId = $('#routineSelect option:selected').val()
      @choreographyRoutine.loadRoutineById @currentRoutineId, (routine) =>
        @routineStage.html(@choreographyRoutine.routines[@currentRoutineId].data)


    $('#routineQueue').click (e) =>
      e.preventDefault()
      @choreographyRoutine.queueRoutine(@currentRoutineId)

  refreshRoutines: () ->
    $('#routineSelect').empty()
    for key in Object.keys(@choreographyRoutine.routines)
      value = @choreographyRoutine.routines[key]
      $('#routineSelect').append($("<option></option>").attr("value", key).text(value.name));

  updateText: (json) ->
    @routineWindow.html(JSON.stringify(json, undefined, 2))
