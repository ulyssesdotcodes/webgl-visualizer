class window.AudioView
  createView: (target, onMic, onUrl) ->
    @audioPlayer = $ "<audio />",
      controls: true
    
    @controls = $ "<div>"

    @mic = $ "<a>",
      href: '#'
    
    micIcon = $ "<img/>",
      class: "icon"
      src: "./resources/ic_mic_none_white_48dp.png"

    @mic.append micIcon
    @controls.append @mic

    @mic.click (e) =>
      e.preventDefault()
      onMic()

    @input = $ "<input>",
      type: "text"
    @controls.append @input

    @input.change (e) =>
      onUrl(@input.val())

    target.append @controls
    target.append @audioPlayer
  
  playStream: (url, onEnd) ->
    @audioPlayer.bind 'ended', onEnd
    @audioPlayer.attr 'src', url
    @audioPlayer.trigger 'play'
