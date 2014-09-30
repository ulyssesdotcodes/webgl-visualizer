class window.PositionDance
	constructor: (smoothingFactor) ->
		@smoothingFactor = smoothingFactor
		@positionChange = 0
		@direction = new THREE.Vector3(0, 1, 0)

	update: (audioWindow, dancer, direction) ->
		direction ?= @direction
		basePosition = dancer.body.position -  @direction.multiplyScalar(@positionChange)
		@direction = direction
		@positionChange = audioWindow.averageDb * @smoothingFactor + (1 - @smoothingFactor) * @positionChange

		newPosition = new THREE.Vector3()
		newPosition.addVectors(basePosition, @direction.multiplyScalar(@positionChange))

		dancer.body.position.set(newPosition.x, newPosition.y, newPosition.z)