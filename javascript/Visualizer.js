// Generated by CoffeeScript 1.8.0
(function() {
  window.Visualizer = (function() {
    function Visualizer(scene, camera) {
      var defaultDancer;
      this.scene = scene;
      this.dancers = new Array();
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      this.audioWindow = new AudioWindow(2048, 1);
      this.loadedAudio = new Array();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.startOffset = 0;
      this.play('audio/Glasser.mp3');
      defaultDancer = new Dancer();
      this.dancers.push(defaultDancer);
      this.scene.add(defaultDancer.body);
    }

    Visualizer.prototype.render = function() {
      var dancer, _i, _len, _ref, _results;
      if (!this.playing) {
        return;
      }
      this.audioWindow.update(this.analyser);
      _ref = this.dancers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dancer = _ref[_i];
        _results.push(dancer.update(this.audioWindow));
      }
      return _results;
    };

    Visualizer.prototype.pause = function() {
      this.source.stop();
      this.playing = false;
      return this.startOffset += this.audioContext.currentTime - this.startTime;
    };

    Visualizer.prototype.onKeyDown = function(event) {
      if (event.keyCode === 80) {
        if (this.playing) {
          return this.pause();
        } else {
          return this.play(this.currentlyPlaying);
        }
      }
    };

    Visualizer.prototype.createLiveInput = function() {
      var gotStream;
      gotStream = (function(_this) {
        return function(stream) {
          _this.source = _this.audioContext.createMediaStreamSource(stream);
          return _this.source.connect(_this.analyser);
        };
      })(this);
      this.dbSampleBuf = new Uint8Array(2048);
      if (navigator.getUserMedia) {
        return navigator.getUserMedia({
          audio: true
        }, gotStream, function(err) {
          return console.log(err);
        });
      } else if (navigator.webkitGetUserMedia) {
        return navigator.webkitGetUserMedia({
          audio: true
        }, gotStream, function(err) {
          return console.log(err);
        });
      } else if (navigator.mozGetUserMedia) {
        return navigator.mozGetUserMedia({
          audio: true
        }, gotStream, function(err) {
          return console.log(err);
        });
      } else {
        return alert("Error: getUserMedia not supported!");
      }
    };

    Visualizer.prototype.play = function(url) {
      var request;
      this.currentlyPlaying = url;
      if (this.loadedAudio[url] != null) {
        this.loadFromBuffer(this.loadedAudio[url]);
        return;
      }
      request = new XMLHttpRequest();
      request.open("GET", url, true);
      request.responseType = 'arraybuffer';
      request.onload = (function(_this) {
        return function() {
          _this.audioContext.decodeAudioData(request.response, function(buffer) {
            _this.loadedAudio[url] = buffer;
            return _this.loadFromBuffer(buffer);
          }, function(err) {
            return console.log(err);
          });
        };
      })(this);
      request.send();
    };

    Visualizer.prototype.loadFromBuffer = function(buffer) {
      this.startTime = this.audioContext.currentTime;
      this.source = this.audioContext.createBufferSource();
      this.source.buffer = buffer;
      this.source.connect(this.analyser);
      this.source.connect(this.audioContext.destination);
      this.playing = true;
      return this.source.start(0, this.startOffset);
    };

    return Visualizer;

  })();

}).call(this);
