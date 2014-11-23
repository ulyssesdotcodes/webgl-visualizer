class window.ShaderMaterial
  @params: 
    [
      {
        name: "shaderName"
        default: "simple_frequency"
      }
    ]

  @name: "ShaderMaterial"
  
  constructor: (@shaderLoader, options) ->
    if options? then { @shaderName } = options
    @target = 256
    @size = AudioWindow.bufferSize
    @channels = 4
    @newTexArray = new Uint8Array(@target * @channels)
    @buffer = new Uint8Array(@target)
  
  loadTexture: (next) ->
    @shaderLoader.load @shaderName, (shader) =>
      shader.uniforms = {
        audioResolution: { type: "1i", value: @target }
        freqTexture: {type: "t", value: AudioWindow.bufferSize}
        time: { type: "1f", value: 0.0 }
      }

      @material = new THREE.ShaderMaterial(shader)
      @material.transparent = true
      next(@)

  update: (audioWindow, dancer) ->
    if !dancer.body.material?
      return

    @reduceArrayToBuffer(audioWindow.frequencyBuffer)
    @mapChannel(@buffer, @newTexArray, 'r', @channels)

    @reduceArrayToBuffer(audioWindow.dbBuffer)
    @mapChannel(@buffer, @newTexArray, 'g', @channels)

    @reduceArrayToBuffer(audioWindow.smoothFrequencyBuffer)
    @mapChannel(@buffer, @newTexArray, 'b', @channels)

    @reduceArrayToBuffer(audioWindow.smoothDbBuffer)
    @mapChannel(@buffer, @newTexArray, 'a', @channels)

    texture = new THREE.DataTexture(@newTexArray, @target, 1, THREE.RGBAFormat, THREE.UnsignedByteType)
    texture.needsUpdate = true
    texture.flipY = false
    texture.generateMipmaps = false
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearFilter
    texture.unpackAlignment = 1

    dancer.body.material.uniforms.freqTexture.value = texture
    dancer.body.material.uniforms.time.value = audioWindow.time

  reduceArrayToBuffer: (freqBuf) ->
    movingSum = 0
    flooredRatio = Math.floor(freqBuf.length / @target)
    for i in [1...freqBuf.length]
      movingSum += freqBuf[i]

      if ((i + 1) % flooredRatio) == 0
        @buffer[Math.floor(i  / flooredRatio)] = movingSum / flooredRatio
        movingSum = 0

  mapWithOffset: (buffer, out, offset) ->
    for i in [1..buffer.length]
      out[i + offset] = buffer[i]
  
  mapChannel: (buffer, out, channel, channels) ->
    cIndex = 
      switch channel
        when 'r','x' then 0
        when 'g','y' then 1
        when 'b','z' then 2
        when 'a' then 3
        else channel

    for i in [1..buffer.length]
      out[i * channels + cIndex] = buffer[i]
