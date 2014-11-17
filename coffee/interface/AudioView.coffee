class window.AudioView
  createView: (target) ->
    @audioPlayer = $ "<audio />",
      controls: true
    
    target.append @audioPlayer
  
  playStream: (url, onEnd) ->
    @audioPlayer.bind 'ended', onEnd
    @audioPlayer.attr 'src', url
    @audioPlayer.trigger 'play'
