class window.ColorDanceMaterial
	constructor: (@smoothingFactor) ->
		@newColor = 0
		@material = new THREE.MeshLambertMaterial({ color: 0x00000, wireframe: true })

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
			if (value > maxValue / 10)
				maxImportantIndex = i

		newColor = 0xffffff * (maxIndex / maxImportantIndex);

		@newColor = @smoothingFactor * newColor + (1 - @smoothingFactor) * @newColor

		dancer.body.material.emissive.setHex(@newColor)
		dancer.body.material.color.setHex(@newColor)
