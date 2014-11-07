class window.QueueView
  createView: (target) ->
    # Add queue view to target
    @routineView = $ "<pre>"
    @routineView.addClass "routinesView"
    target.append @routineView

  updateText: (currentIndex, routineQueue) ->
    # Display routineQueue with current index highlighted
    html = []

    html.push(@stringify(routineQueue.slice(0, currentIndex)))
    html.push("<span class='bold'>")
    html.push(@stringify(routineQueue.slice(currentIndex, currentIndex + 1)))
    html.push("</span>")
    html.push(@stringify(routineQueue.slice(currentIndex + 1)))

    @routineView.html(html.join(""))

  stringify: (json) ->
    JSON.stringify(json, undefined, 2)