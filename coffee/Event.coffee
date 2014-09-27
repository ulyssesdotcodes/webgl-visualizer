# Contains the frequencySamples and dbSamples for audio
class window.Event
  constructor: (samples) ->
    @frequencySamples = new Uint8Array(samples)
    @dbSamples = new Uint8Array(samples)