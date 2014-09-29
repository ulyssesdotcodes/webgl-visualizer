# Contains the frequencySamples and dbSamples for audio
class window.AudioWindow
  constructor: (bufferSize, volume) ->
    @volume = volume
    @bufferSize = bufferSize
    @frequencyBuffer = new Uint8Array(bufferSize)
    @dbBuffer = new Uint8Array(bufferSize)

  update: (analyser) ->
    if !analyser
      return

    analyser.getByteTimeDomainData(@dbBuffer)
    analyser.getByteFrequencyData(@frequencyBuffer)

    rms = 0

    for buf in @dbBuffer
        val = (buf - 128) / 128
        rms += val*val

    @averageDb = Math.sqrt(rms / @bufferSize) * @volume
    # TODO: smooth