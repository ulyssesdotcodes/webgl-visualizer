// Generated by CoffeeScript 1.8.0
(function() {
  window.Visualizer = (function() {
    Visualizer.prototype.keys = {
      PAUSE: 32,
      NEXT: 78
    };

    function Visualizer(scene, camera) {
      this.scene = scene;
      this.dancers = new Array();
      this.shaderLoader = new ShaderLoader();
      this.setupGUI();
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      this.audioWindow = new AudioWindow(2048, 1);
      this.loadedAudio = new Array();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.startOffset = 0;
      this.createLiveInput();
      this.choreographyRoutine.playNext();
    }

    Visualizer.prototype.setupGUI = function() {
      var danceController, danceFolder, danceMaterialController, danceMaterialFolder, dancerController, dancerFolder, gui;
      this.choreographyRoutine = new ChoreographyRoutine();
      this.choreographyRoutine.visualizer = this;
      gui = new dat.GUI();
      gui.add(this.choreographyRoutine, 'id');
      dancerController = gui.add(this.choreographyRoutine, 'dancer', Object.keys(this.dancerTypes));
      dancerFolder = gui.addFolder('Dancer parameters');
      dancerFolder.open();
      dancerController.onFinishChange((function(_this) {
        return function(value) {
          var param, _i, _len, _ref, _results;
          if (_this.dancerTypes[value] == null) {
            return;
          }
          while (dancerFolder.__controllers[0] != null) {
            dancerFolder.remove(dancerFolder.__controllers[0]);
          }
          _ref = _this.dancerTypes[value].params;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            param = _ref[_i];
            _this.choreographyRoutine.dancerParams[param.name] = param["default"];
            _results.push(dancerFolder.add(_this.choreographyRoutine.dancerParams, param.name));
          }
          return _results;
        };
      })(this));
      danceController = gui.add(this.choreographyRoutine, 'dance', Object.keys(this.danceTypes));
      danceFolder = gui.addFolder('Dance parameters');
      danceFolder.open();
      danceController.onChange((function(_this) {
        return function(value) {
          var param, _i, _len, _ref, _results;
          if (_this.danceTypes[value] == null) {
            return;
          }
          while (danceFolder.__controllers[0] != null) {
            danceFolder.remove(danceFolder.__controllers[0]);
          }
          _ref = _this.danceTypes[value].params;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            param = _ref[_i];
            _this.choreographyRoutine.danceParams[param.name] = param["default"];
            _results.push(danceFolder.add(_this.choreographyRoutine.danceParams, param.name));
          }
          return _results;
        };
      })(this));
      danceMaterialController = gui.add(this.choreographyRoutine, 'danceMaterial', Object.keys(this.danceMaterialTypes));
      danceMaterialFolder = gui.addFolder('Dance material parameters');
      danceMaterialFolder.open();
      danceMaterialController.onChange((function(_this) {
        return function(value) {
          var param, _i, _len, _ref, _results;
          if (_this.danceMaterialTypes[value] == null) {
            return;
          }
          while (danceMaterialFolder.__controllers[0] != null) {
            danceMaterialFolder.remove(danceMaterialFolder.__controllers[0]);
          }
          _ref = _this.danceMaterialTypes[value].params;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            param = _ref[_i];
            _this.choreographyRoutine.danceMaterialParams[param.name] = param["default"];
            _results.push(danceMaterialFolder.add(_this.choreographyRoutine.danceMaterialParams, param.name));
          }
          return _results;
        };
      })(this));
      gui.add(this.choreographyRoutine, 'preview');
      gui.add(this.choreographyRoutine, 'add');
      gui.add(this.choreographyRoutine, 'insertBeat');
      gui.add(this.choreographyRoutine, 'playNext');
      return gui.add(this.choreographyRoutine, 'reset');
    };

    Visualizer.prototype.render = function() {
      var id, _i, _len, _ref, _results;
      if (!this.playing) {
        return;
      }
      this.audioWindow.update(this.analyser, this.audioContext.currentTime);
      _ref = Object.keys(this.dancers);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        id = _ref[_i];
        _results.push(this.dancers[id].update(this.audioWindow));
      }
      return _results;
    };

    Visualizer.prototype.pause = function() {
      this.source.stop();
      this.playing = false;
      return this.startOffset += this.audioContext.currentTime - this.startTime;
    };

    Visualizer.prototype.onKeyDown = function(event) {
      switch (event.keyCode) {
        case this.keys.PAUSE:
          if (this.playing) {
            return this.pause();
          } else {
            return this.play(this.currentlyPlaying);
          }
          break;
        case this.keys.NEXT:
          return this.choreographyRoutine.playNext();
      }
    };

    Visualizer.prototype.receiveChoreography = function(_arg) {
      var addDancer, currentDancer, dance, danceMaterial, dancer, id, newDance, newMaterial, _i, _len, _ref;
      id = _arg.id, dancer = _arg.dancer, dance = _arg.dance, danceMaterial = _arg.danceMaterial;
      if (id === -1) {
        _ref = this.dancers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          dancer = _ref[_i];
          this.scene.remove(dancer.body);
        }
        this.dancers = [];
        return;
      }
      if (this.dancers[id] != null) {
        currentDancer = this.dancers[id];
        if ((dancer == null) && !dance && !danceMaterial) {
          this.scene.remove(currentDancer.body);
          this.dancers.splice(this.dancers.indexOf(id), 1);
        }
        if (dance != null) {
          if ((dancer == null) && (danceMaterial == null)) {
            currentDancer.reset();
            currentDancer.dance = new this.danceTypes[dance.type](dance.params);
            return;
          } else {
            newDance = new this.danceTypes[dance.type](dance.params);
          }
        } else {
          newDance = currentDancer.dance;
        }
        addDancer = (function(_this) {
          return function(newDance, newMaterial) {
            var newDancer;
            if (dancer != null) {
              newDancer = new _this.dancerTypes[dancer.type](newDance, newMaterial, dancer.params);
            } else {
              newDancer = new currentDancer.constructor(newDance, newMaterial);
            }
            currentDancer.reset();
            _this.scene.remove(currentDancer.body);
            _this.dancers[id] = newDancer;
            return _this.scene.add(newDancer.body);
          };
        })(this);
        if (danceMaterial != null) {
          if (danceMaterial.type.indexOf('Shader') > -1) {
            newMaterial = new this.danceMaterialTypes[danceMaterial.type](this.shaderLoader);
            newMaterial.loadShader(this.audioWindow, (function(_this) {
              return function(shaderMaterial) {
                return addDancer(newDance, shaderMaterial);
              };
            })(this));
            return;
          }
          newMaterial = new this.danceMaterialTypes[danceMaterial.type](danceMaterial.params);
        } else {
          newMaterial = currentDancer.danceMaterial;
        }
        addDancer(newDance, newMaterial);
      } else if (id != null) {
        this.dancers[id] = new this.dancerTypes[dancer.type](new this.danceTypes[dance.type](dance.params), new this.danceMaterialTypes[danceMaterial.type](danceMaterial.params), dancer.params);
        this.scene.add(this.dancers[id].body);
      } else {

      }
    };

    Visualizer.prototype.createLiveInput = function() {
      var gotStream;
      gotStream = (function(_this) {
        return function(stream) {
          _this.playing = true;
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

    Visualizer.prototype.removeLastDancer = function() {
      var prevDancer;
      prevDancer = this.dancers.pop();
      this.scene.remove(prevDancer.body);
      return prevDancer.dance;
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

    Visualizer.prototype.dancerTypes = {
      CubeDancer: CubeDancer,
      SphereDancer: SphereDancer,
      PointCloudDancer: PointCloudDancer
    };

    Visualizer.prototype.danceTypes = {
      ScaleDance: ScaleDance,
      PositionDance: PositionDance
    };

    Visualizer.prototype.danceMaterialTypes = {
      ColorDanceMaterial: ColorDanceMaterial,
      SimpleFrequencyShader: SimpleFrequencyShader
    };

    return Visualizer;

  })();

}).call(this);
