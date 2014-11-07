class window.QueueView
  createView: (target) ->
    # Add queue view to target
    @routineView = $ "<pre>",
      id: 'queue'

    target.append @routineView

  updateText: (currentIndex, routineQueue) ->
    # Display routineQueue with current index highlighted
    html = []

    for routine, i in routineQueue
      if i == currentIndex
        html.push("<span class='bold'>")

      html.push(@stringify(routine))

      if i == currentIndex
        html.push("</span>")

      html.push(',\n')

    @routineView.html(html.join(""))

  stringify: (json) ->
    JSON.stringify(json, undefined, 2)