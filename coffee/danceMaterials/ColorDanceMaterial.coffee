class window.ColorDanceMaterial
	constructor: (smoothingFactor) ->
		# set a default material. red?
		@newColor = 0

		@smoothingFactor = smoothingFactor

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

		dancer.body.material.color.setHex(@newColor)
