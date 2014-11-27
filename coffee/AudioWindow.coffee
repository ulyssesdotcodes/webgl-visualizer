# Contains the frequencySamples and dbSamples for audio
class window.AudioWindow
  @bufferSize: 512

  constructor: (responsiveness) ->
    @responsiveness = responsiveness
    @frequencyBuffer = new Uint8Array(@constructor.bufferSize)
    @dbBuffer = new Uint8Array(@constructor.bufferSize)
    @smoothFrequencyBuffer = new Uint8Array(@constructor.bufferSize)
    @smoothDbBuffer = new Uint8Array(@constructor.bufferSize)
    @fMax = new Uint8Array(@constructor.bufferSize)
    @dbMax = new Uint8Array(@constructor.bufferSize)
    @time = 0
    @deltaTime = 0
    @max = 0.0
    @current = 0.0

  update: (analyser, time) ->
    if !analyser
      return

    # Keep track of the audioContext time in ms
    newTime = time * 1000
    @deltaTime = newTime - @time
    deltaTimeS = @deltaTime * 0.001
    @time = newTime

    analyser.getByteTimeDomainData(@dbBuffer)
    analyser.getByteFrequencyData(@frequencyBuffer)

    for key,value of @frequencyBuffer
      # First make buffer change with responsiveness
      @frequencyBuffer[key] = value * @responsiveness

      # Then deal with smoothing
      @fMax[key] = Math.max(@fMax[key], value)

      if @smoothFrequencyBuffer[key] > @fMax[key]
        @smoothFrequencyBuffer[key] = 
          Math.min(Math.max(@smoothFrequencyBuffer[key] - 
            256 * deltaTimeS * 0.6, @fMax[key]),
            @smoothFrequencyBuffer[key])
      else 
        @smoothFrequencyBuffer[key] = 
          Math.min(Math.max(@smoothFrequencyBuffer[key] + 
            256 * deltaTimeS * 1.0, @smoothFrequencyBuffer[key]), 
            @fMax[key])

      @fMax[key] = Math.max(@fMax[key] - deltaTimeS * 256.0 * 0.6, 0)

    for key,value of @dbBuffer
      # First make buffer change with responsivenes
      @dbBuffer[key] = value * @responsiveness
      
      # Then deal with smoothing
      @dbMax[key] = 
        if Math.abs(value - 128) > Math.abs(@dbMax[key] - 128)
          value
        else 
          @dbMax[key]
      
      sign = Math.sign(@smoothDbBuffer[key] - 128)
      if sign == 0 then sign = 1
      diff = Math.abs(@smoothDbBuffer[key] - 128)
      maxDiff = Math.abs(@dbMax[key] - 128)


      if diff > maxDiff
        diff = Math.min(Math.max(256 * deltaTimeS, maxDiff), diff)
        @smoothDbBuffer[key] -= sign * diff
      else
        diff = Math.min(Math.max(256 * deltaTimeS, diff), maxDiff)
        @smoothDbBuffer[key] += sign * diff
      

      @dbMax[key] -= sign * Math.min(Math.abs(@dbMax[key] - 128), deltaTimeS * 256.0 * 0.6)

    rms = 0

    for buf in @dbBuffer
        val = (buf - 128) / 128
        rms += val*val

    @averageDb = Math.sqrt(rms / @constructor.bufferSize) * @responsiveness
