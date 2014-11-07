require './RoutinesService.coffee'

class window.RoutinesController
  constructor: () ->
    @routines = []
    @routinesService = new RoutinesService()

  getRoutine: (id, next) ->
    # load from service or from @routines
    if @routines[id].data != ""
      next @routines.data
      return

    @routinesService.getRoutine id, (routine) =>
      @routines[id].data = JSON.parse(routine.data)
      console.log @routines[id]
      next(@routines[id])

  refreshRoutines: (next) ->
    # get routines from server and cache sans data
    @routinesService.getRoutines (data) =>
      for routine in data
        if @routines[routine.id]?
          @routines[routine.id] = routine.name
        else
          @routines[routine.id] = routine

      next(@routines)