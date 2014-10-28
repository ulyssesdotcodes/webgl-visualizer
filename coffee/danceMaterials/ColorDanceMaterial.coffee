class window.ColorDanceMaterial
  @params: 
    [
      {
        name: 'smoothingFactor',
        default: 0.5
      }, 
      {
        name: 'minL',
        default: 0.1
      }, 
      {
        name: 'minS',
        default: 0.3
      },
      {
        name: 'wireframe'
        default: false
      }
    ]

  @name: "ColorDanceMaterial"

  constructor: (@options) ->
    if @options? then { @smoothingFactor, @minL, @minS, @wireframe } = @options
    @smoothingFactor ?= 0.5
    @minL ?= 0.1
    @minS ?= 0.3
    @wireframe ?= false
    @color = new THREE.Color(1.0, 0, 0)
    @material = new THREE.MeshLambertMaterial({ color: 0x00000, wireframe: @wireframe })
    @appliedColor = @color.clone()

  update: (audioWindow, dancer) ->

    maxValue = 0
    maxIndex = -1
    maxImportantIndex = 1
    for i in [1..AudioWindow.bufferSize]
      freq = audioWindow.frequencyBuffer[i]
      value = freq * i
      if (value > maxValue)
        maxValue = value
        maxIndex = i

    oldColorHSL = @appliedColor.getHSL()

    newColorS = maxIndex / AudioWindow.bufferSize;
    newColorS = @smoothingFactor * newColorS + (1 - @smoothingFactor) * oldColorHSL.s

    newColorL = audioWindow.averageDb
    newColorL = @smoothingFactor * newColorL + (1 - @smoothingFactor) * oldColorHSL.l

    l = @minL + newColorL * (1.0 - @minL)
    s = @minS + newColorS * (1.0 - @minS)

    newColorH = (360 * (audioWindow.time / 10000) % 360) / 360

    hsl = @color.getHSL()
    @appliedColor.setHSL(newColorH, s, l)

    if dancer?
      if dancer.body.material.emissive?
        dancer.body.material.emissive.copy(@appliedColor)

      dancer.body.material.color.copy(@appliedColor)
