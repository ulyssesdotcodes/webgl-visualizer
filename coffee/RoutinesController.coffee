class window.RoutinesController
  constructor: () ->
    @routines = []

  getRoutine: (id, next) ->
    # load from service or from @routines

  refreshRoutines: (next) ->
    # get routines from server and cache sans data