require './AudioWindow.coffee'

# Plays the audio and creates an analyser
class window.Player
  constructor: () ->
    @audioWindow = new AudioWindow(1);
    @loadedAudio = new Array()
    @startOffset = 0
    @setupAnalyser()

  setupAnalyser: () ->
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    @audioContext = new AudioContext()
    @analyser = @audioContext.createAnalyser()
    @analyser.fftSize = AudioWindow.bufferSize

  update: () ->
    @audioWindow.update(@analyser, @audioContext.currentTime)

  pause: () ->
    @source.stop()
    @playing = false
    @startOffset += @audioContext.currentTime - @startTime

  createLiveInput: () ->
    gotStream = (stream) =>
      @playing = true
      @source = @audioContext.createMediaStreamSource stream
      @source.connect @analyser

    @dbSampleBuf = new Uint8Array(2048)

    if ( navigator.getUserMedia )
      navigator.getUserMedia({ audio: true }, gotStream, (err) ->
        console.log(err))
    else if (navigator.webkitGetUserMedia )
      navigator.webkitGetUserMedia({ audio: true }, gotStream, (err) ->
        console.log(err))
    else if (navigator.mozGetUserMedia )
      navigator.mozGetUserMedia({ audio: true }, gotStream, (err) ->
        console.log(err))
    else
      return(alert("Error: getUserMedia not supported!"));

  play: (url) ->
    @currentlyPlaying = url

    if @loadedAudio[url]?
      @loadFromBuffer(@loadedAudio[url])
      return

    request = new XMLHttpRequest()
    request.open("GET", url, true)
    request.responseType = 'arraybuffer'
    request.onload = () =>
      @audioContext.decodeAudioData request.response
      , (buffer) =>
        @loadedAudio[url] = buffer
        @loadFromBuffer(buffer)
      , (err) ->
        console.log(err)
      return

    request.send()
    return

  loadFromBuffer: (buffer) ->
    @startTime = @audioContext.currentTime
    @source = @audioContext.createBufferSource()
    @source.buffer = buffer
    @source.connect(@analyser)
    @source.connect(@audioContext.destination)
    @playing = true
    @source.start(0, @startOffset)

  setPlayer: (player) ->
    @source = @audioContext.createMediaElementSource(player)
    @source.connect(@analyser)
    @analyser.connect(@audioContext.destination)
    @playing = true

  pause: () ->
    if @player.playing then @pause() else @play(@currentlyPlaying)
