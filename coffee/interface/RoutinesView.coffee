class window.RoutinesView
  constructor: (@choreographyRoutine, @routinesController) ->
    return

  createView: (target) ->
    # Add routines view to target
    @routinesContainer = $ "<div>",
      id: 'routinesContainer'
    target.append @routinesContainer

    @selector = $ "<select>",
      id: 'routineSelect'

    @selector.change () =>
      @onSelect($("#routineSelect option:selected").val())

    @routinesContainer.append @selector

    @queueButton = $ "<a>",
      href: "#"
      text: "Queue"

    @queueButton.click (e) =>
      e.preventDefault()
      @onQueue()

    @routinesContainer.append @queueButton

    @routineView = $ "<pre>",
      id: 'routineView'

    @routinesContainer.append @routineView

  updateText: (routineData) ->
    # Display routine text in main view
    @currentRoutine = routineData
    @routineView.html(JSON.stringify(routineData, undefined, 2))

  updateRoutines: (next) ->
    # Display names of the routines in the select
    @routinesController.refreshRoutines (routines) =>
      @selector.empty()
      for routine in routines
        if !routine? then continue
        option = $ "<option>",
          value: routine.id
          text: routine.name

        @selector.append(option)

      if next? then next()

  onQueue: () ->
    # Queue in choreography routine
    @choreographyRoutine.queueRoutine(@currentRoutine)

  onSelect: (id) ->
    # updateText with routine
    @routinesController.getRoutine id, (routine) =>
      @updateText(routine.data)
