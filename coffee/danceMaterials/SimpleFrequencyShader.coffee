class window.SimpleFrequencyShader
  constructor: (shaderLoader) ->
    @shaderLoader = shaderLoader

  loadShader: (audioWindow, next) ->    
    @shaderLoader.load 'simple_frequency', (shader) =>
      shader.uniforms = {
        freqTexture: {type: "t", value: @reduceArray(audioWindow.frequencyBuffer)}
        resolution: { type: "v2", value: new THREE.Vector2(128, 128)}
      }

      @material = new THREE.ShaderMaterial(shader)
      next(@)


  update: (audioWindow, dancer) ->
    dancer.body.material.uniforms.freqTexture.value = @reduceArray(audioWindow.frequencyBuffer)

  reduceArray: (freqBuf) ->
    target = 64
    size = 2048

    newBuf = new Array(target)

    movingSum = 0
    flooredRatio = Math.floor(size / target)
    for i in [1..size]
      movingSum += freqBuf[i]

      if ((i + 1) % flooredRatio) == 0
        newBuf[Math.floor(i  / flooredRatio)] = movingSum / flooredRatio
        movingSum = 0

    newTexArray = new Uint8Array(target * target * 4)

    for i in [0..target]
      for j in [0..target]
        if newBuf[j] < i * 4
          newTexArray[i * target + j * 4] = 255
          newTexArray[i * target + j * 4 + 1] = 255
          newTexArray[i * target + j * 4 + 2] = 255
          newTexArray[i * target + j * 4 + 3] = 255
        else 
          newTexArray[i * target + j * 4] = 0
          newTexArray[i * target + j * 4 + 1] = 0
          newTexArray[i * target + j * 4 + 2] = 0
          newTexArray[i * target + j * 4 + 3] = 0

    texture = new THREE.DataTexture(newTexArray, target, target, THREE.RGBAFormat, THREE.UnsignedByte)
    texture.needsUpdate = true

    return texture