class window.QueueView
  constructor: (@routinesController) ->
    return

  createView: (target) ->
    @queueContainer = $ "<div>"

    target.append @queueContainer

    target = @queueContainer

    @pushSuccessful = $ "<div>",
      text: "Push successful"
      class: "hide"

    target.append @pushSuccessful

    @queueName = $ "<input>",
      type: "text"

    target.append @queueName

    @pushButton = $ "<a>",
      href: "#"
      text: "Push"

    @pushButton.click (e) =>
      e.preventDefault()
      @routinesController.pushRoutine @queueName.val(), @queue, () =>
        @pushSuccessful.removeClass "hide"

    target.append @pushButton

    @routineView = $ "<pre>",
      id: 'queue'

    target.append @routineView

  updateText: (currentIndex, routineQueue) ->
    @pushSuccessful.addClass "hide"

    @queue = routineQueue
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