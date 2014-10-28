require './Dancer.coffee'

class window.SphereDancer extends Dancer
  @name: "SphereDancer"

  constructor: (dance, danceMaterial, @options) ->
    if @options? then { position, scale } = @options
    super(new THREE.SphereGeometry(1, 32, 24), dance, danceMaterial, position, scale)