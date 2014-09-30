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
    dancer.body.material.uniforms.freqTexture.needsUpdate

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

    newTexArray = new Uint8Array(target * target * 3)

    for i in [0..target]
      for j in [0..target]
        if newBuf[i] > j * 4
          newTexArray[i * j] = 255
          newTexArray[i * j + 1] = 255
          newTexArray[i * j + 2] = 255
        else 
          newTexArray[i * j] = 0
          newTexArray[i * j + 1] = 0
          newTexArray[i * j + 2] = 0

    texture = new THREE.DataTexture(newTexArray, target, target, THREE.RGBFormat, THREE.UnsignedByte)
    texture.needsUpdate = true

    return texture