class window.Visualizer
  # Set up the scene based on a Main object which contains the scene.
  constructor: (scene, camera) ->
    @scene = scene
    @dancers = new Array()

    defaultDancer = new Dancer()
    @dancers.push(defaultDancer)
    @scene.add( defaultDancer.body )



  # Render the scene by going through the AudioObject array and calling update(audioEvent) on each one
  render: () ->
    # Create event
    for dancer in @dancers
      dancer.update()

