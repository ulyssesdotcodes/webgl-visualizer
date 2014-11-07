(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/AudioWindow.coffee":[function(require,module,exports){
window.AudioWindow = (function() {
  AudioWindow.bufferSize = 2048;

  function AudioWindow(responsiveness) {
    this.responsiveness = responsiveness;
    this.frequencyBuffer = new Uint8Array(this.constructor.bufferSize);
    this.dbBuffer = new Uint8Array(this.constructor.bufferSize);
    this.time = 0;
    this.deltaTime = 0;
  }

  AudioWindow.prototype.update = function(analyser, time) {
    var buf, newTime, rms, val, _i, _len, _ref;
    if (!analyser) {
      return;
    }
    newTime = time * 1000;
    this.deltaTime = newTime - this.time;
    this.time = newTime;
    analyser.getByteTimeDomainData(this.dbBuffer);
    analyser.getByteFrequencyData(this.frequencyBuffer);
    rms = 0;
    _ref = this.dbBuffer;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      buf = _ref[_i];
      val = (buf - 128) / 128;
      rms += val * val;
    }
    return this.averageDb = Math.sqrt(rms / this.constructor.bufferSize) * this.responsiveness;
  };

  return AudioWindow;

})();



},{}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/ChoreographyRoutine.coffee":[function(require,module,exports){
window.ChoreographyRoutine = (function() {
  function ChoreographyRoutine(visualizer) {
    this.visualizer = visualizer;
    this.id = 0;
    this.dancer = "CubeDancer";
    this.dance = "ScaleDance";
    this.danceMaterial = "ColorDanceMaterial";
    this.dancerParams = {};
    this.danceParams = {};
    this.danceMaterialParams = {};
    this.reset();
    this.routine = [
      [
        {
          id: -1
        }, {
          id: 2,
          dancer: {
            type: 'CubeDancer'
          },
          dance: {
            type: 'PositionDance',
            params: {
              smoothingFactor: 0.5,
              direction: [0, 4.0, 0]
            }
          },
          danceMaterial: {
            type: 'ColorDanceMaterial',
            params: {
              smoothingFactor: 0.5
            }
          }
        }, {
          id: 0,
          dancer: {
            type: 'PointCloudDancer'
          },
          dance: {
            type: 'RotateDance',
            params: {
              axis: [-1, -1, 0]
            }
          },
          danceMaterial: {
            type: 'ColorDanceMaterial',
            params: {
              smoothingFactor: 0.5,
              minL: 0.0
            }
          }
        }, {
          id: 1,
          dancer: {
            type: 'PointCloudDancer'
          },
          dance: {
            type: 'RotateDance',
            params: {
              axis: [0, 1, 1],
              speed: 0.5
            }
          },
          danceMaterial: {
            type: 'ColorDanceMaterial',
            params: {
              smoothingFactor: 0.5,
              minL: 0.0
            }
          }
        }
      ], [
        {
          id: 2,
          dancer: {
            type: 'SphereDancer',
            params: {
              position: [0.5, 0, 0.5]
            }
          }
        }, {
          id: 3,
          dancer: {
            type: 'SphereDancer',
            params: {
              position: [0.5, 0, -0.5]
            }
          },
          dance: {
            type: 'ScaleDance',
            params: {
              smoothingFactor: 0.5
            }
          },
          danceMaterial: {
            type: 'ColorDanceMaterial',
            params: {
              smoothingFactor: 0.5,
              wireframe: true
            }
          }
        }, {
          id: 4,
          dancer: {
            type: 'SphereDancer',
            params: {
              position: [-0.5, 0, 0.5]
            }
          },
          dance: {
            type: 'ScaleDance',
            params: {
              smoothingFactor: 0.5
            }
          },
          danceMaterial: {
            type: 'ColorDanceMaterial',
            params: {
              smoothingFactor: 0.5,
              wireframe: true
            }
          }
        }, {
          id: 5,
          dancer: {
            type: 'SphereDancer',
            params: {
              position: [-0.5, 0, -0.5]
            }
          },
          dance: {
            type: 'PositionDance',
            params: {
              smoothingFactor: 0.5
            }
          },
          danceMaterial: {
            type: 'ColorDanceMaterial',
            params: {
              smoothingFactor: 0.5,
              wireframe: true
            }
          }
        }
      ]
    ];
  }

  ChoreographyRoutine.prototype.preview = function() {
    return this.visualizer.receiveChoreography({
      id: this.id,
      dancer: {
        type: this.dancer,
        params: this.dancerParams
      },
      dance: {
        type: this.dance,
        params: this.danceParams
      },
      danceMaterial: {
        type: this.danceMaterial,
        params: this.danceMaterialParams
      }
    });
  };

  ChoreographyRoutine.prototype.add = function() {
    this.routineMoment.push({
      id: this.id,
      dancer: {
        type: this.dancer,
        params: this.dancerParams
      },
      dance: {
        type: this.dance,
        params: this.danceParams
      },
      danceMaterial: {
        type: this.danceMaterial,
        params: this.danceMaterialParams
      }
    });
    return this.updateText();
  };

  ChoreographyRoutine.prototype.insertBeat = function() {
    this.routineMoment = [];
    this.routine.splice(++this.routineBeat, 0, this.routineMoment);
    return this.updateText();
  };

  ChoreographyRoutine.prototype.playNext = function() {
    var change, _i, _len, _ref;
    if (this.routineBeat === this.routine.length - 1) {
      this.routineBeat = -1;
    }
    this.routineMoment = this.routine[++this.routineBeat];
    _ref = this.routineMoment;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      change = _ref[_i];
      this.visualizer.receiveChoreography(change);
    }
    return this.updateText();
  };

  ChoreographyRoutine.prototype.updateDancer = function(dancer) {
    this.dancer = dancer.constructor.name;
    this.danceMaterial = dancer.danceMaterial.constructor.name;
    return this.dance = dancer.dance.constructor.name;
  };

  ChoreographyRoutine.prototype.queueRoutine = function(routineData) {
    return Array.prototype.push.apply(this.routine, routineData);
  };

  ChoreographyRoutine.prototype.createRoutine = function(name, next) {};

  ChoreographyRoutine.prototype.reset = function() {
    this.routine = [];
    this.routineMoment = [];
    return this.routineBeat = -1;
  };

  ChoreographyRoutine.prototype.updateText = function() {
    return this.visualizer["interface"].updateText();
  };

  return ChoreographyRoutine;

})();



},{}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/Main.coffee":[function(require,module,exports){
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

require('./Visualizer.coffee');

require('../javascript/OrbitControls');

require('./Viewer.coffee');

require('./interface/DatGUIInterface.coffee');

window.Main = (function() {
  function Main(isVisualizer) {
    this.onWindowResize = __bind(this.onWindowResize, this);
    var controlChange;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.autoClear = false;
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.damping = 0.2;
    controlChange = (function(_this) {
      return function() {
        return _this.render();
      };
    })(this);
    this.controls.addEventListener('change', controlChange);
    this.camera.position.z = -4;
    this.camera.position.y = 3;
    this.controls.target = new THREE.Vector3(0, 0, 0);
    window.addEventListener('resize', this.onWindowResize, false);
    document.body.appendChild(this.renderer.domElement);
    this.viewer = new Viewer(this.scene, this.camera);
    if (isVisualizer) {
      this.visualizer = new Visualizer(this.viewer, new DatGUIInterface());
      window.addEventListener('keydown', this.visualizer.onKeyDown.bind(this.visualizer), false);
    } else {
      this.domain = window.location.protocol + '//' + window.location.host;
      window.addEventListener('message', (function(_this) {
        return function(event) {
          var sentObj;
          if (event.origin !== _this.domain) {
            return;
          }
          sentObj = event.data;
          if (sentObj.type === 'render') {
            _this.viewer.render(sentObj.data);
          }
          if (sentObj.type === 'choreography') {
            return _this.viewer.receiveChoreography(sentObj.data);
          }
        };
      })(this));
    }
  }

  Main.prototype.animate = function() {
    this.render();
    return this.controls.update();
  };

  Main.prototype.render = function() {
    var _ref;
    if ((_ref = this.visualizer) != null) {
      _ref.render();
    }
    this.scene.updateMatrixWorld();
    this.camera.updateProjectionMatrix();
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
  };

  Main.prototype.onWindowResize = function() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    return this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  return Main;

})();

window.animate = function() {
  requestAnimationFrame(window.animate);
  return window.app.animate();
};

$(function() {
  return dat.GUI.prototype.removeFolder = function(name) {
    var folder;
    folder = this.__folders[name];
    if (!folder) {
      return;
    }
    folder.close();
    this.__ul.removeChild(folder.domElement.parentNode);
    delete this.__folders[name];
    return this.onResize();
  };
});



},{"../javascript/OrbitControls":"/Users/ulyssespopple/Development/js/webgl-visualizer/javascript/OrbitControls.js","./Viewer.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/Viewer.coffee","./Visualizer.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/Visualizer.coffee","./interface/DatGUIInterface.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/interface/DatGUIInterface.coffee"}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/Player.coffee":[function(require,module,exports){
require('./AudioWindow.coffee');

window.Player = (function() {
  function Player() {
    this.audioWindow = new AudioWindow(1);
    this.loadedAudio = new Array();
    this.startOffset = 0;
    this.setupAnalyser();
  }

  Player.prototype.setupAnalyser = function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    return this.analyser.fftSize = AudioWindow.bufferSize;
  };

  Player.prototype.update = function() {
    return this.audioWindow.update(this.analyser, this.audioContext.currentTime);
  };

  Player.prototype.pause = function() {
    this.source.stop();
    this.playing = false;
    return this.startOffset += this.audioContext.currentTime - this.startTime;
  };

  Player.prototype.createLiveInput = function() {
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

  Player.prototype.play = function(url) {
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

  Player.prototype.loadFromBuffer = function(buffer) {
    this.startTime = this.audioContext.currentTime;
    this.source = this.audioContext.createBufferSource();
    this.source.buffer = buffer;
    this.source.connect(this.analyser);
    this.source.connect(this.audioContext.destination);
    this.playing = true;
    return this.source.start(0, this.startOffset);
  };

  Player.prototype.pause = function() {
    if (this.player.playing) {
      return this.pause();
    } else {
      return this.play(this.currentlyPlaying);
    }
  };

  return Player;

})();



},{"./AudioWindow.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/AudioWindow.coffee"}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/RoutinesController.coffee":[function(require,module,exports){
require('./RoutinesService.coffee');

window.RoutinesController = (function() {
  function RoutinesController() {
    this.routines = [];
    this.routinesService = new RoutinesService();
  }

  RoutinesController.prototype.getRoutine = function(id, next) {
    if (this.routines[id].data !== "") {
      next(this.routines.data);
      return;
    }
    return this.routinesService.getRoutine(id, (function(_this) {
      return function(routine) {
        _this.routines[id].data = JSON.parse(routine.data);
        console.log(_this.routines[id]);
        return next(_this.routines[id]);
      };
    })(this));
  };

  RoutinesController.prototype.refreshRoutines = function(next) {
    return this.routinesService.getRoutines((function(_this) {
      return function(data) {
        var routine, _i, _len;
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          routine = data[_i];
          if (_this.routines[routine.id] != null) {
            _this.routines[routine.id] = routine.name;
          } else {
            _this.routines[routine.id] = routine;
          }
        }
        return next(_this.routines);
      };
    })(this));
  };

  return RoutinesController;

})();



},{"./RoutinesService.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/RoutinesService.coffee"}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/RoutinesService.coffee":[function(require,module,exports){
window.RoutinesService = (function() {
  function RoutinesService() {}

  RoutinesService.server = "http://localhost:3000/";

  RoutinesService.prototype.getRoutines = function(next) {
    return $.ajax({
      url: this.constructor.server + 'routines',
      type: "GET",
      success: function(data) {
        return next(data);
      }
    });
  };

  RoutinesService.prototype.getRoutine = function(id, next) {
    return $.ajax({
      url: this.constructor.server + 'routines/' + id,
      type: "GET",
      success: function(data) {
        return next(data);
      }
    });
  };

  RoutinesService.prototype.createRoutine = function(data, next) {
    return next(id);
  };

  return RoutinesService;

})();



},{}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/ShaderLoader.coffee":[function(require,module,exports){
window.ShaderLoader = (function() {
  function ShaderLoader() {
    this.shaders = new Array();
  }

  ShaderLoader.prototype.load = function(name, next) {
    if (this.shaders[name] != null) {
      return next(this.shaders[name]);
    } else {
      this.shaders[name] = {
        vertexShader: '',
        fragmentShader: ''
      };
      return this.loadFromUrl(name, 'shaders/' + name, next);
    }
  };

  ShaderLoader.prototype.loadFromUrl = function(name, url, next) {
    var loadedShader;
    loadedShader = function(jqXHR, textStatus) {
      this.shaders[this.name][this.type] = jqXHR.responseText;
      if ((this.shaders[this.name].vertexShader != null) && this.shaders[this.name].fragmentShader) {
        return next(this.shaders[this.name]);
      }
    };
    $.ajax({
      url: url + '.vert',
      dataType: 'text',
      context: {
        name: name,
        type: 'vertexShader',
        next: next,
        shaders: this.shaders
      },
      complete: loadedShader
    });
    $.ajax({
      url: url + '.frag',
      dataType: 'text',
      context: {
        name: name,
        type: 'fragmentShader',
        next: next,
        shaders: this.shaders
      },
      complete: loadedShader
    });
  };

  return ShaderLoader;

})();



},{}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/Viewer.coffee":[function(require,module,exports){
require('./ShaderLoader.coffee');

require('../javascript/Queue.js');

window.Viewer = (function() {
  function Viewer(scene, camera) {
    this.scene = scene;
    this.dancers = new Array();
    this.shaderLoader = new ShaderLoader();
    this.choreographyQueue = new Queue();
  }

  Viewer.prototype.receiveChoreography = function(move) {
    return this.choreographyQueue.push(move);
  };

  Viewer.prototype.executeChoreography = function(_arg) {
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
          currentDancer.dance = new Visualizer.danceTypes[dance.type](dance.params);
          return;
        } else {
          newDance = new Visualizer.danceTypes[dance.type](dance.params);
        }
      } else {
        newDance = currentDancer.dance;
      }
      addDancer = (function(_this) {
        return function(newDance, newMaterial) {
          var newDancer;
          if (dancer != null) {
            newDancer = new Visualizer.dancerTypes[dancer.type](newDance, newMaterial, dancer.params);
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
          newMaterial = new Visualizer.danceMaterialTypes[danceMaterial.type](this.shaderLoader);
          newMaterial.loadShader((function(_this) {
            return function(shaderMaterial) {
              return addDancer(newDance, shaderMaterial);
            };
          })(this));
          return;
        }
        newMaterial = new Visualizer.danceMaterialTypes[danceMaterial.type](danceMaterial.params);
      } else {
        newMaterial = currentDancer.danceMaterial;
      }
      addDancer(newDance, newMaterial);
    } else if (id != null) {
      this.dancers[id] = new Visualizer.dancerTypes[dancer.type](new Visualizer.danceTypes[dance.type](dance.params), new Visualizer.danceMaterialTypes[danceMaterial.type](danceMaterial.params), dancer.params);
      this.scene.add(this.dancers[id].body);
    } else {

    }
  };

  Viewer.prototype.getDancer = function(id) {
    return this.dancers[id];
  };

  Viewer.prototype.render = function(audioWindow) {
    var id, _i, _len, _ref, _results;
    while (this.choreographyQueue.length() > 0) {
      this.executeChoreography(this.choreographyQueue.shift());
    }
    _ref = Object.keys(this.dancers);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      id = _ref[_i];
      _results.push(this.dancers[id].update(audioWindow));
    }
    return _results;
  };

  Viewer.prototype.removeLastDancer = function() {
    var prevDancer;
    prevDancer = this.dancers.pop();
    this.scene.remove(prevDancer.body);
    return prevDancer.dance;
  };

  return Viewer;

})();



},{"../javascript/Queue.js":"/Users/ulyssespopple/Development/js/webgl-visualizer/javascript/Queue.js","./ShaderLoader.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/ShaderLoader.coffee"}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/Visualizer.coffee":[function(require,module,exports){
require('./Player.coffee');

require('./ChoreographyRoutine.coffee');

require('./dancers/CubeDancer.coffee');

require('./dancers/SphereDancer.coffee');

require('./dancers/PointCloudDancer.coffee');

require('./dances/ScaleDance.coffee');

require('./dances/PositionDance.coffee');

require('./dances/RotateDance.coffee');

require('./danceMaterials/ColorDanceMaterial.coffee');

require('./danceMaterials/SimpleFrequencyShader.coffee');

window.Visualizer = (function() {
  Visualizer.prototype.keys = {
    PAUSE: 32,
    NEXT: 78
  };

  function Visualizer(viewer, _interface) {
    this.viewer = viewer;
    this["interface"] = _interface;
    this.player = new Player();
    this.player.createLiveInput();
    this.choreographyRoutine = new ChoreographyRoutine(this);
    this["interface"].setup(this.player, this.choreographyRoutine, this.viewer);
    this.choreographyRoutine.playNext();
  }

  Visualizer.prototype.receiveChoreography = function(move) {
    this.viewer.receiveChoreography(move);
    if (this.popup != null) {
      return this.popup.postMessage(this.wrapMessage('choreography', move), this.domain);
    }
  };

  Visualizer.prototype.render = function() {
    if (!this.player.playing) {
      return;
    }
    this.player.update();
    this.viewer.render(this.player.audioWindow);
    if (this.popup != null) {
      return this.popup.postMessage(this.wrapMessage('render', this.player.audioWindow), this.domain);
    }
  };

  Visualizer.prototype.wrapMessage = function(type, data) {
    return {
      type: type,
      data: data
    };
  };

  Visualizer.prototype.onKeyDown = function(event) {
    switch (event.keyCode) {
      case this.keys.PAUSE:
        return this.player.pause();
      case this.keys.NEXT:
        return this.choreographyRoutine.playNext();
    }
  };

  Visualizer.dancerTypes = {
    CubeDancer: CubeDancer,
    SphereDancer: SphereDancer,
    PointCloudDancer: PointCloudDancer
  };

  Visualizer.danceTypes = {
    ScaleDance: ScaleDance,
    PositionDance: PositionDance,
    RotateDance: RotateDance
  };

  Visualizer.danceMaterialTypes = {
    ColorDanceMaterial: ColorDanceMaterial,
    SimpleFrequencyShader: SimpleFrequencyShader
  };

  return Visualizer;

})();



},{"./ChoreographyRoutine.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/ChoreographyRoutine.coffee","./Player.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/Player.coffee","./danceMaterials/ColorDanceMaterial.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/danceMaterials/ColorDanceMaterial.coffee","./danceMaterials/SimpleFrequencyShader.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/danceMaterials/SimpleFrequencyShader.coffee","./dancers/CubeDancer.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/dancers/CubeDancer.coffee","./dancers/PointCloudDancer.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/dancers/PointCloudDancer.coffee","./dancers/SphereDancer.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/dancers/SphereDancer.coffee","./dances/PositionDance.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/dances/PositionDance.coffee","./dances/RotateDance.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/dances/RotateDance.coffee","./dances/ScaleDance.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/dances/ScaleDance.coffee"}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/danceMaterials/ColorDanceMaterial.coffee":[function(require,module,exports){
window.ColorDanceMaterial = (function() {
  ColorDanceMaterial.params = [
    {
      name: 'smoothingFactor',
      "default": 0.5
    }, {
      name: 'minL',
      "default": 0.1
    }, {
      name: 'minS',
      "default": 0.3
    }, {
      name: 'wireframe',
      "default": false
    }
  ];

  ColorDanceMaterial.name = "ColorDanceMaterial";

  function ColorDanceMaterial(options) {
    var _ref;
    this.options = options;
    if (this.options != null) {
      _ref = this.options, this.smoothingFactor = _ref.smoothingFactor, this.minL = _ref.minL, this.minS = _ref.minS, this.wireframe = _ref.wireframe;
    }
    if (this.smoothingFactor == null) {
      this.smoothingFactor = 0.5;
    }
    if (this.minL == null) {
      this.minL = 0.1;
    }
    if (this.minS == null) {
      this.minS = 0.3;
    }
    if (this.wireframe == null) {
      this.wireframe = false;
    }
    this.color = new THREE.Color(1.0, 0, 0);
    this.material = new THREE.MeshLambertMaterial({
      color: 0x00000,
      wireframe: this.wireframe
    });
    this.appliedColor = this.color.clone();
  }

  ColorDanceMaterial.prototype.update = function(audioWindow, dancer) {
    var freq, hsl, i, l, maxImportantIndex, maxIndex, maxValue, newColorH, newColorL, newColorS, oldColorHSL, s, value, _i, _ref;
    maxValue = 0;
    maxIndex = -1;
    maxImportantIndex = 1;
    for (i = _i = 1, _ref = AudioWindow.bufferSize; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
      freq = audioWindow.frequencyBuffer[i];
      value = freq * i;
      if (value > maxValue) {
        maxValue = value;
        maxIndex = i;
      }
    }
    oldColorHSL = this.appliedColor.getHSL();
    newColorS = maxIndex / AudioWindow.bufferSize;
    newColorS = this.smoothingFactor * newColorS + (1 - this.smoothingFactor) * oldColorHSL.s;
    newColorL = audioWindow.averageDb;
    newColorL = this.smoothingFactor * newColorL + (1 - this.smoothingFactor) * oldColorHSL.l;
    l = this.minL + newColorL * (1.0 - this.minL);
    s = this.minS + newColorS * (1.0 - this.minS);
    newColorH = (360 * (audioWindow.time / 10000) % 360) / 360;
    hsl = this.color.getHSL();
    this.appliedColor.setHSL(newColorH, s, l);
    if (dancer != null) {
      if (dancer.body.material.emissive != null) {
        dancer.body.material.emissive.copy(this.appliedColor);
      }
      return dancer.body.material.color.copy(this.appliedColor);
    }
  };

  return ColorDanceMaterial;

})();



},{}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/danceMaterials/SimpleFrequencyShader.coffee":[function(require,module,exports){
window.SimpleFrequencyShader = (function() {
  SimpleFrequencyShader.params = [];

  SimpleFrequencyShader.name = "SimpleFrequencyShader";

  function SimpleFrequencyShader(shaderLoader) {
    this.target = 128;
    this.size = 1024;
    this.shaderLoader = shaderLoader;
    this.newTexArray = new Uint8Array(this.target * this.target * 4);
  }

  SimpleFrequencyShader.prototype.loadShader = function(next) {
    return this.shaderLoader.load('simple_frequency', (function(_this) {
      return function(shader) {
        shader.uniforms = {
          freqTexture: {
            type: "t",
            value: AudioWindow.bufferSize
          },
          resolution: {
            type: "v2",
            value: new THREE.Vector2(128, 128)
          }
        };
        _this.material = new THREE.ShaderMaterial(shader);
        _this.material.side = THREE.DoubleSide;
        _this.material.transparent = true;
        return next(_this);
      };
    })(this));
  };

  SimpleFrequencyShader.prototype.update = function(audioWindow, dancer) {
    return dancer.body.material.uniforms.freqTexture.value = this.reduceArray(audioWindow.frequencyBuffer);
  };

  SimpleFrequencyShader.prototype.reduceArray = function(freqBuf) {
    var baseIndex, flooredRatio, i, j, movingSum, newBuf, texture, _i, _j, _k, _ref, _ref1, _ref2;
    newBuf = new Array(this.target);
    movingSum = 0;
    flooredRatio = Math.floor(this.size / this.target);
    for (i = _i = 1, _ref = this.size; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
      movingSum += freqBuf[i];
      if (((i + 1) % flooredRatio) === 0) {
        newBuf[Math.floor(i / flooredRatio)] = movingSum / flooredRatio;
        movingSum = 0;
      }
    }
    for (i = _j = 0, _ref1 = this.target; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      for (j = _k = 0, _ref2 = this.target; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; j = 0 <= _ref2 ? ++_k : --_k) {
        baseIndex = i * this.target * 4 + j * 4;
        if (newBuf[j] > i * 2) {
          this.newTexArray[baseIndex] = 255;
          this.newTexArray[baseIndex + 1] = 255;
          this.newTexArray[baseIndex + 2] = 255;
          this.newTexArray[baseIndex + 3] = 255;
        } else {
          this.newTexArray[baseIndex] = 0;
          this.newTexArray[baseIndex + 1] = 0;
          this.newTexArray[baseIndex + 2] = 0;
          this.newTexArray[baseIndex + 3] = 0;
        }
      }
    }
    texture = new THREE.DataTexture(this.newTexArray, this.target, this.target, THREE.RGBAFormat, THREE.UnsignedByte);
    texture.needsUpdate = true;
    texture.flipY = false;
    texture.generateMipmaps = false;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;
    texture.unpackAlignment = 1;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 4;
    return texture;
  };

  return SimpleFrequencyShader;

})();



},{}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/dancers/CubeDancer.coffee":[function(require,module,exports){
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

require('./Dancer.coffee');

