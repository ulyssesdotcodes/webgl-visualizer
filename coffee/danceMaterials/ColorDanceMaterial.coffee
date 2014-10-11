class window.ColorDanceMaterial
	constructor: (options) ->
		{ @smoothingFactor, @minL, @minS } = options
		@minL ?= 0.1
		@minS ?= 0.3
		@color = new THREE.Color(1.0, 0, 0)
		@material = new THREE.MeshLambertMaterial({ color: 0x00000, wireframe: true })
		@appliedColor = @color.clone()

	update: (audioWindow, dancer) ->

		maxValue = 0
		maxIndex = -1
		maxImportantIndex = 1
		for i in [1..audioWindow.bufferSize]
			freq = audioWindow.frequencyBuffer[i]
			value = freq * i
			if (value > maxValue)
				maxValue = value
				maxIndex = i

		oldColorHSL = @appliedColor.getHSL()

		newColorS = maxIndex / audioWindow.bufferSize;
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
