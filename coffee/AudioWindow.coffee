# Contains the frequencySamples and dbSamples for audio
class window.AudioWindow
  constructor: (bufferSize, responsiveness) ->
    @responsiveness = responsiveness
    @bufferSize = bufferSize
    @frequencyBuffer = new Uint8Array(bufferSize)
    @dbBuffer = new Uint8Array(bufferSize)
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

    @averageDb = Math.sqrt(rms / @bufferSize) * @responsiveness
    # TODO: smooth