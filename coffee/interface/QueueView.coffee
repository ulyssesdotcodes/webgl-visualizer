class window.QueueView
  constructor: (@choreographyRoutine) ->
    return

  createView: (target) ->
    @queueContainer = $ "<div>"

    target.append @queueContainer

    @controls = $ "<div>"

    @queueContainer.append @controls

    @pushSuccessful = $ "<div>",
      text: "Push successful"
      class: "hide"

    @controls.append @pushSuccessful

    @invalidJSON = $ "<div>",
      text: "Invalid json"
      class: "hide"

    @controls.append @invalidJSON

    @queueName = $ "<input>",
      type: "text"

    @controls.append @queueName

    @pushButton = $ "<a>",
      href: "#"
      text: "Push"

    @pushButton.click (e) =>
      e.preventDefault()
      @onPush()

    @controls.append @pushButton

    @routineView = $ "<pre>",
      id: 'queue'
      class: 'scrollable no-margin'
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
        @choreographyRoutine.routine = @queue

    @queueContainer.height(target.height() - target.find('a').height())
    @routineView.height(@queueContainer.height() - @controls.height())

    @queueContainer.append @routineView

  onPush: () ->
    if @jsonInvalid
      return
    @choreographyRoutine.createRoutine @queueName.val(), =>
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