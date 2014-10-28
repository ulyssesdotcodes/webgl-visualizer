require './Dancer.coffee'

class window.CubeDancer extends Dancer
  @name: "CubeDancer"
  
  constructor: (dance, danceMaterial, @options) ->
    if @options? then { position, scale } = @options
    super(new THREE.BoxGeometry(1, 1, 1), dance, danceMaterial, position, scale)