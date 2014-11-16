class window.SoundCloudLoader
  @client_id = "384835fc6e109a2533f83591ae3713e9"

  @constructor: (@player) ->
    return

  @loadStream: (url, successCallback, errorCallback) ->
    SC.initialize
      client_id: @constructor.client_id
    
    SC.get '/resolve', { url: url }, (sound) ->
      if sound.errors
        errorCallback()
      else
        if sound.kind == 'playlist'
          @sound = sound
          @streamPlaylistIndex = 0
          @streamUrl = () => 
            sound.tracks[@streamPlaylistIndex].stream_url + '?client_id=' + @constructor.client_id
          successCallback()
        else
          @sound = sound
          @streamUrl = () =>
            return sound.stream_url + '?client_id=' + @constructor.client_id
  @directStream = (direction) =>
    if direction == 'toggle'
      if @player.paused
        @player.play()
      else
        @player.pause()
    else if @sound.kind == 'playlist'
      if direction == 'coasting'
        @streamPlaylistIndex++
      else if direction = 'forward'
        if @streamPlaylistIndex >= @sound.track_count-1
          @streamPlaylistIndex++
        else
          @streamPlaylistIndex--
      else
        if @streamPlaylistIndex <= 0
          @streamPlaylistIndex = @sound.track_count - 1
        else
          @streamPlaylistIndex--

      if @streamPlaylistIndex >= 0 && @streamPlaylistIndex <= @sound.track_count - 1
        @player.setAttribute @streamUrl()
        @player.play()
