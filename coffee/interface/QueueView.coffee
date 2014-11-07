class window.QueueView
  createView: (target) ->
    # Add queue view to target
    @routineView = $ "<pre>"
    @routineView.addClass "routinesView"
    target.append @routineView

  updateText: (currentIndex, routineQueue) ->
    # Display routineQueue with current index highlighted
    html = []

    for routine, i in routineQueue
      if i == currentIndex
        html.push("<span class='bold'>")

      console.log "i: " + i + ", ci: " + currentIndex
      html.push(@stringify(routine))

      if i == currentIndex
        html.push("</span>")

      html.push(',\n')

    @routineView.html(html.join(""))

  stringify: (json) ->
    JSON.stringify(json, undefined, 2)