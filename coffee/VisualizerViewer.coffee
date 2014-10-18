class window.VisualizerViewer
  constructor: (scene, camera) ->
    @scene = scene
    @dancers = new Array()
    @shaderLoader = new ShaderLoader()

  receiveChoreography: ({id, dancer, dance, danceMaterial }) ->
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
        if danceMaterial.type.indexOf('Shader') > -1
          newMaterial = new Visualizer.danceMaterialTypes[danceMaterial.type](@shaderLoader)
          newMaterial.loadShader @audioWindow, (shaderMaterial) =>
            addDancer newDance, shaderMaterial
          return

        newMaterial = new Visualizer.danceMaterialTypes[danceMaterial.type](danceMaterial.params)
      else
        newMaterial = currentDancer.danceMaterial

      addDancer(newDance, newMaterial)

      return
    else if id?
      @dancers[id] = new Visualizer.dancerTypes[dancer.type](new Visualizer.danceTypes[dance.type](dance.params), new Visualizer.danceMaterialTypes[danceMaterial.type](danceMaterial.params), dancer.params)
      @scene.add @dancers[id].body
      return
    else
      return

  getDancer: (id) ->
    @dancers[id]


  # Render the scene by going through the AudioObject array and calling update(audioEvent) on each one
  render: (audioWindow) ->
    # Create event
    for id in Object.keys(@dancers)
      @dancers[id].update(audioWindow)

  # Removes the last dancer, returns the dancer's dance
  removeLastDancer: () ->
    prevDancer = @dancers.pop()
    @scene.remove(prevDancer.body) 
    return prevDancer.dance