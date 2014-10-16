class window.SimpleFrequencyShader
  @params: []

  @name: "SimpleFrequencyShader"
  
  constructor: (shaderLoader) ->
    @target = 128
    @size = 1024
    @shaderLoader = shaderLoader
    @newTexArray = new Uint8Array(@target * @target * 4)

  loadShader: (audioWindow, next) ->    
    @shaderLoader.load 'simple_frequency', (shader) =>
      shader.uniforms = {
        freqTexture: {type: "t", value: @reduceArray(audioWindow.frequencyBuffer)}
        resolution: { type: "v2", value: new THREE.Vector2(128, 128)}
      }

      @material = new THREE.ShaderMaterial(shader)
      @material.side = THREE.DoubleSide
      @material.transparent = true
      next(@)


  update: (audioWindow, dancer) ->
    dancer.body.material.uniforms.freqTexture.value = @reduceArray(audioWindow.frequencyBuffer)

  reduceArray: (freqBuf) ->

    newBuf = new Array(@target)

    movingSum = 0
    flooredRatio = Math.floor(@size / @target)
    for i in [1...@size]
      movingSum += freqBuf[i]

      if ((i + 1) % flooredRatio) == 0
        newBuf[Math.floor(i  / flooredRatio)] = movingSum / flooredRatio
        movingSum = 0


    for i in [0...@target]
      for j in [0...@target]
        baseIndex = i * @target * 4 + j * 4;
        if newBuf[j] > i * 2
          @newTexArray[baseIndex] = 255
          @newTexArray[baseIndex + 1] = 255
          @newTexArray[baseIndex + 2] = 255
          @newTexArray[baseIndex + 3] = 255
        else 
          @newTexArray[baseIndex] = 0
          @newTexArray[baseIndex + 1] = 0
          @newTexArray[baseIndex + 2] = 0
          @newTexArray[baseIndex + 3] = 0

    texture = new THREE.DataTexture(@newTexArray, @target, @target, THREE.RGBAFormat, THREE.UnsignedByte)
    texture.needsUpdate = true
    texture.flipY = false
    texture.generateMipmaps = false
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearFilter
    texture.unpackAlignment = 1
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.anisotropy = 4

    return texture