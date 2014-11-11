class window.RoutinesService
  @server = "http://visualizer.upopple.com/"

  getRoutines: (next) ->
    # get routines
    $.ajax
      url: @constructor.server + 'routines'
      type: "GET"
      success: (data) ->
        next(data)

  getRoutine: (id, next) ->
    # get routine from from server
    $.ajax
      url: @constructor.server + 'routines/' + id
      type: "GET"
      success: (data) ->
        next(data)


  createRoutine: (data, next) ->
    # post data to server
    $.ajax
      url: @constructor.server + 'routines'
      type: 'POST'
      data: JSON.stringify data
      success: (data) ->
        next()