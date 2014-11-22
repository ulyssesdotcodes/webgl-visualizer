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
    @newTexArray = new Uint8Array(@target * 2)
    @buffer = new Uint8Array(@target)
  
  loadTexture: (next) ->
    @shaderLoader.load @shaderName, (shader) =>
      shader.uniforms = {
        audioResolution: { type: "1i", value: @target }
        freqTexture: {type: "t", value: AudioWindow.bufferSize}
        time: { type: "1f", value: 0.0 }
      }

      @material = new THREE.ShaderMaterial(shader)
      @material.side = THREE.DoubleSide
      @material.transparent = true
      next(@)

  update: (audioWindow, dancer) ->
    if !dancer.body.material?
      return

    @reduceArrayToBuffer(audioWindow.frequencyBuffer)
    for i in [0...@target * 2]
      @newTexArray[i] = @buffer[i % @target]


    texture = new THREE.DataTexture(@newTexArray, @target, 2, THREE.LuminanceFormat, THREE.UnsignedByte)
    texture.needsUpdate = true
    texture.flipY = false
    texture.generateMipmaps = false
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearFilter
    texture.unpackAlignment = 1
    texture.anisotropy = 4

    dancer.body.material.uniforms.freqTexture.value = texture
    dancer.body.material.uniforms.time.value = audioWindow.time

  reduceArrayToBuffer: (freqBuf) ->

    @buffer = new Array(@target)

    movingSum = 0
    flooredRatio = Math.floor(@size / @target)
    for i in [1...@size]
      movingSum += freqBuf[i]

      if ((i + 1) % flooredRatio) == 0
        @buffer[Math.floor(i  / flooredRatio)] = movingSum / flooredRatio
        movingSum = 0


