class window.VisualizerViewer
	constructor: () ->
    @domain = window.location.protocol + '//' + window.location.host

  addEventListener: () ->
    window.addEventListener 'message', (event) =>
      if (event.origin != @domain) then return
      @receiveEvent(event)

	receiveEvent: (event) ->
    console.log(event)
