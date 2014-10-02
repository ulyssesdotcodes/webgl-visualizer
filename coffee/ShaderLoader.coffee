class window.ShaderLoader
  # Construct the shader cache
  constructor: () ->
    @shaders = new Array()

  # Takes a name and a callback, loads that shader from /shaders, caches the result
  load: (name, next) ->
    if @shaders[name]?
      next(@shaders[name])
    else
      @shaders[name] = {vertexShader: '', fragmentShader: ''}
      @loadFromUrl(name, 'shaders/' + name, next)

  # Loads the shaderfrom a URL
  loadFromUrl: (name, url, next) ->

    loadedShader = (jqXHR, textStatus) ->
      @shaders[@name][@type] = jqXHR.responseText
      if (@shaders[@name].vertexShader? && @shaders[@name].fragmentShader)
        next(@shaders[@name])

    $.ajax
      url: url + '.vert'
      dataType: 'text'
      context: {
        name: name
        type: 'vertexShader'
        next: next
        shaders: @shaders
      }
      complete: loadedShader 

    $.ajax
      url: url + '.frag'
      dataType: 'text'
      context: {
        name: name
        type: 'fragmentShader'
        next: next
        shaders: @shaders
      }
      complete: loadedShader 

    return