class window.SimpleFrequencyShader
  @params: []

  @name: "SimpleFrequencyShader"
  
  constructor: (shaderLoader) ->
    @target = 256
    @size = 1024
    @shaderLoader = shaderLoader
    @newTexArray = new Uint8Array(@target * 8)

  loadShader: (next) ->
    @shaderLoader.load 'simple_frequency', (shader) =>
      shader.uniforms = {
        time: { type: "1f", value: 0 }
        audioResolution: { type: "v2", value: [@target, 2] }
        freqTexture: { type: "t", value: AudioWindow.bufferSize}
      }

      @material = new THREE.ShaderMaterial(shader)
      @material.side = THREE.DoubleSide
      @material.transparent = true
      next(@)


  update: (audioWindow, dancer) ->
    dancer.body.material.uniforms.freqTexture.value = @reduceArray(audioWindow.frequencyBuffer)
    dancer.body.material.uniforms.time.value = audioWindow.time

  reduceArray: (freqBuf) ->

    newBuf = new Array(@target)

    movingSum = 0
    flooredRatio = Math.floor(@size / @target)
    for i in [1...@size]
      movingSum += freqBuf[i]

      if ((i + 1) % flooredRatio) == 0
        newBuf[Math.floor(i  / flooredRatio)] = movingSum / flooredRatio
        movingSum = 0


    for i in [0...@target * 8]
      @newTexArray[i] = newBuf[i % @target]

    texture = new THREE.DataTexture(@newTexArray, @target, 2, THREE.LuminanceFormat, THREE.UnsignedByte)
    texture.needsUpdate = true
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearFilter
    texture.unpackAlignment = 1

    return texture
