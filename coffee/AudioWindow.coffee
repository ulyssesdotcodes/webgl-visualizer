# Contains the frequencySamples and dbSamples for audio
class window.AudioWindow
  @bufferSize: 2048

  constructor: (responsiveness) ->
    @responsiveness = responsiveness
    @frequencyBuffer = new Uint8Array(@constructor.bufferSize)
    @dbBuffer = new Uint8Array(@constructor.bufferSize)
    @time = 0
    @deltaTime = 0

  update: (analyser, time) ->
    if !analyser
      return

    # Keep track of the audioContext time in ms
    newTime = time * 1000
    @deltaTime = newTime - @time
    @time = newTime

    analyser.getByteTimeDomainData(@dbBuffer)
    analyser.getByteFrequencyData(@frequencyBuffer)

    rms = 0

    for buf in @dbBuffer
        val = (buf - 128) / 128
        rms += val*val

    @averageDb = Math.sqrt(rms / @constructor.bufferSize) * @responsiveness