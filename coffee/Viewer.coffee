require './ShaderLoader.coffee'
require '../javascript/Queue.js'

class window.Viewer
  constructor: (scene, camera) ->
    @scene = scene
    @dancers = new Array()
    @shaderLoader = new ShaderLoader()

    @choreographyQueue = new Queue()

  receiveChoreography: (move) ->
    @choreographyQueue.push(move)

  executeChoreography: ({id, dancer, dance, danceMaterial }) ->
    if id == -1
      for dancer in @dancers
        @scene.remove(dancer.body)
      @dancers = []
      return
    if @dancers[id]?
      # Test everything else
      currentDancer = @dancers[id]

      # If no parameters are set, but an id is, then remove the object
      if !dancer? && !dance && !danceMaterial
        @scene.remove(currentDancer.body)
        @dancers.splice(@dancers.indexOf(id), 1)

      if dance? 
        if !dancer? && !danceMaterial?
          currentDancer.reset()
          currentDancer.dance = new Visualizer.danceTypes[dance.type](dance.params)
          return
        else
          newDance = new Visualizer.danceTypes[dance.type](dance.params)
      else
        newDance = currentDancer.dance

      addDancer = (newDance, newMaterial) =>
        if dancer?
          newDancer = new Visualizer.dancerTypes[dancer.type](newDance, newMaterial, dancer.params)
        else
          newDancer = new currentDancer.constructor(newDance, newMaterial)

        currentDancer.reset()
        @scene.remove(currentDancer.body)
        @dancers[id] = newDancer
        @scene.add(newDancer.body)

      if danceMaterial?
        # Special case for shaders because it has to load the shader file
        # This is a really hacky way of checking if it's a shader. Should change.
        if danceMaterial.type == "ShaderMaterial"
          danceMaterial.params.shaderLoader = @shaderLoader

          newMaterial = new Visualizer.danceMaterialTypes[danceMaterial.type] @shaderLoader, danceMaterial.params
          newMaterial.loadTexture (shaderMaterial) =>
            addDancer newDance, shaderMaterial
          return

        newMaterial = new Visualizer.danceMaterialTypes[danceMaterial.type](danceMaterial.params)
      else
        newMaterial = currentDancer.danceMaterial

      addDancer(newDance, newMaterial)

      return
    else if id?
      addDancer = (newMaterial) =>
        @dancers[id] = new Visualizer.dancerTypes[dancer.type](new Visualizer.danceTypes[dance.type](dance.params), newMaterial, dancer.params)
        @scene.add @dancers[id].body

      if danceMaterial.type == "ShaderMaterial"
        newMaterial = new Visualizer.danceMaterialTypes[danceMaterial.type] @shaderLoader, danceMaterial.params
        newMaterial.loadTexture addDancer
      else
        addDancer new Visualizer.danceMaterialTypes[danceMaterial.type](danceMaterial.params)
      return
    else
      return

  getDancer: (id) ->
    @dancers[id]


  # Render the scene by going through the AudioObject array and calling update(audioEvent) on each one
  render: (audioWindow) ->
    while @choreographyQueue.length() > 0
      @executeChoreography @choreographyQueue.shift()
    # Create event
    for id in Object.keys(@dancers)
      @dancers[id].update(audioWindow)

  # Removes the last dancer, returns the dancer's dance
  removeLastDancer: () ->
    prevDancer = @dancers.pop()
    @scene.remove(prevDancer.body) 
    return prevDancer.dance
