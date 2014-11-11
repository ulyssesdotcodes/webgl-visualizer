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

    @invalidJSON = $ "<div>",
      text: "Invalid json"
      class: "hide"

    target.append @invalidJSON

    @queueName = $ "<input>",
      type: "text"

    target.append @queueName

    @pushButton = $ "<a>",
      href: "#"
      text: "Push"

    @pushButton.click (e) =>
      e.preventDefault()
      @onPush()

    target.append @pushButton

    @routineView = $ "<pre>",
      id: 'queue'
      contenteditable: true

    @routineView.keydown (e) ->
      e.stopPropagation()

    @routineView.on 'input', () =>
      try
        newJSON = JSON.parse("[" + @routineView.text() + "]")
      catch
        @jsonInvalid = true
        @invalidJSON.removeClass "hide"

      if !newJSON? || newJSON.length == 0
        @jsonInvalid = true
        @invalidJSON.removeClass "hide"
      else
        @jsonInvalid = false
        @invalidJSON.addClass "hide"
        @queue = newJSON


    target.append @routineView

  onPush: () ->
    if @jsonInvalid
      return
    @routinesController.pushRoutine @queueName.val(), @queue, () =>
      @pushSuccessful.removeClass "hide"

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

    @routineView.html(html.slice(0, html.length-1).join(""))

  stringify: (json) ->
    JSON.stringify(json, undefined, 2)