window.CubeDancer = (function(_super) {
  __extends(CubeDancer, _super);

  CubeDancer.name = "CubeDancer";

  function CubeDancer(dance, danceMaterial, options) {
    var position, scale, _ref;
    this.options = options;
    if (this.options != null) {
      _ref = this.options, position = _ref.position, scale = _ref.scale;
    }
    CubeDancer.__super__.constructor.call(this, new THREE.BoxGeometry(1, 1, 1), dance, danceMaterial, position, scale);
  }

  return CubeDancer;

})(Dancer);



},{"./Dancer.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/dancers/Dancer.coffee"}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/dancers/Dancer.coffee":[function(require,module,exports){
window.Dancer = (function() {
  Dancer.type = Dancer;

  Dancer.params = [
    {
      name: 'position',
      "default": [0, 0, 0]
    }, {
      name: 'scale',
      "default": [1, 1, 1]
    }
  ];

  function Dancer(geometry, dance, danceMaterial, position, scale) {
    var material;
    material = danceMaterial.material;
    this.dance = dance;
    this.danceMaterial = danceMaterial;
    this.body = new THREE.Mesh(geometry, material);
    if ((position != null) && position.length === 3) {
      this.body.position.set(position[0], position[1], position[2]);
    }
    if ((scale != null) && scale.length === 3) {
      this.body.scale.set(scale[0], scale[1], scale[2]);
    }
  }

  Dancer.prototype.geometry = function() {
    return new THREE.PlaneGeometry(1, 1);
  };

  Dancer.prototype.reset = function() {
    return this.dance.reset(this);
  };

  Dancer.prototype.update = function(audioWindow) {
    this.dance.update(audioWindow, this);
    return this.danceMaterial.update(audioWindow, this);
  };

  return Dancer;

})();



},{}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/dancers/PointCloudDancer.coffee":[function(require,module,exports){
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

require('./Dancer.coffee');

window.PointCloudDancer = (function(_super) {
  __extends(PointCloudDancer, _super);

  PointCloudDancer.params = [
    {
      name: 'minDistance',
      "default": 5.0
    }, {
      name: 'maxDistance',
      "default": 10.0
    }, {
      name: 'count',
      "default": 500
    }
  ];

  PointCloudDancer.name = "PointCloudDancer";

  function PointCloudDancer(dance, danceMaterial, options) {
    var direction, geometry, i, material, position, positions, _i, _ref, _ref1;
    this.dance = dance;
    this.danceMaterial = danceMaterial;
    this.options = options;
    if (this.options != null) {
      _ref = this.options, this.minDistance = _ref.minDistance, this.maxDistance = _ref.maxDistance, this.count = _ref.count;
    }
    if (this.minDistance == null) {
      this.minDistance = 5.0;
    }
    if (this.maxDistance == null) {
      this.maxDistance = 10.0;
    }
    if (this.count == null) {
      this.count = 500;
    }
    direction = new THREE.Vector3();
    position = new THREE.Vector3(0, 0, 0);
    geometry = new THREE.BufferGeometry();
    positions = new Float32Array(this.count * 3);
    for (i = _i = 0, _ref1 = this.count; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      direction.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
      direction.normalize();
      direction.multiplyScalar(this.minDistance + Math.random() * (this.maxDistance - this.minDistance));
      positions[3 * i] = position.x + direction.x;
      positions[3 * i + 1] = position.y + direction.y;
      positions[3 * i + 2] = position.z + direction.z;
    }
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.computeBoundingBox();
    material = new THREE.PointCloudMaterial({
      size: 0.5,
      color: this.danceMaterial.color
    });
    this.body = new THREE.PointCloud(geometry, material);
  }

  return PointCloudDancer;

})(Dancer);



},{"./Dancer.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/dancers/Dancer.coffee"}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/dancers/SphereDancer.coffee":[function(require,module,exports){
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

require('./Dancer.coffee');

window.SphereDancer = (function(_super) {
  __extends(SphereDancer, _super);

  SphereDancer.name = "SphereDancer";

  function SphereDancer(dance, danceMaterial, options) {
    var position, scale, _ref;
    this.options = options;
    if (this.options != null) {
      _ref = this.options, position = _ref.position, scale = _ref.scale;
    }
    SphereDancer.__super__.constructor.call(this, new THREE.SphereGeometry(1, 32, 24), dance, danceMaterial, position, scale);
  }

  return SphereDancer;

})(Dancer);



},{"./Dancer.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/dancers/Dancer.coffee"}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/dances/PositionDance.coffee":[function(require,module,exports){
window.PositionDance = (function() {
  PositionDance.params = [
    {
      name: 'smoothingFactor',
      "default": 0.2
    }, {
      name: 'direction',
      "default": [0, 1, 0]
    }
  ];

  PositionDance.name = "PositionDance";

  function PositionDance(options) {
    var direction, _ref;
    this.options = options;
    if (this.options != null) {
      _ref = this.options, this.smoothingFactor = _ref.smoothingFactor, direction = _ref.direction;
    }
    if (this.smoothingFactor == null) {
      this.smoothingFactor = 0.2;
    }
    if (direction == null) {
      direction = [0, 1, 0];
    }
    this.direction = new THREE.Vector3(direction[0], direction[1], direction[2]);
    this.directionCopy = new THREE.Vector3();
    this.positionChange = 0;
  }

  PositionDance.prototype.update = function(audioWindow, dancer) {
    var basePosition, newPosition, smoothingFactor;
    basePosition = new THREE.Vector3();
    this.directionCopy.copy(this.direction);
    basePosition.subVectors(dancer.body.position, this.directionCopy.multiplyScalar(this.positionChange));
    smoothingFactor = audioWindow.averageDb < this.positionChange ? this.smoothingFactor : Math.max(1, this.smoothingFactor * 4);
    this.positionChange = audioWindow.averageDb * smoothingFactor + (1 - smoothingFactor) * this.positionChange;
    this.directionCopy.copy(this.direction);
    newPosition = new THREE.Vector3();
    newPosition.addVectors(basePosition, this.directionCopy.multiplyScalar(this.positionChange));
    return dancer.body.position.set(newPosition.x, newPosition.y, newPosition.z);
  };

  PositionDance.prototype.reset = function(dancer) {
    var basePosition;
    this.directionCopy.copy(this.direction);
    basePosition = new THREE.Vector3();
    basePosition.subVectors(dancer.body.position, this.directionCopy.multiplyScalar(this.positionChange));
    return dancer.body.position.set(basePosition.x, basePosition.y, basePosition.z);
  };

  return PositionDance;

})();



},{}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/dances/RotateDance.coffee":[function(require,module,exports){
window.RotateDance = (function() {
  RotateDance.name = "RotateDance";

  RotateDance.params = [
    {
      name: 'axis',
      "default": [0, 1, 0]
    }, {
      name: 'minRotation',
      "default": 0.05
    }, {
      name: 'speed',
      "default": 1
    }
  ];

  function RotateDance(options) {
    var axis, _ref;
    this.options = options;
    if (this.options != null) {
      _ref = this.options, axis = _ref.axis, this.minRotation = _ref.minRotation, this.speed = _ref.speed;
    }
    if (this.minRotation == null) {
      this.minRotation = 0.05;
    }
    if (this.speed == null) {
      this.speed = 1;
    }
    if (axis == null) {
      axis = [0, 1, 0];
    }
    this.axis = new THREE.Vector3(axis[0], axis[1], axis[2]);
    this.time = 0;
  }

  RotateDance.prototype.update = function(audioWindow, dancer) {
    var absRotation;
    absRotation = audioWindow.averageDb * this.speed;
    dancer.body.rotateOnAxis(this.axis, (this.minRotation + absRotation * 0.9) * Math.PI * ((audioWindow.time - this.time) / 1000));
    return this.time = audioWindow.time;
  };

  RotateDance.prototype.reset = function(dancer) {
    return dancer.body.rotation.set(0, 0, 0);
  };

  return RotateDance;

})();



},{}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/dances/ScaleDance.coffee":[function(require,module,exports){
window.ScaleDance = (function() {
  ScaleDance.params = [
    {
      name: 'smoothingFactor',
      "default": 0.5
    }, {
      name: 'min',
      "default": [0.5, 0.5, 0.5]
    }, {
      name: 'max',
      "default": [1, 1, 1]
    }
  ];

  ScaleDance.name = "ScaleDance";

  function ScaleDance(options) {
    var max, min, _ref;
    this.options = options;
    if (this.options != null) {
      _ref = this.options, this.smoothingFactor = _ref.smoothingFactor, min = _ref.min, max = _ref.max;
    }
    if (this.smoothingFactor == null) {
      this.smoothingFactor = 0.5;
    }
    this.averageDb = 0;
    this.min = min ? new THREE.Vector3(min[0], min[1], min[2]) : new THREE.Vector3(0.5, 0.5, 0.5);
    this.max = max ? new THREE.Vector3(max[0], max[1], max[2]) : new THREE.Vector3(1, 1, 1);
    this.scale = new THREE.Vector3();
  }

  ScaleDance.prototype.update = function(audioWindow, dancer) {
    var smoothingFactor;
    if (audioWindow.averageDb < this.averageDb) {
      this.averageDb = audioWindow.averageDb * this.smoothingFactor + (1 - this.smoothingFactor) * this.averageDb;
    } else {
      smoothingFactor = Math.max(1, this.smoothingFactor * 4);
      this.averageDb = audioWindow.averageDb * smoothingFactor + (1 - smoothingFactor) * this.averageDb;
    }
    this.scale.copy(this.min);
    this.scale.lerp(this.max, this.averageDb);
    return dancer.body.scale.set(this.scale.x, this.scale.y, this.scale.z);
  };

  ScaleDance.prototype.reset = function(dancer) {
    return dancer.body.scale.set(1, 1, 1);
  };

  return ScaleDance;

})();



},{}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/interface/DatGUIInterface.coffee":[function(require,module,exports){
require('./QueueView.coffee');

require('./RoutinesView.coffee');

require('../RoutinesController.coffee');

window.DatGUIInterface = (function() {
  function DatGUIInterface() {
    this.container = $('#interface');
    this.routinesController = new RoutinesController();
  }

  DatGUIInterface.prototype.setup = function(player, choreographyRoutine, viewer) {
    var danceController, danceFolder, danceMaterialController, danceMaterialFolder, dancerController, dancerFolder, gui, idController, setupFolder, updateDanceFolder, updateDanceMaterialFolder, updateDancerFolder, updateFolder, _ref, _ref1, _ref2;
    this.player = player;
    this.choreographyRoutine = choreographyRoutine;
    this.viewer = viewer;
    gui = new dat.GUI();
    gui.add(this.player.audioWindow, 'responsiveness', 0.0, 5.0);
    idController = gui.add(this.choreographyRoutine, 'id');
    setupFolder = (function(_this) {
      return function(name, varName, keys) {
        var controller, folder;
        controller = gui.add(_this.choreographyRoutine, varName, keys);
        folder = gui.addFolder(name);
        folder.open();
        return [controller, folder];
      };
    })(this);
    updateFolder = function(types, folder, params, value, obj) {
      var param, _i, _len, _ref, _ref1, _results;
      if (types[value] == null) {
        return;
      }
      while (folder.__controllers[0] != null) {
        folder.remove(folder.__controllers[0]);
      }
      _ref = types[value].params;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        param = _ref[_i];
        params[param.name] = (obj != null ? (_ref1 = obj.options) != null ? _ref1[param.name] : void 0 : void 0) ? obj.options[param.name] : param["default"];
        _results.push(folder.add(params, param.name));
      }
      return _results;
    };
    _ref = setupFolder('Dancer parameters', 'dancer', Object.keys(Visualizer.dancerTypes)), dancerController = _ref[0], dancerFolder = _ref[1];
    updateDancerFolder = (function(_this) {
      return function(value, obj) {
        return updateFolder(Visualizer.dancerTypes, dancerFolder, _this.choreographyRoutine.dancerParams, value, obj);
      };
    })(this);
    dancerController.onChange(updateDancerFolder);
    _ref1 = setupFolder('Dance parameters', 'dance', Object.keys(Visualizer.danceTypes)), danceController = _ref1[0], danceFolder = _ref1[1];
    updateDanceFolder = (function(_this) {
      return function(value, obj) {
        return updateFolder(Visualizer.danceTypes, danceFolder, _this.choreographyRoutine.danceParams, value, obj);
      };
    })(this);
    danceController.onChange(updateDanceFolder);
    _ref2 = setupFolder('Dance material paramaters', 'danceMaterial', Object.keys(Visualizer.danceMaterialTypes)), danceMaterialController = _ref2[0], danceMaterialFolder = _ref2[1];
    updateDanceMaterialFolder = (function(_this) {
      return function(value, obj) {
        return updateFolder(Visualizer.danceMaterialTypes, danceMaterialFolder, _this.choreographyRoutine.danceMaterialParams, value, obj);
      };
    })(this);
    danceMaterialController.onChange(updateDanceMaterialFolder);
    idController.onChange((function(_this) {
      return function(value) {
        var controller, idDancer, _i, _len, _ref3;
        idDancer = _this.viewer.getDancer(value);
        if (idDancer != null) {
          _this.choreographyRoutine.updateDancer(idDancer);
          _ref3 = gui.__controllers;
          for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
            controller = _ref3[_i];
            controller.updateDisplay();
          }
          updateDancerFolder(_this.choreographyRoutine.dancer, idDancer);
          updateDanceMaterialFolder(_this.choreographyRoutine.danceMaterial, idDancer.danceMaterial);
          return updateDanceFolder(_this.choreographyRoutine.dance, idDancer.dance);
        }
      };
    })(this));
    gui.add(this.choreographyRoutine, 'preview');
    gui.add(this.choreographyRoutine, 'add');
    gui.add(this.choreographyRoutine, 'insertBeat');
    gui.add(this.choreographyRoutine, 'playNext');
    gui.add(this.choreographyRoutine, 'reset');
    this.setupPopup();
    this.setupQueueView();
    return this.setupRoutinesView();
  };

  DatGUIInterface.prototype.setupPopup = function() {
    this.viewerButton = $("<a href='#'>Open Viewer</a>");
    this.viewerButton.click((function(_this) {
      return function(e) {
        var popupURL, sendBeats;
        e.preventDefault();
        _this.domain = window.location.protocol + '//' + window.location.host;
        popupURL = _this.domain + location.pathname + 'viewer.html';
        _this.popup = window.open(popupURL, 'myWindow');
        sendBeats = function() {
          var routineBeat, _results;
          routineBeat = _this.choreographyRoutine.routineBeat;
          _this.choreographyRoutine.routineBeat = -1;
          _results = [];
          while (_this.choreographyRoutine.routineBeat < routineBeat) {
            _results.push(_this.choreographyRoutine.playNext());
          }
          return _results;
        };
        return setTimeout(sendBeats, 100);
      };
    })(this));
    return this.container.append(this.viewerButton);
  };

  DatGUIInterface.prototype.setupQueueView = function() {
    this.queueView = new QueueView();
    return this.queueView.createView(this.container);
  };

  DatGUIInterface.prototype.setupRoutinesView = function() {
    this.routinesView = new RoutinesView(this.choreographyRoutine, this.routinesController);
    this.routinesView.createView(this.container);
    return this.routinesView.updateRoutines((function(_this) {
      return function() {
        return _this.routinesView.onSelect(1);
      };
    })(this));
  };

  DatGUIInterface.prototype.updateText = function() {
    return this.queueView.updateText(this.choreographyRoutine.routineBeat, this.choreographyRoutine.routine);
  };

  return DatGUIInterface;

})();



},{"../RoutinesController.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/RoutinesController.coffee","./QueueView.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/interface/QueueView.coffee","./RoutinesView.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/interface/RoutinesView.coffee"}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/interface/QueueView.coffee":[function(require,module,exports){
window.QueueView = (function() {
  function QueueView() {}

  QueueView.prototype.createView = function(target) {
    this.routineView = $("<pre>", {
      id: 'queue'
    });
    return target.append(this.routineView);
  };

  QueueView.prototype.updateText = function(currentIndex, routineQueue) {
    var html, i, routine, _i, _len;
    html = [];
    for (i = _i = 0, _len = routineQueue.length; _i < _len; i = ++_i) {
      routine = routineQueue[i];
      if (i === currentIndex) {
        html.push("<span class='bold'>");
      }
      html.push(this.stringify(routine));
      if (i === currentIndex) {
        html.push("</span>");
      }
      html.push(',\n');
    }
    return this.routineView.html(html.join(""));
  };

  QueueView.prototype.stringify = function(json) {
    return JSON.stringify(json, void 0, 2);
  };

  return QueueView;

})();



},{}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/interface/RoutinesView.coffee":[function(require,module,exports){
window.RoutinesView = (function() {
  function RoutinesView(choreographyRoutine, routinesController) {
    this.choreographyRoutine = choreographyRoutine;
    this.routinesController = routinesController;
    return;
  }

  RoutinesView.prototype.createView = function(target) {
    this.routinesContainer = $("<div>", {
      id: 'routinesContainer'
    });
    target.append(this.routinesContainer);
    this.selector = $("<select>", {
      id: 'routineSelect'
    });
    this.selector.change((function(_this) {
      return function() {
        return _this.onSelect($("#routineSelect option:selected").val());
      };
    })(this));
    this.routinesContainer.append(this.selector);
    this.queueButton = $("<a>", {
      href: "#",
      text: "Queue"
    });
    this.queueButton.click((function(_this) {
      return function(e) {
        e.preventDefault();
        return _this.onQueue();
      };
    })(this));
    this.routinesContainer.append(this.queueButton);
    this.routineView = $("<pre>", {
      id: 'routineView'
    });
    return this.routinesContainer.append(this.routineView);
  };

  RoutinesView.prototype.updateText = function(routineData) {
    this.currentRoutine = routineData;
    return this.routineView.html(JSON.stringify(routineData, void 0, 2));
  };

  RoutinesView.prototype.updateRoutines = function(next) {
    return this.routinesController.refreshRoutines((function(_this) {
      return function(routines) {
        var option, routine, _i, _len;
        _this.selector.empty();
        for (_i = 0, _len = routines.length; _i < _len; _i++) {
          routine = routines[_i];
          if (routine == null) {
            continue;
          }
          option = $("<option>", {
            value: routine.id,
            text: routine.name
          });
          _this.selector.append(option);
        }
        if (next != null) {
          return next();
        }
      };
    })(this));
  };

  RoutinesView.prototype.onQueue = function() {
    return this.choreographyRoutine.queueRoutine(this.currentRoutine);
  };

  RoutinesView.prototype.onSelect = function(id) {
    return this.routinesController.getRoutine(id, (function(_this) {
      return function(routine) {
        return _this.updateText(routine.data);
      };
    })(this));
  };

  return RoutinesView;

})();



},{}],"/Users/ulyssespopple/Development/js/webgl-visualizer/javascript/OrbitControls.js":[function(require,module,exports){
/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 */
/*global THREE, console */

// This set of controls performs orbiting, dollying (zooming), and panning. It maintains
// the "up" direction as +Y, unlike the TrackballControls. Touch on tablet and phones is
// supported.
//
//    Orbit - left mouse / touch: one finger move
//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
//    Pan - right mouse, or arrow keys / touch: three finter swipe
//
// This is a drop-in replacement for (most) TrackballControls used in examples.
// That is, include this js file and wherever you see:
//    	controls = new THREE.TrackballControls( camera );
//      controls.target.z = 150;
// Simple substitute "OrbitControls" and the control should work as-is.

THREE.OrbitControls = function (object, domElement) {

    this.object = object;
    this.domElement = ( domElement !== undefined ) ? domElement : document;

    // API

    // Set to false to disable this control
    this.enabled = true;

    // "target" sets the location of focus, where the control orbits around
    // and where it pans with respect to.
    this.target = new THREE.Vector3();

    // center is old, deprecated; use "target" instead
    this.center = this.target;

    // This option actually enables dollying in and out; left as "zoom" for
    // backwards compatibility
    this.noZoom = false;
    this.zoomSpeed = 1.0;

    // Limits to how far you can dolly in and out
    this.minDistance = 0;
    this.maxDistance = Infinity;

    // Set to true to disable this control
    this.noRotate = false;
    this.rotateSpeed = 1.0;

    // Set to true to disable this control
    this.noPan = false;
    this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

    // Set to true to automatically rotate around the target
    this.autoRotate = false;
    this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

    // How far you can orbit vertically, upper and lower limits.
    // Range is 0 to Math.PI radians.
    this.minPolarAngle = 0; // radians
    this.maxPolarAngle = Math.PI; // radians

    // Set to true to disable use of the keys
    this.noKeys = false;

    // The four arrow keys
    this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

    ////////////
    // internals

    var scope = this;

    var EPS = 0.000001;

    var rotateStart = new THREE.Vector2();
    var rotateEnd = new THREE.Vector2();
    var rotateDelta = new THREE.Vector2();

    var panStart = new THREE.Vector2();
    var panEnd = new THREE.Vector2();
    var panDelta = new THREE.Vector2();
    var panOffset = new THREE.Vector3();

    var offset = new THREE.Vector3();

    var dollyStart = new THREE.Vector2();
    var dollyEnd = new THREE.Vector2();
    var dollyDelta = new THREE.Vector2();

    var phiDelta = 0;
    var thetaDelta = 0;
    var scale = 1;
    var pan = new THREE.Vector3();

    var lastPosition = new THREE.Vector3();
    var lastQuaternion = new THREE.Quaternion();

    var STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5 };

    var state = STATE.NONE;

    // for reset

    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();

    // so camera.up is the orbit axis

    var quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
    var quatInverse = quat.clone().inverse();

    // events

    var changeEvent = { type: 'change' };
    var startEvent = { type: 'start'};
    var endEvent = { type: 'end'};

    this.rotateLeft = function (angle) {

        if (angle === undefined) {

            angle = getAutoRotationAngle();

        }

        thetaDelta -= angle;

    };

    this.rotateUp = function (angle) {

        if (angle === undefined) {

            angle = getAutoRotationAngle();

        }

        phiDelta -= angle;

    };

    // pass in distance in world space to move left
    this.panLeft = function (distance) {

        var te = this.object.matrix.elements;

        // get X column of matrix
        panOffset.set(te[ 0 ], te[ 1 ], te[ 2 ]);
        panOffset.multiplyScalar(-distance);

        pan.add(panOffset);

    };

    // pass in distance in world space to move up
    this.panUp = function (distance) {

        var te = this.object.matrix.elements;

        // get Y column of matrix
        panOffset.set(te[ 4 ], te[ 5 ], te[ 6 ]);
        panOffset.multiplyScalar(distance);

        pan.add(panOffset);

    };

    // pass in x,y of change desired in pixel space,
    // right and down are positive
    this.pan = function (deltaX, deltaY) {

        var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

        if (scope.object.fov !== undefined) {

            // perspective
            var position = scope.object.position;
            var offset = position.clone().sub(scope.target);
            var targetDistance = offset.length();

            // half of the fov is center to top of screen
            targetDistance *= Math.tan(( scope.object.fov / 2 ) * Math.PI / 180.0);

            // we actually don't use screenWidth, since perspective camera is fixed to screen height
            scope.panLeft(2 * deltaX * targetDistance / element.clientHeight);
            scope.panUp(2 * deltaY * targetDistance / element.clientHeight);

        } else if (scope.object.top !== undefined) {

            // orthographic
            scope.panLeft(deltaX * (scope.object.right - scope.object.left) / element.clientWidth);
            scope.panUp(deltaY * (scope.object.top - scope.object.bottom) / element.clientHeight);

        } else {

            // camera neither orthographic or perspective
            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');

        }

    };

    this.dollyIn = function (dollyScale) {

        if (dollyScale === undefined) {

            dollyScale = getZoomScale();

        }

        scale /= dollyScale;

    };

    this.dollyOut = function (dollyScale) {

        if (dollyScale === undefined) {

            dollyScale = getZoomScale();

        }

        scale *= dollyScale;

    };

    this.update = function () {

        var position = this.object.position;

        offset.copy(position).sub(this.target);

        // rotate offset to "y-axis-is-up" space
        offset.applyQuaternion(quat);

        // angle from z-axis around y-axis

        var theta = Math.atan2(offset.x, offset.z);

        // angle from y-axis

        var phi = Math.atan2(Math.sqrt(offset.x * offset.x + offset.z * offset.z), offset.y);

        if (this.autoRotate) {

            this.rotateLeft(getAutoRotationAngle());

        }

        theta += thetaDelta;
        phi += phiDelta;

        // restrict phi to be between desired limits
        phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, phi));

        // restrict phi to be betwee EPS and PI-EPS
        phi = Math.max(EPS, Math.min(Math.PI - EPS, phi));

        var radius = offset.length() * scale;

        // restrict radius to be between desired limits
        radius = Math.max(this.minDistance, Math.min(this.maxDistance, radius));

        // move target to panned location
        this.target.add(pan);

        offset.x = radius * Math.sin(phi) * Math.sin(theta);
        offset.y = radius * Math.cos(phi);
        offset.z = radius * Math.sin(phi) * Math.cos(theta);

        // rotate offset back to "camera-up-vector-is-up" space
        offset.applyQuaternion(quatInverse);

        position.copy(this.target).add(offset);

        this.object.lookAt(this.target);

        thetaDelta = 0;
        phiDelta = 0;
        scale = 1;
        pan.set(0, 0, 0);

        // update condition is:
        // min(camera displacement, camera rotation in radians)^2 > EPS
        // using small-angle approximation cos(x/2) = 1 - x^2 / 8

        if (lastPosition.distanceToSquared(this.object.position) > EPS
            || 8 * (1 - lastQuaternion.dot(this.object.quaternion)) > EPS) {

            this.dispatchEvent(changeEvent);

            lastPosition.copy(this.object.position);
            lastQuaternion.copy(this.object.quaternion);

        }

        var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

        if (element.clientWidth > 0 && element.clientHeight > 0) {
            // rotating across whole screen goes 360 degrees around
            scope.rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);

            // rotating up and down along whole screen attempts to go 360, but limited to 180
            scope.rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);

            rotateDelta.multiplyScalar(0.99)
        }

    };


    this.reset = function () {

        state = STATE.NONE;

        this.target.copy(this.target0);
        this.object.position.copy(this.position0);

        this.update();

    };

    function getAutoRotationAngle() {

        return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

    }

    function getZoomScale() {

        return Math.pow(0.95, scope.zoomSpeed);

    }

    function onMouseDown(event) {

        if (scope.enabled === false) return;
        event.preventDefault();

        if (event.button === 0) {
            if (scope.noRotate === true) return;

            state = STATE.ROTATE;

            rotateStart.set(event.clientX, event.clientY);

        } else if (event.button === 1) {
            if (scope.noZoom === true) return;

            state = STATE.DOLLY;

            dollyStart.set(event.clientX, event.clientY);

        } else if (event.button === 2) {
            if (scope.noPan === true) return;

            state = STATE.PAN;

            panStart.set(event.clientX, event.clientY);

        }

        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('mouseup', onMouseUp, false);
        scope.dispatchEvent(startEvent);

    }

    function onMouseMove(event) {

        if (scope.enabled === false) return;

        event.preventDefault();

        var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

        if (state === STATE.ROTATE) {

            if (scope.noRotate === true) return;

            rotateEnd.set(event.clientX, event.clientY);
            rotateDelta.subVectors(rotateEnd, rotateStart);

            // rotating across whole screen goes 360 degrees around
            scope.rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);

            // rotating up and down along whole screen attempts to go 360, but limited to 180
            scope.rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);

            rotateStart.copy(rotateEnd);

        } else if (state === STATE.DOLLY) {

            if (scope.noZoom === true) return;

            dollyEnd.set(event.clientX, event.clientY);
            dollyDelta.subVectors(dollyEnd, dollyStart);

            if (dollyDelta.y > 0) {

                scope.dollyIn();

            } else {

                scope.dollyOut();

            }

            dollyStart.copy(dollyEnd);

        } else if (state === STATE.PAN) {

            if (scope.noPan === true) return;

            panEnd.set(event.clientX, event.clientY);
            panDelta.subVectors(panEnd, panStart);

            scope.pan(panDelta.x, panDelta.y);

            panStart.copy(panEnd);

        }

        scope.update();

    }

    function onMouseUp(/* event */) {

        if (scope.enabled === false) return;

        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);
        scope.dispatchEvent(endEvent);
        state = STATE.NONE;

    }

    function onMouseWheel(event) {

        if (scope.enabled === false || scope.noZoom === true) return;

        event.preventDefault();
        event.stopPropagation();

        var delta = 0;

        if (event.wheelDelta !== undefined) { // WebKit / Opera / Explorer 9

            delta = event.wheelDelta;

        } else if (event.detail !== undefined) { // Firefox

            delta = -event.detail;

        }

        if (delta > 0) {

            scope.dollyOut();

        } else {

            scope.dollyIn();

        }

        scope.update();
        scope.dispatchEvent(startEvent);
        scope.dispatchEvent(endEvent);

    }

    function onKeyDown(event) {

        if (scope.enabled === false || scope.noKeys === true || scope.noPan === true) return;

        switch (event.keyCode) {

            case scope.keys.UP:
                scope.pan(0, scope.keyPanSpeed);
                scope.update();
                break;

            case scope.keys.BOTTOM:
                scope.pan(0, -scope.keyPanSpeed);
                scope.update();
                break;

            case scope.keys.LEFT:
                scope.pan(scope.keyPanSpeed, 0);
                scope.update();
                break;

            case scope.keys.RIGHT:
                scope.pan(-scope.keyPanSpeed, 0);
                scope.update();
                break;

        }

    }

    function touchstart(event) {

        if (scope.enabled === false) return;

        switch (event.touches.length) {

            case 1:	// one-fingered touch: rotate

                if (scope.noRotate === true) return;

                state = STATE.TOUCH_ROTATE;

                rotateStart.set(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY);
                break;

            case 2:	// two-fingered touch: dolly

                if (scope.noZoom === true) return;

                state = STATE.TOUCH_DOLLY;

                var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
                var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
                var distance = Math.sqrt(dx * dx + dy * dy);
                dollyStart.set(0, distance);
                break;

            case 3: // three-fingered touch: pan

                if (scope.noPan === true) return;

                state = STATE.TOUCH_PAN;

                panStart.set(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY);
                break;

            default:

                state = STATE.NONE;

        }

        scope.dispatchEvent(startEvent);

    }

    function touchmove(event) {

        if (scope.enabled === false) return;

        event.preventDefault();
        event.stopPropagation();

        var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

        switch (event.touches.length) {

            case 1: // one-fingered touch: rotate

                if (scope.noRotate === true) return;
                if (state !== STATE.TOUCH_ROTATE) return;

                rotateEnd.set(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY);
                rotateDelta.subVectors(rotateEnd, rotateStart);

                // rotating across whole screen goes 360 degrees around
                scope.rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);
                // rotating up and down along whole screen attempts to go 360, but limited to 180
                scope.rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);

                rotateStart.copy(rotateEnd);

                scope.update();
                break;

            case 2: // two-fingered touch: dolly

                if (scope.noZoom === true) return;
                if (state !== STATE.TOUCH_DOLLY) return;

                var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
                var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
                var distance = Math.sqrt(dx * dx + dy * dy);

                dollyEnd.set(0, distance);
                dollyDelta.subVectors(dollyEnd, dollyStart);

                if (dollyDelta.y > 0) {

                    scope.dollyOut();

                } else {

                    scope.dollyIn();

                }

                dollyStart.copy(dollyEnd);

                scope.update();
                break;

            case 3: // three-fingered touch: pan

                if (scope.noPan === true) return;
                if (state !== STATE.TOUCH_PAN) return;

                panEnd.set(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY);
                panDelta.subVectors(panEnd, panStart);

                scope.pan(panDelta.x, panDelta.y);

                panStart.copy(panEnd);

                scope.update();
                break;

            default:

                state = STATE.NONE;

        }

    }

    function touchend(/* event */) {

        if (scope.enabled === false) return;

        scope.dispatchEvent(endEvent);
        state = STATE.NONE;

    }

    this.domElement.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    }, false);
    this.domElement.addEventListener('mousedown', onMouseDown, false);
    this.domElement.addEventListener('mousewheel', onMouseWheel, false);
    this.domElement.addEventListener('DOMMouseScroll', onMouseWheel, false); // firefox

    this.domElement.addEventListener('touchstart', touchstart, false);
    this.domElement.addEventListener('touchend', touchend, false);
    this.domElement.addEventListener('touchmove', touchmove, false);

    window.addEventListener('keydown', onKeyDown, false);

    // force an update at start
    this.update();

};

THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);
},{}],"/Users/ulyssespopple/Development/js/webgl-visualizer/javascript/Queue.js":[function(require,module,exports){
(function () {
    window.Queue = (function () {
        function Queue() {
            this.tail = [];
            this.head = Array.prototype.slice.call(arguments);
            this.offset = 0;
            // Lock the object down
            Object.seal(this);
        };

        Queue.prototype.shift = function () {
            if (this.offset === this.head.length) {
                var tmp = this.head;
                tmp.length = 0;
                this.head = this.tail;
                this.tail = tmp;
                this.offset = 0;
                if (this.head.length === 0) return;
            }
            return this.head[this.offset++];
        };

        Queue.prototype.push = function (item) {
            return this.tail.push(item);
        };

        Queue.prototype.length = function () {
            return this.head.length - this.offset + this.tail.length;
        };

        return Queue;
    })();
}).call(this)
},{}]},{},["/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/Main.coffee"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9BdWRpb1dpbmRvdy5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9DaG9yZW9ncmFwaHlSb3V0aW5lLmNvZmZlZSIsIi9Vc2Vycy91bHlzc2VzcG9wcGxlL0RldmVsb3BtZW50L2pzL3dlYmdsLXZpc3VhbGl6ZXIvY29mZmVlL01haW4uY29mZmVlIiwiL1VzZXJzL3VseXNzZXNwb3BwbGUvRGV2ZWxvcG1lbnQvanMvd2ViZ2wtdmlzdWFsaXplci9jb2ZmZWUvUGxheWVyLmNvZmZlZSIsIi9Vc2Vycy91bHlzc2VzcG9wcGxlL0RldmVsb3BtZW50L2pzL3dlYmdsLXZpc3VhbGl6ZXIvY29mZmVlL1JvdXRpbmVzQ29udHJvbGxlci5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9Sb3V0aW5lc1NlcnZpY2UuY29mZmVlIiwiL1VzZXJzL3VseXNzZXNwb3BwbGUvRGV2ZWxvcG1lbnQvanMvd2ViZ2wtdmlzdWFsaXplci9jb2ZmZWUvU2hhZGVyTG9hZGVyLmNvZmZlZSIsIi9Vc2Vycy91bHlzc2VzcG9wcGxlL0RldmVsb3BtZW50L2pzL3dlYmdsLXZpc3VhbGl6ZXIvY29mZmVlL1ZpZXdlci5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9WaXN1YWxpemVyLmNvZmZlZSIsIi9Vc2Vycy91bHlzc2VzcG9wcGxlL0RldmVsb3BtZW50L2pzL3dlYmdsLXZpc3VhbGl6ZXIvY29mZmVlL2RhbmNlTWF0ZXJpYWxzL0NvbG9yRGFuY2VNYXRlcmlhbC5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9kYW5jZU1hdGVyaWFscy9TaW1wbGVGcmVxdWVuY3lTaGFkZXIuY29mZmVlIiwiL1VzZXJzL3VseXNzZXNwb3BwbGUvRGV2ZWxvcG1lbnQvanMvd2ViZ2wtdmlzdWFsaXplci9jb2ZmZWUvZGFuY2Vycy9DdWJlRGFuY2VyLmNvZmZlZSIsIi9Vc2Vycy91bHlzc2VzcG9wcGxlL0RldmVsb3BtZW50L2pzL3dlYmdsLXZpc3VhbGl6ZXIvY29mZmVlL2RhbmNlcnMvRGFuY2VyLmNvZmZlZSIsIi9Vc2Vycy91bHlzc2VzcG9wcGxlL0RldmVsb3BtZW50L2pzL3dlYmdsLXZpc3VhbGl6ZXIvY29mZmVlL2RhbmNlcnMvUG9pbnRDbG91ZERhbmNlci5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9kYW5jZXJzL1NwaGVyZURhbmNlci5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9kYW5jZXMvUG9zaXRpb25EYW5jZS5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9kYW5jZXMvUm90YXRlRGFuY2UuY29mZmVlIiwiL1VzZXJzL3VseXNzZXNwb3BwbGUvRGV2ZWxvcG1lbnQvanMvd2ViZ2wtdmlzdWFsaXplci9jb2ZmZWUvZGFuY2VzL1NjYWxlRGFuY2UuY29mZmVlIiwiL1VzZXJzL3VseXNzZXNwb3BwbGUvRGV2ZWxvcG1lbnQvanMvd2ViZ2wtdmlzdWFsaXplci9jb2ZmZWUvaW50ZXJmYWNlL0RhdEdVSUludGVyZmFjZS5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9pbnRlcmZhY2UvUXVldWVWaWV3LmNvZmZlZSIsIi9Vc2Vycy91bHlzc2VzcG9wcGxlL0RldmVsb3BtZW50L2pzL3dlYmdsLXZpc3VhbGl6ZXIvY29mZmVlL2ludGVyZmFjZS9Sb3V0aW5lc1ZpZXcuY29mZmVlIiwiamF2YXNjcmlwdC9PcmJpdENvbnRyb2xzLmpzIiwiamF2YXNjcmlwdC9RdWV1ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0NBLE1BQVksQ0FBQztBQUNYLEVBQUEsV0FBQyxDQUFBLFVBQUQsR0FBYSxJQUFiLENBQUE7O0FBRWEsRUFBQSxxQkFBQyxjQUFELEdBQUE7QUFDWCxJQUFBLElBQUMsQ0FBQSxjQUFELEdBQWtCLGNBQWxCLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxlQUFELEdBQXVCLElBQUEsVUFBQSxDQUFXLElBQUMsQ0FBQSxXQUFXLENBQUMsVUFBeEIsQ0FEdkIsQ0FBQTtBQUFBLElBRUEsSUFBQyxDQUFBLFFBQUQsR0FBZ0IsSUFBQSxVQUFBLENBQVcsSUFBQyxDQUFBLFdBQVcsQ0FBQyxVQUF4QixDQUZoQixDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsSUFBRCxHQUFRLENBSFIsQ0FBQTtBQUFBLElBSUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUpiLENBRFc7RUFBQSxDQUZiOztBQUFBLHdCQVNBLE1BQUEsR0FBUSxTQUFDLFFBQUQsRUFBVyxJQUFYLEdBQUE7QUFDTixRQUFBLHNDQUFBO0FBQUEsSUFBQSxJQUFHLENBQUEsUUFBSDtBQUNFLFlBQUEsQ0FERjtLQUFBO0FBQUEsSUFJQSxPQUFBLEdBQVUsSUFBQSxHQUFPLElBSmpCLENBQUE7QUFBQSxJQUtBLElBQUMsQ0FBQSxTQUFELEdBQWEsT0FBQSxHQUFVLElBQUMsQ0FBQSxJQUx4QixDQUFBO0FBQUEsSUFNQSxJQUFDLENBQUEsSUFBRCxHQUFRLE9BTlIsQ0FBQTtBQUFBLElBUUEsUUFB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIENvbnRhaW5zIHRoZSBmcmVxdWVuY3lTYW1wbGVzIGFuZCBkYlNhbXBsZXMgZm9yIGF1ZGlvXG5jbGFzcyB3aW5kb3cuQXVkaW9XaW5kb3dcbiAgQGJ1ZmZlclNpemU6IDIwNDhcblxuICBjb25zdHJ1Y3RvcjogKHJlc3BvbnNpdmVuZXNzKSAtPlxuICAgIEByZXNwb25zaXZlbmVzcyA9IHJlc3BvbnNpdmVuZXNzXG4gICAgQGZyZXF1ZW5jeUJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KEBjb25zdHJ1Y3Rvci5idWZmZXJTaXplKVxuICAgIEBkYkJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KEBjb25zdHJ1Y3Rvci5idWZmZXJTaXplKVxuICAgIEB0aW1lID0gMFxuICAgIEBkZWx0YVRpbWUgPSAwXG5cbiAgdXBkYXRlOiAoYW5hbHlzZXIsIHRpbWUpIC0+XG4gICAgaWYgIWFuYWx5c2VyXG4gICAgICByZXR1cm5cblxuICAgICMgS2VlcCB0cmFjayBvZiB0aGUgYXVkaW9Db250ZXh0IHRpbWUgaW4gbXNcbiAgICBuZXdUaW1lID0gdGltZSAqIDEwMDBcbiAgICBAZGVsdGFUaW1lID0gbmV3VGltZSAtIEB0aW1lXG4gICAgQHRpbWUgPSBuZXdUaW1lXG5cbiAgICBhbmFseXNlci5nZXRCeXRlVGltZURvbWFpbkRhdGEoQGRiQnVmZmVyKVxuICAgIGFuYWx5c2VyLmdldEJ5dGVGcmVxdWVuY3lEYXRhKEBmcmVxdWVuY3lCdWZmZXIpXG5cbiAgICBybXMgPSAwXG5cbiAgICBmb3IgYnVmIGluIEBkYkJ1ZmZlclxuICAgICAgICB2YWwgPSAoYnVmIC0gMTI4KSAvIDEyOFxuICAgICAgICBybXMgKz0gdmFsKnZhbFxuXG4gICAgQGF2ZXJhZ2VEYiA9IE1hdGguc3FydChybXMgLyBAY29uc3RydWN0b3IuYnVmZmVyU2l6ZSkgKiBAcmVzcG9uc2l2ZW5lc3MiLCJjbGFzcyB3aW5kb3cuQ2hvcmVvZ3JhcGh5Um91dGluZVxuICBjb25zdHJ1Y3RvcjogKEB2aXN1YWxpemVyKSAtPlxuICAgIEBpZCA9IDBcbiAgICBAZGFuY2VyID0gXCJDdWJlRGFuY2VyXCJcbiAgICBAZGFuY2UgPSBcIlNjYWxlRGFuY2VcIlxuICAgIEBkYW5jZU1hdGVyaWFsID0gXCJDb2xvckRhbmNlTWF0ZXJpYWxcIlxuICAgIEBkYW5jZXJQYXJhbXMgPSB7fVxuICAgIEBkYW5jZVBhcmFtcyA9IHt9XG4gICAgQGRhbmNlTWF0ZXJpYWxQYXJhbXMgPSB7fVxuXG4gICAgQHJlc2V0KClcbiAgICBAcm91dGluZSA9IFtcbiAgICAgIFtcbiAgICAgICAgeyBpZDogLTEgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAyXG4gICAgICAgICAgZGFuY2VyOlxuICAgICAgICAgICAgdHlwZTogJ0N1YmVEYW5jZXInXG4gICAgICAgICAgZGFuY2U6XG4gICAgICAgICAgICB0eXBlOiAnUG9zaXRpb25EYW5jZSdcbiAgICAgICAgICAgIHBhcmFtczpcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcbiAgICAgICAgICAgICAgZGlyZWN0aW9uOiBbMCwgNC4wLCAwXVxuICAgICAgICAgIGRhbmNlTWF0ZXJpYWw6XG4gICAgICAgICAgICB0eXBlOiAnQ29sb3JEYW5jZU1hdGVyaWFsJ1xuICAgICAgICAgICAgcGFyYW1zOlxuICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6IDBcbiAgICAgICAgICBkYW5jZXI6XG4gICAgICAgICAgICB0eXBlOiAnUG9pbnRDbG91ZERhbmNlcidcbiAgICAgICAgICBkYW5jZTpcbiAgICAgICAgICAgIHR5cGU6ICdSb3RhdGVEYW5jZSdcbiAgICAgICAgICAgIHBhcmFtczpcbiAgICAgICAgICAgICAgYXhpczogWy0xLCAtMSwgMF1cbiAgICAgICAgICBkYW5jZU1hdGVyaWFsOlxuICAgICAgICAgICAgdHlwZTogJ0NvbG9yRGFuY2VNYXRlcmlhbCdcbiAgICAgICAgICAgIHBhcmFtczpcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcbiAgICAgICAgICAgICAgbWluTDogMC4wXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogMVxuICAgICAgICAgIGRhbmNlcjpcbiAgICAgICAgICAgIHR5cGU6ICdQb2ludENsb3VkRGFuY2VyJ1xuICAgICAgICAgIGRhbmNlOlxuICAgICAgICAgICAgdHlwZTogJ1JvdGF0ZURhbmNlJ1xuICAgICAgICAgICAgcGFyYW1zOlxuICAgICAgICAgICAgICBheGlzOiBbMCwgMSwgMV1cbiAgICAgICAgICAgICAgc3BlZWQ6IDAuNVxuICAgICAgICAgIGRhbmNlTWF0ZXJpYWw6XG4gICAgICAgICAgICB0eXBlOiAnQ29sb3JEYW5jZU1hdGVyaWFsJ1xuICAgICAgICAgICAgcGFyYW1zOlxuICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxuICAgICAgICAgICAgICBtaW5MOiAwLjBcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAyXG4gICAgICAgICAgZGFuY2VyOlxuICAgICAgICAgICAgdHlwZTogJ1NwaGVyZURhbmNlcidcbiAgICAgICAgICAgIHBhcmFtczpcbiAgICAgICAgICAgICAgcG9zaXRpb246IFswLjUsIDAsIDAuNV1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAzXG4gICAgICAgICAgZGFuY2VyOlxuICAgICAgICAgICAgdHlwZTogJ1NwaGVyZURhbmNlcidcbiAgICAgICAgICAgIHBhcmFtczpcbiAgICAgICAgICAgICAgcG9zaXRpb246IFswLjUsIDAsIC0wLjVdXG4gICAgICAgICAgZGFuY2U6XG4gICAgICAgICAgICB0eXBlOiAnU2NhbGVEYW5jZSdcbiAgICAgICAgICAgIHBhcmFtczpcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcbiAgICAgICAgICBkYW5jZU1hdGVyaWFsOlxuICAgICAgICAgICAgdHlwZTogJ0NvbG9yRGFuY2VNYXRlcmlhbCdcbiAgICAgICAgICAgIHBhcmFtczpcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcbiAgICAgICAgICAgICAgd2lyZWZyYW1lOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogNFxuICAgICAgICAgIGRhbmNlcjpcbiAgICAgICAgICAgIHR5cGU6ICdTcGhlcmVEYW5jZXInXG4gICAgICAgICAgICBwYXJhbXM6XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBbLTAuNSwgMCwgMC41XVxuICAgICAgICAgIGRhbmNlOlxuICAgICAgICAgICAgdHlwZTogJ1NjYWxlRGFuY2UnXG4gICAgICAgICAgICBwYXJhbXM6XG4gICAgICAgICAgICAgIHNtb290aGluZ0ZhY3RvcjogMC41XG4gICAgICAgICAgZGFuY2VNYXRlcmlhbDpcbiAgICAgICAgICAgIHR5cGU6ICdDb2xvckRhbmNlTWF0ZXJpYWwnXG4gICAgICAgICAgICBwYXJhbXM6XG4gICAgICAgICAgICAgIHNtb290aGluZ0ZhY3RvcjogMC41XG4gICAgICAgICAgICAgIHdpcmVmcmFtZTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6IDVcbiAgICAgICAgICBkYW5jZXI6XG4gICAgICAgICAgICB0eXBlOiAnU3BoZXJlRGFuY2VyJ1xuICAgICAgICAgICAgcGFyYW1zOlxuICAgICAgICAgICAgICBwb3NpdGlvbjogWy0wLjUsIDAsIC0wLjVdXG4gICAgICAgICAgZGFuY2U6XG4gICAgICAgICAgICB0eXBlOiAnUG9zaXRpb25EYW5jZSdcbiAgICAgICAgICAgIHBhcmFtczpcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcbiAgICAgICAgICBkYW5jZU1hdGVyaWFsOlxuICAgICAgICAgICAgdHlwZTogJ0NvbG9yRGFuY2VNYXRlcmlhbCdcbiAgICAgICAgICAgIHBhcmFtczpcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcbiAgICAgICAgICAgICAgd2lyZWZyYW1lOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICBdXG4gICAgXVxuXG4jICAgIEB1cGRhdGVUZXh0KClcblxuICAjIEluZGl2aWR1YWwgbW9tZW50IG1ldGhvZHNcblxuICBwcmV2aWV3OiAoKSAtPlxuICAgIEB2aXN1YWxpemVyLnJlY2VpdmVDaG9yZW9ncmFwaHlcbiAgICAgIGlkOiBAaWRcbiAgICAgIGRhbmNlcjpcbiAgICAgICAgdHlwZTogQGRhbmNlclxuICAgICAgICBwYXJhbXM6IEBkYW5jZXJQYXJhbXNcbiAgICAgIGRhbmNlOlxuICAgICAgICB0eXBlOiBAZGFuY2VcbiAgICAgICAgcGFyYW1zOiBAZGFuY2VQYXJhbXNcbiAgICAgIGRhbmNlTWF0ZXJpYWw6XG4gICAgICAgIHR5cGU6IEBkYW5jZU1hdGVyaWFsXG4gICAgICAgIHBhcmFtczogQGRhbmNlTWF0ZXJpYWxQYXJhbXNcblxuICBhZGQ6ICgpIC0+XG4gICAgQHJvdXRpbmVNb21lbnQucHVzaFxuICAgICAgaWQ6IEBpZFxuICAgICAgZGFuY2VyOlxuICAgICAgICB0eXBlOiBAZGFuY2VyXG4gICAgICAgIHBhcmFtczogQGRhbmNlclBhcmFtc1xuICAgICAgZGFuY2U6XG4gICAgICAgIHR5cGU6IEBkYW5jZVxuICAgICAgICBwYXJhbXM6IEBkYW5jZVBhcmFtc1xuICAgICAgZGFuY2VNYXRlcmlhbDpcbiAgICAgICAgdHlwZTogQGRhbmNlTWF0ZXJpYWxcbiAgICAgICAgcGFyYW1zOiBAZGFuY2VNYXRlcmlhbFBhcmFtc1xuXG4gICAgQHVwZGF0ZVRleHQoKVxuXG4gIGluc2VydEJlYXQ6ICgpIC0+XG4gICAgQHJvdXRpbmVNb21lbnQgPSBbXVxuICAgIEByb3V0aW5lLnNwbGljZSgrK0Byb3V0aW5lQmVhdCwgMCwgQHJvdXRpbmVNb21lbnQpXG4gICAgQHVwZGF0ZVRleHQoKVxuXG4gIHBsYXlOZXh0OiAoKSAtPlxuICAgIGlmIEByb3V0aW5lQmVhdCA9PSBAcm91dGluZS5sZW5ndGggLSAxXG4gICAgICBAcm91dGluZUJlYXQgPSAtMVxuXG4gICAgQHJvdXRpbmVNb21lbnQgPSBAcm91dGluZVsrK0Byb3V0aW5lQmVhdF1cbiAgICBmb3IgY2hhbmdlIGluIEByb3V0aW5lTW9tZW50XG4gICAgICBAdmlzdWFsaXplci5yZWNlaXZlQ2hvcmVvZ3JhcGh5IGNoYW5nZVxuXG4gICAgQHVwZGF0ZVRleHQoKVxuXG4gIHVwZGF0ZURhbmNlcjogKGRhbmNlcikgLT5cbiAgICBAZGFuY2VyID0gZGFuY2VyLmNvbnN0cnVjdG9yLm5hbWVcbiAgICBAZGFuY2VNYXRlcmlhbCA9IGRhbmNlci5kYW5jZU1hdGVyaWFsLmNvbnN0cnVjdG9yLm5hbWVcbiAgICBAZGFuY2UgPSBkYW5jZXIuZGFuY2UuY29uc3RydWN0b3IubmFtZVxuXG5cbiAgIyBFbnRpcmUgcm91dGluZSBtZXRob2RzXG5cbiAgcXVldWVSb3V0aW5lOiAocm91dGluZURhdGEpIC0+XG4gICAgQXJyYXk6OnB1c2guYXBwbHkgQHJvdXRpbmUsIHJvdXRpbmVEYXRhXG5cbiAgY3JlYXRlUm91dGluZTogKG5hbWUsIG5leHQpIC0+XG4gICAgIyBVc2UgdGhlIHJvdXRpbmUgc2VydmljZSB0byBjcmVhdGUgYSByb3V0aW5lXG5cbiAgcmVzZXQ6ICgpIC0+XG4gICAgQHJvdXRpbmUgPSBbXVxuICAgIEByb3V0aW5lTW9tZW50ID0gW11cbiAgICBAcm91dGluZUJlYXQgPSAtMVxuXG4gIHVwZGF0ZVRleHQ6ICgpIC0+XG4gICAgQHZpc3VhbGl6ZXIuaW50ZXJmYWNlLnVwZGF0ZVRleHQoKVxuXG5cblxuXG5cblxuIiwiIyBSZXF1aXJlIGFsbCB0aGUgc2hpdFxucmVxdWlyZSAnLi9WaXN1YWxpemVyLmNvZmZlZSdcbnJlcXVpcmUgJy4uL2phdmFzY3JpcHQvT3JiaXRDb250cm9scydcbnJlcXVpcmUgJy4vVmlld2VyLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW50ZXJmYWNlL0RhdEdVSUludGVyZmFjZS5jb2ZmZWUnXG5cbmNsYXNzIHdpbmRvdy5NYWluXG4gICMgQ29uc3RydWN0IHRoZSBzY2VuZVxuICBjb25zdHJ1Y3RvcjogKGlzVmlzdWFsaXplcikgLT5cbiAgICBAc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKVxuICAgIEByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCB7IGFudGlhbGlhczogdHJ1ZSwgYWxwaGE6IGZhbHNlIH0gKVxuICAgIEByZW5kZXJlci5zZXRTaXplKCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0IClcbiAgICBAcmVuZGVyZXIuYXV0b0NsZWFyID0gZmFsc2VcblxuICAgIEBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoIDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwIClcbiAgICBAY29udHJvbHMgPSBuZXcgVEhSRUUuT3JiaXRDb250cm9scyggQGNhbWVyYSwgQHJlbmRlcmVyLmRvbUVsZW1lbnQgKVxuICAgIEBjb250cm9scy5kYW1waW5nID0gMC4yXG5cbiAgICBjb250cm9sQ2hhbmdlID0gKCkgPT5cbiAgICAgIEByZW5kZXIoKVxuXG4gICAgQGNvbnRyb2xzLmFkZEV2ZW50TGlzdGVuZXIoICdjaGFuZ2UnLCBjb250cm9sQ2hhbmdlIClcblxuICAgIEBjYW1lcmEucG9zaXRpb24ueiA9IC00XG4gICAgQGNhbWVyYS5wb3NpdGlvbi55ID0gM1xuICAgIEBjb250cm9scy50YXJnZXQgPSBuZXcgVEhSRUUuVmVjdG9yMyggMCwgMCwgMCApXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Jlc2l6ZScsIEBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UgKVxuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChAcmVuZGVyZXIuZG9tRWxlbWVudClcblxuICAgIEB2aWV3ZXIgPSBuZXcgVmlld2VyKEBzY2VuZSwgQGNhbWVyYSlcbiAgICBpZiBpc1Zpc3VhbGl6ZXJcbiAgICAgIEB2aXN1YWxpemVyID0gbmV3IFZpc3VhbGl6ZXIoQHZpZXdlciwgbmV3IERhdEdVSUludGVyZmFjZSgpKVxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBAdmlzdWFsaXplci5vbktleURvd24uYmluZChAdmlzdWFsaXplciksIGZhbHNlKVxuICAgIGVsc2VcbiAgICAgIEBkb21haW4gPSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3RcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdtZXNzYWdlJywgKGV2ZW50KSA9PlxuICAgICAgICBpZiBldmVudC5vcmlnaW4gIT0gQGRvbWFpbiB0aGVuIHJldHVyblxuICAgICAgICBzZW50T2JqID0gZXZlbnQuZGF0YVxuICAgICAgICBpZiBzZW50T2JqLnR5cGUgPT0gJ3JlbmRlcidcbiAgICAgICAgICBAdmlld2VyLnJlbmRlciBzZW50T2JqLmRhdGFcbiAgICAgICAgaWYgc2VudE9iai50eXBlID09ICdjaG9yZW9ncmFwaHknXG4gICAgICAgICAgQHZpZXdlci5yZWNlaXZlQ2hvcmVvZ3JhcGh5IHNlbnRPYmouZGF0YVxuXG4gIGFuaW1hdGU6ICgpIC0+XG4gICAgQHJlbmRlcigpXG4gICAgQGNvbnRyb2xzLnVwZGF0ZSgpXG5cbiAgcmVuZGVyOiAoKSAtPlxuICAgIEB2aXN1YWxpemVyPy5yZW5kZXIoKSAgXG5cbiAgICBAc2NlbmUudXBkYXRlTWF0cml4V29ybGQoKVxuICAgIEBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpXG4gICAgQHJlbmRlcmVyLmNsZWFyKClcbiAgICBAcmVuZGVyZXIucmVuZGVyKEBzY2VuZSwgQGNhbWVyYSlcbiAgICByZXR1cm5cblxuICBvbldpbmRvd1Jlc2l6ZTogKCkgPT5cbiAgICBAY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0XG4gICAgQGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KClcbiAgICBAcmVuZGVyZXIuc2V0U2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApXG5cbndpbmRvdy5hbmltYXRlID0gKCkgLT5cbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHdpbmRvdy5hbmltYXRlKVxuICB3aW5kb3cuYXBwLmFuaW1hdGUoKVxuXG4kIC0+XG4gIGRhdC5HVUkucHJvdG90eXBlLnJlbW92ZUZvbGRlciA9IChuYW1lKSAtPlxuICAgIGZvbGRlciA9ICB0aGlzLl9fZm9sZGVyc1tuYW1lXVxuICAgIGlmICFmb2xkZXJcbiAgICAgIHJldHVyblxuICAgIGZvbGRlci5jbG9zZSgpXG4gICAgdGhpcy5fX3VsLnJlbW92ZUNoaWxkKGZvbGRlci5kb21FbGVtZW50LnBhcmVudE5vZGUpXG4gICAgZGVsZXRlIHRoaXMuX19mb2xkZXJzW25hbWVdXG4gICAgdGhpcy5vblJlc2l6ZSgpIiwicmVxdWlyZSAnLi9BdWRpb1dpbmRvdy5jb2ZmZWUnXG5cbiMgUGxheXMgdGhlIGF1ZGlvIGFuZCBjcmVhdGVzIGFuIGFuYWx5c2VyXG5jbGFzcyB3aW5kb3cuUGxheWVyXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgIEBhdWRpb1dpbmRvdyA9IG5ldyBBdWRpb1dpbmRvdygxKTtcbiAgICBAbG9hZGVkQXVkaW8gPSBuZXcgQXJyYXkoKVxuICAgIEBzdGFydE9mZnNldCA9IDBcbiAgICBAc2V0dXBBbmFseXNlcigpXG5cbiAgc2V0dXBBbmFseXNlcjogKCkgLT5cbiAgICB3aW5kb3cuQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0XG4gICAgQGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKVxuICAgIEBhbmFseXNlciA9IEBhdWRpb0NvbnRleHQuY3JlYXRlQW5hbHlzZXIoKVxuICAgIEBhbmFseXNlci5mZnRTaXplID0gQXVkaW9XaW5kb3cuYnVmZmVyU2l6ZVxuXG4gIHVwZGF0ZTogKCkgLT5cbiAgICBAYXVkaW9XaW5kb3cudXBkYXRlKEBhbmFseXNlciwgQGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSlcblxuICBwYXVzZTogKCkgLT5cbiAgICBAc291cmNlLnN0b3AoKVxuICAgIEBwbGF5aW5nID0gZmFsc2VcbiAgICBAc3RhcnRPZmZzZXQgKz0gQGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSAtIEBzdGFydFRpbWVcblxuICBjcmVhdGVMaXZlSW5wdXQ6ICgpIC0+XG4gICAgZ290U3RyZWFtID0gKHN0cmVhbSkgPT5cbiAgICAgIEBwbGF5aW5nID0gdHJ1ZVxuICAgICAgQHNvdXJjZSA9IEBhdWRpb0NvbnRleHQuY3JlYXRlTWVkaWFTdHJlYW1Tb3VyY2Ugc3RyZWFtXG4gICAgICBAc291cmNlLmNvbm5lY3QgQGFuYWx5c2VyXG5cbiAgICBAZGJTYW1wbGVCdWYgPSBuZXcgVWludDhBcnJheSgyMDQ4KVxuXG4gICAgaWYgKCBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhIClcbiAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSB9LCBnb3RTdHJlYW0sIChlcnIpIC0+XG4gICAgICAgIGNvbnNvbGUubG9nKGVycikpXG4gICAgZWxzZSBpZiAobmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSApXG4gICAgICBuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSwgZ290U3RyZWFtLCAoZXJyKSAtPlxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpKVxuICAgIGVsc2UgaWYgKG5hdmlnYXRvci5tb3pHZXRVc2VyTWVkaWEgKVxuICAgICAgbmF2aWdhdG9yLm1vekdldFVzZXJNZWRpYSh7IGF1ZGlvOiB0cnVlIH0sIGdvdFN0cmVhbSwgKGVycikgLT5cbiAgICAgICAgY29uc29sZS5sb2coZXJyKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4oYWxlcnQoXCJFcnJvcjogZ2V0VXNlck1lZGlhIG5vdCBzdXBwb3J0ZWQhXCIpKTtcblxuICBwbGF5OiAodXJsKSAtPlxuICAgIEBjdXJyZW50bHlQbGF5aW5nID0gdXJsXG5cbiAgICBpZiBAbG9hZGVkQXVkaW9bdXJsXT9cbiAgICAgIEBsb2FkRnJvbUJ1ZmZlcihAbG9hZGVkQXVkaW9bdXJsXSlcbiAgICAgIHJldHVyblxuXG4gICAgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgcmVxdWVzdC5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSlcbiAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcidcbiAgICByZXF1ZXN0Lm9ubG9hZCA9ICgpID0+XG4gICAgICBAYXVkaW9Db250ZXh0LmRlY29kZUF1ZGlvRGF0YSByZXF1ZXN0LnJlc3BvbnNlXG4gICAgICAsIChidWZmZXIpID0+XG4gICAgICAgIEBsb2FkZWRBdWRpb1t1cmxdID0gYnVmZmVyXG4gICAgICAgIEBsb2FkRnJvbUJ1ZmZlcihidWZmZXIpXG4gICAgICAsIChlcnIpIC0+XG4gICAgICAgIGNvbnNvbGUubG9nKGVycilcbiAgICAgIHJldHVyblxuXG4gICAgcmVxdWVzdC5zZW5kKClcbiAgICByZXR1cm5cblxuICBsb2FkRnJvbUJ1ZmZlcjogKGJ1ZmZlcikgLT5cbiAgICBAc3RhcnRUaW1lID0gQGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZVxuICAgIEBzb3VyY2UgPSBAYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpXG4gICAgQHNvdXJjZS5idWZmZXIgPSBidWZmZXJcbiAgICBAc291cmNlLmNvbm5lY3QoQGFuYWx5c2VyKVxuICAgIEBzb3VyY2UuY29ubmVjdChAYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKVxuICAgIEBwbGF5aW5nID0gdHJ1ZVxuICAgIEBzb3VyY2Uuc3RhcnQoMCwgQHN0YXJ0T2Zmc2V0KVxuXG4gIHBhdXNlOiAoKSAtPlxuICAgIGlmIEBwbGF5ZXIucGxheWluZyB0aGVuIEBwYXVzZSgpIGVsc2UgQHBsYXkoQGN1cnJlbnRseVBsYXlpbmcpIiwicmVxdWlyZSAnLi9Sb3V0aW5lc1NlcnZpY2UuY29mZmVlJ1xuXG5jbGFzcyB3aW5kb3cuUm91dGluZXNDb250cm9sbGVyXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgIEByb3V0aW5lcyA9IFtdXG4gICAgQHJvdXRpbmVzU2VydmljZSA9IG5ldyBSb3V0aW5lc1NlcnZpY2UoKVxuXG4gIGdldFJvdXRpbmU6IChpZCwgbmV4dCkgLT5cbiAgICAjIGxvYWQgZnJvbSBzZXJ2aWNlIG9yIGZyb20gQHJvdXRpbmVzXG4gICAgaWYgQHJvdXRpbmVzW2lkXS5kYXRhICE9IFwiXCJcbiAgICAgIG5leHQgQHJvdXRpbmVzLmRhdGFcbiAgICAgIHJldHVyblxuXG4gICAgQHJvdXRpbmVzU2VydmljZS5nZXRSb3V0aW5lIGlkLCAocm91dGluZSkgPT5cbiAgICAgIEByb3V0aW5lc1tpZF0uZGF0YSA9IEpTT04ucGFyc2Uocm91dGluZS5kYXRhKVxuICAgICAgY29uc29sZS5sb2cgQHJvdXRpbmVzW2lkXVxuICAgICAgbmV4dChAcm91dGluZXNbaWRdKVxuXG4gIHJlZnJlc2hSb3V0aW5lczogKG5leHQpIC0+XG4gICAgIyBnZXQgcm91dGluZXMgZnJvbSBzZXJ2ZXIgYW5kIGNhY2hlIHNhbnMgZGF0YVxuICAgIEByb3V0aW5lc1NlcnZpY2UuZ2V0Um91dGluZXMgKGRhdGEpID0+XG4gICAgICBmb3Igcm91dGluZSBpbiBkYXRhXG4gICAgICAgIGlmIEByb3V0aW5lc1tyb3V0aW5lLmlkXT9cbiAgICAgICAgICBAcm91dGluZXNbcm91dGluZS5pZF0gPSByb3V0aW5lLm5hbWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEByb3V0aW5lc1tyb3V0aW5lLmlkXSA9IHJvdXRpbmVcblxuICAgICAgbmV4dChAcm91dGluZXMpIiwiY2xhc3Mgd2luZG93LlJvdXRpbmVzU2VydmljZVxuICBAc2VydmVyID0gXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvXCJcblxuICBnZXRSb3V0aW5lczogKG5leHQpIC0+XG4gICAgIyBnZXQgcm91dGluZXNcbiAgICAkLmFqYXhcbiAgICAgIHVybDogQGNvbnN0cnVjdG9yLnNlcnZlciArICdyb3V0aW5lcydcbiAgICAgIHR5cGU6IFwiR0VUXCJcbiAgICAgIHN1Y2Nlc3M6IChkYXRhKSAtPlxuICAgICAgICBuZXh0KGRhdGEpXG5cbiAgZ2V0Um91dGluZTogKGlkLCBuZXh0KSAtPlxuICAgICMgZ2V0IHJvdXRpbmUgZnJvbSBmcm9tIHNlcnZlclxuICAgICQuYWpheFxuICAgICAgdXJsOiBAY29uc3RydWN0b3Iuc2VydmVyICsgJ3JvdXRpbmVzLycgKyBpZFxuICAgICAgdHlwZTogXCJHRVRcIlxuICAgICAgc3VjY2VzczogKGRhdGEpIC0+XG4gICAgICAgIG5leHQoZGF0YSlcblxuXG4gIGNyZWF0ZVJvdXRpbmU6IChkYXRhLCBuZXh0KSAtPlxuICAgICAjIHBvc3QgZGF0YSB0byBzZXJ2ZXJcblxuICAgICBuZXh0KGlkKSIsImNsYXNzIHdpbmRvdy5TaGFkZXJMb2FkZXJcbiAgIyBDb25zdHJ1Y3QgdGhlIHNoYWRlciBjYWNoZVxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICBAc2hhZGVycyA9IG5ldyBBcnJheSgpXG5cbiAgIyBUYWtlcyBhIG5hbWUgYW5kIGEgY2FsbGJhY2ssIGxvYWRzIHRoYXQgc2hhZGVyIGZyb20gL3NoYWRlcnMsIGNhY2hlcyB0aGUgcmVzdWx0XG4gIGxvYWQ6IChuYW1lLCBuZXh0KSAtPlxuICAgIGlmIEBzaGFkZXJzW25hbWVdP1xuICAgICAgbmV4dChAc2hhZGVyc1tuYW1lXSlcbiAgICBlbHNlXG4gICAgICBAc2hhZGVyc1tuYW1lXSA9IHt2ZXJ0ZXhTaGFkZXI6ICcnLCBmcmFnbWVudFNoYWRlcjogJyd9XG4gICAgICBAbG9hZEZyb21VcmwobmFtZSwgJ3NoYWRlcnMvJyArIG5hbWUsIG5leHQpXG5cbiAgIyBMb2FkcyB0aGUgc2hhZGVyZnJvbSBhIFVSTFxuICBsb2FkRnJvbVVybDogKG5hbWUsIHVybCwgbmV4dCkgLT5cblxuICAgIGxvYWRlZFNoYWRlciA9IChqcVhIUiwgdGV4dFN0YXR1cykgLT5cbiAgICAgIEBzaGFkZXJzW0BuYW1lXVtAdHlwZV0gPSBqcVhIUi5yZXNwb25zZVRleHRcbiAgICAgIGlmIChAc2hhZGVyc1tAbmFtZV0udmVydGV4U2hhZGVyPyAmJiBAc2hhZGVyc1tAbmFtZV0uZnJhZ21lbnRTaGFkZXIpXG4gICAgICAgIG5leHQoQHNoYWRlcnNbQG5hbWVdKVxuXG4gICAgJC5hamF4XG4gICAgICB1cmw6IHVybCArICcudmVydCdcbiAgICAgIGRhdGFUeXBlOiAndGV4dCdcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgbmFtZTogbmFtZVxuICAgICAgICB0eXBlOiAndmVydGV4U2hhZGVyJ1xuICAgICAgICBuZXh0OiBuZXh0XG4gICAgICAgIHNoYWRlcnM6IEBzaGFkZXJzXG4gICAgICB9XG4gICAgICBjb21wbGV0ZTogbG9hZGVkU2hhZGVyIFxuXG4gICAgJC5hamF4XG4gICAgICB1cmw6IHVybCArICcuZnJhZydcbiAgICAgIGRhdGFUeXBlOiAndGV4dCdcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgbmFtZTogbmFtZVxuICAgICAgICB0eXBlOiAnZnJhZ21lbnRTaGFkZXInXG4gICAgICAgIG5leHQ6IG5leHRcbiAgICAgICAgc2hhZGVyczogQHNoYWRlcnNcbiAgICAgIH1cbiAgICAgIGNvbXBsZXRlOiBsb2FkZWRTaGFkZXIgXG5cbiAgICByZXR1cm4iLCJyZXF1aXJlICcuL1NoYWRlckxvYWRlci5jb2ZmZWUnXG5yZXF1aXJlICcuLi9qYXZhc2NyaXB0L1F1ZXVlLmpzJ1xuXG5jbGFzcyB3aW5kb3cuVmlld2VyXG4gIGNvbnN0cnVjdG9yOiAoc2NlbmUsIGNhbWVyYSkgLT5cbiAgICBAc2NlbmUgPSBzY2VuZVxuICAgIEBkYW5jZXJzID0gbmV3IEFycmF5KClcbiAgICBAc2hhZGVyTG9hZGVyID0gbmV3IFNoYWRlckxvYWRlcigpXG5cbiAgICBAY2hvcmVvZ3JhcGh5UXVldWUgPSBuZXcgUXVldWUoKVxuXG4gIHJlY2VpdmVDaG9yZW9ncmFwaHk6IChtb3ZlKSAtPlxuICAgIEBjaG9yZW9ncmFwaHlRdWV1ZS5wdXNoKG1vdmUpXG5cbiAgZXhlY3V0ZUNob3Jlb2dyYXBoeTogKHtpZCwgZGFuY2VyLCBkYW5jZSwgZGFuY2VNYXRlcmlhbCB9KSAtPlxuICAgIGlmIGlkID09IC0xXG4gICAgICBmb3IgZGFuY2VyIGluIEBkYW5jZXJzXG4gICAgICAgIEBzY2VuZS5yZW1vdmUoZGFuY2VyLmJvZHkpXG4gICAgICBAZGFuY2VycyA9IFtdXG4gICAgICByZXR1cm5cbiAgICBpZiBAZGFuY2Vyc1tpZF0/XG4gICAgICAjIFRlc3QgZXZlcnl0aGluZyBlbHNlXG4gICAgICBjdXJyZW50RGFuY2VyID0gQGRhbmNlcnNbaWRdXG5cbiAgICAgICMgSWYgbm8gcGFyYW1ldGVycyBhcmUgc2V0LCBidXQgYW4gaWQgaXMsIHRoZW4gcmVtb3ZlIHRoZSBvYmplY3RcbiAgICAgIGlmICFkYW5jZXI/ICYmICFkYW5jZSAmJiAhZGFuY2VNYXRlcmlhbFxuICAgICAgICBAc2NlbmUucmVtb3ZlKGN1cnJlbnREYW5jZXIuYm9keSlcbiAgICAgICAgQGRhbmNlcnMuc3BsaWNlKEBkYW5jZXJzLmluZGV4T2YoaWQpLCAxKVxuXG4gICAgICBpZiBkYW5jZT8gXG4gICAgICAgIGlmICFkYW5jZXI/ICYmICFkYW5jZU1hdGVyaWFsP1xuICAgICAgICAgIGN1cnJlbnREYW5jZXIucmVzZXQoKVxuICAgICAgICAgIGN1cnJlbnREYW5jZXIuZGFuY2UgPSBuZXcgVmlzdWFsaXplci5kYW5jZVR5cGVzW2RhbmNlLnR5cGVdKGRhbmNlLnBhcmFtcylcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgZWxzZVxuICAgICAgICAgIG5ld0RhbmNlID0gbmV3IFZpc3VhbGl6ZXIuZGFuY2VUeXBlc1tkYW5jZS50eXBlXShkYW5jZS5wYXJhbXMpXG4gICAgICBlbHNlXG4gICAgICAgIG5ld0RhbmNlID0gY3VycmVudERhbmNlci5kYW5jZVxuXG4gICAgICBhZGREYW5jZXIgPSAobmV3RGFuY2UsIG5ld01hdGVyaWFsKSA9PlxuICAgICAgICBpZiBkYW5jZXI/XG4gICAgICAgICAgbmV3RGFuY2VyID0gbmV3IFZpc3VhbGl6ZXIuZGFuY2VyVHlwZXNbZGFuY2VyLnR5cGVdKG5ld0RhbmNlLCBuZXdNYXRlcmlhbCwgZGFuY2VyLnBhcmFtcylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG5ld0RhbmNlciA9IG5ldyBjdXJyZW50RGFuY2VyLmNvbnN0cnVjdG9yKG5ld0RhbmNlLCBuZXdNYXRlcmlhbClcblxuICAgICAgICBjdXJyZW50RGFuY2VyLnJlc2V0KClcbiAgICAgICAgQHNjZW5lLnJlbW92ZShjdXJyZW50RGFuY2VyLmJvZHkpXG4gICAgICAgIEBkYW5jZXJzW2lkXSA9IG5ld0RhbmNlclxuICAgICAgICBAc2NlbmUuYWRkKG5ld0RhbmNlci5ib2R5KVxuXG4gICAgICBpZiBkYW5jZU1hdGVyaWFsP1xuICAgICAgICAjIFNwZWNpYWwgY2FzZSBmb3Igc2hhZGVycyBiZWNhdXNlIGl0IGhhcyB0byBsb2FkIHRoZSBzaGFkZXIgZmlsZVxuICAgICAgICAjIFRoaXMgaXMgYSByZWFsbHkgaGFja3kgd2F5IG9mIGNoZWNraW5nIGlmIGl0J3MgYSBzaGFkZXIuIFNob3VsZCBjaGFuZ2UuXG4gICAgICAgIGlmIGRhbmNlTWF0ZXJpYWwudHlwZS5pbmRleE9mKCdTaGFkZXInKSA+IC0xXG4gICAgICAgICAgbmV3TWF0ZXJpYWwgPSBuZXcgVmlzdWFsaXplci5kYW5jZU1hdGVyaWFsVHlwZXNbZGFuY2VNYXRlcmlhbC50eXBlXShAc2hhZGVyTG9hZGVyKVxuICAgICAgICAgIG5ld01hdGVyaWFsLmxvYWRTaGFkZXIgKHNoYWRlck1hdGVyaWFsKSA9PlxuICAgICAgICAgICAgYWRkRGFuY2VyIG5ld0RhbmNlLCBzaGFkZXJNYXRlcmlhbFxuICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIG5ld01hdGVyaWFsID0gbmV3IFZpc3VhbGl6ZXIuZGFuY2VNYXRlcmlhbFR5cGVzW2RhbmNlTWF0ZXJpYWwudHlwZV0oZGFuY2VNYXRlcmlhbC5wYXJhbXMpXG4gICAgICBlbHNlXG4gICAgICAgIG5ld01hdGVyaWFsID0gY3VycmVudERhbmNlci5kYW5jZU1hdGVyaWFsXG5cbiAgICAgIGFkZERhbmNlcihuZXdEYW5jZSwgbmV3TWF0ZXJpYWwpXG5cbiAgICAgIHJldHVyblxuICAgIGVsc2UgaWYgaWQ/XG4gICAgICBAZGFuY2Vyc1tpZF0gPSBuZXcgVmlzdWFsaXplci5kYW5jZXJUeXBlc1tkYW5jZXIudHlwZV0obmV3IFZpc3VhbGl6ZXIuZGFuY2VUeXBlc1tkYW5jZS50eXBlXShkYW5jZS5wYXJhbXMpLCBuZXcgVmlzdWFsaXplci5kYW5jZU1hdGVyaWFsVHlwZXNbZGFuY2VNYXRlcmlhbC50eXBlXShkYW5jZU1hdGVyaWFsLnBhcmFtcyksIGRhbmNlci5wYXJhbXMpXG4gICAgICBAc2NlbmUuYWRkIEBkYW5jZXJzW2lkXS5ib2R5XG4gICAgICByZXR1cm5cbiAgICBlbHNlXG4gICAgICByZXR1cm5cblxuICBnZXREYW5jZXI6IChpZCkgLT5cbiAgICBAZGFuY2Vyc1tpZF1cblxuXG4gICMgUmVuZGVyIHRoZSBzY2VuZSBieSBnb2luZyB0aHJvdWdoIHRoZSBBdWRpb09iamVjdCBhcnJheSBhbmQgY2FsbGluZyB1cGRhdGUoYXVkaW9FdmVudCkgb24gZWFjaCBvbmVcbiAgcmVuZGVyOiAoYXVkaW9XaW5kb3cpIC0+XG4gICAgd2hpbGUgQGNob3Jlb2dyYXBoeVF1ZXVlLmxlbmd0aCgpID4gMFxuICAgICAgQGV4ZWN1dGVDaG9yZW9ncmFwaHkgQGNob3Jlb2dyYXBoeVF1ZXVlLnNoaWZ0KClcbiAgICAjIENyZWF0ZSBldmVudFxuICAgIGZvciBpZCBpbiBPYmplY3Qua2V5cyhAZGFuY2VycylcbiAgICAgIEBkYW5jZXJzW2lkXS51cGRhdGUoYXVkaW9XaW5kb3cpXG5cbiAgIyBSZW1vdmVzIHRoZSBsYXN0IGRhbmNlciwgcmV0dXJucyB0aGUgZGFuY2VyJ3MgZGFuY2VcbiAgcmVtb3ZlTGFzdERhbmNlcjogKCkgLT5cbiAgICBwcmV2RGFuY2VyID0gQGRhbmNlcnMucG9wKClcbiAgICBAc2NlbmUucmVtb3ZlKHByZXZEYW5jZXIuYm9keSkgXG4gICAgcmV0dXJuIHByZXZEYW5jZXIuZGFuY2UiLCJyZXF1aXJlICcuL1BsYXllci5jb2ZmZWUnXG5yZXF1aXJlICcuL0Nob3Jlb2dyYXBoeVJvdXRpbmUuY29mZmVlJ1xucmVxdWlyZSAnLi9kYW5jZXJzL0N1YmVEYW5jZXIuY29mZmVlJ1xucmVxdWlyZSAnLi9kYW5jZXJzL1NwaGVyZURhbmNlci5jb2ZmZWUnXG5yZXF1aXJlICcuL2RhbmNlcnMvUG9pbnRDbG91ZERhbmNlci5jb2ZmZWUnXG5yZXF1aXJlICcuL2RhbmNlcy9TY2FsZURhbmNlLmNvZmZlZSdcbnJlcXVpcmUgJy4vZGFuY2VzL1Bvc2l0aW9uRGFuY2UuY29mZmVlJ1xucmVxdWlyZSAnLi9kYW5jZXMvUm90YXRlRGFuY2UuY29mZmVlJ1xucmVxdWlyZSAnLi9kYW5jZU1hdGVyaWFscy9Db2xvckRhbmNlTWF0ZXJpYWwuY29mZmVlJ1xucmVxdWlyZSAnLi9kYW5jZU1hdGVyaWFscy9TaW1wbGVGcmVxdWVuY3lTaGFkZXIuY29mZmVlJ1xuXG5jbGFzcyB3aW5kb3cuVmlzdWFsaXplclxuICAjIEdldCB0aG9zZSBrZXlzIHNldCB1cFxuICBrZXlzOiB7IFBBVVNFOiAzMiwgTkVYVDogNzggfVxuXG4gICMgU2V0IHVwIHRoZSBzY2VuZSBiYXNlZCBvbiBhIE1haW4gb2JqZWN0IHdoaWNoIGNvbnRhaW5zIHRoZSBzY2VuZS5cbiAgY29uc3RydWN0b3I6IChAdmlld2VyLCBAaW50ZXJmYWNlKSAtPlxuICAgIEBwbGF5ZXIgPSBuZXcgUGxheWVyKClcblxuICAgICMgTG9hZCB0aGUgc2FtcGxlIGF1ZGlvXG4gICAgIyBAcGxheSgnYXVkaW8vR28ubXAzJylcbiAgICAjIEBwbGF5KCdhdWRpby9HbGFzc2VyLm1wMycpXG4gICAgIyBAcGxheSgnYXVkaW8vT25NeU1pbmQubXAzJylcblxuICAgIEBwbGF5ZXIuY3JlYXRlTGl2ZUlucHV0KClcblxuICAgIEBjaG9yZW9ncmFwaHlSb3V0aW5lID0gbmV3IENob3Jlb2dyYXBoeVJvdXRpbmUoQClcblxuICAgIEBpbnRlcmZhY2Uuc2V0dXAoQHBsYXllciwgQGNob3Jlb2dyYXBoeVJvdXRpbmUsIEB2aWV3ZXIpXG5cbiAgICBAY2hvcmVvZ3JhcGh5Um91dGluZS5wbGF5TmV4dCgpXG5cbiAgcmVjZWl2ZUNob3Jlb2dyYXBoeTogKG1vdmUpIC0+XG4gICAgQHZpZXdlci5yZWNlaXZlQ2hvcmVvZ3JhcGh5IG1vdmVcbiAgICBpZiBAcG9wdXA/IHRoZW4gQHBvcHVwLnBvc3RNZXNzYWdlKEB3cmFwTWVzc2FnZSgnY2hvcmVvZ3JhcGh5JywgbW92ZSksIEBkb21haW4pXG5cbiAgcmVuZGVyOiAoKSAtPlxuICAgIGlmICFAcGxheWVyLnBsYXlpbmdcbiAgICAgIHJldHVyblxuXG4gICAgQHBsYXllci51cGRhdGUoKVxuXG4gICAgQHZpZXdlci5yZW5kZXIoQHBsYXllci5hdWRpb1dpbmRvdylcbiAgICBpZiBAcG9wdXA/IHRoZW4gQHBvcHVwLnBvc3RNZXNzYWdlKEB3cmFwTWVzc2FnZSgncmVuZGVyJywgQHBsYXllci5hdWRpb1dpbmRvdyksIEBkb21haW4pXG5cbiAgd3JhcE1lc3NhZ2U6ICh0eXBlLCBkYXRhKSAtPlxuICAgIHR5cGU6IHR5cGVcbiAgICBkYXRhOiBkYXRhXG5cbiAgI0V2ZW50IG1ldGhvZHNcbiAgb25LZXlEb3duOiAoZXZlbnQpIC0+XG4gICAgc3dpdGNoIGV2ZW50LmtleUNvZGVcbiAgICAgIHdoZW4gQGtleXMuUEFVU0VcbiAgICAgICAgQHBsYXllci5wYXVzZSgpXG4gICAgICB3aGVuIEBrZXlzLk5FWFRcbiAgICAgICAgQGNob3Jlb2dyYXBoeVJvdXRpbmUucGxheU5leHQoKVxuXG4gIEBkYW5jZXJUeXBlczpcbiAgICBDdWJlRGFuY2VyOiBDdWJlRGFuY2VyXG4gICAgU3BoZXJlRGFuY2VyOiBTcGhlcmVEYW5jZXJcbiAgICBQb2ludENsb3VkRGFuY2VyOiBQb2ludENsb3VkRGFuY2VyXG5cbiAgQGRhbmNlVHlwZXM6XG4gICAgU2NhbGVEYW5jZTogU2NhbGVEYW5jZVxuICAgIFBvc2l0aW9uRGFuY2U6IFBvc2l0aW9uRGFuY2VcbiAgICBSb3RhdGVEYW5jZTogUm90YXRlRGFuY2VcblxuICBAZGFuY2VNYXRlcmlhbFR5cGVzOlxuICAgIENvbG9yRGFuY2VNYXRlcmlhbDogQ29sb3JEYW5jZU1hdGVyaWFsXG4gICAgU2ltcGxlRnJlcXVlbmN5U2hhZGVyOiBTaW1wbGVGcmVxdWVuY3lTaGFkZXJcbiIsImNsYXNzIHdpbmRvdy5Db2xvckRhbmNlTWF0ZXJpYWxcbiAgQHBhcmFtczogXG4gICAgW1xuICAgICAge1xuICAgICAgICBuYW1lOiAnc21vb3RoaW5nRmFjdG9yJyxcbiAgICAgICAgZGVmYXVsdDogMC41XG4gICAgICB9LCBcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ21pbkwnLFxuICAgICAgICBkZWZhdWx0OiAwLjFcbiAgICAgIH0sIFxuICAgICAge1xuICAgICAgICBuYW1lOiAnbWluUycsXG4gICAgICAgIGRlZmF1bHQ6IDAuM1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3dpcmVmcmFtZSdcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIH1cbiAgICBdXG5cbiAgQG5hbWU6IFwiQ29sb3JEYW5jZU1hdGVyaWFsXCJcblxuICBjb25zdHJ1Y3RvcjogKEBvcHRpb25zKSAtPlxuICAgIGlmIEBvcHRpb25zPyB0aGVuIHsgQHNtb290aGluZ0ZhY3RvciwgQG1pbkwsIEBtaW5TLCBAd2lyZWZyYW1lIH0gPSBAb3B0aW9uc1xuICAgIEBzbW9vdGhpbmdGYWN0b3IgPz0gMC41XG4gICAgQG1pbkwgPz0gMC4xXG4gICAgQG1pblMgPz0gMC4zXG4gICAgQHdpcmVmcmFtZSA/PSBmYWxzZVxuICAgIEBjb2xvciA9IG5ldyBUSFJFRS5Db2xvcigxLjAsIDAsIDApXG4gICAgQG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoeyBjb2xvcjogMHgwMDAwMCwgd2lyZWZyYW1lOiBAd2lyZWZyYW1lIH0pXG4gICAgQGFwcGxpZWRDb2xvciA9IEBjb2xvci5jbG9uZSgpXG5cbiAgdXBkYXRlOiAoYXVkaW9XaW5kb3csIGRhbmNlcikgLT5cblxuICAgIG1heFZhbHVlID0gMFxuICAgIG1heEluZGV4ID0gLTFcbiAgICBtYXhJbXBvcnRhbnRJbmRleCA9IDFcbiAgICBmb3IgaSBpbiBbMS4uQXVkaW9XaW5kb3cuYnVmZmVyU2l6ZV1cbiAgICAgIGZyZXEgPSBhdWRpb1dpbmRvdy5mcmVxdWVuY3lCdWZmZXJbaV1cbiAgICAgIHZhbHVlID0gZnJlcSAqIGlcbiAgICAgIGlmICh2YWx1ZSA+IG1heFZhbHVlKVxuICAgICAgICBtYXhWYWx1ZSA9IHZhbHVlXG4gICAgICAgIG1heEluZGV4ID0gaVxuXG4gICAgb2xkQ29sb3JIU0wgPSBAYXBwbGllZENvbG9yLmdldEhTTCgpXG5cbiAgICBuZXdDb2xvclMgPSBtYXhJbmRleCAvIEF1ZGlvV2luZG93LmJ1ZmZlclNpemU7XG4gICAgbmV3Q29sb3JTID0gQHNtb290aGluZ0ZhY3RvciAqIG5ld0NvbG9yUyArICgxIC0gQHNtb290aGluZ0ZhY3RvcikgKiBvbGRDb2xvckhTTC5zXG5cbiAgICBuZXdDb2xvckwgPSBhdWRpb1dpbmRvdy5hdmVyYWdlRGJcbiAgICBuZXdDb2xvckwgPSBAc21vb3RoaW5nRmFjdG9yICogbmV3Q29sb3JMICsgKDEgLSBAc21vb3RoaW5nRmFjdG9yKSAqIG9sZENvbG9ySFNMLmxcblxuICAgIGwgPSBAbWluTCArIG5ld0NvbG9yTCAqICgxLjAgLSBAbWluTClcbiAgICBzID0gQG1pblMgKyBuZXdDb2xvclMgKiAoMS4wIC0gQG1pblMpXG5cbiAgICBuZXdDb2xvckggPSAoMzYwICogKGF1ZGlvV2luZG93LnRpbWUgLyAxMDAwMCkgJSAzNjApIC8gMzYwXG5cbiAgICBoc2wgPSBAY29sb3IuZ2V0SFNMKClcbiAgICBAYXBwbGllZENvbG9yLnNldEhTTChuZXdDb2xvckgsIHMsIGwpXG5cbiAgICBpZiBkYW5jZXI/XG4gICAgICBpZiBkYW5jZXIuYm9keS5tYXRlcmlhbC5lbWlzc2l2ZT9cbiAgICAgICAgZGFuY2VyLmJvZHkubWF0ZXJpYWwuZW1pc3NpdmUuY29weShAYXBwbGllZENvbG9yKVxuXG4gICAgICBkYW5jZXIuYm9keS5tYXRlcmlhbC5jb2xvci5jb3B5KEBhcHBsaWVkQ29sb3IpXG4iLCJjbGFzcyB3aW5kb3cuU2ltcGxlRnJlcXVlbmN5U2hhZGVyXG4gIEBwYXJhbXM6IFtdXG5cbiAgQG5hbWU6IFwiU2ltcGxlRnJlcXVlbmN5U2hhZGVyXCJcbiAgXG4gIGNvbnN0cnVjdG9yOiAoc2hhZGVyTG9hZGVyKSAtPlxuICAgIEB0YXJnZXQgPSAxMjhcbiAgICBAc2l6ZSA9IDEwMjRcbiAgICBAc2hhZGVyTG9hZGVyID0gc2hhZGVyTG9hZGVyXG4gICAgQG5ld1RleEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoQHRhcmdldCAqIEB0YXJnZXQgKiA0KVxuXG4gIGxvYWRTaGFkZXI6IChuZXh0KSAtPlxuICAgIEBzaGFkZXJMb2FkZXIubG9hZCAnc2ltcGxlX2ZyZXF1ZW5jeScsIChzaGFkZXIpID0+XG4gICAgICBzaGFkZXIudW5pZm9ybXMgPSB7XG4gICAgICAgIGZyZXFUZXh0dXJlOiB7dHlwZTogXCJ0XCIsIHZhbHVlOiBBdWRpb1dpbmRvdy5idWZmZXJTaXplfVxuICAgICAgICByZXNvbHV0aW9uOiB7IHR5cGU6IFwidjJcIiwgdmFsdWU6IG5ldyBUSFJFRS5WZWN0b3IyKDEyOCwgMTI4KX1cbiAgICAgIH1cblxuICAgICAgQG1hdGVyaWFsID0gbmV3IFRIUkVFLlNoYWRlck1hdGVyaWFsKHNoYWRlcilcbiAgICAgIEBtYXRlcmlhbC5zaWRlID0gVEhSRUUuRG91YmxlU2lkZVxuICAgICAgQG1hdGVyaWFsLnRyYW5zcGFyZW50ID0gdHJ1ZVxuICAgICAgbmV4dChAKVxuXG5cbiAgdXBkYXRlOiAoYXVkaW9XaW5kb3csIGRhbmNlcikgLT5cbiAgICBkYW5jZXIuYm9keS5tYXRlcmlhbC51bmlmb3Jtcy5mcmVxVGV4dHVyZS52YWx1ZSA9IEByZWR1Y2VBcnJheShhdWRpb1dpbmRvdy5mcmVxdWVuY3lCdWZmZXIpXG5cbiAgcmVkdWNlQXJyYXk6IChmcmVxQnVmKSAtPlxuXG4gICAgbmV3QnVmID0gbmV3IEFycmF5KEB0YXJnZXQpXG5cbiAgICBtb3ZpbmdTdW0gPSAwXG4gICAgZmxvb3JlZFJhdGlvID0gTWF0aC5mbG9vcihAc2l6ZSAvIEB0YXJnZXQpXG4gICAgZm9yIGkgaW4gWzEuLi5Ac2l6ZV1cbiAgICAgIG1vdmluZ1N1bSArPSBmcmVxQnVmW2ldXG5cbiAgICAgIGlmICgoaSArIDEpICUgZmxvb3JlZFJhdGlvKSA9PSAwXG4gICAgICAgIG5ld0J1ZltNYXRoLmZsb29yKGkgIC8gZmxvb3JlZFJhdGlvKV0gPSBtb3ZpbmdTdW0gLyBmbG9vcmVkUmF0aW9cbiAgICAgICAgbW92aW5nU3VtID0gMFxuXG5cbiAgICBmb3IgaSBpbiBbMC4uLkB0YXJnZXRdXG4gICAgICBmb3IgaiBpbiBbMC4uLkB0YXJnZXRdXG4gICAgICAgIGJhc2VJbmRleCA9IGkgKiBAdGFyZ2V0ICogNCArIGogKiA0O1xuICAgICAgICBpZiBuZXdCdWZbal0gPiBpICogMlxuICAgICAgICAgIEBuZXdUZXhBcnJheVtiYXNlSW5kZXhdID0gMjU1XG4gICAgICAgICAgQG5ld1RleEFycmF5W2Jhc2VJbmRleCArIDFdID0gMjU1XG4gICAgICAgICAgQG5ld1RleEFycmF5W2Jhc2VJbmRleCArIDJdID0gMjU1XG4gICAgICAgICAgQG5ld1RleEFycmF5W2Jhc2VJbmRleCArIDNdID0gMjU1XG4gICAgICAgIGVsc2UgXG4gICAgICAgICAgQG5ld1RleEFycmF5W2Jhc2VJbmRleF0gPSAwXG4gICAgICAgICAgQG5ld1RleEFycmF5W2Jhc2VJbmRleCArIDFdID0gMFxuICAgICAgICAgIEBuZXdUZXhBcnJheVtiYXNlSW5kZXggKyAyXSA9IDBcbiAgICAgICAgICBAbmV3VGV4QXJyYXlbYmFzZUluZGV4ICsgM10gPSAwXG5cbiAgICB0ZXh0dXJlID0gbmV3IFRIUkVFLkRhdGFUZXh0dXJlKEBuZXdUZXhBcnJheSwgQHRhcmdldCwgQHRhcmdldCwgVEhSRUUuUkdCQUZvcm1hdCwgVEhSRUUuVW5zaWduZWRCeXRlKVxuICAgIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlXG4gICAgdGV4dHVyZS5mbGlwWSA9IGZhbHNlXG4gICAgdGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgPSBmYWxzZVxuICAgIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTGluZWFyRmlsdGVyXG4gICAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5MaW5lYXJGaWx0ZXJcbiAgICB0ZXh0dXJlLnVucGFja0FsaWdubWVudCA9IDFcbiAgICB0ZXh0dXJlLndyYXBTID0gVEhSRUUuUmVwZWF0V3JhcHBpbmdcbiAgICB0ZXh0dXJlLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmdcbiAgICB0ZXh0dXJlLmFuaXNvdHJvcHkgPSA0XG5cbiAgICByZXR1cm4gdGV4dHVyZSIsInJlcXVpcmUgJy4vRGFuY2VyLmNvZmZlZSdcblxuY2xhc3Mgd2luZG93LkN1YmVEYW5jZXIgZXh0ZW5kcyBEYW5jZXJcbiAgQG5hbWU6IFwiQ3ViZURhbmNlclwiXG4gIFxuICBjb25zdHJ1Y3RvcjogKGRhbmNlLCBkYW5jZU1hdGVyaWFsLCBAb3B0aW9ucykgLT5cbiAgICBpZiBAb3B0aW9ucz8gdGhlbiB7IHBvc2l0aW9uLCBzY2FsZSB9ID0gQG9wdGlvbnNcbiAgICBzdXBlcihuZXcgVEhSRUUuQm94R2VvbWV0cnkoMSwgMSwgMSksIGRhbmNlLCBkYW5jZU1hdGVyaWFsLCBwb3NpdGlvbiwgc2NhbGUpIiwiIyBDb250YWlucyBhbiBPYmplY3QzRCBvZiBzb21lIGtpbmQsIHdpdGggYSBtZXNoIGRldGVybWluZWQgYnkgc3ViY2xhc3Nlcy5cbiMgSXQgaGFzIGFuIEVmZmVjdCBhbmQgYSBEYW5jZU1hdGVyaWFsIHdoaWNoIG9wZXJhdGUgb24gdGhlIHRyYW5zZm9ybSBhbmQgdGhlIG1hdGVyaWFsIG9mIHRoZSBPYmplY3QzRCByZXNwZWN0aXZseVxuXG5jbGFzcyB3aW5kb3cuRGFuY2VyXG4gIEB0eXBlID0gRGFuY2VyXG4gIEBwYXJhbXMgPSBbXG4gICAge1xuICAgICAgbmFtZTogJ3Bvc2l0aW9uJ1xuICAgICAgZGVmYXVsdDogWzAsIDAsIDBdXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnc2NhbGUnXG4gICAgICBkZWZhdWx0OiBbMSwgMSwgMV1cbiAgICB9XG4gIF1cblxuICBjb25zdHJ1Y3RvcjogKGdlb21ldHJ5LCBkYW5jZSwgZGFuY2VNYXRlcmlhbCwgcG9zaXRpb24sIHNjYWxlKSAtPlxuICAgICMgQ29uc3RydWN0IGEgZGVmYXVsdCBEYW5jZXIgdXNpbmcgQGJvZHkgYXMgdGhlIE9iamVjdDNEXG4gICAgbWF0ZXJpYWwgPSBkYW5jZU1hdGVyaWFsLm1hdGVyaWFsO1xuICAgIEBkYW5jZSA9IGRhbmNlXG4gICAgQGRhbmNlTWF0ZXJpYWwgPSBkYW5jZU1hdGVyaWFsO1xuICAgIEBib2R5ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICBpZiBwb3NpdGlvbj8gJiYgcG9zaXRpb24ubGVuZ3RoID09IDMgdGhlbiBAYm9keS5wb3NpdGlvbi5zZXQocG9zaXRpb25bMF0sIHBvc2l0aW9uWzFdLCBwb3NpdGlvblsyXSlcbiAgICBpZiBzY2FsZT8gJiYgc2NhbGUubGVuZ3RoID09IDMgdGhlbiBAYm9keS5zY2FsZS5zZXQoc2NhbGVbMF0sIHNjYWxlWzFdLCBzY2FsZVsyXSlcblxuICBnZW9tZXRyeTogKCkgLT5cbiAgICBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgxLCAxKVxuXG4gIHJlc2V0OiAoKSAtPlxuICAgIEBkYW5jZS5yZXNldChAKVxuXG4gIHVwZGF0ZTogKGF1ZGlvV2luZG93KSAtPlxuICAgICMgUmVhY3QgdG8gdGhlIGF1ZGlvIGV2ZW50IGJ5IHB1bXBpbmcgaXQgdGhyb3VnaCBFZmZlY3QgYW5kIFNoYWRlclxuICAgIEBkYW5jZS51cGRhdGUoYXVkaW9XaW5kb3csIEApXG4gICAgQGRhbmNlTWF0ZXJpYWwudXBkYXRlKGF1ZGlvV2luZG93LCBAKSIsInJlcXVpcmUgJy4vRGFuY2VyLmNvZmZlZSdcblxuY2xhc3Mgd2luZG93LlBvaW50Q2xvdWREYW5jZXIgZXh0ZW5kcyBEYW5jZXJcbiAgQHBhcmFtczogXG4gICAgW1xuICAgICAge1xuICAgICAgICBuYW1lOiAnbWluRGlzdGFuY2UnLFxuICAgICAgICBkZWZhdWx0OiA1LjBcbiAgICAgIH0sIFxuICAgICAge1xuICAgICAgICBuYW1lOiAnbWF4RGlzdGFuY2UnLFxuICAgICAgICBkZWZhdWx0OiAxMC4wXG4gICAgICB9LCBcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2NvdW50JyxcbiAgICAgICAgZGVmYXVsdDogNTAwXG4gICAgICB9XG4gICAgXVxuXG4gIEBuYW1lOiBcIlBvaW50Q2xvdWREYW5jZXJcIlxuXG4gIGNvbnN0cnVjdG9yOiAoQGRhbmNlLCBAZGFuY2VNYXRlcmlhbCwgQG9wdGlvbnMpIC0+XG4gICAgaWYgQG9wdGlvbnM/IHRoZW4geyBAbWluRGlzdGFuY2UsIEBtYXhEaXN0YW5jZSwgQGNvdW50IH0gPSBAb3B0aW9uc1xuICAgIEBtaW5EaXN0YW5jZSA/PSA1LjBcbiAgICBAbWF4RGlzdGFuY2UgPz0gMTAuMFxuICAgIEBjb3VudCA/PSA1MDBcblxuICAgIGRpcmVjdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKClcbiAgICBwb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApXG5cbiAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpXG4gICAgcG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheShAY291bnQgKiAzKVxuXG4gICAgZm9yIGkgaW4gWzAuLi5AY291bnRdXG4gICAgICBkaXJlY3Rpb24uc2V0KE1hdGgucmFuZG9tKCkgLSAwLjUsIE1hdGgucmFuZG9tKCkgLSAwLjUsIE1hdGgucmFuZG9tKCktIDAuNSlcbiAgICAgIGRpcmVjdGlvbi5ub3JtYWxpemUoKVxuICAgICAgZGlyZWN0aW9uLm11bHRpcGx5U2NhbGFyKEBtaW5EaXN0YW5jZSArIE1hdGgucmFuZG9tKCkgKiAoQG1heERpc3RhbmNlIC0gQG1pbkRpc3RhbmNlKSlcblxuICAgICAgcG9zaXRpb25zWzMgKiBpXSA9IHBvc2l0aW9uLnggKyBkaXJlY3Rpb24ueFxuICAgICAgcG9zaXRpb25zWzMgKiBpICsgMV0gPSBwb3NpdGlvbi55ICsgZGlyZWN0aW9uLnlcbiAgICAgIHBvc2l0aW9uc1szICogaSArIDJdID0gcG9zaXRpb24ueiArIGRpcmVjdGlvbi56XG5cbiAgICBnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShwb3NpdGlvbnMsIDMpKVxuICAgIGdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpXG5cbiAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5Qb2ludENsb3VkTWF0ZXJpYWwoeyBzaXplOiAwLjUsIGNvbG9yOiBAZGFuY2VNYXRlcmlhbC5jb2xvciB9KVxuICAgIEBib2R5ID0gbmV3IFRIUkVFLlBvaW50Q2xvdWQoIGdlb21ldHJ5LCBtYXRlcmlhbCApIiwicmVxdWlyZSAnLi9EYW5jZXIuY29mZmVlJ1xuXG5jbGFzcyB3aW5kb3cuU3BoZXJlRGFuY2VyIGV4dGVuZHMgRGFuY2VyXG4gIEBuYW1lOiBcIlNwaGVyZURhbmNlclwiXG5cbiAgY29uc3RydWN0b3I6IChkYW5jZSwgZGFuY2VNYXRlcmlhbCwgQG9wdGlvbnMpIC0+XG4gICAgaWYgQG9wdGlvbnM/IHRoZW4geyBwb3NpdGlvbiwgc2NhbGUgfSA9IEBvcHRpb25zXG4gICAgc3VwZXIobmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDEsIDMyLCAyNCksIGRhbmNlLCBkYW5jZU1hdGVyaWFsLCBwb3NpdGlvbiwgc2NhbGUpIiwiY2xhc3Mgd2luZG93LlBvc2l0aW9uRGFuY2VcbiAgQHBhcmFtczogXG4gICAgW1xuICAgICAge1xuICAgICAgICBuYW1lOiAnc21vb3RoaW5nRmFjdG9yJ1xuICAgICAgICBkZWZhdWx0OiAwLjJcbiAgICAgIH0sIFxuICAgICAge1xuICAgICAgICBuYW1lOiAnZGlyZWN0aW9uJ1xuICAgICAgICBkZWZhdWx0OiBbMCwgMSwgMF1cbiAgICAgIH1cbiAgICBdXG5cbiAgQG5hbWU6IFwiUG9zaXRpb25EYW5jZVwiXG5cbiAgY29uc3RydWN0b3I6IChAb3B0aW9ucykgLT5cbiAgICBpZiBAb3B0aW9ucz8gdGhlbiB7IEBzbW9vdGhpbmdGYWN0b3IsIGRpcmVjdGlvbiB9ID0gQG9wdGlvbnNcbiAgICBAc21vb3RoaW5nRmFjdG9yID89IDAuMlxuICAgIFxuICAgIGRpcmVjdGlvbiA/PSBbMCwgMSwgMF1cbiAgICBAZGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoZGlyZWN0aW9uWzBdLCBkaXJlY3Rpb25bMV0sIGRpcmVjdGlvblsyXSlcblxuICAgIEBkaXJlY3Rpb25Db3B5ID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICBAcG9zaXRpb25DaGFuZ2UgPSAwXG5cbiAgdXBkYXRlOiAoYXVkaW9XaW5kb3csIGRhbmNlcikgLT5cbiAgICBiYXNlUG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgIEBkaXJlY3Rpb25Db3B5LmNvcHkoQGRpcmVjdGlvbik7XG4gICAgYmFzZVBvc2l0aW9uLnN1YlZlY3RvcnMoZGFuY2VyLmJvZHkucG9zaXRpb24sIEBkaXJlY3Rpb25Db3B5Lm11bHRpcGx5U2NhbGFyKEBwb3NpdGlvbkNoYW5nZSkpXG5cbiAgICBzbW9vdGhpbmdGYWN0b3IgPSBpZiBhdWRpb1dpbmRvdy5hdmVyYWdlRGIgPCBAcG9zaXRpb25DaGFuZ2UgdGhlbiBAc21vb3RoaW5nRmFjdG9yIGVsc2UgTWF0aC5tYXgoMSwgQHNtb290aGluZ0ZhY3RvciAqIDQpXG4gICAgQHBvc2l0aW9uQ2hhbmdlID0gYXVkaW9XaW5kb3cuYXZlcmFnZURiICogc21vb3RoaW5nRmFjdG9yICsgKDEgLSBzbW9vdGhpbmdGYWN0b3IpICogQHBvc2l0aW9uQ2hhbmdlXG5cbiAgICBAZGlyZWN0aW9uQ29weS5jb3B5KEBkaXJlY3Rpb24pXG4gICAgbmV3UG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgbmV3UG9zaXRpb24uYWRkVmVjdG9ycyhiYXNlUG9zaXRpb24sIEBkaXJlY3Rpb25Db3B5Lm11bHRpcGx5U2NhbGFyKEBwb3NpdGlvbkNoYW5nZSkpXG5cbiAgICBkYW5jZXIuYm9keS5wb3NpdGlvbi5zZXQobmV3UG9zaXRpb24ueCwgbmV3UG9zaXRpb24ueSwgbmV3UG9zaXRpb24ueilcblxuICByZXNldDogKGRhbmNlcikgLT5cbiAgICBAZGlyZWN0aW9uQ29weS5jb3B5KEBkaXJlY3Rpb24pO1xuICAgIGJhc2VQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgYmFzZVBvc2l0aW9uLnN1YlZlY3RvcnMoZGFuY2VyLmJvZHkucG9zaXRpb24sIEBkaXJlY3Rpb25Db3B5Lm11bHRpcGx5U2NhbGFyKEBwb3NpdGlvbkNoYW5nZSkpXG4gICAgZGFuY2VyLmJvZHkucG9zaXRpb24uc2V0KGJhc2VQb3NpdGlvbi54LCBiYXNlUG9zaXRpb24ueSwgYmFzZVBvc2l0aW9uLnopIiwiY2xhc3Mgd2luZG93LlJvdGF0ZURhbmNlXG4gIEBuYW1lOiBcIlJvdGF0ZURhbmNlXCJcblxuICBAcGFyYW1zOlxuICAgIFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2F4aXMnXG4gICAgICAgIGRlZmF1bHQ6IFswLCAxLCAwXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ21pblJvdGF0aW9uJ1xuICAgICAgICBkZWZhdWx0OiAwLjA1XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnc3BlZWQnXG4gICAgICAgIGRlZmF1bHQ6IDFcbiAgICAgIH0sXG4gICAgXVxuXG4gIGNvbnN0cnVjdG9yOiAoQG9wdGlvbnMpIC0+XG4gICAgaWYgQG9wdGlvbnM/IHRoZW4geyBheGlzLCBAbWluUm90YXRpb24sIEBzcGVlZCB9ID0gQG9wdGlvbnNcbiAgICBAbWluUm90YXRpb24gPz0gMC4wNVxuICAgIEBzcGVlZCA/PSAxXG5cbiAgICBheGlzID89IFswLCAxLCAwXVxuICAgIEBheGlzID0gbmV3IFRIUkVFLlZlY3RvcjMoYXhpc1swXSwgYXhpc1sxXSwgYXhpc1syXSlcblxuICAgIEB0aW1lID0gMFxuXG4gIHVwZGF0ZTogKGF1ZGlvV2luZG93LCBkYW5jZXIpIC0+XG4gICAgYWJzUm90YXRpb24gPSBhdWRpb1dpbmRvdy5hdmVyYWdlRGIgKiBAc3BlZWRcblxuICAgIGRhbmNlci5ib2R5LnJvdGF0ZU9uQXhpcyBAYXhpcywgKEBtaW5Sb3RhdGlvbiArIGFic1JvdGF0aW9uICogKDAuOSkpICogTWF0aC5QSSAqICgoYXVkaW9XaW5kb3cudGltZSAtIEB0aW1lKSAvIDEwMDApXG5cbiAgICBAdGltZSA9IGF1ZGlvV2luZG93LnRpbWVcblxuICByZXNldDogKGRhbmNlcikgLT5cbiAgICBkYW5jZXIuYm9keS5yb3RhdGlvbi5zZXQoMCwgMCwgMClcbiIsIiMgQ29udHJvbHMgdGhlIG1lc2ggb2YgdGhlIHByb3ZpZGVkIERhbmNlcidzIGJvZHlcbmNsYXNzIHdpbmRvdy5TY2FsZURhbmNlXG4gIEBwYXJhbXM6XG4gICAgW1xuICAgICAge1xuICAgICAgICBuYW1lOiAnc21vb3RoaW5nRmFjdG9yJ1xuICAgICAgICBkZWZhdWx0OiAwLjVcbiAgICAgIH0sIFxuICAgICAge1xuICAgICAgICBuYW1lOiAnbWluJ1xuICAgICAgICBkZWZhdWx0OiBbMC41LCAwLjUsIDAuNV1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdtYXgnXG4gICAgICAgIGRlZmF1bHQ6IFsxLCAxLCAxXVxuICAgICAgfVxuICAgIF1cblxuICBAbmFtZTogXCJTY2FsZURhbmNlXCJcblxuICBjb25zdHJ1Y3RvcjogKEBvcHRpb25zKSAtPlxuICAgIGlmIEBvcHRpb25zPyB0aGVuIHsgQHNtb290aGluZ0ZhY3RvciwgbWluLCBtYXggfSA9IEBvcHRpb25zXG4gICAgQHNtb290aGluZ0ZhY3RvciA/PSAwLjVcbiAgICBAYXZlcmFnZURiID0gMFxuICAgIEBtaW4gPSBpZiBtaW4gdGhlbiBuZXcgVEhSRUUuVmVjdG9yMyhtaW5bMF0sIG1pblsxXSwgbWluWzJdKSBlbHNlIG5ldyBUSFJFRS5WZWN0b3IzKDAuNSwgMC41LCAwLjUpXG4gICAgQG1heCA9IGlmIG1heCB0aGVuIG5ldyBUSFJFRS5WZWN0b3IzKG1heFswXSwgbWF4WzFdLCBtYXhbMl0pIGVsc2UgbmV3IFRIUkVFLlZlY3RvcjMoMSwgMSwgMSlcbiAgICBAc2NhbGUgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG5cbiAgdXBkYXRlOiAoYXVkaW9XaW5kb3csIGRhbmNlcikgLT5cbiAgICAjIHVwZGF0ZSB0aGUgRGFuY2VyJ3MgYm9keSBtZXNoIHRvIHJlZmxlY3QgdGhlIGF1ZGlvIGV2ZW50XG4gICAgaWYgKGF1ZGlvV2luZG93LmF2ZXJhZ2VEYiA8IEBhdmVyYWdlRGIpXG4gICAgXHRAYXZlcmFnZURiID0gYXVkaW9XaW5kb3cuYXZlcmFnZURiICogQHNtb290aGluZ0ZhY3RvciArICgxIC0gQHNtb290aGluZ0ZhY3RvcikgKiBAYXZlcmFnZURiXG4gICAgZWxzZSBcbiAgICBcdHNtb290aGluZ0ZhY3RvciA9IE1hdGgubWF4KDEsIEBzbW9vdGhpbmdGYWN0b3IgKiA0KVxuICAgIFx0QGF2ZXJhZ2VEYiA9IGF1ZGlvV2luZG93LmF2ZXJhZ2VEYiAqIHNtb290aGluZ0ZhY3RvciArICgxIC0gc21vb3RoaW5nRmFjdG9yKSAqIEBhdmVyYWdlRGJcblxuICAgIEBzY2FsZS5jb3B5KEBtaW4pXG5cbiAgICBAc2NhbGUubGVycChAbWF4LCBAYXZlcmFnZURiKVxuXG4gICAgZGFuY2VyLmJvZHkuc2NhbGUuc2V0KEBzY2FsZS54LCBAc2NhbGUueSwgQHNjYWxlLnopXG5cdFxuICByZXNldDogKGRhbmNlcikgLT5cbiAgXHRkYW5jZXIuYm9keS5zY2FsZS5zZXQoMSwgMSwgMSlcbiIsInJlcXVpcmUgJy4vUXVldWVWaWV3LmNvZmZlZSdcbnJlcXVpcmUgJy4vUm91dGluZXNWaWV3LmNvZmZlZSdcbnJlcXVpcmUgJy4uL1JvdXRpbmVzQ29udHJvbGxlci5jb2ZmZWUnXG5cbmNsYXNzIHdpbmRvdy5EYXRHVUlJbnRlcmZhY2VcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgQGNvbnRhaW5lciA9ICQoJyNpbnRlcmZhY2UnKVxuICAgIEByb3V0aW5lc0NvbnRyb2xsZXIgPSBuZXcgUm91dGluZXNDb250cm9sbGVyKClcblxuICBzZXR1cDogKEBwbGF5ZXIsIEBjaG9yZW9ncmFwaHlSb3V0aW5lLCBAdmlld2VyKSAtPlxuICAgIGd1aSA9IG5ldyBkYXQuR1VJKClcblxuICAgIGd1aS5hZGQoQHBsYXllci5hdWRpb1dpbmRvdywgJ3Jlc3BvbnNpdmVuZXNzJywgMC4wLCA1LjApXG4gICAgaWRDb250cm9sbGVyID0gZ3VpLmFkZChAY2hvcmVvZ3JhcGh5Um91dGluZSwgJ2lkJylcblxuICAgIHNldHVwRm9sZGVyID0gKG5hbWUsIHZhck5hbWUsIGtleXMpID0+XG4gICAgICBjb250cm9sbGVyID0gZ3VpLmFkZChAY2hvcmVvZ3JhcGh5Um91dGluZSwgdmFyTmFtZSwga2V5cylcbiAgICAgIGZvbGRlciA9IGd1aS5hZGRGb2xkZXIobmFtZSlcbiAgICAgIGZvbGRlci5vcGVuKClcbiAgICAgIHJldHVybiBbIGNvbnRyb2xsZXIsIGZvbGRlciBdXG5cbiAgICB1cGRhdGVGb2xkZXIgPSAodHlwZXMsIGZvbGRlciwgcGFyYW1zLCB2YWx1ZSwgb2JqKSAtPlxuICAgICAgaWYgIXR5cGVzW3ZhbHVlXT9cbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIHdoaWxlIGZvbGRlci5fX2NvbnRyb2xsZXJzWzBdP1xuICAgICAgICBmb2xkZXIucmVtb3ZlKGZvbGRlci5fX2NvbnRyb2xsZXJzWzBdKVxuXG4gICAgICBmb3IgcGFyYW0gaW4gdHlwZXNbdmFsdWVdLnBhcmFtc1xuICAgICAgICBwYXJhbXNbcGFyYW0ubmFtZV0gPVxuICAgICAgICAgIGlmIG9iaj8ub3B0aW9ucz9bcGFyYW0ubmFtZV1cbiAgICAgICAgICAgIG9iai5vcHRpb25zW3BhcmFtLm5hbWVdXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcGFyYW0uZGVmYXVsdFxuXG4gICAgICAgIGZvbGRlci5hZGQocGFyYW1zLCBwYXJhbS5uYW1lKVxuXG4gICAgW2RhbmNlckNvbnRyb2xsZXIsIGRhbmNlckZvbGRlcl0gPSBzZXR1cEZvbGRlcignRGFuY2VyIHBhcmFtZXRlcnMnLCAnZGFuY2VyJywgT2JqZWN0LmtleXMoVmlzdWFsaXplci5kYW5jZXJUeXBlcykpXG5cbiAgICB1cGRhdGVEYW5jZXJGb2xkZXIgPSAodmFsdWUsIG9iaikgPT5cbiAgICAgIHVwZGF0ZUZvbGRlcihWaXN1YWxpemVyLmRhbmNlclR5cGVzLCBkYW5jZXJGb2xkZXIsIEBjaG9yZW9ncmFwaHlSb3V0aW5lLmRhbmNlclBhcmFtcywgdmFsdWUsIG9iailcbiAgICBkYW5jZXJDb250cm9sbGVyLm9uQ2hhbmdlIHVwZGF0ZURhbmNlckZvbGRlclxuXG4gICAgW2RhbmNlQ29udHJvbGxlciwgZGFuY2VGb2xkZXJdID0gc2V0dXBGb2xkZXIoJ0RhbmNlIHBhcmFtZXRlcnMnLCAnZGFuY2UnLCBPYmplY3Qua2V5cyhWaXN1YWxpemVyLmRhbmNlVHlwZXMpKVxuXG4gICAgdXBkYXRlRGFuY2VGb2xkZXIgPSAodmFsdWUsIG9iaikgPT5cbiAgICAgIHVwZGF0ZUZvbGRlcihWaXN1YWxpemVyLmRhbmNlVHlwZXMsIGRhbmNlRm9sZGVyLCBAY2hvcmVvZ3JhcGh5Um91dGluZS5kYW5jZVBhcmFtcywgdmFsdWUsIG9iailcbiAgICBkYW5jZUNvbnRyb2xsZXIub25DaGFuZ2UgdXBkYXRlRGFuY2VGb2xkZXJcblxuICAgIFtkYW5jZU1hdGVyaWFsQ29udHJvbGxlciwgZGFuY2VNYXRlcmlhbEZvbGRlcl0gPSBzZXR1cEZvbGRlcignRGFuY2UgbWF0ZXJpYWwgcGFyYW1hdGVycycsICdkYW5jZU1hdGVyaWFsJyxcbiAgICAgIE9iamVjdC5rZXlzKFZpc3VhbGl6ZXIuZGFuY2VNYXRlcmlhbFR5cGVzKSlcblxuICAgIHVwZGF0ZURhbmNlTWF0ZXJpYWxGb2xkZXIgPSAodmFsdWUsIG9iaikgPT5cbiAgICAgIHVwZGF0ZUZvbGRlcihWaXN1YWxpemVyLmRhbmNlTWF0ZXJpYWxUeXBlcywgZGFuY2VNYXRlcmlhbEZvbGRlciwgQGNob3Jlb2dyYXBoeVJvdXRpbmUuZGFuY2VNYXRlcmlhbFBhcmFtcywgdmFsdWUsXG4gICAgICAgIG9iailcbiAgICBkYW5jZU1hdGVyaWFsQ29udHJvbGxlci5vbkNoYW5nZSB1cGRhdGVEYW5jZU1hdGVyaWFsRm9sZGVyXG5cbiAgICBpZENvbnRyb2xsZXIub25DaGFuZ2UgKHZhbHVlKSA9PlxuICAgICAgaWREYW5jZXIgPSBAdmlld2VyLmdldERhbmNlcih2YWx1ZSlcbiAgICAgIGlmIGlkRGFuY2VyP1xuICAgICAgICBAY2hvcmVvZ3JhcGh5Um91dGluZS51cGRhdGVEYW5jZXIgaWREYW5jZXJcbiAgICAgICAgZm9yIGNvbnRyb2xsZXIgaW4gZ3VpLl9fY29udHJvbGxlcnNcbiAgICAgICAgICBjb250cm9sbGVyLnVwZGF0ZURpc3BsYXkoKVxuXG4gICAgICAgIHVwZGF0ZURhbmNlckZvbGRlcihAY2hvcmVvZ3JhcGh5Um91dGluZS5kYW5jZXIsIGlkRGFuY2VyKVxuICAgICAgICB1cGRhdGVEYW5jZU1hdGVyaWFsRm9sZGVyKEBjaG9yZW9ncmFwaHlSb3V0aW5lLmRhbmNlTWF0ZXJpYWwsIGlkRGFuY2VyLmRhbmNlTWF0ZXJpYWwpXG4gICAgICAgIHVwZGF0ZURhbmNlRm9sZGVyKEBjaG9yZW9ncmFwaHlSb3V0aW5lLmRhbmNlLCBpZERhbmNlci5kYW5jZSlcblxuICAgIGd1aS5hZGQoQGNob3Jlb2dyYXBoeVJvdXRpbmUsICdwcmV2aWV3JylcbiAgICBndWkuYWRkKEBjaG9yZW9ncmFwaHlSb3V0aW5lLCAnYWRkJylcbiAgICBndWkuYWRkKEBjaG9yZW9ncmFwaHlSb3V0aW5lLCAnaW5zZXJ0QmVhdCcpXG4gICAgZ3VpLmFkZChAY2hvcmVvZ3JhcGh5Um91dGluZSwgJ3BsYXlOZXh0JylcbiAgICBndWkuYWRkKEBjaG9yZW9ncmFwaHlSb3V0aW5lLCAncmVzZXQnKVxuXG4gICAgQHNldHVwUG9wdXAoKVxuICAgIEBzZXR1cFF1ZXVlVmlldygpXG4gICAgQHNldHVwUm91dGluZXNWaWV3KClcblxuXG4gIHNldHVwUG9wdXA6ICgpIC0+XG4gICAgQHZpZXdlckJ1dHRvbiA9ICQgXCI8YSBocmVmPScjJz5PcGVuIFZpZXdlcjwvYT5cIlxuICAgIEB2aWV3ZXJCdXR0b24uY2xpY2sgKGUpID0+XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIEBkb21haW4gPSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3RcbiAgICAgIHBvcHVwVVJMID0gQGRvbWFpbiArIGxvY2F0aW9uLnBhdGhuYW1lICsgJ3ZpZXdlci5odG1sJ1xuICAgICAgQHBvcHVwID0gd2luZG93Lm9wZW4ocG9wdXBVUkwsICdteVdpbmRvdycpXG5cbiAgICAgICMgV2UgaGF2ZSB0byBkZWxheSBjYXRjaGluZyB0aGUgd2luZG93IHVwIGJlY2F1c2UgaXQgaGFzIHRvIGxvYWQgZmlyc3QuXG4gICAgICBzZW5kQmVhdHMgPSAoKSA9PlxuICAgICAgICByb3V0aW5lQmVhdCA9IEBjaG9yZW9ncmFwaHlSb3V0aW5lLnJvdXRpbmVCZWF0XG4gICAgICAgIEBjaG9yZW9ncmFwaHlSb3V0aW5lLnJvdXRpbmVCZWF0ID0gLTFcbiAgICAgICAgd2hpbGUgQGNob3Jlb2dyYXBoeVJvdXRpbmUucm91dGluZUJlYXQgPCByb3V0aW5lQmVhdFxuICAgICAgICAgIEBjaG9yZW9ncmFwaHlSb3V0aW5lLnBsYXlOZXh0KClcbiAgICAgIHNldFRpbWVvdXQgc2VuZEJlYXRzLCAxMDBcblxuICAgIEBjb250YWluZXIuYXBwZW5kKEB2aWV3ZXJCdXR0b24pXG5cbiAgc2V0dXBRdWV1ZVZpZXc6ICgpIC0+XG4gICAgQHF1ZXVlVmlldyA9IG5ldyBRdWV1ZVZpZXcoKVxuICAgIEBxdWV1ZVZpZXcuY3JlYXRlVmlldyhAY29udGFpbmVyKVxuXG4gIHNldHVwUm91dGluZXNWaWV3OiAoKSAtPlxuICAgIEByb3V0aW5lc1ZpZXcgPSBuZXcgUm91dGluZXNWaWV3KEBjaG9yZW9ncmFwaHlSb3V0aW5lLCBAcm91dGluZXNDb250cm9sbGVyKVxuICAgIEByb3V0aW5lc1ZpZXcuY3JlYXRlVmlldyhAY29udGFpbmVyKVxuXG4gICAgQHJvdXRpbmVzVmlldy51cGRhdGVSb3V0aW5lcyAoKSA9PlxuICAgICAgQHJvdXRpbmVzVmlldy5vblNlbGVjdCgxKVxuXG4gIHVwZGF0ZVRleHQ6ICgpIC0+XG4gICAgQHF1ZXVlVmlldy51cGRhdGVUZXh0KEBjaG9yZW9ncmFwaHlSb3V0aW5lLnJvdXRpbmVCZWF0LCBAY2hvcmVvZ3JhcGh5Um91dGluZS5yb3V0aW5lKVxuIiwiY2xhc3Mgd2luZG93LlF1ZXVlVmlld1xuICBjcmVhdGVWaWV3OiAodGFyZ2V0KSAtPlxuICAgICMgQWRkIHF1ZXVlIHZpZXcgdG8gdGFyZ2V0XG4gICAgQHJvdXRpbmVWaWV3ID0gJCBcIjxwcmU+XCIsXG4gICAgICBpZDogJ3F1ZXVlJ1xuXG4gICAgdGFyZ2V0LmFwcGVuZCBAcm91dGluZVZpZXdcblxuICB1cGRhdGVUZXh0OiAoY3VycmVudEluZGV4LCByb3V0aW5lUXVldWUpIC0+XG4gICAgIyBEaXNwbGF5IHJvdXRpbmVRdWV1ZSB3aXRoIGN1cnJlbnQgaW5kZXggaGlnaGxpZ2h0ZWRcbiAgICBodG1sID0gW11cblxuICAgIGZvciByb3V0aW5lLCBpIGluIHJvdXRpbmVRdWV1ZVxuICAgICAgaWYgaSA9PSBjdXJyZW50SW5kZXhcbiAgICAgICAgaHRtbC5wdXNoKFwiPHNwYW4gY2xhc3M9J2JvbGQnPlwiKVxuXG4gICAgICBodG1sLnB1c2goQHN0cmluZ2lmeShyb3V0aW5lKSlcblxuICAgICAgaWYgaSA9PSBjdXJyZW50SW5kZXhcbiAgICAgICAgaHRtbC5wdXNoKFwiPC9zcGFuPlwiKVxuXG4gICAgICBodG1sLnB1c2goJyxcXG4nKVxuXG4gICAgQHJvdXRpbmVWaWV3Lmh0bWwoaHRtbC5qb2luKFwiXCIpKVxuXG4gIHN0cmluZ2lmeTogKGpzb24pIC0+XG4gICAgSlNPTi5zdHJpbmdpZnkoanNvbiwgdW5kZWZpbmVkLCAyKSIsImNsYXNzIHdpbmRvdy5Sb3V0aW5lc1ZpZXdcbiAgY29uc3RydWN0b3I6IChAY2hvcmVvZ3JhcGh5Um91dGluZSwgQHJvdXRpbmVzQ29udHJvbGxlcikgLT5cbiAgICByZXR1cm5cblxuICBjcmVhdGVWaWV3OiAodGFyZ2V0KSAtPlxuICAgICMgQWRkIHJvdXRpbmVzIHZpZXcgdG8gdGFyZ2V0XG4gICAgQHJvdXRpbmVzQ29udGFpbmVyID0gJCBcIjxkaXY+XCIsXG4gICAgICBpZDogJ3JvdXRpbmVzQ29udGFpbmVyJ1xuICAgIHRhcmdldC5hcHBlbmQgQHJvdXRpbmVzQ29udGFpbmVyXG5cbiAgICBAc2VsZWN0b3IgPSAkIFwiPHNlbGVjdD5cIixcbiAgICAgIGlkOiAncm91dGluZVNlbGVjdCdcblxuICAgIEBzZWxlY3Rvci5jaGFuZ2UgKCkgPT5cbiAgICAgIEBvblNlbGVjdCgkKFwiI3JvdXRpbmVTZWxlY3Qgb3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpKVxuXG4gICAgQHJvdXRpbmVzQ29udGFpbmVyLmFwcGVuZCBAc2VsZWN0b3JcblxuICAgIEBxdWV1ZUJ1dHRvbiA9ICQgXCI8YT5cIixcbiAgICAgIGhyZWY6IFwiI1wiXG4gICAgICB0ZXh0OiBcIlF1ZXVlXCJcblxuICAgIEBxdWV1ZUJ1dHRvbi5jbGljayAoZSkgPT5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgQG9uUXVldWUoKVxuXG4gICAgQHJvdXRpbmVzQ29udGFpbmVyLmFwcGVuZCBAcXVldWVCdXR0b25cblxuICAgIEByb3V0aW5lVmlldyA9ICQgXCI8cHJlPlwiLFxuICAgICAgaWQ6ICdyb3V0aW5lVmlldydcblxuICAgIEByb3V0aW5lc0NvbnRhaW5lci5hcHBlbmQgQHJvdXRpbmVWaWV3XG5cbiAgdXBkYXRlVGV4dDogKHJvdXRpbmVEYXRhKSAtPlxuICAgICMgRGlzcGxheSByb3V0aW5lIHRleHQgaW4gbWFpbiB2aWV3XG4gICAgQGN1cnJlbnRSb3V0aW5lID0gcm91dGluZURhdGFcbiAgICBAcm91dGluZVZpZXcuaHRtbChKU09OLnN0cmluZ2lmeShyb3V0aW5lRGF0YSwgdW5kZWZpbmVkLCAyKSlcblxuICB1cGRhdGVSb3V0aW5lczogKG5leHQpIC0+XG4gICAgIyBEaXNwbGF5IG5hbWVzIG9mIHRoZSByb3V0aW5lcyBpbiB0aGUgc2VsZWN0XG4gICAgQHJvdXRpbmVzQ29udHJvbGxlci5yZWZyZXNoUm91dGluZXMgKHJvdXRpbmVzKSA9PlxuICAgICAgQHNlbGVjdG9yLmVtcHR5KClcbiAgICAgIGZvciByb3V0aW5lIGluIHJvdXRpbmVzXG4gICAgICAgIGlmICFyb3V0aW5lPyB0aGVuIGNvbnRpbnVlXG4gICAgICAgIG9wdGlvbiA9ICQgXCI8b3B0aW9uPlwiLFxuICAgICAgICAgIHZhbHVlOiByb3V0aW5lLmlkXG4gICAgICAgICAgdGV4dDogcm91dGluZS5uYW1lXG5cbiAgICAgICAgQHNlbGVjdG9yLmFwcGVuZChvcHRpb24pXG5cbiAgICAgIGlmIG5leHQ/IHRoZW4gbmV4dCgpXG5cbiAgb25RdWV1ZTogKCkgLT5cbiAgICAjIFF1ZXVlIGluIGNob3Jlb2dyYXBoeSByb3V0aW5lXG4gICAgQGNob3Jlb2dyYXBoeVJvdXRpbmUucXVldWVSb3V0aW5lKEBjdXJyZW50Um91dGluZSlcblxuICBvblNlbGVjdDogKGlkKSAtPlxuICAgICMgdXBkYXRlVGV4dCB3aXRoIHJvdXRpbmVcbiAgICBAcm91dGluZXNDb250cm9sbGVyLmdldFJvdXRpbmUgaWQsIChyb3V0aW5lKSA9PlxuICAgICAgQHVwZGF0ZVRleHQocm91dGluZS5kYXRhKVxuIiwiLyoqXG4gKiBAYXV0aG9yIHFpYW8gLyBodHRwczovL2dpdGh1Yi5jb20vcWlhb1xuICogQGF1dGhvciBtcmRvb2IgLyBodHRwOi8vbXJkb29iLmNvbVxuICogQGF1dGhvciBhbHRlcmVkcSAvIGh0dHA6Ly9hbHRlcmVkcXVhbGlhLmNvbS9cbiAqIEBhdXRob3IgV2VzdExhbmdsZXkgLyBodHRwOi8vZ2l0aHViLmNvbS9XZXN0TGFuZ2xleVxuICogQGF1dGhvciBlcmljaDY2NiAvIGh0dHA6Ly9lcmljaGFpbmVzLmNvbVxuICovXG4vKmdsb2JhbCBUSFJFRSwgY29uc29sZSAqL1xuXG4vLyBUaGlzIHNldCBvZiBjb250cm9scyBwZXJmb3JtcyBvcmJpdGluZywgZG9sbHlpbmcgKHpvb21pbmcpLCBhbmQgcGFubmluZy4gSXQgbWFpbnRhaW5zXG4vLyB0aGUgXCJ1cFwiIGRpcmVjdGlvbiBhcyArWSwgdW5saWtlIHRoZSBUcmFja2JhbGxDb250cm9scy4gVG91Y2ggb24gdGFibGV0IGFuZCBwaG9uZXMgaXNcbi8vIHN1cHBvcnRlZC5cbi8vXG4vLyAgICBPcmJpdCAtIGxlZnQgbW91c2UgLyB0b3VjaDogb25lIGZpbmdlciBtb3ZlXG4vLyAgICBab29tIC0gbWlkZGxlIG1vdXNlLCBvciBtb3VzZXdoZWVsIC8gdG91Y2g6IHR3byBmaW5nZXIgc3ByZWFkIG9yIHNxdWlzaFxuLy8gICAgUGFuIC0gcmlnaHQgbW91c2UsIG9yIGFycm93IGtleXMgLyB0b3VjaDogdGhyZWUgZmludGVyIHN3aXBlXG4vL1xuLy8gVGhpcyBpcyBhIGRyb3AtaW4gcmVwbGFjZW1lbnQgZm9yIChtb3N0KSBUcmFja2JhbGxDb250cm9scyB1c2VkIGluIGV4YW1wbGVzLlxuLy8gVGhhdCBpcywgaW5jbHVkZSB0aGlzIGpzIGZpbGUgYW5kIHdoZXJldmVyIHlvdSBzZWU6XG4vLyAgICBcdGNvbnRyb2xzID0gbmV3IFRIUkVFLlRyYWNrYmFsbENvbnRyb2xzKCBjYW1lcmEgKTtcbi8vICAgICAgY29udHJvbHMudGFyZ2V0LnogPSAxNTA7XG4vLyBTaW1wbGUgc3Vic3RpdHV0ZSBcIk9yYml0Q29udHJvbHNcIiBhbmQgdGhlIGNvbnRyb2wgc2hvdWxkIHdvcmsgYXMtaXMuXG5cblRIUkVFLk9yYml0Q29udHJvbHMgPSBmdW5jdGlvbiAob2JqZWN0LCBkb21FbGVtZW50KSB7XG5cbiAgICB0aGlzLm9iamVjdCA9IG9iamVjdDtcbiAgICB0aGlzLmRvbUVsZW1lbnQgPSAoIGRvbUVsZW1lbnQgIT09IHVuZGVmaW5lZCApID8gZG9tRWxlbWVudCA6IGRvY3VtZW50O1xuXG4gICAgLy8gQVBJXG5cbiAgICAvLyBTZXQgdG8gZmFsc2UgdG8gZGlzYWJsZSB0aGlzIGNvbnRyb2xcbiAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgLy8gXCJ0YXJnZXRcIiBzZXRzIHRoZSBsb2NhdGlvbiBvZiBmb2N1cywgd2hlcmUgdGhlIGNvbnRyb2wgb3JiaXRzIGFyb3VuZFxuICAgIC8vIGFuZCB3aGVyZSBpdCBwYW5zIHdpdGggcmVzcGVjdCB0by5cbiAgICB0aGlzLnRhcmdldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cbiAgICAvLyBjZW50ZXIgaXMgb2xkLCBkZXByZWNhdGVkOyB1c2UgXCJ0YXJnZXRcIiBpbnN0ZWFkXG4gICAgdGhpcy5jZW50ZXIgPSB0aGlzLnRhcmdldDtcblxuICAgIC8vIFRoaXMgb3B0aW9uIGFjdHVhbGx5IGVuYWJsZXMgZG9sbHlpbmcgaW4gYW5kIG91dDsgbGVmdCBhcyBcInpvb21cIiBmb3JcbiAgICAvLyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgIHRoaXMubm9ab29tID0gZmFsc2U7XG4gICAgdGhpcy56b29tU3BlZWQgPSAxLjA7XG5cbiAgICAvLyBMaW1pdHMgdG8gaG93IGZhciB5b3UgY2FuIGRvbGx5IGluIGFuZCBvdXRcbiAgICB0aGlzLm1pbkRpc3RhbmNlID0gMDtcbiAgICB0aGlzLm1heERpc3RhbmNlID0gSW5maW5pdHk7XG5cbiAgICAvLyBTZXQgdG8gdHJ1ZSB0byBkaXNhYmxlIHRoaXMgY29udHJvbFxuICAgIHRoaXMubm9Sb3RhdGUgPSBmYWxzZTtcbiAgICB0aGlzLnJvdGF0ZVNwZWVkID0gMS4wO1xuXG4gICAgLy8gU2V0IHRvIHRydWUgdG8gZGlzYWJsZSB0aGlzIGNvbnRyb2xcbiAgICB0aGlzLm5vUGFuID0gZmFsc2U7XG4gICAgdGhpcy5rZXlQYW5TcGVlZCA9IDcuMDtcdC8vIHBpeGVscyBtb3ZlZCBwZXIgYXJyb3cga2V5IHB1c2hcblxuICAgIC8vIFNldCB0byB0cnVlIHRvIGF1dG9tYXRpY2FsbHkgcm90YXRlIGFyb3VuZCB0aGUgdGFyZ2V0XG4gICAgdGhpcy5hdXRvUm90YXRlID0gZmFsc2U7XG4gICAgdGhpcy5hdXRvUm90YXRlU3BlZWQgPSAyLjA7IC8vIDMwIHNlY29uZHMgcGVyIHJvdW5kIHdoZW4gZnBzIGlzIDYwXG5cbiAgICAvLyBIb3cgZmFyIHlvdSBjYW4gb3JiaXQgdmVydGljYWxseSwgdXBwZXIgYW5kIGxvd2VyIGxpbWl0cy5cbiAgICAvLyBSYW5nZSBpcyAwIHRvIE1hdGguUEkgcmFkaWFucy5cbiAgICB0aGlzLm1pblBvbGFyQW5nbGUgPSAwOyAvLyByYWRpYW5zXG4gICAgdGhpcy5tYXhQb2xhckFuZ2xlID0gTWF0aC5QSTsgLy8gcmFkaWFuc1xuXG4gICAgLy8gU2V0IHRvIHRydWUgdG8gZGlzYWJsZSB1c2Ugb2YgdGhlIGtleXNcbiAgICB0aGlzLm5vS2V5cyA9IGZhbHNlO1xuXG4gICAgLy8gVGhlIGZvdXIgYXJyb3cga2V5c1xuICAgIHRoaXMua2V5cyA9IHsgTEVGVDogMzcsIFVQOiAzOCwgUklHSFQ6IDM5LCBCT1RUT006IDQwIH07XG5cbiAgICAvLy8vLy8vLy8vLy9cbiAgICAvLyBpbnRlcm5hbHNcblxuICAgIHZhciBzY29wZSA9IHRoaXM7XG5cbiAgICB2YXIgRVBTID0gMC4wMDAwMDE7XG5cbiAgICB2YXIgcm90YXRlU3RhcnQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuICAgIHZhciByb3RhdGVFbmQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuICAgIHZhciByb3RhdGVEZWx0YSA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cbiAgICB2YXIgcGFuU3RhcnQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuICAgIHZhciBwYW5FbmQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuICAgIHZhciBwYW5EZWx0YSA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG4gICAgdmFyIHBhbk9mZnNldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cbiAgICB2YXIgb2Zmc2V0ID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblxuICAgIHZhciBkb2xseVN0YXJ0ID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcbiAgICB2YXIgZG9sbHlFbmQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuICAgIHZhciBkb2xseURlbHRhID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcblxuICAgIHZhciBwaGlEZWx0YSA9IDA7XG4gICAgdmFyIHRoZXRhRGVsdGEgPSAwO1xuICAgIHZhciBzY2FsZSA9IDE7XG4gICAgdmFyIHBhbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cbiAgICB2YXIgbGFzdFBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICB2YXIgbGFzdFF1YXRlcm5pb24gPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpO1xuXG4gICAgdmFyIFNUQVRFID0geyBOT05FOiAtMSwgUk9UQVRFOiAwLCBET0xMWTogMSwgUEFOOiAyLCBUT1VDSF9ST1RBVEU6IDMsIFRPVUNIX0RPTExZOiA0LCBUT1VDSF9QQU46IDUgfTtcblxuICAgIHZhciBzdGF0ZSA9IFNUQVRFLk5PTkU7XG5cbiAgICAvLyBmb3IgcmVzZXRcblxuICAgIHRoaXMudGFyZ2V0MCA9IHRoaXMudGFyZ2V0LmNsb25lKCk7XG4gICAgdGhpcy5wb3NpdGlvbjAgPSB0aGlzLm9iamVjdC5wb3NpdGlvbi5jbG9uZSgpO1xuXG4gICAgLy8gc28gY2FtZXJhLnVwIGlzIHRoZSBvcmJpdCBheGlzXG5cbiAgICB2YXIgcXVhdCA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbVVuaXRWZWN0b3JzKG9iamVjdC51cCwgbmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCkpO1xuICAgIHZhciBxdWF0SW52ZXJzZSA9IHF1YXQuY2xvbmUoKS5pbnZlcnNlKCk7XG5cbiAgICAvLyBldmVudHNcblxuICAgIHZhciBjaGFuZ2VFdmVudCA9IHsgdHlwZTogJ2NoYW5nZScgfTtcbiAgICB2YXIgc3RhcnRFdmVudCA9IHsgdHlwZTogJ3N0YXJ0J307XG4gICAgdmFyIGVuZEV2ZW50ID0geyB0eXBlOiAnZW5kJ307XG5cbiAgICB0aGlzLnJvdGF0ZUxlZnQgPSBmdW5jdGlvbiAoYW5nbGUpIHtcblxuICAgICAgICBpZiAoYW5nbGUgPT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICBhbmdsZSA9IGdldEF1dG9Sb3RhdGlvbkFuZ2xlKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoZXRhRGVsdGEgLT0gYW5nbGU7XG5cbiAgICB9O1xuXG4gICAgdGhpcy5yb3RhdGVVcCA9IGZ1bmN0aW9uIChhbmdsZSkge1xuXG4gICAgICAgIGlmIChhbmdsZSA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIGFuZ2xlID0gZ2V0QXV0b1JvdGF0aW9uQW5nbGUoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcGhpRGVsdGEgLT0gYW5nbGU7XG5cbiAgICB9O1xuXG4gICAgLy8gcGFzcyBpbiBkaXN0YW5jZSBpbiB3b3JsZCBzcGFjZSB0byBtb3ZlIGxlZnRcbiAgICB0aGlzLnBhbkxlZnQgPSBmdW5jdGlvbiAoZGlzdGFuY2UpIHtcblxuICAgICAgICB2YXIgdGUgPSB0aGlzLm9iamVjdC5tYXRyaXguZWxlbWVudHM7XG5cbiAgICAgICAgLy8gZ2V0IFggY29sdW1uIG9mIG1hdHJpeFxuICAgICAgICBwYW5PZmZzZXQuc2V0KHRlWyAwIF0sIHRlWyAxIF0sIHRlWyAyIF0pO1xuICAgICAgICBwYW5PZmZzZXQubXVsdGlwbHlTY2FsYXIoLWRpc3RhbmNlKTtcblxuICAgICAgICBwYW4uYWRkKHBhbk9mZnNldCk7XG5cbiAgICB9O1xuXG4gICAgLy8gcGFzcyBpbiBkaXN0YW5jZSBpbiB3b3JsZCBzcGFjZSB0byBtb3ZlIHVwXG4gICAgdGhpcy5wYW5VcCA9IGZ1bmN0aW9uIChkaXN0YW5jZSkge1xuXG4gICAgICAgIHZhciB0ZSA9IHRoaXMub2JqZWN0Lm1hdHJpeC5lbGVtZW50cztcblxuICAgICAgICAvLyBnZXQgWSBjb2x1bW4gb2YgbWF0cml4XG4gICAgICAgIHBhbk9mZnNldC5zZXQodGVbIDQgXSwgdGVbIDUgXSwgdGVbIDYgXSk7XG4gICAgICAgIHBhbk9mZnNldC5tdWx0aXBseVNjYWxhcihkaXN0YW5jZSk7XG5cbiAgICAgICAgcGFuLmFkZChwYW5PZmZzZXQpO1xuXG4gICAgfTtcblxuICAgIC8vIHBhc3MgaW4geCx5IG9mIGNoYW5nZSBkZXNpcmVkIGluIHBpeGVsIHNwYWNlLFxuICAgIC8vIHJpZ2h0IGFuZCBkb3duIGFyZSBwb3NpdGl2ZVxuICAgIHRoaXMucGFuID0gZnVuY3Rpb24gKGRlbHRhWCwgZGVsdGFZKSB7XG5cbiAgICAgICAgdmFyIGVsZW1lbnQgPSBzY29wZS5kb21FbGVtZW50ID09PSBkb2N1bWVudCA/IHNjb3BlLmRvbUVsZW1lbnQuYm9keSA6IHNjb3BlLmRvbUVsZW1lbnQ7XG5cbiAgICAgICAgaWYgKHNjb3BlLm9iamVjdC5mb3YgIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICAvLyBwZXJzcGVjdGl2ZVxuICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0gc2NvcGUub2JqZWN0LnBvc2l0aW9uO1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHBvc2l0aW9uLmNsb25lKCkuc3ViKHNjb3BlLnRhcmdldCk7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0RGlzdGFuY2UgPSBvZmZzZXQubGVuZ3RoKCk7XG5cbiAgICAgICAgICAgIC8vIGhhbGYgb2YgdGhlIGZvdiBpcyBjZW50ZXIgdG8gdG9wIG9mIHNjcmVlblxuICAgICAgICAgICAgdGFyZ2V0RGlzdGFuY2UgKj0gTWF0aC50YW4oKCBzY29wZS5vYmplY3QuZm92IC8gMiApICogTWF0aC5QSSAvIDE4MC4wKTtcblxuICAgICAgICAgICAgLy8gd2UgYWN0dWFsbHkgZG9uJ3QgdXNlIHNjcmVlbldpZHRoLCBzaW5jZSBwZXJzcGVjdGl2ZSBjYW1lcmEgaXMgZml4ZWQgdG8gc2NyZWVuIGhlaWdodFxuICAgICAgICAgICAgc2NvcGUucGFuTGVmdCgyICogZGVsdGFYICogdGFyZ2V0RGlzdGFuY2UgLyBlbGVtZW50LmNsaWVudEhlaWdodCk7XG4gICAgICAgICAgICBzY29wZS5wYW5VcCgyICogZGVsdGFZICogdGFyZ2V0RGlzdGFuY2UgLyBlbGVtZW50LmNsaWVudEhlaWdodCk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChzY29wZS5vYmplY3QudG9wICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgLy8gb3J0aG9ncmFwaGljXG4gICAgICAgICAgICBzY29wZS5wYW5MZWZ0KGRlbHRhWCAqIChzY29wZS5vYmplY3QucmlnaHQgLSBzY29wZS5vYmplY3QubGVmdCkgLyBlbGVtZW50LmNsaWVudFdpZHRoKTtcbiAgICAgICAgICAgIHNjb3BlLnBhblVwKGRlbHRhWSAqIChzY29wZS5vYmplY3QudG9wIC0gc2NvcGUub2JqZWN0LmJvdHRvbSkgLyBlbGVtZW50LmNsaWVudEhlaWdodCk7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy8gY2FtZXJhIG5laXRoZXIgb3J0aG9ncmFwaGljIG9yIHBlcnNwZWN0aXZlXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1dBUk5JTkc6IE9yYml0Q29udHJvbHMuanMgZW5jb3VudGVyZWQgYW4gdW5rbm93biBjYW1lcmEgdHlwZSAtIHBhbiBkaXNhYmxlZC4nKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgdGhpcy5kb2xseUluID0gZnVuY3Rpb24gKGRvbGx5U2NhbGUpIHtcblxuICAgICAgICBpZiAoZG9sbHlTY2FsZSA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIGRvbGx5U2NhbGUgPSBnZXRab29tU2NhbGUoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgc2NhbGUgLz0gZG9sbHlTY2FsZTtcblxuICAgIH07XG5cbiAgICB0aGlzLmRvbGx5T3V0ID0gZnVuY3Rpb24gKGRvbGx5U2NhbGUpIHtcblxuICAgICAgICBpZiAoZG9sbHlTY2FsZSA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIGRvbGx5U2NhbGUgPSBnZXRab29tU2NhbGUoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgc2NhbGUgKj0gZG9sbHlTY2FsZTtcblxuICAgIH07XG5cbiAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgcG9zaXRpb24gPSB0aGlzLm9iamVjdC5wb3NpdGlvbjtcblxuICAgICAgICBvZmZzZXQuY29weShwb3NpdGlvbikuc3ViKHRoaXMudGFyZ2V0KTtcblxuICAgICAgICAvLyByb3RhdGUgb2Zmc2V0IHRvIFwieS1heGlzLWlzLXVwXCIgc3BhY2VcbiAgICAgICAgb2Zmc2V0LmFwcGx5UXVhdGVybmlvbihxdWF0KTtcblxuICAgICAgICAvLyBhbmdsZSBmcm9tIHotYXhpcyBhcm91bmQgeS1heGlzXG5cbiAgICAgICAgdmFyIHRoZXRhID0gTWF0aC5hdGFuMihvZmZzZXQueCwgb2Zmc2V0LnopO1xuXG4gICAgICAgIC8vIGFuZ2xlIGZyb20geS1heGlzXG5cbiAgICAgICAgdmFyIHBoaSA9IE1hdGguYXRhbjIoTWF0aC5zcXJ0KG9mZnNldC54ICogb2Zmc2V0LnggKyBvZmZzZXQueiAqIG9mZnNldC56KSwgb2Zmc2V0LnkpO1xuXG4gICAgICAgIGlmICh0aGlzLmF1dG9Sb3RhdGUpIHtcblxuICAgICAgICAgICAgdGhpcy5yb3RhdGVMZWZ0KGdldEF1dG9Sb3RhdGlvbkFuZ2xlKCkpO1xuXG4gICAgICAgIH1cblxuICAgICAgICB0aGV0YSArPSB0aGV0YURlbHRhO1xuICAgICAgICBwaGkgKz0gcGhpRGVsdGE7XG5cbiAgICAgICAgLy8gcmVzdHJpY3QgcGhpIHRvIGJlIGJldHdlZW4gZGVzaXJlZCBsaW1pdHNcbiAgICAgICAgcGhpID0gTWF0aC5tYXgodGhpcy5taW5Qb2xhckFuZ2xlLCBNYXRoLm1pbih0aGlzLm1heFBvbGFyQW5nbGUsIHBoaSkpO1xuXG4gICAgICAgIC8vIHJlc3RyaWN0IHBoaSB0byBiZSBiZXR3ZWUgRVBTIGFuZCBQSS1FUFNcbiAgICAgICAgcGhpID0gTWF0aC5tYXgoRVBTLCBNYXRoLm1pbihNYXRoLlBJIC0gRVBTLCBwaGkpKTtcblxuICAgICAgICB2YXIgcmFkaXVzID0gb2Zmc2V0Lmxlbmd0aCgpICogc2NhbGU7XG5cbiAgICAgICAgLy8gcmVzdHJpY3QgcmFkaXVzIHRvIGJlIGJldHdlZW4gZGVzaXJlZCBsaW1pdHNcbiAgICAgICAgcmFkaXVzID0gTWF0aC5tYXgodGhpcy5taW5EaXN0YW5jZSwgTWF0aC5taW4odGhpcy5tYXhEaXN0YW5jZSwgcmFkaXVzKSk7XG5cbiAgICAgICAgLy8gbW92ZSB0YXJnZXQgdG8gcGFubmVkIGxvY2F0aW9uXG4gICAgICAgIHRoaXMudGFyZ2V0LmFkZChwYW4pO1xuXG4gICAgICAgIG9mZnNldC54ID0gcmFkaXVzICogTWF0aC5zaW4ocGhpKSAqIE1hdGguc2luKHRoZXRhKTtcbiAgICAgICAgb2Zmc2V0LnkgPSByYWRpdXMgKiBNYXRoLmNvcyhwaGkpO1xuICAgICAgICBvZmZzZXQueiA9IHJhZGl1cyAqIE1hdGguc2luKHBoaSkgKiBNYXRoLmNvcyh0aGV0YSk7XG5cbiAgICAgICAgLy8gcm90YXRlIG9mZnNldCBiYWNrIHRvIFwiY2FtZXJhLXVwLXZlY3Rvci1pcy11cFwiIHNwYWNlXG4gICAgICAgIG9mZnNldC5hcHBseVF1YXRlcm5pb24ocXVhdEludmVyc2UpO1xuXG4gICAgICAgIHBvc2l0aW9uLmNvcHkodGhpcy50YXJnZXQpLmFkZChvZmZzZXQpO1xuXG4gICAgICAgIHRoaXMub2JqZWN0Lmxvb2tBdCh0aGlzLnRhcmdldCk7XG5cbiAgICAgICAgdGhldGFEZWx0YSA9IDA7XG4gICAgICAgIHBoaURlbHRhID0gMDtcbiAgICAgICAgc2NhbGUgPSAxO1xuICAgICAgICBwYW4uc2V0KDAsIDAsIDApO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBjb25kaXRpb24gaXM6XG4gICAgICAgIC8vIG1pbihjYW1lcmEgZGlzcGxhY2VtZW50LCBjYW1lcmEgcm90YXRpb24gaW4gcmFkaWFucyleMiA+IEVQU1xuICAgICAgICAvLyB1c2luZyBzbWFsbC1hbmdsZSBhcHByb3hpbWF0aW9uIGNvcyh4LzIpID0gMSAtIHheMiAvIDhcblxuICAgICAgICBpZiAobGFzdFBvc2l0aW9uLmRpc3RhbmNlVG9TcXVhcmVkKHRoaXMub2JqZWN0LnBvc2l0aW9uKSA+IEVQU1xuICAgICAgICAgICAgfHwgOCAqICgxIC0gbGFzdFF1YXRlcm5pb24uZG90KHRoaXMub2JqZWN0LnF1YXRlcm5pb24pKSA+IEVQUykge1xuXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoY2hhbmdlRXZlbnQpO1xuXG4gICAgICAgICAgICBsYXN0UG9zaXRpb24uY29weSh0aGlzLm9iamVjdC5wb3NpdGlvbik7XG4gICAgICAgICAgICBsYXN0UXVhdGVybmlvbi5jb3B5KHRoaXMub2JqZWN0LnF1YXRlcm5pb24pO1xuXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZWxlbWVudCA9IHNjb3BlLmRvbUVsZW1lbnQgPT09IGRvY3VtZW50ID8gc2NvcGUuZG9tRWxlbWVudC5ib2R5IDogc2NvcGUuZG9tRWxlbWVudDtcblxuICAgICAgICBpZiAoZWxlbWVudC5jbGllbnRXaWR0aCA+IDAgJiYgZWxlbWVudC5jbGllbnRIZWlnaHQgPiAwKSB7XG4gICAgICAgICAgICAvLyByb3RhdGluZyBhY3Jvc3Mgd2hvbGUgc2NyZWVuIGdvZXMgMzYwIGRlZ3JlZXMgYXJvdW5kXG4gICAgICAgICAgICBzY29wZS5yb3RhdGVMZWZ0KDIgKiBNYXRoLlBJICogcm90YXRlRGVsdGEueCAvIGVsZW1lbnQuY2xpZW50V2lkdGggKiBzY29wZS5yb3RhdGVTcGVlZCk7XG5cbiAgICAgICAgICAgIC8vIHJvdGF0aW5nIHVwIGFuZCBkb3duIGFsb25nIHdob2xlIHNjcmVlbiBhdHRlbXB0cyB0byBnbyAzNjAsIGJ1dCBsaW1pdGVkIHRvIDE4MFxuICAgICAgICAgICAgc2NvcGUucm90YXRlVXAoMiAqIE1hdGguUEkgKiByb3RhdGVEZWx0YS55IC8gZWxlbWVudC5jbGllbnRIZWlnaHQgKiBzY29wZS5yb3RhdGVTcGVlZCk7XG5cbiAgICAgICAgICAgIHJvdGF0ZURlbHRhLm11bHRpcGx5U2NhbGFyKDAuOTkpXG4gICAgICAgIH1cblxuICAgIH07XG5cblxuICAgIHRoaXMucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgc3RhdGUgPSBTVEFURS5OT05FO1xuXG4gICAgICAgIHRoaXMudGFyZ2V0LmNvcHkodGhpcy50YXJnZXQwKTtcbiAgICAgICAgdGhpcy5vYmplY3QucG9zaXRpb24uY29weSh0aGlzLnBvc2l0aW9uMCk7XG5cbiAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRBdXRvUm90YXRpb25BbmdsZSgpIHtcblxuICAgICAgICByZXR1cm4gMiAqIE1hdGguUEkgLyA2MCAvIDYwICogc2NvcGUuYXV0b1JvdGF0ZVNwZWVkO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Wm9vbVNjYWxlKCkge1xuXG4gICAgICAgIHJldHVybiBNYXRoLnBvdygwLjk1LCBzY29wZS56b29tU3BlZWQpO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Nb3VzZURvd24oZXZlbnQpIHtcblxuICAgICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UpIHJldHVybjtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAoZXZlbnQuYnV0dG9uID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoc2NvcGUubm9Sb3RhdGUgPT09IHRydWUpIHJldHVybjtcblxuICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5ST1RBVEU7XG5cbiAgICAgICAgICAgIHJvdGF0ZVN0YXJ0LnNldChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gMSkge1xuICAgICAgICAgICAgaWYgKHNjb3BlLm5vWm9vbSA9PT0gdHJ1ZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBzdGF0ZSA9IFNUQVRFLkRPTExZO1xuXG4gICAgICAgICAgICBkb2xseVN0YXJ0LnNldChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gMikge1xuICAgICAgICAgICAgaWYgKHNjb3BlLm5vUGFuID09PSB0cnVlKSByZXR1cm47XG5cbiAgICAgICAgICAgIHN0YXRlID0gU1RBVEUuUEFOO1xuXG4gICAgICAgICAgICBwYW5TdGFydC5zZXQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlLCBmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXAsIGZhbHNlKTtcbiAgICAgICAgc2NvcGUuZGlzcGF0Y2hFdmVudChzdGFydEV2ZW50KTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG5cbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKSByZXR1cm47XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB2YXIgZWxlbWVudCA9IHNjb3BlLmRvbUVsZW1lbnQgPT09IGRvY3VtZW50ID8gc2NvcGUuZG9tRWxlbWVudC5ib2R5IDogc2NvcGUuZG9tRWxlbWVudDtcblxuICAgICAgICBpZiAoc3RhdGUgPT09IFNUQVRFLlJPVEFURSkge1xuXG4gICAgICAgICAgICBpZiAoc2NvcGUubm9Sb3RhdGUgPT09IHRydWUpIHJldHVybjtcblxuICAgICAgICAgICAgcm90YXRlRW5kLnNldChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcbiAgICAgICAgICAgIHJvdGF0ZURlbHRhLnN1YlZlY3RvcnMocm90YXRlRW5kLCByb3RhdGVTdGFydCk7XG5cbiAgICAgICAgICAgIC8vIHJvdGF0aW5nIGFjcm9zcyB3aG9sZSBzY3JlZW4gZ29lcyAzNjAgZGVncmVlcyBhcm91bmRcbiAgICAgICAgICAgIHNjb3BlLnJvdGF0ZUxlZnQoMiAqIE1hdGguUEkgKiByb3RhdGVEZWx0YS54IC8gZWxlbWVudC5jbGllbnRXaWR0aCAqIHNjb3BlLnJvdGF0ZVNwZWVkKTtcblxuICAgICAgICAgICAgLy8gcm90YXRpbmcgdXAgYW5kIGRvd24gYWxvbmcgd2hvbGUgc2NyZWVuIGF0dGVtcHRzIHRvIGdvIDM2MCwgYnV0IGxpbWl0ZWQgdG8gMTgwXG4gICAgICAgICAgICBzY29wZS5yb3RhdGVVcCgyICogTWF0aC5QSSAqIHJvdGF0ZURlbHRhLnkgLyBlbGVtZW50LmNsaWVudEhlaWdodCAqIHNjb3BlLnJvdGF0ZVNwZWVkKTtcblxuICAgICAgICAgICAgcm90YXRlU3RhcnQuY29weShyb3RhdGVFbmQpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IFNUQVRFLkRPTExZKSB7XG5cbiAgICAgICAgICAgIGlmIChzY29wZS5ub1pvb20gPT09IHRydWUpIHJldHVybjtcblxuICAgICAgICAgICAgZG9sbHlFbmQuc2V0KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuICAgICAgICAgICAgZG9sbHlEZWx0YS5zdWJWZWN0b3JzKGRvbGx5RW5kLCBkb2xseVN0YXJ0KTtcblxuICAgICAgICAgICAgaWYgKGRvbGx5RGVsdGEueSA+IDApIHtcblxuICAgICAgICAgICAgICAgIHNjb3BlLmRvbGx5SW4oKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIHNjb3BlLmRvbGx5T3V0KCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9sbHlTdGFydC5jb3B5KGRvbGx5RW5kKTtcblxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBTVEFURS5QQU4pIHtcblxuICAgICAgICAgICAgaWYgKHNjb3BlLm5vUGFuID09PSB0cnVlKSByZXR1cm47XG5cbiAgICAgICAgICAgIHBhbkVuZC5zZXQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG4gICAgICAgICAgICBwYW5EZWx0YS5zdWJWZWN0b3JzKHBhbkVuZCwgcGFuU3RhcnQpO1xuXG4gICAgICAgICAgICBzY29wZS5wYW4ocGFuRGVsdGEueCwgcGFuRGVsdGEueSk7XG5cbiAgICAgICAgICAgIHBhblN0YXJ0LmNvcHkocGFuRW5kKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgc2NvcGUudXBkYXRlKCk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbk1vdXNlVXAoLyogZXZlbnQgKi8pIHtcblxuICAgICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwLCBmYWxzZSk7XG4gICAgICAgIHNjb3BlLmRpc3BhdGNoRXZlbnQoZW5kRXZlbnQpO1xuICAgICAgICBzdGF0ZSA9IFNUQVRFLk5PTkU7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbk1vdXNlV2hlZWwoZXZlbnQpIHtcblxuICAgICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UgfHwgc2NvcGUubm9ab29tID09PSB0cnVlKSByZXR1cm47XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgdmFyIGRlbHRhID0gMDtcblxuICAgICAgICBpZiAoZXZlbnQud2hlZWxEZWx0YSAhPT0gdW5kZWZpbmVkKSB7IC8vIFdlYktpdCAvIE9wZXJhIC8gRXhwbG9yZXIgOVxuXG4gICAgICAgICAgICBkZWx0YSA9IGV2ZW50LndoZWVsRGVsdGE7XG5cbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5kZXRhaWwgIT09IHVuZGVmaW5lZCkgeyAvLyBGaXJlZm94XG5cbiAgICAgICAgICAgIGRlbHRhID0gLWV2ZW50LmRldGFpbDtcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRlbHRhID4gMCkge1xuXG4gICAgICAgICAgICBzY29wZS5kb2xseU91dCgpO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHNjb3BlLmRvbGx5SW4oKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgc2NvcGUudXBkYXRlKCk7XG4gICAgICAgIHNjb3BlLmRpc3BhdGNoRXZlbnQoc3RhcnRFdmVudCk7XG4gICAgICAgIHNjb3BlLmRpc3BhdGNoRXZlbnQoZW5kRXZlbnQpO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25LZXlEb3duKGV2ZW50KSB7XG5cbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlIHx8IHNjb3BlLm5vS2V5cyA9PT0gdHJ1ZSB8fCBzY29wZS5ub1BhbiA9PT0gdHJ1ZSkgcmV0dXJuO1xuXG4gICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuXG4gICAgICAgICAgICBjYXNlIHNjb3BlLmtleXMuVVA6XG4gICAgICAgICAgICAgICAgc2NvcGUucGFuKDAsIHNjb3BlLmtleVBhblNwZWVkKTtcbiAgICAgICAgICAgICAgICBzY29wZS51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBzY29wZS5rZXlzLkJPVFRPTTpcbiAgICAgICAgICAgICAgICBzY29wZS5wYW4oMCwgLXNjb3BlLmtleVBhblNwZWVkKTtcbiAgICAgICAgICAgICAgICBzY29wZS51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBzY29wZS5rZXlzLkxFRlQ6XG4gICAgICAgICAgICAgICAgc2NvcGUucGFuKHNjb3BlLmtleVBhblNwZWVkLCAwKTtcbiAgICAgICAgICAgICAgICBzY29wZS51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBzY29wZS5rZXlzLlJJR0hUOlxuICAgICAgICAgICAgICAgIHNjb3BlLnBhbigtc2NvcGUua2V5UGFuU3BlZWQsIDApO1xuICAgICAgICAgICAgICAgIHNjb3BlLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvdWNoc3RhcnQoZXZlbnQpIHtcblxuICAgICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgICBzd2l0Y2ggKGV2ZW50LnRvdWNoZXMubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgIGNhc2UgMTpcdC8vIG9uZS1maW5nZXJlZCB0b3VjaDogcm90YXRlXG5cbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUubm9Sb3RhdGUgPT09IHRydWUpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHN0YXRlID0gU1RBVEUuVE9VQ0hfUk9UQVRFO1xuXG4gICAgICAgICAgICAgICAgcm90YXRlU3RhcnQuc2V0KGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCwgZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAyOlx0Ly8gdHdvLWZpbmdlcmVkIHRvdWNoOiBkb2xseVxuXG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLm5vWm9vbSA9PT0gdHJ1ZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5UT1VDSF9ET0xMWTtcblxuICAgICAgICAgICAgICAgIHZhciBkeCA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCAtIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWDtcbiAgICAgICAgICAgICAgICB2YXIgZHkgPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVk7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbiAgICAgICAgICAgICAgICBkb2xseVN0YXJ0LnNldCgwLCBkaXN0YW5jZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMzogLy8gdGhyZWUtZmluZ2VyZWQgdG91Y2g6IHBhblxuXG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLm5vUGFuID09PSB0cnVlKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICBzdGF0ZSA9IFNUQVRFLlRPVUNIX1BBTjtcblxuICAgICAgICAgICAgICAgIHBhblN0YXJ0LnNldChldmVudC50b3VjaGVzWyAwIF0ucGFnZVgsIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG5cbiAgICAgICAgICAgICAgICBzdGF0ZSA9IFNUQVRFLk5PTkU7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHNjb3BlLmRpc3BhdGNoRXZlbnQoc3RhcnRFdmVudCk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b3VjaG1vdmUoZXZlbnQpIHtcblxuICAgICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICB2YXIgZWxlbWVudCA9IHNjb3BlLmRvbUVsZW1lbnQgPT09IGRvY3VtZW50ID8gc2NvcGUuZG9tRWxlbWVudC5ib2R5IDogc2NvcGUuZG9tRWxlbWVudDtcblxuICAgICAgICBzd2l0Y2ggKGV2ZW50LnRvdWNoZXMubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgIGNhc2UgMTogLy8gb25lLWZpbmdlcmVkIHRvdWNoOiByb3RhdGVcblxuICAgICAgICAgICAgICAgIGlmIChzY29wZS5ub1JvdGF0ZSA9PT0gdHJ1ZSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSAhPT0gU1RBVEUuVE9VQ0hfUk9UQVRFKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICByb3RhdGVFbmQuc2V0KGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCwgZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZKTtcbiAgICAgICAgICAgICAgICByb3RhdGVEZWx0YS5zdWJWZWN0b3JzKHJvdGF0ZUVuZCwgcm90YXRlU3RhcnQpO1xuXG4gICAgICAgICAgICAgICAgLy8gcm90YXRpbmcgYWNyb3NzIHdob2xlIHNjcmVlbiBnb2VzIDM2MCBkZWdyZWVzIGFyb3VuZFxuICAgICAgICAgICAgICAgIHNjb3BlLnJvdGF0ZUxlZnQoMiAqIE1hdGguUEkgKiByb3RhdGVEZWx0YS54IC8gZWxlbWVudC5jbGllbnRXaWR0aCAqIHNjb3BlLnJvdGF0ZVNwZWVkKTtcbiAgICAgICAgICAgICAgICAvLyByb3RhdGluZyB1cCBhbmQgZG93biBhbG9uZyB3aG9sZSBzY3JlZW4gYXR0ZW1wdHMgdG8gZ28gMzYwLCBidXQgbGltaXRlZCB0byAxODBcbiAgICAgICAgICAgICAgICBzY29wZS5yb3RhdGVVcCgyICogTWF0aC5QSSAqIHJvdGF0ZURlbHRhLnkgLyBlbGVtZW50LmNsaWVudEhlaWdodCAqIHNjb3BlLnJvdGF0ZVNwZWVkKTtcblxuICAgICAgICAgICAgICAgIHJvdGF0ZVN0YXJ0LmNvcHkocm90YXRlRW5kKTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDI6IC8vIHR3by1maW5nZXJlZCB0b3VjaDogZG9sbHlcblxuICAgICAgICAgICAgICAgIGlmIChzY29wZS5ub1pvb20gPT09IHRydWUpIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgIT09IFNUQVRFLlRPVUNIX0RPTExZKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB2YXIgZHggPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVg7XG4gICAgICAgICAgICAgICAgdmFyIGR5ID0gZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZIC0gZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VZO1xuICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG5cbiAgICAgICAgICAgICAgICBkb2xseUVuZC5zZXQoMCwgZGlzdGFuY2UpO1xuICAgICAgICAgICAgICAgIGRvbGx5RGVsdGEuc3ViVmVjdG9ycyhkb2xseUVuZCwgZG9sbHlTdGFydCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZG9sbHlEZWx0YS55ID4gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmRvbGx5T3V0KCk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmRvbGx5SW4oKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRvbGx5U3RhcnQuY29weShkb2xseUVuZCk7XG5cbiAgICAgICAgICAgICAgICBzY29wZS51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAzOiAvLyB0aHJlZS1maW5nZXJlZCB0b3VjaDogcGFuXG5cbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUubm9QYW4gPT09IHRydWUpIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgIT09IFNUQVRFLlRPVUNIX1BBTikgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgcGFuRW5kLnNldChldmVudC50b3VjaGVzWyAwIF0ucGFnZVgsIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSk7XG4gICAgICAgICAgICAgICAgcGFuRGVsdGEuc3ViVmVjdG9ycyhwYW5FbmQsIHBhblN0YXJ0KTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLnBhbihwYW5EZWx0YS54LCBwYW5EZWx0YS55KTtcblxuICAgICAgICAgICAgICAgIHBhblN0YXJ0LmNvcHkocGFuRW5kKTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuXG4gICAgICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5OT05FO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvdWNoZW5kKC8qIGV2ZW50ICovKSB7XG5cbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKSByZXR1cm47XG5cbiAgICAgICAgc2NvcGUuZGlzcGF0Y2hFdmVudChlbmRFdmVudCk7XG4gICAgICAgIHN0YXRlID0gU1RBVEUuTk9ORTtcblxuICAgIH1cblxuICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0sIGZhbHNlKTtcbiAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Nb3VzZURvd24sIGZhbHNlKTtcbiAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V3aGVlbCcsIG9uTW91c2VXaGVlbCwgZmFsc2UpO1xuICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Nb3VzZVNjcm9sbCcsIG9uTW91c2VXaGVlbCwgZmFsc2UpOyAvLyBmaXJlZm94XG5cbiAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRvdWNoc3RhcnQsIGZhbHNlKTtcbiAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0b3VjaGVuZCwgZmFsc2UpO1xuICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0b3VjaG1vdmUsIGZhbHNlKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXlEb3duLCBmYWxzZSk7XG5cbiAgICAvLyBmb3JjZSBhbiB1cGRhdGUgYXQgc3RhcnRcbiAgICB0aGlzLnVwZGF0ZSgpO1xuXG59O1xuXG5USFJFRS5PcmJpdENvbnRyb2xzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVEhSRUUuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZSk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuUXVldWUgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBRdWV1ZSgpIHtcbiAgICAgICAgICAgIHRoaXMudGFpbCA9IFtdO1xuICAgICAgICAgICAgdGhpcy5oZWFkID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gMDtcbiAgICAgICAgICAgIC8vIExvY2sgdGhlIG9iamVjdCBkb3duXG4gICAgICAgICAgICBPYmplY3Quc2VhbCh0aGlzKTtcbiAgICAgICAgfTtcblxuICAgICAgICBRdWV1ZS5wcm90b3R5cGUuc2hpZnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vZmZzZXQgPT09IHRoaXMuaGVhZC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdG1wID0gdGhpcy5oZWFkO1xuICAgICAgICAgICAgICAgIHRtcC5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZCA9IHRoaXMudGFpbDtcbiAgICAgICAgICAgICAgICB0aGlzLnRhaWwgPSB0bXA7XG4gICAgICAgICAgICAgICAgdGhpcy5vZmZzZXQgPSAwO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhlYWQubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oZWFkW3RoaXMub2Zmc2V0KytdO1xuICAgICAgICB9O1xuXG4gICAgICAgIFF1ZXVlLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhaWwucHVzaChpdGVtKTtcbiAgICAgICAgfTtcblxuICAgICAgICBRdWV1ZS5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVhZC5sZW5ndGggLSB0aGlzLm9mZnNldCArIHRoaXMudGFpbC5sZW5ndGg7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIFF1ZXVlO1xuICAgIH0pKCk7XG59KS5jYWxsKHRoaXMpIl19
