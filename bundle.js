(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\AudioWindow.coffee":[function(require,module,exports){
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



},{}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\ChoreographyRoutine.coffee":[function(require,module,exports){
window.ChoreographyRoutine = (function() {
  function ChoreographyRoutine(visualizer, routinesController) {
    this.visualizer = visualizer;
    this.routinesController = routinesController;
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
    if (this.routineBeat >= this.routine.length - 1) {
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
    Array.prototype.push.apply(this.routine, routineData);
    return this.updateText();
  };

  ChoreographyRoutine.prototype.createRoutine = function(name, next) {
    return this.visualizer.routinesController.pushRoutine(name, this.routine, (function(_this) {
      return function() {
        return next();
      };
    })(this));
  };

  ChoreographyRoutine.prototype.reset = function() {
    this.routine = [];
    this.routineMoment = [];
    this.routineBeat = -1;
    this.visualizer.receiveChoreography({
      id: -1
    });
    return this.updateText();
  };

  ChoreographyRoutine.prototype.updateText = function() {
    return this.visualizer["interface"].updateText();
  };

  return ChoreographyRoutine;

})();



},{}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\Main.coffee":[function(require,module,exports){
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

require('./Visualizer.coffee');

require('../javascript/OrbitControls');

require('./Viewer.coffee');

require('./interface/DatGUIInterface.coffee');

window.Main = (function() {
  function Main(isVisualizer) {
    this.onWindowResize = __bind(this.onWindowResize, this);
    var controlChange, routinesController;
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
    this.controls.target = new THREE.Vector3(0, 0, 0);
    window.addEventListener('resize', this.onWindowResize, false);
    document.body.appendChild(this.renderer.domElement);
    this.viewer = new Viewer(this.scene, this.camera);
    if (isVisualizer) {
      routinesController = new RoutinesController();
      this.visualizer = new Visualizer(this.viewer, new DatGUIInterface(routinesController), routinesController);
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



},{"../javascript/OrbitControls":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\javascript\\OrbitControls.js","./Viewer.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\Viewer.coffee","./Visualizer.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\Visualizer.coffee","./interface/DatGUIInterface.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\interface\\DatGUIInterface.coffee"}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\Player.coffee":[function(require,module,exports){
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



},{"./AudioWindow.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\AudioWindow.coffee"}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\RoutinesController.coffee":[function(require,module,exports){
require('./RoutinesService.coffee');

window.RoutinesController = (function() {
  function RoutinesController() {
    this.routines = [];
    this.routinesService = new RoutinesService();
  }

  RoutinesController.prototype.getRoutine = function(id, next) {
    var _ref;
    if (((_ref = this.routines[id]) != null ? _ref.data : void 0) !== "") {
      next(this.routines[id]);
      return;
    }
    return this.routinesService.getRoutine(id, (function(_this) {
      return function(routine) {
        if (_this.routines[id] == null) {
          _this.routines[id] = routine;
        } else {
          _this.routines[id].data = JSON.parse(routine.data);
        }
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
        if (next != null) {
          return next(_this.routines);
        }
      };
    })(this));
  };

  RoutinesController.prototype.pushRoutine = function(name, data, next) {
    var routine;
    routine = {
      name: name,
      data: JSON.stringify(data)
    };
    return this.routinesService.createRoutine(routine, (function(_this) {
      return function() {
        _this.refreshRoutines();
        return next();
      };
    })(this));
  };

  return RoutinesController;

})();



},{"./RoutinesService.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\RoutinesService.coffee"}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\RoutinesService.coffee":[function(require,module,exports){
window.RoutinesService = (function() {
  function RoutinesService() {}

  RoutinesService.server = "http://visualizer.upopple.com/";

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
    return $.ajax({
      url: this.constructor.server + 'routines',
      type: 'POST',
      data: JSON.stringify(data),
      success: function(data) {
        return next();
      }
    });
  };

  return RoutinesService;

})();



},{}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\ShaderLoader.coffee":[function(require,module,exports){
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



},{}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\Viewer.coffee":[function(require,module,exports){
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



},{"../javascript/Queue.js":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\javascript\\Queue.js","./ShaderLoader.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\ShaderLoader.coffee"}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\Visualizer.coffee":[function(require,module,exports){
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

  function Visualizer(viewer, _interface, routinesController) {
    this.viewer = viewer;
    this["interface"] = _interface;
    this.routinesController = routinesController;
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



},{"./ChoreographyRoutine.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\ChoreographyRoutine.coffee","./Player.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\Player.coffee","./danceMaterials/ColorDanceMaterial.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\danceMaterials\\ColorDanceMaterial.coffee","./danceMaterials/SimpleFrequencyShader.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\danceMaterials\\SimpleFrequencyShader.coffee","./dancers/CubeDancer.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\dancers\\CubeDancer.coffee","./dancers/PointCloudDancer.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\dancers\\PointCloudDancer.coffee","./dancers/SphereDancer.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\dancers\\SphereDancer.coffee","./dances/PositionDance.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\dances\\PositionDance.coffee","./dances/RotateDance.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\dances\\RotateDance.coffee","./dances/ScaleDance.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\dances\\ScaleDance.coffee"}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\danceMaterials\\ColorDanceMaterial.coffee":[function(require,module,exports){
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



},{}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\danceMaterials\\SimpleFrequencyShader.coffee":[function(require,module,exports){
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



},{}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\dancers\\CubeDancer.coffee":[function(require,module,exports){
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



},{"./Dancer.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\dancers\\Dancer.coffee"}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\dancers\\Dancer.coffee":[function(require,module,exports){
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



},{}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\dancers\\PointCloudDancer.coffee":[function(require,module,exports){
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



},{"./Dancer.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\dancers\\Dancer.coffee"}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\dancers\\SphereDancer.coffee":[function(require,module,exports){
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



},{"./Dancer.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\dancers\\Dancer.coffee"}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\dances\\PositionDance.coffee":[function(require,module,exports){
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



},{}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\dances\\RotateDance.coffee":[function(require,module,exports){
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



},{}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\dances\\ScaleDance.coffee":[function(require,module,exports){
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



},{}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\interface\\DatGUIInterface.coffee":[function(require,module,exports){
require('./QueueView.coffee');

require('./RoutinesView.coffee');

require('../RoutinesController.coffee');

window.DatGUIInterface = (function() {
  function DatGUIInterface(routinesController) {
    this.routinesController = routinesController;
    this.container = $('#interface');
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
    this.containerTop = $("<div>", {
      "class": "half-height"
    });
    this.container.append(this.containerTop);
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
    return this.containerTop.append(this.viewerButton);
  };

  DatGUIInterface.prototype.setupQueueView = function() {
    this.queueView = new QueueView(this.choreographyRoutine);
    return this.queueView.createView(this.containerTop);
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
    if (this.queueView != null) {
      return this.queueView.updateText(this.choreographyRoutine.routineBeat, this.choreographyRoutine.routine);
    }
  };

  return DatGUIInterface;

})();



},{"../RoutinesController.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\RoutinesController.coffee","./QueueView.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\interface\\QueueView.coffee","./RoutinesView.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\interface\\RoutinesView.coffee"}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\interface\\QueueView.coffee":[function(require,module,exports){
window.QueueView = (function() {
  function QueueView(choreographyRoutine) {
    this.choreographyRoutine = choreographyRoutine;
    return;
  }

  QueueView.prototype.createView = function(target) {
    this.queueContainer = $("<div>");
    target.append(this.queueContainer);
    this.controls = $("<div>");
    this.queueContainer.append(this.controls);
    this.pushSuccessful = $("<div>", {
      text: "Push successful",
      "class": "hide"
    });
    this.controls.append(this.pushSuccessful);
    this.invalidJSON = $("<div>", {
      text: "Invalid json",
      "class": "hide"
    });
    this.controls.append(this.invalidJSON);
    this.queueName = $("<input>", {
      type: "text"
    });
    this.controls.append(this.queueName);
    this.pushButton = $("<a>", {
      href: "#",
      text: "Push"
    });
    this.pushButton.click((function(_this) {
      return function(e) {
        e.preventDefault();
        return _this.onPush();
      };
    })(this));
    this.controls.append(this.pushButton);
    this.routineView = $("<pre>", {
      id: 'queue',
      "class": 'scrollable no-margin',
      contenteditable: true
    });
    this.routineView.keydown(function(e) {
      return e.stopPropagation();
    });
    this.routineView.on('input', (function(_this) {
      return function() {
        var newJSON;
        try {
          newJSON = JSON.parse("[" + _this.routineView.text() + "]");
        } catch (_error) {
          _this.jsonInvalid = true;
          _this.invalidJSON.removeClass("hide");
        }
        if ((newJSON == null) || newJSON.length === 0) {
          _this.jsonInvalid = true;
          return _this.invalidJSON.removeClass("hide");
        } else {
          _this.jsonInvalid = false;
          _this.invalidJSON.addClass("hide");
          _this.queue = newJSON;
          return _this.choreographyRoutine.routine = _this.queue;
        }
      };
    })(this));
    this.queueContainer.height(target.height() - target.find('a').height());
    this.routineView.height(this.queueContainer.height() - this.controls.height());
    return this.queueContainer.append(this.routineView);
  };

  QueueView.prototype.onPush = function() {
    if (this.jsonInvalid) {
      return;
    }
    return this.choreographyRoutine.createRoutine(this.queueName.val(), (function(_this) {
      return function() {
        return _this.pushSuccessful.removeClass("hide");
      };
    })(this));
  };

  QueueView.prototype.updateText = function(currentIndex, routineQueue) {
    var html, i, routine, _i, _len;
    this.pushSuccessful.addClass("hide");
    this.queue = routineQueue;
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
    return this.routineView.html(html.slice(0, html.length - 1).join(""));
  };

  QueueView.prototype.stringify = function(json) {
    return JSON.stringify(json, void 0, 2);
  };

  return QueueView;

})();



},{}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\interface\\RoutinesView.coffee":[function(require,module,exports){
window.RoutinesView = (function() {
  function RoutinesView(choreographyRoutine, routinesController) {
    this.choreographyRoutine = choreographyRoutine;
    this.routinesController = routinesController;
    return;
  }

  RoutinesView.prototype.createView = function(target) {
    this.routinesContainer = $("<div>", {
      id: 'routinesContainer',
      "class": 'half-height scrollable'
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
        if ((routine != null ? routine.data : void 0) != null) {
          return _this.updateText(routine.data);
        }
      };
    })(this));
  };

  return RoutinesView;

})();



},{}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\javascript\\OrbitControls.js":[function(require,module,exports){
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
},{}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\javascript\\Queue.js":[function(require,module,exports){
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
},{}]},{},["C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\Main.coffee"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcQXBwRGF0YVxcUm9hbWluZ1xcbnBtXFxub2RlX21vZHVsZXNcXHdhdGNoaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkM6XFxVc2Vyc1xcVWx5c3Nlc1xcRGV2ZWxvcG1lbnRcXHdlYmdsLXZpc3VhbGl6ZXJcXGNvZmZlZVxcQXVkaW9XaW5kb3cuY29mZmVlIiwiQzpcXFVzZXJzXFxVbHlzc2VzXFxEZXZlbG9wbWVudFxcd2ViZ2wtdmlzdWFsaXplclxcY29mZmVlXFxDaG9yZW9ncmFwaHlSb3V0aW5lLmNvZmZlZSIsIkM6XFxVc2Vyc1xcVWx5c3Nlc1xcRGV2ZWxvcG1lbnRcXHdlYmdsLXZpc3VhbGl6ZXJcXGNvZmZlZVxcTWFpbi5jb2ZmZWUiLCJDOlxcVXNlcnNcXFVseXNzZXNcXERldmVsb3BtZW50XFx3ZWJnbC12aXN1YWxpemVyXFxjb2ZmZWVcXFBsYXllci5jb2ZmZWUiLCJDOlxcVXNlcnNcXFVseXNzZXNcXERldmVsb3BtZW50XFx3ZWJnbC12aXN1YWxpemVyXFxjb2ZmZWVcXFJvdXRpbmVzQ29udHJvbGxlci5jb2ZmZWUiLCJDOlxcVXNlcnNcXFVseXNzZXNcXERldmVsb3BtZW50XFx3ZWJnbC12aXN1YWxpemVyXFxjb2ZmZWVcXFJvdXRpbmVzU2VydmljZS5jb2ZmZWUiLCJDOlxcVXNlcnNcXFVseXNzZXNcXERldmVsb3BtZW50XFx3ZWJnbC12aXN1YWxpemVyXFxjb2ZmZWVcXFNoYWRlckxvYWRlci5jb2ZmZWUiLCJDOlxcVXNlcnNcXFVseXNzZXNcXERldmVsb3BtZW50XFx3ZWJnbC12aXN1YWxpemVyXFxjb2ZmZWVcXFZpZXdlci5jb2ZmZWUiLCJDOlxcVXNlcnNcXFVseXNzZXNcXERldmVsb3BtZW50XFx3ZWJnbC12aXN1YWxpemVyXFxjb2ZmZWVcXFZpc3VhbGl6ZXIuY29mZmVlIiwiQzpcXFVzZXJzXFxVbHlzc2VzXFxEZXZlbG9wbWVudFxcd2ViZ2wtdmlzdWFsaXplclxcY29mZmVlXFxkYW5jZU1hdGVyaWFsc1xcQ29sb3JEYW5jZU1hdGVyaWFsLmNvZmZlZSIsIkM6XFxVc2Vyc1xcVWx5c3Nlc1xcRGV2ZWxvcG1lbnRcXHdlYmdsLXZpc3VhbGl6ZXJcXGNvZmZlZVxcZGFuY2VNYXRlcmlhbHNcXFNpbXBsZUZyZXF1ZW5jeVNoYWRlci5jb2ZmZWUiLCJDOlxcVXNlcnNcXFVseXNzZXNcXERldmVsb3BtZW50XFx3ZWJnbC12aXN1YWxpemVyXFxjb2ZmZWVcXGRhbmNlcnNcXEN1YmVEYW5jZXIuY29mZmVlIiwiQzpcXFVzZXJzXFxVbHlzc2VzXFxEZXZlbG9wbWVudFxcd2ViZ2wtdmlzdWFsaXplclxcY29mZmVlXFxkYW5jZXJzXFxEYW5jZXIuY29mZmVlIiwiQzpcXFVzZXJzXFxVbHlzc2VzXFxEZXZlbG9wbWVudFxcd2ViZ2wtdmlzdWFsaXplclxcY29mZmVlXFxkYW5jZXJzXFxQb2ludENsb3VkRGFuY2VyLmNvZmZlZSIsIkM6XFxVc2Vyc1xcVWx5c3Nlc1xcRGV2ZWxvcG1lbnRcXHdlYmdsLXZpc3VhbGl6ZXJcXGNvZmZlZVxcZGFuY2Vyc1xcU3BoZXJlRGFuY2VyLmNvZmZlZSIsIkM6XFxVc2Vyc1xcVWx5c3Nlc1xcRGV2ZWxvcG1lbnRcXHdlYmdsLXZpc3VhbGl6ZXJcXGNvZmZlZVxcZGFuY2VzXFxQb3NpdGlvbkRhbmNlLmNvZmZlZSIsIkM6XFxVc2Vyc1xcVWx5c3Nlc1xcRGV2ZWxvcG1lbnRcXHdlYmdsLXZpc3VhbGl6ZXJcXGNvZmZlZVxcZGFuY2VzXFxSb3RhdGVEYW5jZS5jb2ZmZWUiLCJDOlxcVXNlcnNcXFVseXNzZXNcXERldmVsb3BtZW50XFx3ZWJnbC12aXN1YWxpemVyXFxjb2ZmZWVcXGRhbmNlc1xcU2NhbGVEYW5jZS5jb2ZmZWUiLCJDOlxcVXNlcnNcXFVseXNzZXNcXERldmVsb3BtZW50XFx3ZWJnbC12aXN1YWxpemVyXFxjb2ZmZWVcXGludGVyZmFjZVxcRGF0R1VJSW50ZXJmYWNlLmNvZmZlZSIsIkM6XFxVc2Vyc1xcVWx5c3Nlc1xcRGV2ZWxvcG1lbnRcXHdlYmdsLXZpc3VhbGl6ZXJcXGNvZmZlZVxcaW50ZXJmYWNlXFxRdWV1ZVZpZXcuY29mZmVlIiwiQzpcXFVzZXJzXFxVbHlzc2VzXFxEZXZlbG9wbWVudFxcd2ViZ2wtdmlzdWFsaXplclxcY29mZmVlXFxpbnRlcmZhY2VcXFJvdXRpbmVzVmlldy5jb2ZmZWUiLCJqYXZhc2NyaXB0XFxPcmJpdENvbnRyb2xzLmpzIiwiamF2YXNjcmlwdFxcUXVldWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNDQSxNQUFZLENBQUM7QUFDWCxFQUFBLFdBQUMsQ0FBQSxVQUFELEdBQWEsSUFBYixDQUFBOztBQUVhLEVBQUEscUJBQUMsY0FBRCxHQUFBO0FBQ1gsSUFBQSxJQUFDLENBQUEsY0FBRCxHQUFrQixjQUFsQixDQUFBO0FBQUEsSUFDQSxJQUFDLENBQUEsZUFBRCxHQUF1QixJQUFBLFVBQUEsQ0FBVyxJQUFDLENBQUEsV0FBVyxDQUFDLFVBQXhCLENBRHZCLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsVUFBQSxDQUFXLElBQUMsQ0FBQSxXQUFXLENBQUMsVUFBeEIsQ0FGaEIsQ0FBQTtBQUFBLElBR0EsSUFBQyxDQUFBLElBQUQsR0FBUSxDQUhSLENBQUE7QUFBQSxJQUlBLElBQUMsQ0FBQSxTQUFELEdBQWEsQ0FKYixDQURXO0VBQUEsQ0FGYjs7QUFBQSx3QkFTQSxNQUFBLEdBQVEsU0FBQyxRQUFELEVBQVcsSUFBWCxHQUFBO0FBQ04sUUFBQSxzQ0FBQTtBQUFBLElBQUEsSUFBRyxDQUFBLFFBQUg7QUFDRSxZQUFBLENBREY7S0FBQTtBQUFBLElBSUEsT0FBQSxHQUFVLElBQUEsR0FBTyxJQUpqQixDQUFBO0FBQUEsSUFLQSxJQUFDLENBQUEsU0FBRCxHQUFhLE9BQUEsR0FBVSxJQUFDLENBQUEsSUFMeEIsQ0FBQTtBQUFBLElBTUEsSUFBQyxDQUFBLElBQUQsR0FBUSxPQU5SLENBQUE7QUFBQSxJQVFBLFFB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R0FBQTtBQUNqQyxRQUFBLElBQUcsaURBQUg7aUJBQ0UsS0FBQyxDQUFBLFVBQUQsQ0FBWSxPQUFPLENBQUMsSUFBcEIsRUFERjtTQURpQztNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5DLEVBRlE7RUFBQSxDQXhEVixDQUFBOztzQkFBQTs7SUFERixDQUFBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMgQ29udGFpbnMgdGhlIGZyZXF1ZW5jeVNhbXBsZXMgYW5kIGRiU2FtcGxlcyBmb3IgYXVkaW9cclxuY2xhc3Mgd2luZG93LkF1ZGlvV2luZG93XHJcbiAgQGJ1ZmZlclNpemU6IDIwNDhcclxuXHJcbiAgY29uc3RydWN0b3I6IChyZXNwb25zaXZlbmVzcykgLT5cclxuICAgIEByZXNwb25zaXZlbmVzcyA9IHJlc3BvbnNpdmVuZXNzXHJcbiAgICBAZnJlcXVlbmN5QnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoQGNvbnN0cnVjdG9yLmJ1ZmZlclNpemUpXHJcbiAgICBAZGJCdWZmZXIgPSBuZXcgVWludDhBcnJheShAY29uc3RydWN0b3IuYnVmZmVyU2l6ZSlcclxuICAgIEB0aW1lID0gMFxyXG4gICAgQGRlbHRhVGltZSA9IDBcclxuXHJcbiAgdXBkYXRlOiAoYW5hbHlzZXIsIHRpbWUpIC0+XHJcbiAgICBpZiAhYW5hbHlzZXJcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgIyBLZWVwIHRyYWNrIG9mIHRoZSBhdWRpb0NvbnRleHQgdGltZSBpbiBtc1xyXG4gICAgbmV3VGltZSA9IHRpbWUgKiAxMDAwXHJcbiAgICBAZGVsdGFUaW1lID0gbmV3VGltZSAtIEB0aW1lXHJcbiAgICBAdGltZSA9IG5ld1RpbWVcclxuXHJcbiAgICBhbmFseXNlci5nZXRCeXRlVGltZURvbWFpbkRhdGEoQGRiQnVmZmVyKVxyXG4gICAgYW5hbHlzZXIuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEoQGZyZXF1ZW5jeUJ1ZmZlcilcclxuXHJcbiAgICBybXMgPSAwXHJcblxyXG4gICAgZm9yIGJ1ZiBpbiBAZGJCdWZmZXJcclxuICAgICAgICB2YWwgPSAoYnVmIC0gMTI4KSAvIDEyOFxyXG4gICAgICAgIHJtcyArPSB2YWwqdmFsXHJcblxyXG4gICAgQGF2ZXJhZ2VEYiA9IE1hdGguc3FydChybXMgLyBAY29uc3RydWN0b3IuYnVmZmVyU2l6ZSkgKiBAcmVzcG9uc2l2ZW5lc3MiLCJjbGFzcyB3aW5kb3cuQ2hvcmVvZ3JhcGh5Um91dGluZVxyXG4gIGNvbnN0cnVjdG9yOiAoQHZpc3VhbGl6ZXIsIEByb3V0aW5lc0NvbnRyb2xsZXIpIC0+XHJcbiAgICBAaWQgPSAwXHJcbiAgICBAZGFuY2VyID0gXCJDdWJlRGFuY2VyXCJcclxuICAgIEBkYW5jZSA9IFwiU2NhbGVEYW5jZVwiXHJcbiAgICBAZGFuY2VNYXRlcmlhbCA9IFwiQ29sb3JEYW5jZU1hdGVyaWFsXCJcclxuICAgIEBkYW5jZXJQYXJhbXMgPSB7fVxyXG4gICAgQGRhbmNlUGFyYW1zID0ge31cclxuICAgIEBkYW5jZU1hdGVyaWFsUGFyYW1zID0ge31cclxuXHJcbiAgICBAcmVzZXQoKVxyXG4gICAgQHJvdXRpbmUgPSBbXHJcbiAgICAgIFtcclxuICAgICAgICB7IGlkOiAtMSB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAyXHJcbiAgICAgICAgICBkYW5jZXI6XHJcbiAgICAgICAgICAgIHR5cGU6ICdDdWJlRGFuY2VyJ1xyXG4gICAgICAgICAgZGFuY2U6XHJcbiAgICAgICAgICAgIHR5cGU6ICdQb3NpdGlvbkRhbmNlJ1xyXG4gICAgICAgICAgICBwYXJhbXM6XHJcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcclxuICAgICAgICAgICAgICBkaXJlY3Rpb246IFswLCA0LjAsIDBdXHJcbiAgICAgICAgICBkYW5jZU1hdGVyaWFsOlxyXG4gICAgICAgICAgICB0eXBlOiAnQ29sb3JEYW5jZU1hdGVyaWFsJ1xyXG4gICAgICAgICAgICBwYXJhbXM6XHJcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAwXHJcbiAgICAgICAgICBkYW5jZXI6XHJcbiAgICAgICAgICAgIHR5cGU6ICdQb2ludENsb3VkRGFuY2VyJ1xyXG4gICAgICAgICAgZGFuY2U6XHJcbiAgICAgICAgICAgIHR5cGU6ICdSb3RhdGVEYW5jZSdcclxuICAgICAgICAgICAgcGFyYW1zOlxyXG4gICAgICAgICAgICAgIGF4aXM6IFstMSwgLTEsIDBdXHJcbiAgICAgICAgICBkYW5jZU1hdGVyaWFsOlxyXG4gICAgICAgICAgICB0eXBlOiAnQ29sb3JEYW5jZU1hdGVyaWFsJ1xyXG4gICAgICAgICAgICBwYXJhbXM6XHJcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcclxuICAgICAgICAgICAgICBtaW5MOiAwLjBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAxXHJcbiAgICAgICAgICBkYW5jZXI6XHJcbiAgICAgICAgICAgIHR5cGU6ICdQb2ludENsb3VkRGFuY2VyJ1xyXG4gICAgICAgICAgZGFuY2U6XHJcbiAgICAgICAgICAgIHR5cGU6ICdSb3RhdGVEYW5jZSdcclxuICAgICAgICAgICAgcGFyYW1zOlxyXG4gICAgICAgICAgICAgIGF4aXM6IFswLCAxLCAxXVxyXG4gICAgICAgICAgICAgIHNwZWVkOiAwLjVcclxuICAgICAgICAgIGRhbmNlTWF0ZXJpYWw6XHJcbiAgICAgICAgICAgIHR5cGU6ICdDb2xvckRhbmNlTWF0ZXJpYWwnXHJcbiAgICAgICAgICAgIHBhcmFtczpcclxuICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxyXG4gICAgICAgICAgICAgIG1pbkw6IDAuMFxyXG4gICAgICAgIH1cclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAyXHJcbiAgICAgICAgICBkYW5jZXI6XHJcbiAgICAgICAgICAgIHR5cGU6ICdTcGhlcmVEYW5jZXInXHJcbiAgICAgICAgICAgIHBhcmFtczpcclxuICAgICAgICAgICAgICBwb3NpdGlvbjogWzAuNSwgMCwgMC41XVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6IDNcclxuICAgICAgICAgIGRhbmNlcjpcclxuICAgICAgICAgICAgdHlwZTogJ1NwaGVyZURhbmNlcidcclxuICAgICAgICAgICAgcGFyYW1zOlxyXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBbMC41LCAwLCAtMC41XVxyXG4gICAgICAgICAgZGFuY2U6XHJcbiAgICAgICAgICAgIHR5cGU6ICdTY2FsZURhbmNlJ1xyXG4gICAgICAgICAgICBwYXJhbXM6XHJcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcclxuICAgICAgICAgIGRhbmNlTWF0ZXJpYWw6XHJcbiAgICAgICAgICAgIHR5cGU6ICdDb2xvckRhbmNlTWF0ZXJpYWwnXHJcbiAgICAgICAgICAgIHBhcmFtczpcclxuICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxyXG4gICAgICAgICAgICAgIHdpcmVmcmFtZTogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6IDRcclxuICAgICAgICAgIGRhbmNlcjpcclxuICAgICAgICAgICAgdHlwZTogJ1NwaGVyZURhbmNlcidcclxuICAgICAgICAgICAgcGFyYW1zOlxyXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBbLTAuNSwgMCwgMC41XVxyXG4gICAgICAgICAgZGFuY2U6XHJcbiAgICAgICAgICAgIHR5cGU6ICdTY2FsZURhbmNlJ1xyXG4gICAgICAgICAgICBwYXJhbXM6XHJcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcclxuICAgICAgICAgIGRhbmNlTWF0ZXJpYWw6XHJcbiAgICAgICAgICAgIHR5cGU6ICdDb2xvckRhbmNlTWF0ZXJpYWwnXHJcbiAgICAgICAgICAgIHBhcmFtczpcclxuICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxyXG4gICAgICAgICAgICAgIHdpcmVmcmFtZTogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6IDVcclxuICAgICAgICAgIGRhbmNlcjpcclxuICAgICAgICAgICAgdHlwZTogJ1NwaGVyZURhbmNlcidcclxuICAgICAgICAgICAgcGFyYW1zOlxyXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBbLTAuNSwgMCwgLTAuNV1cclxuICAgICAgICAgIGRhbmNlOlxyXG4gICAgICAgICAgICB0eXBlOiAnUG9zaXRpb25EYW5jZSdcclxuICAgICAgICAgICAgcGFyYW1zOlxyXG4gICAgICAgICAgICAgIHNtb290aGluZ0ZhY3RvcjogMC41XHJcbiAgICAgICAgICBkYW5jZU1hdGVyaWFsOlxyXG4gICAgICAgICAgICB0eXBlOiAnQ29sb3JEYW5jZU1hdGVyaWFsJ1xyXG4gICAgICAgICAgICBwYXJhbXM6XHJcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcclxuICAgICAgICAgICAgICB3aXJlZnJhbWU6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICBdXHJcbiAgICBdXHJcblxyXG4jICAgIEB1cGRhdGVUZXh0KClcclxuXHJcbiAgIyBJbmRpdmlkdWFsIG1vbWVudCBtZXRob2RzXHJcblxyXG4gIHByZXZpZXc6ICgpIC0+XHJcbiAgICBAdmlzdWFsaXplci5yZWNlaXZlQ2hvcmVvZ3JhcGh5XHJcbiAgICAgIGlkOiBAaWRcclxuICAgICAgZGFuY2VyOlxyXG4gICAgICAgIHR5cGU6IEBkYW5jZXJcclxuICAgICAgICBwYXJhbXM6IEBkYW5jZXJQYXJhbXNcclxuICAgICAgZGFuY2U6XHJcbiAgICAgICAgdHlwZTogQGRhbmNlXHJcbiAgICAgICAgcGFyYW1zOiBAZGFuY2VQYXJhbXNcclxuICAgICAgZGFuY2VNYXRlcmlhbDpcclxuICAgICAgICB0eXBlOiBAZGFuY2VNYXRlcmlhbFxyXG4gICAgICAgIHBhcmFtczogQGRhbmNlTWF0ZXJpYWxQYXJhbXNcclxuXHJcbiAgYWRkOiAoKSAtPlxyXG4gICAgQHJvdXRpbmVNb21lbnQucHVzaFxyXG4gICAgICBpZDogQGlkXHJcbiAgICAgIGRhbmNlcjpcclxuICAgICAgICB0eXBlOiBAZGFuY2VyXHJcbiAgICAgICAgcGFyYW1zOiBAZGFuY2VyUGFyYW1zXHJcbiAgICAgIGRhbmNlOlxyXG4gICAgICAgIHR5cGU6IEBkYW5jZVxyXG4gICAgICAgIHBhcmFtczogQGRhbmNlUGFyYW1zXHJcbiAgICAgIGRhbmNlTWF0ZXJpYWw6XHJcbiAgICAgICAgdHlwZTogQGRhbmNlTWF0ZXJpYWxcclxuICAgICAgICBwYXJhbXM6IEBkYW5jZU1hdGVyaWFsUGFyYW1zXHJcblxyXG4gICAgQHVwZGF0ZVRleHQoKVxyXG5cclxuICBpbnNlcnRCZWF0OiAoKSAtPlxyXG4gICAgQHJvdXRpbmVNb21lbnQgPSBbXVxyXG4gICAgQHJvdXRpbmUuc3BsaWNlKCsrQHJvdXRpbmVCZWF0LCAwLCBAcm91dGluZU1vbWVudClcclxuICAgIEB1cGRhdGVUZXh0KClcclxuXHJcbiAgcGxheU5leHQ6ICgpIC0+XHJcbiAgICBpZiBAcm91dGluZUJlYXQgPj0gQHJvdXRpbmUubGVuZ3RoIC0gMVxyXG4gICAgICBAcm91dGluZUJlYXQgPSAtMVxyXG5cclxuICAgIEByb3V0aW5lTW9tZW50ID0gQHJvdXRpbmVbKytAcm91dGluZUJlYXRdXHJcbiAgICBmb3IgY2hhbmdlIGluIEByb3V0aW5lTW9tZW50XHJcbiAgICAgIEB2aXN1YWxpemVyLnJlY2VpdmVDaG9yZW9ncmFwaHkgY2hhbmdlXHJcblxyXG4gICAgQHVwZGF0ZVRleHQoKVxyXG5cclxuICB1cGRhdGVEYW5jZXI6IChkYW5jZXIpIC0+XHJcbiAgICBAZGFuY2VyID0gZGFuY2VyLmNvbnN0cnVjdG9yLm5hbWVcclxuICAgIEBkYW5jZU1hdGVyaWFsID0gZGFuY2VyLmRhbmNlTWF0ZXJpYWwuY29uc3RydWN0b3IubmFtZVxyXG4gICAgQGRhbmNlID0gZGFuY2VyLmRhbmNlLmNvbnN0cnVjdG9yLm5hbWVcclxuXHJcblxyXG4gICMgRW50aXJlIHJvdXRpbmUgbWV0aG9kc1xyXG5cclxuICBxdWV1ZVJvdXRpbmU6IChyb3V0aW5lRGF0YSkgLT5cclxuICAgIEFycmF5OjpwdXNoLmFwcGx5IEByb3V0aW5lLCByb3V0aW5lRGF0YVxyXG4gICAgQHVwZGF0ZVRleHQoKVxyXG5cclxuICBjcmVhdGVSb3V0aW5lOiAobmFtZSwgbmV4dCkgLT5cclxuICAgIEB2aXN1YWxpemVyLnJvdXRpbmVzQ29udHJvbGxlci5wdXNoUm91dGluZSBuYW1lLCBAcm91dGluZSwgKCkgPT5cclxuICAgICAgbmV4dCgpXHJcblxyXG4gIHJlc2V0OiAoKSAtPlxyXG4gICAgQHJvdXRpbmUgPSBbXVxyXG4gICAgQHJvdXRpbmVNb21lbnQgPSBbXVxyXG4gICAgQHJvdXRpbmVCZWF0ID0gLTFcclxuICAgIEB2aXN1YWxpemVyLnJlY2VpdmVDaG9yZW9ncmFwaHkoeyBpZDogLTEgfSlcclxuICAgIEB1cGRhdGVUZXh0KClcclxuXHJcbiAgdXBkYXRlVGV4dDogKCkgLT5cclxuICAgIEB2aXN1YWxpemVyLmludGVyZmFjZS51cGRhdGVUZXh0KClcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuIiwiIyBSZXF1aXJlIGFsbCB0aGUgc2hpdFxyXG5yZXF1aXJlICcuL1Zpc3VhbGl6ZXIuY29mZmVlJ1xyXG5yZXF1aXJlICcuLi9qYXZhc2NyaXB0L09yYml0Q29udHJvbHMnXHJcbnJlcXVpcmUgJy4vVmlld2VyLmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnRlcmZhY2UvRGF0R1VJSW50ZXJmYWNlLmNvZmZlZSdcclxuXHJcbmNsYXNzIHdpbmRvdy5NYWluXHJcbiAgIyBDb25zdHJ1Y3QgdGhlIHNjZW5lXHJcbiAgY29uc3RydWN0b3I6IChpc1Zpc3VhbGl6ZXIpIC0+XHJcbiAgICBAc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKVxyXG4gICAgQHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoIHsgYW50aWFsaWFzOiB0cnVlLCBhbHBoYTogZmFsc2UgfSApXHJcbiAgICBAcmVuZGVyZXIuc2V0U2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApXHJcbiAgICBAcmVuZGVyZXIuYXV0b0NsZWFyID0gZmFsc2VcclxuXHJcbiAgICBAY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCA3NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMCApXHJcbiAgICBAY29udHJvbHMgPSBuZXcgVEhSRUUuT3JiaXRDb250cm9scyggQGNhbWVyYSwgQHJlbmRlcmVyLmRvbUVsZW1lbnQgKVxyXG4gICAgQGNvbnRyb2xzLmRhbXBpbmcgPSAwLjJcclxuXHJcbiAgICBjb250cm9sQ2hhbmdlID0gKCkgPT5cclxuICAgICAgQHJlbmRlcigpXHJcblxyXG4gICAgQGNvbnRyb2xzLmFkZEV2ZW50TGlzdGVuZXIoICdjaGFuZ2UnLCBjb250cm9sQ2hhbmdlIClcclxuXHJcbiAgICBAY2FtZXJhLnBvc2l0aW9uLnogPSAtNFxyXG4gICAgQGNvbnRyb2xzLnRhcmdldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCAwLCAwLCAwIClcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Jlc2l6ZScsIEBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UgKVxyXG5cclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoQHJlbmRlcmVyLmRvbUVsZW1lbnQpXHJcblxyXG4gICAgQHZpZXdlciA9IG5ldyBWaWV3ZXIoQHNjZW5lLCBAY2FtZXJhKVxyXG4gICAgaWYgaXNWaXN1YWxpemVyXHJcbiAgICAgIHJvdXRpbmVzQ29udHJvbGxlciA9IG5ldyBSb3V0aW5lc0NvbnRyb2xsZXIoKVxyXG4gICAgICBAdmlzdWFsaXplciA9IG5ldyBWaXN1YWxpemVyKEB2aWV3ZXIsIG5ldyBEYXRHVUlJbnRlcmZhY2Uocm91dGluZXNDb250cm9sbGVyKSwgcm91dGluZXNDb250cm9sbGVyKVxyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIEB2aXN1YWxpemVyLm9uS2V5RG93bi5iaW5kKEB2aXN1YWxpemVyKSwgZmFsc2UpXHJcbiAgICBlbHNlXHJcbiAgICAgIEBkb21haW4gPSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3RcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ21lc3NhZ2UnLCAoZXZlbnQpID0+XHJcbiAgICAgICAgaWYgZXZlbnQub3JpZ2luICE9IEBkb21haW4gdGhlbiByZXR1cm5cclxuICAgICAgICBzZW50T2JqID0gZXZlbnQuZGF0YVxyXG4gICAgICAgIGlmIHNlbnRPYmoudHlwZSA9PSAncmVuZGVyJ1xyXG4gICAgICAgICAgQHZpZXdlci5yZW5kZXIgc2VudE9iai5kYXRhXHJcbiAgICAgICAgaWYgc2VudE9iai50eXBlID09ICdjaG9yZW9ncmFwaHknXHJcbiAgICAgICAgICBAdmlld2VyLnJlY2VpdmVDaG9yZW9ncmFwaHkgc2VudE9iai5kYXRhXHJcblxyXG4gIGFuaW1hdGU6ICgpIC0+XHJcbiAgICBAcmVuZGVyKClcclxuICAgIEBjb250cm9scy51cGRhdGUoKVxyXG5cclxuICByZW5kZXI6ICgpIC0+XHJcbiAgICBAdmlzdWFsaXplcj8ucmVuZGVyKCkgIFxyXG5cclxuICAgIEBzY2VuZS51cGRhdGVNYXRyaXhXb3JsZCgpXHJcbiAgICBAY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKVxyXG4gICAgQHJlbmRlcmVyLmNsZWFyKClcclxuICAgIEByZW5kZXJlci5yZW5kZXIoQHNjZW5lLCBAY2FtZXJhKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIG9uV2luZG93UmVzaXplOiAoKSA9PlxyXG4gICAgQGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodFxyXG4gICAgQGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KClcclxuICAgIEByZW5kZXJlci5zZXRTaXplKCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0IClcclxuXHJcbndpbmRvdy5hbmltYXRlID0gKCkgLT5cclxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUod2luZG93LmFuaW1hdGUpXHJcbiAgd2luZG93LmFwcC5hbmltYXRlKClcclxuXHJcbiQgLT5cclxuICBkYXQuR1VJLnByb3RvdHlwZS5yZW1vdmVGb2xkZXIgPSAobmFtZSkgLT5cclxuICAgIGZvbGRlciA9ICB0aGlzLl9fZm9sZGVyc1tuYW1lXVxyXG4gICAgaWYgIWZvbGRlclxyXG4gICAgICByZXR1cm5cclxuICAgIGZvbGRlci5jbG9zZSgpXHJcbiAgICB0aGlzLl9fdWwucmVtb3ZlQ2hpbGQoZm9sZGVyLmRvbUVsZW1lbnQucGFyZW50Tm9kZSlcclxuICAgIGRlbGV0ZSB0aGlzLl9fZm9sZGVyc1tuYW1lXVxyXG4gICAgdGhpcy5vblJlc2l6ZSgpIiwicmVxdWlyZSAnLi9BdWRpb1dpbmRvdy5jb2ZmZWUnXHJcblxyXG4jIFBsYXlzIHRoZSBhdWRpbyBhbmQgY3JlYXRlcyBhbiBhbmFseXNlclxyXG5jbGFzcyB3aW5kb3cuUGxheWVyXHJcbiAgY29uc3RydWN0b3I6ICgpIC0+XHJcbiAgICBAYXVkaW9XaW5kb3cgPSBuZXcgQXVkaW9XaW5kb3coMSk7XHJcbiAgICBAbG9hZGVkQXVkaW8gPSBuZXcgQXJyYXkoKVxyXG4gICAgQHN0YXJ0T2Zmc2V0ID0gMFxyXG4gICAgQHNldHVwQW5hbHlzZXIoKVxyXG5cclxuICBzZXR1cEFuYWx5c2VyOiAoKSAtPlxyXG4gICAgd2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dFxyXG4gICAgQGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKVxyXG4gICAgQGFuYWx5c2VyID0gQGF1ZGlvQ29udGV4dC5jcmVhdGVBbmFseXNlcigpXHJcbiAgICBAYW5hbHlzZXIuZmZ0U2l6ZSA9IEF1ZGlvV2luZG93LmJ1ZmZlclNpemVcclxuXHJcbiAgdXBkYXRlOiAoKSAtPlxyXG4gICAgQGF1ZGlvV2luZG93LnVwZGF0ZShAYW5hbHlzZXIsIEBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUpXHJcblxyXG4gIHBhdXNlOiAoKSAtPlxyXG4gICAgQHNvdXJjZS5zdG9wKClcclxuICAgIEBwbGF5aW5nID0gZmFsc2VcclxuICAgIEBzdGFydE9mZnNldCArPSBAYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lIC0gQHN0YXJ0VGltZVxyXG5cclxuICBjcmVhdGVMaXZlSW5wdXQ6ICgpIC0+XHJcbiAgICBnb3RTdHJlYW0gPSAoc3RyZWFtKSA9PlxyXG4gICAgICBAcGxheWluZyA9IHRydWVcclxuICAgICAgQHNvdXJjZSA9IEBhdWRpb0NvbnRleHQuY3JlYXRlTWVkaWFTdHJlYW1Tb3VyY2Ugc3RyZWFtXHJcbiAgICAgIEBzb3VyY2UuY29ubmVjdCBAYW5hbHlzZXJcclxuXHJcbiAgICBAZGJTYW1wbGVCdWYgPSBuZXcgVWludDhBcnJheSgyMDQ4KVxyXG5cclxuICAgIGlmICggbmF2aWdhdG9yLmdldFVzZXJNZWRpYSApXHJcbiAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSB9LCBnb3RTdHJlYW0sIChlcnIpIC0+XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyKSlcclxuICAgIGVsc2UgaWYgKG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWEgKVxyXG4gICAgICBuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSwgZ290U3RyZWFtLCAoZXJyKSAtPlxyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycikpXHJcbiAgICBlbHNlIGlmIChuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIClcclxuICAgICAgbmF2aWdhdG9yLm1vekdldFVzZXJNZWRpYSh7IGF1ZGlvOiB0cnVlIH0sIGdvdFN0cmVhbSwgKGVycikgLT5cclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpKVxyXG4gICAgZWxzZVxyXG4gICAgICByZXR1cm4oYWxlcnQoXCJFcnJvcjogZ2V0VXNlck1lZGlhIG5vdCBzdXBwb3J0ZWQhXCIpKTtcclxuXHJcbiAgcGxheTogKHVybCkgLT5cclxuICAgIEBjdXJyZW50bHlQbGF5aW5nID0gdXJsXHJcblxyXG4gICAgaWYgQGxvYWRlZEF1ZGlvW3VybF0/XHJcbiAgICAgIEBsb2FkRnJvbUJ1ZmZlcihAbG9hZGVkQXVkaW9bdXJsXSlcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXHJcbiAgICByZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKVxyXG4gICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInXHJcbiAgICByZXF1ZXN0Lm9ubG9hZCA9ICgpID0+XHJcbiAgICAgIEBhdWRpb0NvbnRleHQuZGVjb2RlQXVkaW9EYXRhIHJlcXVlc3QucmVzcG9uc2VcclxuICAgICAgLCAoYnVmZmVyKSA9PlxyXG4gICAgICAgIEBsb2FkZWRBdWRpb1t1cmxdID0gYnVmZmVyXHJcbiAgICAgICAgQGxvYWRGcm9tQnVmZmVyKGJ1ZmZlcilcclxuICAgICAgLCAoZXJyKSAtPlxyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgcmVxdWVzdC5zZW5kKClcclxuICAgIHJldHVyblxyXG5cclxuICBsb2FkRnJvbUJ1ZmZlcjogKGJ1ZmZlcikgLT5cclxuICAgIEBzdGFydFRpbWUgPSBAYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lXHJcbiAgICBAc291cmNlID0gQGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKVxyXG4gICAgQHNvdXJjZS5idWZmZXIgPSBidWZmZXJcclxuICAgIEBzb3VyY2UuY29ubmVjdChAYW5hbHlzZXIpXHJcbiAgICBAc291cmNlLmNvbm5lY3QoQGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbilcclxuICAgIEBwbGF5aW5nID0gdHJ1ZVxyXG4gICAgQHNvdXJjZS5zdGFydCgwLCBAc3RhcnRPZmZzZXQpXHJcblxyXG4gIHBhdXNlOiAoKSAtPlxyXG4gICAgaWYgQHBsYXllci5wbGF5aW5nIHRoZW4gQHBhdXNlKCkgZWxzZSBAcGxheShAY3VycmVudGx5UGxheWluZykiLCJyZXF1aXJlICcuL1JvdXRpbmVzU2VydmljZS5jb2ZmZWUnXHJcblxyXG5jbGFzcyB3aW5kb3cuUm91dGluZXNDb250cm9sbGVyXHJcbiAgY29uc3RydWN0b3I6ICgpIC0+XHJcbiAgICBAcm91dGluZXMgPSBbXVxyXG4gICAgQHJvdXRpbmVzU2VydmljZSA9IG5ldyBSb3V0aW5lc1NlcnZpY2UoKVxyXG5cclxuICBnZXRSb3V0aW5lOiAoaWQsIG5leHQpIC0+XHJcbiAgICAjIGxvYWQgZnJvbSBzZXJ2aWNlIG9yIGZyb20gQHJvdXRpbmVzXHJcbiAgICBpZiBAcm91dGluZXNbaWRdPy5kYXRhICE9IFwiXCJcclxuICAgICAgbmV4dCBAcm91dGluZXNbaWRdXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIEByb3V0aW5lc1NlcnZpY2UuZ2V0Um91dGluZSBpZCwgKHJvdXRpbmUpID0+XHJcbiAgICAgIGlmICFAcm91dGluZXNbaWRdP1xyXG4gICAgICAgIEByb3V0aW5lc1tpZF0gPSByb3V0aW5lXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBAcm91dGluZXNbaWRdLmRhdGEgPSBKU09OLnBhcnNlKHJvdXRpbmUuZGF0YSlcclxuXHJcbiAgICAgIG5leHQoQHJvdXRpbmVzW2lkXSlcclxuXHJcbiAgcmVmcmVzaFJvdXRpbmVzOiAobmV4dCkgLT5cclxuICAgICMgZ2V0IHJvdXRpbmVzIGZyb20gc2VydmVyIGFuZCBjYWNoZSBzYW5zIGRhdGFcclxuICAgIEByb3V0aW5lc1NlcnZpY2UuZ2V0Um91dGluZXMgKGRhdGEpID0+XHJcbiAgICAgIGZvciByb3V0aW5lIGluIGRhdGFcclxuICAgICAgICBpZiBAcm91dGluZXNbcm91dGluZS5pZF0/XHJcbiAgICAgICAgICBAcm91dGluZXNbcm91dGluZS5pZF0gPSByb3V0aW5lLm5hbWVcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBAcm91dGluZXNbcm91dGluZS5pZF0gPSByb3V0aW5lXHJcblxyXG4gICAgICBpZiBuZXh0PyB0aGVuIG5leHQoQHJvdXRpbmVzKVxyXG5cclxuICBwdXNoUm91dGluZTogKG5hbWUsIGRhdGEsIG5leHQpIC0+XHJcbiAgICByb3V0aW5lID1cclxuICAgICAgbmFtZTogbmFtZVxyXG4gICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSBkYXRhXHJcbiAgICBAcm91dGluZXNTZXJ2aWNlLmNyZWF0ZVJvdXRpbmUgcm91dGluZSwgKCkgPT5cclxuICAgICAgQHJlZnJlc2hSb3V0aW5lcygpXHJcbiAgICAgIG5leHQoKSIsImNsYXNzIHdpbmRvdy5Sb3V0aW5lc1NlcnZpY2VcclxuICBAc2VydmVyID0gXCJodHRwOi8vdmlzdWFsaXplci51cG9wcGxlLmNvbS9cIlxyXG5cclxuICBnZXRSb3V0aW5lczogKG5leHQpIC0+XHJcbiAgICAjIGdldCByb3V0aW5lc1xyXG4gICAgJC5hamF4XHJcbiAgICAgIHVybDogQGNvbnN0cnVjdG9yLnNlcnZlciArICdyb3V0aW5lcydcclxuICAgICAgdHlwZTogXCJHRVRcIlxyXG4gICAgICBzdWNjZXNzOiAoZGF0YSkgLT5cclxuICAgICAgICBuZXh0KGRhdGEpXHJcblxyXG4gIGdldFJvdXRpbmU6IChpZCwgbmV4dCkgLT5cclxuICAgICMgZ2V0IHJvdXRpbmUgZnJvbSBmcm9tIHNlcnZlclxyXG4gICAgJC5hamF4XHJcbiAgICAgIHVybDogQGNvbnN0cnVjdG9yLnNlcnZlciArICdyb3V0aW5lcy8nICsgaWRcclxuICAgICAgdHlwZTogXCJHRVRcIlxyXG4gICAgICBzdWNjZXNzOiAoZGF0YSkgLT5cclxuICAgICAgICBuZXh0KGRhdGEpXHJcblxyXG5cclxuICBjcmVhdGVSb3V0aW5lOiAoZGF0YSwgbmV4dCkgLT5cclxuICAgICMgcG9zdCBkYXRhIHRvIHNlcnZlclxyXG4gICAgJC5hamF4XHJcbiAgICAgIHVybDogQGNvbnN0cnVjdG9yLnNlcnZlciArICdyb3V0aW5lcydcclxuICAgICAgdHlwZTogJ1BPU1QnXHJcbiAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5IGRhdGFcclxuICAgICAgc3VjY2VzczogKGRhdGEpIC0+XHJcbiAgICAgICAgbmV4dCgpIiwiY2xhc3Mgd2luZG93LlNoYWRlckxvYWRlclxyXG4gICMgQ29uc3RydWN0IHRoZSBzaGFkZXIgY2FjaGVcclxuICBjb25zdHJ1Y3RvcjogKCkgLT5cclxuICAgIEBzaGFkZXJzID0gbmV3IEFycmF5KClcclxuXHJcbiAgIyBUYWtlcyBhIG5hbWUgYW5kIGEgY2FsbGJhY2ssIGxvYWRzIHRoYXQgc2hhZGVyIGZyb20gL3NoYWRlcnMsIGNhY2hlcyB0aGUgcmVzdWx0XHJcbiAgbG9hZDogKG5hbWUsIG5leHQpIC0+XHJcbiAgICBpZiBAc2hhZGVyc1tuYW1lXT9cclxuICAgICAgbmV4dChAc2hhZGVyc1tuYW1lXSlcclxuICAgIGVsc2VcclxuICAgICAgQHNoYWRlcnNbbmFtZV0gPSB7dmVydGV4U2hhZGVyOiAnJywgZnJhZ21lbnRTaGFkZXI6ICcnfVxyXG4gICAgICBAbG9hZEZyb21VcmwobmFtZSwgJ3NoYWRlcnMvJyArIG5hbWUsIG5leHQpXHJcblxyXG4gICMgTG9hZHMgdGhlIHNoYWRlcmZyb20gYSBVUkxcclxuICBsb2FkRnJvbVVybDogKG5hbWUsIHVybCwgbmV4dCkgLT5cclxuXHJcbiAgICBsb2FkZWRTaGFkZXIgPSAoanFYSFIsIHRleHRTdGF0dXMpIC0+XHJcbiAgICAgIEBzaGFkZXJzW0BuYW1lXVtAdHlwZV0gPSBqcVhIUi5yZXNwb25zZVRleHRcclxuICAgICAgaWYgKEBzaGFkZXJzW0BuYW1lXS52ZXJ0ZXhTaGFkZXI/ICYmIEBzaGFkZXJzW0BuYW1lXS5mcmFnbWVudFNoYWRlcilcclxuICAgICAgICBuZXh0KEBzaGFkZXJzW0BuYW1lXSlcclxuXHJcbiAgICAkLmFqYXhcclxuICAgICAgdXJsOiB1cmwgKyAnLnZlcnQnXHJcbiAgICAgIGRhdGFUeXBlOiAndGV4dCdcclxuICAgICAgY29udGV4dDoge1xyXG4gICAgICAgIG5hbWU6IG5hbWVcclxuICAgICAgICB0eXBlOiAndmVydGV4U2hhZGVyJ1xyXG4gICAgICAgIG5leHQ6IG5leHRcclxuICAgICAgICBzaGFkZXJzOiBAc2hhZGVyc1xyXG4gICAgICB9XHJcbiAgICAgIGNvbXBsZXRlOiBsb2FkZWRTaGFkZXIgXHJcblxyXG4gICAgJC5hamF4XHJcbiAgICAgIHVybDogdXJsICsgJy5mcmFnJ1xyXG4gICAgICBkYXRhVHlwZTogJ3RleHQnXHJcbiAgICAgIGNvbnRleHQ6IHtcclxuICAgICAgICBuYW1lOiBuYW1lXHJcbiAgICAgICAgdHlwZTogJ2ZyYWdtZW50U2hhZGVyJ1xyXG4gICAgICAgIG5leHQ6IG5leHRcclxuICAgICAgICBzaGFkZXJzOiBAc2hhZGVyc1xyXG4gICAgICB9XHJcbiAgICAgIGNvbXBsZXRlOiBsb2FkZWRTaGFkZXIgXHJcblxyXG4gICAgcmV0dXJuIiwicmVxdWlyZSAnLi9TaGFkZXJMb2FkZXIuY29mZmVlJ1xyXG5yZXF1aXJlICcuLi9qYXZhc2NyaXB0L1F1ZXVlLmpzJ1xyXG5cclxuY2xhc3Mgd2luZG93LlZpZXdlclxyXG4gIGNvbnN0cnVjdG9yOiAoc2NlbmUsIGNhbWVyYSkgLT5cclxuICAgIEBzY2VuZSA9IHNjZW5lXHJcbiAgICBAZGFuY2VycyA9IG5ldyBBcnJheSgpXHJcbiAgICBAc2hhZGVyTG9hZGVyID0gbmV3IFNoYWRlckxvYWRlcigpXHJcblxyXG4gICAgQGNob3Jlb2dyYXBoeVF1ZXVlID0gbmV3IFF1ZXVlKClcclxuXHJcbiAgcmVjZWl2ZUNob3Jlb2dyYXBoeTogKG1vdmUpIC0+XHJcbiAgICBAY2hvcmVvZ3JhcGh5UXVldWUucHVzaChtb3ZlKVxyXG5cclxuICBleGVjdXRlQ2hvcmVvZ3JhcGh5OiAoe2lkLCBkYW5jZXIsIGRhbmNlLCBkYW5jZU1hdGVyaWFsIH0pIC0+XHJcbiAgICBpZiBpZCA9PSAtMVxyXG4gICAgICBmb3IgZGFuY2VyIGluIEBkYW5jZXJzXHJcbiAgICAgICAgQHNjZW5lLnJlbW92ZShkYW5jZXIuYm9keSlcclxuICAgICAgQGRhbmNlcnMgPSBbXVxyXG4gICAgICByZXR1cm5cclxuICAgIGlmIEBkYW5jZXJzW2lkXT9cclxuICAgICAgIyBUZXN0IGV2ZXJ5dGhpbmcgZWxzZVxyXG4gICAgICBjdXJyZW50RGFuY2VyID0gQGRhbmNlcnNbaWRdXHJcblxyXG4gICAgICAjIElmIG5vIHBhcmFtZXRlcnMgYXJlIHNldCwgYnV0IGFuIGlkIGlzLCB0aGVuIHJlbW92ZSB0aGUgb2JqZWN0XHJcbiAgICAgIGlmICFkYW5jZXI/ICYmICFkYW5jZSAmJiAhZGFuY2VNYXRlcmlhbFxyXG4gICAgICAgIEBzY2VuZS5yZW1vdmUoY3VycmVudERhbmNlci5ib2R5KVxyXG4gICAgICAgIEBkYW5jZXJzLnNwbGljZShAZGFuY2Vycy5pbmRleE9mKGlkKSwgMSlcclxuXHJcbiAgICAgIGlmIGRhbmNlPyBcclxuICAgICAgICBpZiAhZGFuY2VyPyAmJiAhZGFuY2VNYXRlcmlhbD9cclxuICAgICAgICAgIGN1cnJlbnREYW5jZXIucmVzZXQoKVxyXG4gICAgICAgICAgY3VycmVudERhbmNlci5kYW5jZSA9IG5ldyBWaXN1YWxpemVyLmRhbmNlVHlwZXNbZGFuY2UudHlwZV0oZGFuY2UucGFyYW1zKVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgbmV3RGFuY2UgPSBuZXcgVmlzdWFsaXplci5kYW5jZVR5cGVzW2RhbmNlLnR5cGVdKGRhbmNlLnBhcmFtcylcclxuICAgICAgZWxzZVxyXG4gICAgICAgIG5ld0RhbmNlID0gY3VycmVudERhbmNlci5kYW5jZVxyXG5cclxuICAgICAgYWRkRGFuY2VyID0gKG5ld0RhbmNlLCBuZXdNYXRlcmlhbCkgPT5cclxuICAgICAgICBpZiBkYW5jZXI/XHJcbiAgICAgICAgICBuZXdEYW5jZXIgPSBuZXcgVmlzdWFsaXplci5kYW5jZXJUeXBlc1tkYW5jZXIudHlwZV0obmV3RGFuY2UsIG5ld01hdGVyaWFsLCBkYW5jZXIucGFyYW1zKVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIG5ld0RhbmNlciA9IG5ldyBjdXJyZW50RGFuY2VyLmNvbnN0cnVjdG9yKG5ld0RhbmNlLCBuZXdNYXRlcmlhbClcclxuXHJcbiAgICAgICAgY3VycmVudERhbmNlci5yZXNldCgpXHJcbiAgICAgICAgQHNjZW5lLnJlbW92ZShjdXJyZW50RGFuY2VyLmJvZHkpXHJcbiAgICAgICAgQGRhbmNlcnNbaWRdID0gbmV3RGFuY2VyXHJcbiAgICAgICAgQHNjZW5lLmFkZChuZXdEYW5jZXIuYm9keSlcclxuXHJcbiAgICAgIGlmIGRhbmNlTWF0ZXJpYWw/XHJcbiAgICAgICAgIyBTcGVjaWFsIGNhc2UgZm9yIHNoYWRlcnMgYmVjYXVzZSBpdCBoYXMgdG8gbG9hZCB0aGUgc2hhZGVyIGZpbGVcclxuICAgICAgICAjIFRoaXMgaXMgYSByZWFsbHkgaGFja3kgd2F5IG9mIGNoZWNraW5nIGlmIGl0J3MgYSBzaGFkZXIuIFNob3VsZCBjaGFuZ2UuXHJcbiAgICAgICAgaWYgZGFuY2VNYXRlcmlhbC50eXBlLmluZGV4T2YoJ1NoYWRlcicpID4gLTFcclxuICAgICAgICAgIG5ld01hdGVyaWFsID0gbmV3IFZpc3VhbGl6ZXIuZGFuY2VNYXRlcmlhbFR5cGVzW2RhbmNlTWF0ZXJpYWwudHlwZV0oQHNoYWRlckxvYWRlcilcclxuICAgICAgICAgIG5ld01hdGVyaWFsLmxvYWRTaGFkZXIgKHNoYWRlck1hdGVyaWFsKSA9PlxyXG4gICAgICAgICAgICBhZGREYW5jZXIgbmV3RGFuY2UsIHNoYWRlck1hdGVyaWFsXHJcbiAgICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgICAgbmV3TWF0ZXJpYWwgPSBuZXcgVmlzdWFsaXplci5kYW5jZU1hdGVyaWFsVHlwZXNbZGFuY2VNYXRlcmlhbC50eXBlXShkYW5jZU1hdGVyaWFsLnBhcmFtcylcclxuICAgICAgZWxzZVxyXG4gICAgICAgIG5ld01hdGVyaWFsID0gY3VycmVudERhbmNlci5kYW5jZU1hdGVyaWFsXHJcblxyXG4gICAgICBhZGREYW5jZXIobmV3RGFuY2UsIG5ld01hdGVyaWFsKVxyXG5cclxuICAgICAgcmV0dXJuXHJcbiAgICBlbHNlIGlmIGlkP1xyXG4gICAgICBAZGFuY2Vyc1tpZF0gPSBuZXcgVmlzdWFsaXplci5kYW5jZXJUeXBlc1tkYW5jZXIudHlwZV0obmV3IFZpc3VhbGl6ZXIuZGFuY2VUeXBlc1tkYW5jZS50eXBlXShkYW5jZS5wYXJhbXMpLCBuZXcgVmlzdWFsaXplci5kYW5jZU1hdGVyaWFsVHlwZXNbZGFuY2VNYXRlcmlhbC50eXBlXShkYW5jZU1hdGVyaWFsLnBhcmFtcyksIGRhbmNlci5wYXJhbXMpXHJcbiAgICAgIEBzY2VuZS5hZGQgQGRhbmNlcnNbaWRdLmJvZHlcclxuICAgICAgcmV0dXJuXHJcbiAgICBlbHNlXHJcbiAgICAgIHJldHVyblxyXG5cclxuICBnZXREYW5jZXI6IChpZCkgLT5cclxuICAgIEBkYW5jZXJzW2lkXVxyXG5cclxuXHJcbiAgIyBSZW5kZXIgdGhlIHNjZW5lIGJ5IGdvaW5nIHRocm91Z2ggdGhlIEF1ZGlvT2JqZWN0IGFycmF5IGFuZCBjYWxsaW5nIHVwZGF0ZShhdWRpb0V2ZW50KSBvbiBlYWNoIG9uZVxyXG4gIHJlbmRlcjogKGF1ZGlvV2luZG93KSAtPlxyXG4gICAgd2hpbGUgQGNob3Jlb2dyYXBoeVF1ZXVlLmxlbmd0aCgpID4gMFxyXG4gICAgICBAZXhlY3V0ZUNob3Jlb2dyYXBoeSBAY2hvcmVvZ3JhcGh5UXVldWUuc2hpZnQoKVxyXG4gICAgIyBDcmVhdGUgZXZlbnRcclxuICAgIGZvciBpZCBpbiBPYmplY3Qua2V5cyhAZGFuY2VycylcclxuICAgICAgQGRhbmNlcnNbaWRdLnVwZGF0ZShhdWRpb1dpbmRvdylcclxuXHJcbiAgIyBSZW1vdmVzIHRoZSBsYXN0IGRhbmNlciwgcmV0dXJucyB0aGUgZGFuY2VyJ3MgZGFuY2VcclxuICByZW1vdmVMYXN0RGFuY2VyOiAoKSAtPlxyXG4gICAgcHJldkRhbmNlciA9IEBkYW5jZXJzLnBvcCgpXHJcbiAgICBAc2NlbmUucmVtb3ZlKHByZXZEYW5jZXIuYm9keSkgXHJcbiAgICByZXR1cm4gcHJldkRhbmNlci5kYW5jZSIsInJlcXVpcmUgJy4vUGxheWVyLmNvZmZlZSdcclxucmVxdWlyZSAnLi9DaG9yZW9ncmFwaHlSb3V0aW5lLmNvZmZlZSdcclxucmVxdWlyZSAnLi9kYW5jZXJzL0N1YmVEYW5jZXIuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2RhbmNlcnMvU3BoZXJlRGFuY2VyLmNvZmZlZSdcclxucmVxdWlyZSAnLi9kYW5jZXJzL1BvaW50Q2xvdWREYW5jZXIuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2RhbmNlcy9TY2FsZURhbmNlLmNvZmZlZSdcclxucmVxdWlyZSAnLi9kYW5jZXMvUG9zaXRpb25EYW5jZS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZGFuY2VzL1JvdGF0ZURhbmNlLmNvZmZlZSdcclxucmVxdWlyZSAnLi9kYW5jZU1hdGVyaWFscy9Db2xvckRhbmNlTWF0ZXJpYWwuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2RhbmNlTWF0ZXJpYWxzL1NpbXBsZUZyZXF1ZW5jeVNoYWRlci5jb2ZmZWUnXHJcblxyXG5jbGFzcyB3aW5kb3cuVmlzdWFsaXplclxyXG4gICMgR2V0IHRob3NlIGtleXMgc2V0IHVwXHJcbiAga2V5czogeyBQQVVTRTogMzIsIE5FWFQ6IDc4IH1cclxuXHJcbiAgIyBTZXQgdXAgdGhlIHNjZW5lIGJhc2VkIG9uIGEgTWFpbiBvYmplY3Qgd2hpY2ggY29udGFpbnMgdGhlIHNjZW5lLlxyXG4gIGNvbnN0cnVjdG9yOiAoQHZpZXdlciwgQGludGVyZmFjZSwgQHJvdXRpbmVzQ29udHJvbGxlcikgLT5cclxuICAgIEBwbGF5ZXIgPSBuZXcgUGxheWVyKClcclxuXHJcbiAgICAjIExvYWQgdGhlIHNhbXBsZSBhdWRpb1xyXG4gICAgIyBAcGxheSgnYXVkaW8vR28ubXAzJylcclxuICAgICMgQHBsYXkoJ2F1ZGlvL0dsYXNzZXIubXAzJylcclxuICAgICMgQHBsYXkoJ2F1ZGlvL09uTXlNaW5kLm1wMycpXHJcblxyXG4gICAgQHBsYXllci5jcmVhdGVMaXZlSW5wdXQoKVxyXG5cclxuICAgIEBjaG9yZW9ncmFwaHlSb3V0aW5lID0gbmV3IENob3Jlb2dyYXBoeVJvdXRpbmUoQClcclxuXHJcbiAgICBAaW50ZXJmYWNlLnNldHVwKEBwbGF5ZXIsIEBjaG9yZW9ncmFwaHlSb3V0aW5lLCBAdmlld2VyKVxyXG5cclxuICAgIEBjaG9yZW9ncmFwaHlSb3V0aW5lLnBsYXlOZXh0KClcclxuXHJcbiAgcmVjZWl2ZUNob3Jlb2dyYXBoeTogKG1vdmUpIC0+XHJcbiAgICBAdmlld2VyLnJlY2VpdmVDaG9yZW9ncmFwaHkgbW92ZVxyXG4gICAgaWYgQHBvcHVwPyB0aGVuIEBwb3B1cC5wb3N0TWVzc2FnZShAd3JhcE1lc3NhZ2UoJ2Nob3Jlb2dyYXBoeScsIG1vdmUpLCBAZG9tYWluKVxyXG5cclxuICByZW5kZXI6ICgpIC0+XHJcbiAgICBpZiAhQHBsYXllci5wbGF5aW5nXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIEBwbGF5ZXIudXBkYXRlKClcclxuXHJcbiAgICBAdmlld2VyLnJlbmRlcihAcGxheWVyLmF1ZGlvV2luZG93KVxyXG4gICAgaWYgQHBvcHVwPyB0aGVuIEBwb3B1cC5wb3N0TWVzc2FnZShAd3JhcE1lc3NhZ2UoJ3JlbmRlcicsIEBwbGF5ZXIuYXVkaW9XaW5kb3cpLCBAZG9tYWluKVxyXG5cclxuICB3cmFwTWVzc2FnZTogKHR5cGUsIGRhdGEpIC0+XHJcbiAgICB0eXBlOiB0eXBlXHJcbiAgICBkYXRhOiBkYXRhXHJcblxyXG4gICNFdmVudCBtZXRob2RzXHJcbiAgb25LZXlEb3duOiAoZXZlbnQpIC0+XHJcbiAgICBzd2l0Y2ggZXZlbnQua2V5Q29kZVxyXG4gICAgICB3aGVuIEBrZXlzLlBBVVNFXHJcbiAgICAgICAgQHBsYXllci5wYXVzZSgpXHJcbiAgICAgIHdoZW4gQGtleXMuTkVYVFxyXG4gICAgICAgIEBjaG9yZW9ncmFwaHlSb3V0aW5lLnBsYXlOZXh0KClcclxuXHJcbiAgQGRhbmNlclR5cGVzOlxyXG4gICAgQ3ViZURhbmNlcjogQ3ViZURhbmNlclxyXG4gICAgU3BoZXJlRGFuY2VyOiBTcGhlcmVEYW5jZXJcclxuICAgIFBvaW50Q2xvdWREYW5jZXI6IFBvaW50Q2xvdWREYW5jZXJcclxuXHJcbiAgQGRhbmNlVHlwZXM6XHJcbiAgICBTY2FsZURhbmNlOiBTY2FsZURhbmNlXHJcbiAgICBQb3NpdGlvbkRhbmNlOiBQb3NpdGlvbkRhbmNlXHJcbiAgICBSb3RhdGVEYW5jZTogUm90YXRlRGFuY2VcclxuXHJcbiAgQGRhbmNlTWF0ZXJpYWxUeXBlczpcclxuICAgIENvbG9yRGFuY2VNYXRlcmlhbDogQ29sb3JEYW5jZU1hdGVyaWFsXHJcbiAgICBTaW1wbGVGcmVxdWVuY3lTaGFkZXI6IFNpbXBsZUZyZXF1ZW5jeVNoYWRlclxyXG4iLCJjbGFzcyB3aW5kb3cuQ29sb3JEYW5jZU1hdGVyaWFsXHJcbiAgQHBhcmFtczogXHJcbiAgICBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnc21vb3RoaW5nRmFjdG9yJyxcclxuICAgICAgICBkZWZhdWx0OiAwLjVcclxuICAgICAgfSwgXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnbWluTCcsXHJcbiAgICAgICAgZGVmYXVsdDogMC4xXHJcbiAgICAgIH0sIFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ21pblMnLFxyXG4gICAgICAgIGRlZmF1bHQ6IDAuM1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ3dpcmVmcmFtZSdcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICBdXHJcblxyXG4gIEBuYW1lOiBcIkNvbG9yRGFuY2VNYXRlcmlhbFwiXHJcblxyXG4gIGNvbnN0cnVjdG9yOiAoQG9wdGlvbnMpIC0+XHJcbiAgICBpZiBAb3B0aW9ucz8gdGhlbiB7IEBzbW9vdGhpbmdGYWN0b3IsIEBtaW5MLCBAbWluUywgQHdpcmVmcmFtZSB9ID0gQG9wdGlvbnNcclxuICAgIEBzbW9vdGhpbmdGYWN0b3IgPz0gMC41XHJcbiAgICBAbWluTCA/PSAwLjFcclxuICAgIEBtaW5TID89IDAuM1xyXG4gICAgQHdpcmVmcmFtZSA/PSBmYWxzZVxyXG4gICAgQGNvbG9yID0gbmV3IFRIUkVFLkNvbG9yKDEuMCwgMCwgMClcclxuICAgIEBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHsgY29sb3I6IDB4MDAwMDAsIHdpcmVmcmFtZTogQHdpcmVmcmFtZSB9KVxyXG4gICAgQGFwcGxpZWRDb2xvciA9IEBjb2xvci5jbG9uZSgpXHJcblxyXG4gIHVwZGF0ZTogKGF1ZGlvV2luZG93LCBkYW5jZXIpIC0+XHJcblxyXG4gICAgbWF4VmFsdWUgPSAwXHJcbiAgICBtYXhJbmRleCA9IC0xXHJcbiAgICBtYXhJbXBvcnRhbnRJbmRleCA9IDFcclxuICAgIGZvciBpIGluIFsxLi5BdWRpb1dpbmRvdy5idWZmZXJTaXplXVxyXG4gICAgICBmcmVxID0gYXVkaW9XaW5kb3cuZnJlcXVlbmN5QnVmZmVyW2ldXHJcbiAgICAgIHZhbHVlID0gZnJlcSAqIGlcclxuICAgICAgaWYgKHZhbHVlID4gbWF4VmFsdWUpXHJcbiAgICAgICAgbWF4VmFsdWUgPSB2YWx1ZVxyXG4gICAgICAgIG1heEluZGV4ID0gaVxyXG5cclxuICAgIG9sZENvbG9ySFNMID0gQGFwcGxpZWRDb2xvci5nZXRIU0woKVxyXG5cclxuICAgIG5ld0NvbG9yUyA9IG1heEluZGV4IC8gQXVkaW9XaW5kb3cuYnVmZmVyU2l6ZTtcclxuICAgIG5ld0NvbG9yUyA9IEBzbW9vdGhpbmdGYWN0b3IgKiBuZXdDb2xvclMgKyAoMSAtIEBzbW9vdGhpbmdGYWN0b3IpICogb2xkQ29sb3JIU0wuc1xyXG5cclxuICAgIG5ld0NvbG9yTCA9IGF1ZGlvV2luZG93LmF2ZXJhZ2VEYlxyXG4gICAgbmV3Q29sb3JMID0gQHNtb290aGluZ0ZhY3RvciAqIG5ld0NvbG9yTCArICgxIC0gQHNtb290aGluZ0ZhY3RvcikgKiBvbGRDb2xvckhTTC5sXHJcblxyXG4gICAgbCA9IEBtaW5MICsgbmV3Q29sb3JMICogKDEuMCAtIEBtaW5MKVxyXG4gICAgcyA9IEBtaW5TICsgbmV3Q29sb3JTICogKDEuMCAtIEBtaW5TKVxyXG5cclxuICAgIG5ld0NvbG9ySCA9ICgzNjAgKiAoYXVkaW9XaW5kb3cudGltZSAvIDEwMDAwKSAlIDM2MCkgLyAzNjBcclxuXHJcbiAgICBoc2wgPSBAY29sb3IuZ2V0SFNMKClcclxuICAgIEBhcHBsaWVkQ29sb3Iuc2V0SFNMKG5ld0NvbG9ySCwgcywgbClcclxuXHJcbiAgICBpZiBkYW5jZXI/XHJcbiAgICAgIGlmIGRhbmNlci5ib2R5Lm1hdGVyaWFsLmVtaXNzaXZlP1xyXG4gICAgICAgIGRhbmNlci5ib2R5Lm1hdGVyaWFsLmVtaXNzaXZlLmNvcHkoQGFwcGxpZWRDb2xvcilcclxuXHJcbiAgICAgIGRhbmNlci5ib2R5Lm1hdGVyaWFsLmNvbG9yLmNvcHkoQGFwcGxpZWRDb2xvcilcclxuIiwiY2xhc3Mgd2luZG93LlNpbXBsZUZyZXF1ZW5jeVNoYWRlclxyXG4gIEBwYXJhbXM6IFtdXHJcblxyXG4gIEBuYW1lOiBcIlNpbXBsZUZyZXF1ZW5jeVNoYWRlclwiXHJcbiAgXHJcbiAgY29uc3RydWN0b3I6IChzaGFkZXJMb2FkZXIpIC0+XHJcbiAgICBAdGFyZ2V0ID0gMTI4XHJcbiAgICBAc2l6ZSA9IDEwMjRcclxuICAgIEBzaGFkZXJMb2FkZXIgPSBzaGFkZXJMb2FkZXJcclxuICAgIEBuZXdUZXhBcnJheSA9IG5ldyBVaW50OEFycmF5KEB0YXJnZXQgKiBAdGFyZ2V0ICogNClcclxuXHJcbiAgbG9hZFNoYWRlcjogKG5leHQpIC0+XHJcbiAgICBAc2hhZGVyTG9hZGVyLmxvYWQgJ3NpbXBsZV9mcmVxdWVuY3knLCAoc2hhZGVyKSA9PlxyXG4gICAgICBzaGFkZXIudW5pZm9ybXMgPSB7XHJcbiAgICAgICAgZnJlcVRleHR1cmU6IHt0eXBlOiBcInRcIiwgdmFsdWU6IEF1ZGlvV2luZG93LmJ1ZmZlclNpemV9XHJcbiAgICAgICAgcmVzb2x1dGlvbjogeyB0eXBlOiBcInYyXCIsIHZhbHVlOiBuZXcgVEhSRUUuVmVjdG9yMigxMjgsIDEyOCl9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIEBtYXRlcmlhbCA9IG5ldyBUSFJFRS5TaGFkZXJNYXRlcmlhbChzaGFkZXIpXHJcbiAgICAgIEBtYXRlcmlhbC5zaWRlID0gVEhSRUUuRG91YmxlU2lkZVxyXG4gICAgICBAbWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlXHJcbiAgICAgIG5leHQoQClcclxuXHJcblxyXG4gIHVwZGF0ZTogKGF1ZGlvV2luZG93LCBkYW5jZXIpIC0+XHJcbiAgICBkYW5jZXIuYm9keS5tYXRlcmlhbC51bmlmb3Jtcy5mcmVxVGV4dHVyZS52YWx1ZSA9IEByZWR1Y2VBcnJheShhdWRpb1dpbmRvdy5mcmVxdWVuY3lCdWZmZXIpXHJcblxyXG4gIHJlZHVjZUFycmF5OiAoZnJlcUJ1ZikgLT5cclxuXHJcbiAgICBuZXdCdWYgPSBuZXcgQXJyYXkoQHRhcmdldClcclxuXHJcbiAgICBtb3ZpbmdTdW0gPSAwXHJcbiAgICBmbG9vcmVkUmF0aW8gPSBNYXRoLmZsb29yKEBzaXplIC8gQHRhcmdldClcclxuICAgIGZvciBpIGluIFsxLi4uQHNpemVdXHJcbiAgICAgIG1vdmluZ1N1bSArPSBmcmVxQnVmW2ldXHJcblxyXG4gICAgICBpZiAoKGkgKyAxKSAlIGZsb29yZWRSYXRpbykgPT0gMFxyXG4gICAgICAgIG5ld0J1ZltNYXRoLmZsb29yKGkgIC8gZmxvb3JlZFJhdGlvKV0gPSBtb3ZpbmdTdW0gLyBmbG9vcmVkUmF0aW9cclxuICAgICAgICBtb3ZpbmdTdW0gPSAwXHJcblxyXG5cclxuICAgIGZvciBpIGluIFswLi4uQHRhcmdldF1cclxuICAgICAgZm9yIGogaW4gWzAuLi5AdGFyZ2V0XVxyXG4gICAgICAgIGJhc2VJbmRleCA9IGkgKiBAdGFyZ2V0ICogNCArIGogKiA0O1xyXG4gICAgICAgIGlmIG5ld0J1ZltqXSA+IGkgKiAyXHJcbiAgICAgICAgICBAbmV3VGV4QXJyYXlbYmFzZUluZGV4XSA9IDI1NVxyXG4gICAgICAgICAgQG5ld1RleEFycmF5W2Jhc2VJbmRleCArIDFdID0gMjU1XHJcbiAgICAgICAgICBAbmV3VGV4QXJyYXlbYmFzZUluZGV4ICsgMl0gPSAyNTVcclxuICAgICAgICAgIEBuZXdUZXhBcnJheVtiYXNlSW5kZXggKyAzXSA9IDI1NVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAgICBAbmV3VGV4QXJyYXlbYmFzZUluZGV4XSA9IDBcclxuICAgICAgICAgIEBuZXdUZXhBcnJheVtiYXNlSW5kZXggKyAxXSA9IDBcclxuICAgICAgICAgIEBuZXdUZXhBcnJheVtiYXNlSW5kZXggKyAyXSA9IDBcclxuICAgICAgICAgIEBuZXdUZXhBcnJheVtiYXNlSW5kZXggKyAzXSA9IDBcclxuXHJcbiAgICB0ZXh0dXJlID0gbmV3IFRIUkVFLkRhdGFUZXh0dXJlKEBuZXdUZXhBcnJheSwgQHRhcmdldCwgQHRhcmdldCwgVEhSRUUuUkdCQUZvcm1hdCwgVEhSRUUuVW5zaWduZWRCeXRlKVxyXG4gICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWVcclxuICAgIHRleHR1cmUuZmxpcFkgPSBmYWxzZVxyXG4gICAgdGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgPSBmYWxzZVxyXG4gICAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5MaW5lYXJGaWx0ZXJcclxuICAgIHRleHR1cmUubWluRmlsdGVyID0gVEhSRUUuTGluZWFyRmlsdGVyXHJcbiAgICB0ZXh0dXJlLnVucGFja0FsaWdubWVudCA9IDFcclxuICAgIHRleHR1cmUud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZ1xyXG4gICAgdGV4dHVyZS53cmFwVCA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nXHJcbiAgICB0ZXh0dXJlLmFuaXNvdHJvcHkgPSA0XHJcblxyXG4gICAgcmV0dXJuIHRleHR1cmUiLCJyZXF1aXJlICcuL0RhbmNlci5jb2ZmZWUnXHJcblxyXG5jbGFzcyB3aW5kb3cuQ3ViZURhbmNlciBleHRlbmRzIERhbmNlclxyXG4gIEBuYW1lOiBcIkN1YmVEYW5jZXJcIlxyXG4gIFxyXG4gIGNvbnN0cnVjdG9yOiAoZGFuY2UsIGRhbmNlTWF0ZXJpYWwsIEBvcHRpb25zKSAtPlxyXG4gICAgaWYgQG9wdGlvbnM/IHRoZW4geyBwb3NpdGlvbiwgc2NhbGUgfSA9IEBvcHRpb25zXHJcbiAgICBzdXBlcihuZXcgVEhSRUUuQm94R2VvbWV0cnkoMSwgMSwgMSksIGRhbmNlLCBkYW5jZU1hdGVyaWFsLCBwb3NpdGlvbiwgc2NhbGUpIiwiIyBDb250YWlucyBhbiBPYmplY3QzRCBvZiBzb21lIGtpbmQsIHdpdGggYSBtZXNoIGRldGVybWluZWQgYnkgc3ViY2xhc3Nlcy5cclxuIyBJdCBoYXMgYW4gRWZmZWN0IGFuZCBhIERhbmNlTWF0ZXJpYWwgd2hpY2ggb3BlcmF0ZSBvbiB0aGUgdHJhbnNmb3JtIGFuZCB0aGUgbWF0ZXJpYWwgb2YgdGhlIE9iamVjdDNEIHJlc3BlY3Rpdmx5XHJcblxyXG5jbGFzcyB3aW5kb3cuRGFuY2VyXHJcbiAgQHR5cGUgPSBEYW5jZXJcclxuICBAcGFyYW1zID0gW1xyXG4gICAge1xyXG4gICAgICBuYW1lOiAncG9zaXRpb24nXHJcbiAgICAgIGRlZmF1bHQ6IFswLCAwLCAwXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3NjYWxlJ1xyXG4gICAgICBkZWZhdWx0OiBbMSwgMSwgMV1cclxuICAgIH1cclxuICBdXHJcblxyXG4gIGNvbnN0cnVjdG9yOiAoZ2VvbWV0cnksIGRhbmNlLCBkYW5jZU1hdGVyaWFsLCBwb3NpdGlvbiwgc2NhbGUpIC0+XHJcbiAgICAjIENvbnN0cnVjdCBhIGRlZmF1bHQgRGFuY2VyIHVzaW5nIEBib2R5IGFzIHRoZSBPYmplY3QzRFxyXG4gICAgbWF0ZXJpYWwgPSBkYW5jZU1hdGVyaWFsLm1hdGVyaWFsO1xyXG4gICAgQGRhbmNlID0gZGFuY2VcclxuICAgIEBkYW5jZU1hdGVyaWFsID0gZGFuY2VNYXRlcmlhbDtcclxuICAgIEBib2R5ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcclxuICAgIGlmIHBvc2l0aW9uPyAmJiBwb3NpdGlvbi5sZW5ndGggPT0gMyB0aGVuIEBib2R5LnBvc2l0aW9uLnNldChwb3NpdGlvblswXSwgcG9zaXRpb25bMV0sIHBvc2l0aW9uWzJdKVxyXG4gICAgaWYgc2NhbGU/ICYmIHNjYWxlLmxlbmd0aCA9PSAzIHRoZW4gQGJvZHkuc2NhbGUuc2V0KHNjYWxlWzBdLCBzY2FsZVsxXSwgc2NhbGVbMl0pXHJcblxyXG4gIGdlb21ldHJ5OiAoKSAtPlxyXG4gICAgbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoMSwgMSlcclxuXHJcbiAgcmVzZXQ6ICgpIC0+XHJcbiAgICBAZGFuY2UucmVzZXQoQClcclxuXHJcbiAgdXBkYXRlOiAoYXVkaW9XaW5kb3cpIC0+XHJcbiAgICAjIFJlYWN0IHRvIHRoZSBhdWRpbyBldmVudCBieSBwdW1waW5nIGl0IHRocm91Z2ggRWZmZWN0IGFuZCBTaGFkZXJcclxuICAgIEBkYW5jZS51cGRhdGUoYXVkaW9XaW5kb3csIEApXHJcbiAgICBAZGFuY2VNYXRlcmlhbC51cGRhdGUoYXVkaW9XaW5kb3csIEApIiwicmVxdWlyZSAnLi9EYW5jZXIuY29mZmVlJ1xyXG5cclxuY2xhc3Mgd2luZG93LlBvaW50Q2xvdWREYW5jZXIgZXh0ZW5kcyBEYW5jZXJcclxuICBAcGFyYW1zOiBcclxuICAgIFtcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdtaW5EaXN0YW5jZScsXHJcbiAgICAgICAgZGVmYXVsdDogNS4wXHJcbiAgICAgIH0sIFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ21heERpc3RhbmNlJyxcclxuICAgICAgICBkZWZhdWx0OiAxMC4wXHJcbiAgICAgIH0sIFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ2NvdW50JyxcclxuICAgICAgICBkZWZhdWx0OiA1MDBcclxuICAgICAgfVxyXG4gICAgXVxyXG5cclxuICBAbmFtZTogXCJQb2ludENsb3VkRGFuY2VyXCJcclxuXHJcbiAgY29uc3RydWN0b3I6IChAZGFuY2UsIEBkYW5jZU1hdGVyaWFsLCBAb3B0aW9ucykgLT5cclxuICAgIGlmIEBvcHRpb25zPyB0aGVuIHsgQG1pbkRpc3RhbmNlLCBAbWF4RGlzdGFuY2UsIEBjb3VudCB9ID0gQG9wdGlvbnNcclxuICAgIEBtaW5EaXN0YW5jZSA/PSA1LjBcclxuICAgIEBtYXhEaXN0YW5jZSA/PSAxMC4wXHJcbiAgICBAY291bnQgPz0gNTAwXHJcblxyXG4gICAgZGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxyXG4gICAgcG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKVxyXG5cclxuICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KClcclxuICAgIHBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkoQGNvdW50ICogMylcclxuXHJcbiAgICBmb3IgaSBpbiBbMC4uLkBjb3VudF1cclxuICAgICAgZGlyZWN0aW9uLnNldChNYXRoLnJhbmRvbSgpIC0gMC41LCBNYXRoLnJhbmRvbSgpIC0gMC41LCBNYXRoLnJhbmRvbSgpLSAwLjUpXHJcbiAgICAgIGRpcmVjdGlvbi5ub3JtYWxpemUoKVxyXG4gICAgICBkaXJlY3Rpb24ubXVsdGlwbHlTY2FsYXIoQG1pbkRpc3RhbmNlICsgTWF0aC5yYW5kb20oKSAqIChAbWF4RGlzdGFuY2UgLSBAbWluRGlzdGFuY2UpKVxyXG5cclxuICAgICAgcG9zaXRpb25zWzMgKiBpXSA9IHBvc2l0aW9uLnggKyBkaXJlY3Rpb24ueFxyXG4gICAgICBwb3NpdGlvbnNbMyAqIGkgKyAxXSA9IHBvc2l0aW9uLnkgKyBkaXJlY3Rpb24ueVxyXG4gICAgICBwb3NpdGlvbnNbMyAqIGkgKyAyXSA9IHBvc2l0aW9uLnogKyBkaXJlY3Rpb24uelxyXG5cclxuICAgIGdlb21ldHJ5LmFkZEF0dHJpYnV0ZSgncG9zaXRpb24nLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKHBvc2l0aW9ucywgMykpXHJcbiAgICBnZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKVxyXG5cclxuICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLlBvaW50Q2xvdWRNYXRlcmlhbCh7IHNpemU6IDAuNSwgY29sb3I6IEBkYW5jZU1hdGVyaWFsLmNvbG9yIH0pXHJcbiAgICBAYm9keSA9IG5ldyBUSFJFRS5Qb2ludENsb3VkKCBnZW9tZXRyeSwgbWF0ZXJpYWwgKSIsInJlcXVpcmUgJy4vRGFuY2VyLmNvZmZlZSdcclxuXHJcbmNsYXNzIHdpbmRvdy5TcGhlcmVEYW5jZXIgZXh0ZW5kcyBEYW5jZXJcclxuICBAbmFtZTogXCJTcGhlcmVEYW5jZXJcIlxyXG5cclxuICBjb25zdHJ1Y3RvcjogKGRhbmNlLCBkYW5jZU1hdGVyaWFsLCBAb3B0aW9ucykgLT5cclxuICAgIGlmIEBvcHRpb25zPyB0aGVuIHsgcG9zaXRpb24sIHNjYWxlIH0gPSBAb3B0aW9uc1xyXG4gICAgc3VwZXIobmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDEsIDMyLCAyNCksIGRhbmNlLCBkYW5jZU1hdGVyaWFsLCBwb3NpdGlvbiwgc2NhbGUpIiwiY2xhc3Mgd2luZG93LlBvc2l0aW9uRGFuY2VcclxuICBAcGFyYW1zOiBcclxuICAgIFtcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdzbW9vdGhpbmdGYWN0b3InXHJcbiAgICAgICAgZGVmYXVsdDogMC4yXHJcbiAgICAgIH0sIFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ2RpcmVjdGlvbidcclxuICAgICAgICBkZWZhdWx0OiBbMCwgMSwgMF1cclxuICAgICAgfVxyXG4gICAgXVxyXG5cclxuICBAbmFtZTogXCJQb3NpdGlvbkRhbmNlXCJcclxuXHJcbiAgY29uc3RydWN0b3I6IChAb3B0aW9ucykgLT5cclxuICAgIGlmIEBvcHRpb25zPyB0aGVuIHsgQHNtb290aGluZ0ZhY3RvciwgZGlyZWN0aW9uIH0gPSBAb3B0aW9uc1xyXG4gICAgQHNtb290aGluZ0ZhY3RvciA/PSAwLjJcclxuICAgIFxyXG4gICAgZGlyZWN0aW9uID89IFswLCAxLCAwXVxyXG4gICAgQGRpcmVjdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKGRpcmVjdGlvblswXSwgZGlyZWN0aW9uWzFdLCBkaXJlY3Rpb25bMl0pXHJcblxyXG4gICAgQGRpcmVjdGlvbkNvcHkgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG4gICAgQHBvc2l0aW9uQ2hhbmdlID0gMFxyXG5cclxuICB1cGRhdGU6IChhdWRpb1dpbmRvdywgZGFuY2VyKSAtPlxyXG4gICAgYmFzZVBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICAgIEBkaXJlY3Rpb25Db3B5LmNvcHkoQGRpcmVjdGlvbik7XHJcbiAgICBiYXNlUG9zaXRpb24uc3ViVmVjdG9ycyhkYW5jZXIuYm9keS5wb3NpdGlvbiwgQGRpcmVjdGlvbkNvcHkubXVsdGlwbHlTY2FsYXIoQHBvc2l0aW9uQ2hhbmdlKSlcclxuXHJcbiAgICBzbW9vdGhpbmdGYWN0b3IgPSBpZiBhdWRpb1dpbmRvdy5hdmVyYWdlRGIgPCBAcG9zaXRpb25DaGFuZ2UgdGhlbiBAc21vb3RoaW5nRmFjdG9yIGVsc2UgTWF0aC5tYXgoMSwgQHNtb290aGluZ0ZhY3RvciAqIDQpXHJcbiAgICBAcG9zaXRpb25DaGFuZ2UgPSBhdWRpb1dpbmRvdy5hdmVyYWdlRGIgKiBzbW9vdGhpbmdGYWN0b3IgKyAoMSAtIHNtb290aGluZ0ZhY3RvcikgKiBAcG9zaXRpb25DaGFuZ2VcclxuXHJcbiAgICBAZGlyZWN0aW9uQ29weS5jb3B5KEBkaXJlY3Rpb24pXHJcbiAgICBuZXdQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKClcclxuICAgIG5ld1Bvc2l0aW9uLmFkZFZlY3RvcnMoYmFzZVBvc2l0aW9uLCBAZGlyZWN0aW9uQ29weS5tdWx0aXBseVNjYWxhcihAcG9zaXRpb25DaGFuZ2UpKVxyXG5cclxuICAgIGRhbmNlci5ib2R5LnBvc2l0aW9uLnNldChuZXdQb3NpdGlvbi54LCBuZXdQb3NpdGlvbi55LCBuZXdQb3NpdGlvbi56KVxyXG5cclxuICByZXNldDogKGRhbmNlcikgLT5cclxuICAgIEBkaXJlY3Rpb25Db3B5LmNvcHkoQGRpcmVjdGlvbik7XHJcbiAgICBiYXNlUG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG4gICAgYmFzZVBvc2l0aW9uLnN1YlZlY3RvcnMoZGFuY2VyLmJvZHkucG9zaXRpb24sIEBkaXJlY3Rpb25Db3B5Lm11bHRpcGx5U2NhbGFyKEBwb3NpdGlvbkNoYW5nZSkpXHJcbiAgICBkYW5jZXIuYm9keS5wb3NpdGlvbi5zZXQoYmFzZVBvc2l0aW9uLngsIGJhc2VQb3NpdGlvbi55LCBiYXNlUG9zaXRpb24ueikiLCJjbGFzcyB3aW5kb3cuUm90YXRlRGFuY2VcclxuICBAbmFtZTogXCJSb3RhdGVEYW5jZVwiXHJcblxyXG4gIEBwYXJhbXM6XHJcbiAgICBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnYXhpcydcclxuICAgICAgICBkZWZhdWx0OiBbMCwgMSwgMF1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdtaW5Sb3RhdGlvbidcclxuICAgICAgICBkZWZhdWx0OiAwLjA1XHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnc3BlZWQnXHJcbiAgICAgICAgZGVmYXVsdDogMVxyXG4gICAgICB9LFxyXG4gICAgXVxyXG5cclxuICBjb25zdHJ1Y3RvcjogKEBvcHRpb25zKSAtPlxyXG4gICAgaWYgQG9wdGlvbnM/IHRoZW4geyBheGlzLCBAbWluUm90YXRpb24sIEBzcGVlZCB9ID0gQG9wdGlvbnNcclxuICAgIEBtaW5Sb3RhdGlvbiA/PSAwLjA1XHJcbiAgICBAc3BlZWQgPz0gMVxyXG5cclxuICAgIGF4aXMgPz0gWzAsIDEsIDBdXHJcbiAgICBAYXhpcyA9IG5ldyBUSFJFRS5WZWN0b3IzKGF4aXNbMF0sIGF4aXNbMV0sIGF4aXNbMl0pXHJcblxyXG4gICAgQHRpbWUgPSAwXHJcblxyXG4gIHVwZGF0ZTogKGF1ZGlvV2luZG93LCBkYW5jZXIpIC0+XHJcbiAgICBhYnNSb3RhdGlvbiA9IGF1ZGlvV2luZG93LmF2ZXJhZ2VEYiAqIEBzcGVlZFxyXG5cclxuICAgIGRhbmNlci5ib2R5LnJvdGF0ZU9uQXhpcyBAYXhpcywgKEBtaW5Sb3RhdGlvbiArIGFic1JvdGF0aW9uICogKDAuOSkpICogTWF0aC5QSSAqICgoYXVkaW9XaW5kb3cudGltZSAtIEB0aW1lKSAvIDEwMDApXHJcblxyXG4gICAgQHRpbWUgPSBhdWRpb1dpbmRvdy50aW1lXHJcblxyXG4gIHJlc2V0OiAoZGFuY2VyKSAtPlxyXG4gICAgZGFuY2VyLmJvZHkucm90YXRpb24uc2V0KDAsIDAsIDApXHJcbiIsIiMgQ29udHJvbHMgdGhlIG1lc2ggb2YgdGhlIHByb3ZpZGVkIERhbmNlcidzIGJvZHlcclxuY2xhc3Mgd2luZG93LlNjYWxlRGFuY2VcclxuICBAcGFyYW1zOlxyXG4gICAgW1xyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ3Ntb290aGluZ0ZhY3RvcidcclxuICAgICAgICBkZWZhdWx0OiAwLjVcclxuICAgICAgfSwgXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnbWluJ1xyXG4gICAgICAgIGRlZmF1bHQ6IFswLjUsIDAuNSwgMC41XVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ21heCdcclxuICAgICAgICBkZWZhdWx0OiBbMSwgMSwgMV1cclxuICAgICAgfVxyXG4gICAgXVxyXG5cclxuICBAbmFtZTogXCJTY2FsZURhbmNlXCJcclxuXHJcbiAgY29uc3RydWN0b3I6IChAb3B0aW9ucykgLT5cclxuICAgIGlmIEBvcHRpb25zPyB0aGVuIHsgQHNtb290aGluZ0ZhY3RvciwgbWluLCBtYXggfSA9IEBvcHRpb25zXHJcbiAgICBAc21vb3RoaW5nRmFjdG9yID89IDAuNVxyXG4gICAgQGF2ZXJhZ2VEYiA9IDBcclxuICAgIEBtaW4gPSBpZiBtaW4gdGhlbiBuZXcgVEhSRUUuVmVjdG9yMyhtaW5bMF0sIG1pblsxXSwgbWluWzJdKSBlbHNlIG5ldyBUSFJFRS5WZWN0b3IzKDAuNSwgMC41LCAwLjUpXHJcbiAgICBAbWF4ID0gaWYgbWF4IHRoZW4gbmV3IFRIUkVFLlZlY3RvcjMobWF4WzBdLCBtYXhbMV0sIG1heFsyXSkgZWxzZSBuZXcgVEhSRUUuVmVjdG9yMygxLCAxLCAxKVxyXG4gICAgQHNjYWxlID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxyXG5cclxuICB1cGRhdGU6IChhdWRpb1dpbmRvdywgZGFuY2VyKSAtPlxyXG4gICAgIyB1cGRhdGUgdGhlIERhbmNlcidzIGJvZHkgbWVzaCB0byByZWZsZWN0IHRoZSBhdWRpbyBldmVudFxyXG4gICAgaWYgKGF1ZGlvV2luZG93LmF2ZXJhZ2VEYiA8IEBhdmVyYWdlRGIpXHJcbiAgICBcdEBhdmVyYWdlRGIgPSBhdWRpb1dpbmRvdy5hdmVyYWdlRGIgKiBAc21vb3RoaW5nRmFjdG9yICsgKDEgLSBAc21vb3RoaW5nRmFjdG9yKSAqIEBhdmVyYWdlRGJcclxuICAgIGVsc2UgXHJcbiAgICBcdHNtb290aGluZ0ZhY3RvciA9IE1hdGgubWF4KDEsIEBzbW9vdGhpbmdGYWN0b3IgKiA0KVxyXG4gICAgXHRAYXZlcmFnZURiID0gYXVkaW9XaW5kb3cuYXZlcmFnZURiICogc21vb3RoaW5nRmFjdG9yICsgKDEgLSBzbW9vdGhpbmdGYWN0b3IpICogQGF2ZXJhZ2VEYlxyXG5cclxuICAgIEBzY2FsZS5jb3B5KEBtaW4pXHJcblxyXG4gICAgQHNjYWxlLmxlcnAoQG1heCwgQGF2ZXJhZ2VEYilcclxuXHJcbiAgICBkYW5jZXIuYm9keS5zY2FsZS5zZXQoQHNjYWxlLngsIEBzY2FsZS55LCBAc2NhbGUueilcclxuXHRcclxuICByZXNldDogKGRhbmNlcikgLT5cclxuICBcdGRhbmNlci5ib2R5LnNjYWxlLnNldCgxLCAxLCAxKVxyXG4iLCJyZXF1aXJlICcuL1F1ZXVlVmlldy5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vUm91dGluZXNWaWV3LmNvZmZlZSdcclxucmVxdWlyZSAnLi4vUm91dGluZXNDb250cm9sbGVyLmNvZmZlZSdcclxuXHJcbmNsYXNzIHdpbmRvdy5EYXRHVUlJbnRlcmZhY2VcclxuICBjb25zdHJ1Y3RvcjogKEByb3V0aW5lc0NvbnRyb2xsZXIpIC0+XHJcbiAgICBAY29udGFpbmVyID0gJCgnI2ludGVyZmFjZScpXHJcblxyXG4gIHNldHVwOiAoQHBsYXllciwgQGNob3Jlb2dyYXBoeVJvdXRpbmUsIEB2aWV3ZXIpIC0+XHJcbiAgICBndWkgPSBuZXcgZGF0LkdVSSgpXHJcblxyXG4gICAgZ3VpLmFkZChAcGxheWVyLmF1ZGlvV2luZG93LCAncmVzcG9uc2l2ZW5lc3MnLCAwLjAsIDUuMClcclxuICAgIGlkQ29udHJvbGxlciA9IGd1aS5hZGQoQGNob3Jlb2dyYXBoeVJvdXRpbmUsICdpZCcpXHJcblxyXG4gICAgc2V0dXBGb2xkZXIgPSAobmFtZSwgdmFyTmFtZSwga2V5cykgPT5cclxuICAgICAgY29udHJvbGxlciA9IGd1aS5hZGQoQGNob3Jlb2dyYXBoeVJvdXRpbmUsIHZhck5hbWUsIGtleXMpXHJcbiAgICAgIGZvbGRlciA9IGd1aS5hZGRGb2xkZXIobmFtZSlcclxuICAgICAgZm9sZGVyLm9wZW4oKVxyXG4gICAgICByZXR1cm4gWyBjb250cm9sbGVyLCBmb2xkZXIgXVxyXG5cclxuICAgIHVwZGF0ZUZvbGRlciA9ICh0eXBlcywgZm9sZGVyLCBwYXJhbXMsIHZhbHVlLCBvYmopIC0+XHJcbiAgICAgIGlmICF0eXBlc1t2YWx1ZV0/XHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICB3aGlsZSBmb2xkZXIuX19jb250cm9sbGVyc1swXT9cclxuICAgICAgICBmb2xkZXIucmVtb3ZlKGZvbGRlci5fX2NvbnRyb2xsZXJzWzBdKVxyXG5cclxuICAgICAgZm9yIHBhcmFtIGluIHR5cGVzW3ZhbHVlXS5wYXJhbXNcclxuICAgICAgICBwYXJhbXNbcGFyYW0ubmFtZV0gPVxyXG4gICAgICAgICAgaWYgb2JqPy5vcHRpb25zP1twYXJhbS5uYW1lXVxyXG4gICAgICAgICAgICBvYmoub3B0aW9uc1twYXJhbS5uYW1lXVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBwYXJhbS5kZWZhdWx0XHJcblxyXG4gICAgICAgIGZvbGRlci5hZGQocGFyYW1zLCBwYXJhbS5uYW1lKVxyXG5cclxuICAgIFtkYW5jZXJDb250cm9sbGVyLCBkYW5jZXJGb2xkZXJdID0gc2V0dXBGb2xkZXIoJ0RhbmNlciBwYXJhbWV0ZXJzJywgJ2RhbmNlcicsIE9iamVjdC5rZXlzKFZpc3VhbGl6ZXIuZGFuY2VyVHlwZXMpKVxyXG5cclxuICAgIHVwZGF0ZURhbmNlckZvbGRlciA9ICh2YWx1ZSwgb2JqKSA9PlxyXG4gICAgICB1cGRhdGVGb2xkZXIoVmlzdWFsaXplci5kYW5jZXJUeXBlcywgZGFuY2VyRm9sZGVyLCBAY2hvcmVvZ3JhcGh5Um91dGluZS5kYW5jZXJQYXJhbXMsIHZhbHVlLCBvYmopXHJcbiAgICBkYW5jZXJDb250cm9sbGVyLm9uQ2hhbmdlIHVwZGF0ZURhbmNlckZvbGRlclxyXG5cclxuICAgIFtkYW5jZUNvbnRyb2xsZXIsIGRhbmNlRm9sZGVyXSA9IHNldHVwRm9sZGVyKCdEYW5jZSBwYXJhbWV0ZXJzJywgJ2RhbmNlJywgT2JqZWN0LmtleXMoVmlzdWFsaXplci5kYW5jZVR5cGVzKSlcclxuXHJcbiAgICB1cGRhdGVEYW5jZUZvbGRlciA9ICh2YWx1ZSwgb2JqKSA9PlxyXG4gICAgICB1cGRhdGVGb2xkZXIoVmlzdWFsaXplci5kYW5jZVR5cGVzLCBkYW5jZUZvbGRlciwgQGNob3Jlb2dyYXBoeVJvdXRpbmUuZGFuY2VQYXJhbXMsIHZhbHVlLCBvYmopXHJcbiAgICBkYW5jZUNvbnRyb2xsZXIub25DaGFuZ2UgdXBkYXRlRGFuY2VGb2xkZXJcclxuXHJcbiAgICBbZGFuY2VNYXRlcmlhbENvbnRyb2xsZXIsIGRhbmNlTWF0ZXJpYWxGb2xkZXJdID0gc2V0dXBGb2xkZXIoJ0RhbmNlIG1hdGVyaWFsIHBhcmFtYXRlcnMnLCAnZGFuY2VNYXRlcmlhbCcsXHJcbiAgICAgIE9iamVjdC5rZXlzKFZpc3VhbGl6ZXIuZGFuY2VNYXRlcmlhbFR5cGVzKSlcclxuXHJcbiAgICB1cGRhdGVEYW5jZU1hdGVyaWFsRm9sZGVyID0gKHZhbHVlLCBvYmopID0+XHJcbiAgICAgIHVwZGF0ZUZvbGRlcihWaXN1YWxpemVyLmRhbmNlTWF0ZXJpYWxUeXBlcywgZGFuY2VNYXRlcmlhbEZvbGRlciwgQGNob3Jlb2dyYXBoeVJvdXRpbmUuZGFuY2VNYXRlcmlhbFBhcmFtcywgdmFsdWUsXHJcbiAgICAgICAgb2JqKVxyXG4gICAgZGFuY2VNYXRlcmlhbENvbnRyb2xsZXIub25DaGFuZ2UgdXBkYXRlRGFuY2VNYXRlcmlhbEZvbGRlclxyXG5cclxuICAgIGlkQ29udHJvbGxlci5vbkNoYW5nZSAodmFsdWUpID0+XHJcbiAgICAgIGlkRGFuY2VyID0gQHZpZXdlci5nZXREYW5jZXIodmFsdWUpXHJcbiAgICAgIGlmIGlkRGFuY2VyP1xyXG4gICAgICAgIEBjaG9yZW9ncmFwaHlSb3V0aW5lLnVwZGF0ZURhbmNlciBpZERhbmNlclxyXG4gICAgICAgIGZvciBjb250cm9sbGVyIGluIGd1aS5fX2NvbnRyb2xsZXJzXHJcbiAgICAgICAgICBjb250cm9sbGVyLnVwZGF0ZURpc3BsYXkoKVxyXG5cclxuICAgICAgICB1cGRhdGVEYW5jZXJGb2xkZXIoQGNob3Jlb2dyYXBoeVJvdXRpbmUuZGFuY2VyLCBpZERhbmNlcilcclxuICAgICAgICB1cGRhdGVEYW5jZU1hdGVyaWFsRm9sZGVyKEBjaG9yZW9ncmFwaHlSb3V0aW5lLmRhbmNlTWF0ZXJpYWwsIGlkRGFuY2VyLmRhbmNlTWF0ZXJpYWwpXHJcbiAgICAgICAgdXBkYXRlRGFuY2VGb2xkZXIoQGNob3Jlb2dyYXBoeVJvdXRpbmUuZGFuY2UsIGlkRGFuY2VyLmRhbmNlKVxyXG5cclxuICAgIGd1aS5hZGQoQGNob3Jlb2dyYXBoeVJvdXRpbmUsICdwcmV2aWV3JylcclxuICAgIGd1aS5hZGQoQGNob3Jlb2dyYXBoeVJvdXRpbmUsICdhZGQnKVxyXG4gICAgZ3VpLmFkZChAY2hvcmVvZ3JhcGh5Um91dGluZSwgJ2luc2VydEJlYXQnKVxyXG4gICAgZ3VpLmFkZChAY2hvcmVvZ3JhcGh5Um91dGluZSwgJ3BsYXlOZXh0JylcclxuICAgIGd1aS5hZGQoQGNob3Jlb2dyYXBoeVJvdXRpbmUsICdyZXNldCcpXHJcblxyXG4gICAgQGNvbnRhaW5lclRvcCA9ICQgXCI8ZGl2PlwiLFxyXG4gICAgICBjbGFzczogXCJoYWxmLWhlaWdodFwiXHJcblxyXG4gICAgQGNvbnRhaW5lci5hcHBlbmQgQGNvbnRhaW5lclRvcFxyXG5cclxuICAgIEBzZXR1cFBvcHVwKClcclxuICAgIEBzZXR1cFF1ZXVlVmlldygpXHJcbiAgICBAc2V0dXBSb3V0aW5lc1ZpZXcoKVxyXG5cclxuXHJcbiAgc2V0dXBQb3B1cDogKCkgLT5cclxuICAgIEB2aWV3ZXJCdXR0b24gPSAkIFwiPGEgaHJlZj0nIyc+T3BlbiBWaWV3ZXI8L2E+XCJcclxuICAgIEB2aWV3ZXJCdXR0b24uY2xpY2sgKGUpID0+XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICBAZG9tYWluID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0XHJcbiAgICAgIHBvcHVwVVJMID0gQGRvbWFpbiArIGxvY2F0aW9uLnBhdGhuYW1lICsgJ3ZpZXdlci5odG1sJ1xyXG4gICAgICBAcG9wdXAgPSB3aW5kb3cub3Blbihwb3B1cFVSTCwgJ215V2luZG93JylcclxuXHJcbiAgICAgICMgV2UgaGF2ZSB0byBkZWxheSBjYXRjaGluZyB0aGUgd2luZG93IHVwIGJlY2F1c2UgaXQgaGFzIHRvIGxvYWQgZmlyc3QuXHJcbiAgICAgIHNlbmRCZWF0cyA9ICgpID0+XHJcbiAgICAgICAgcm91dGluZUJlYXQgPSBAY2hvcmVvZ3JhcGh5Um91dGluZS5yb3V0aW5lQmVhdFxyXG4gICAgICAgIEBjaG9yZW9ncmFwaHlSb3V0aW5lLnJvdXRpbmVCZWF0ID0gLTFcclxuICAgICAgICB3aGlsZSBAY2hvcmVvZ3JhcGh5Um91dGluZS5yb3V0aW5lQmVhdCA8IHJvdXRpbmVCZWF0XHJcbiAgICAgICAgICBAY2hvcmVvZ3JhcGh5Um91dGluZS5wbGF5TmV4dCgpXHJcbiAgICAgIHNldFRpbWVvdXQgc2VuZEJlYXRzLCAxMDBcclxuXHJcbiAgICBAY29udGFpbmVyVG9wLmFwcGVuZChAdmlld2VyQnV0dG9uKVxyXG5cclxuICBzZXR1cFF1ZXVlVmlldzogKCkgLT5cclxuICAgIEBxdWV1ZVZpZXcgPSBuZXcgUXVldWVWaWV3KEBjaG9yZW9ncmFwaHlSb3V0aW5lKVxyXG4gICAgQHF1ZXVlVmlldy5jcmVhdGVWaWV3KEBjb250YWluZXJUb3ApXHJcblxyXG4gIHNldHVwUm91dGluZXNWaWV3OiAoKSAtPlxyXG4gICAgQHJvdXRpbmVzVmlldyA9IG5ldyBSb3V0aW5lc1ZpZXcoQGNob3Jlb2dyYXBoeVJvdXRpbmUsIEByb3V0aW5lc0NvbnRyb2xsZXIpXHJcbiAgICBAcm91dGluZXNWaWV3LmNyZWF0ZVZpZXcoQGNvbnRhaW5lcilcclxuXHJcbiAgICBAcm91dGluZXNWaWV3LnVwZGF0ZVJvdXRpbmVzICgpID0+XHJcbiAgICAgIEByb3V0aW5lc1ZpZXcub25TZWxlY3QoMSlcclxuXHJcbiAgdXBkYXRlVGV4dDogKCkgLT5cclxuICAgIGlmIEBxdWV1ZVZpZXc/XHJcbiAgICAgIEBxdWV1ZVZpZXcudXBkYXRlVGV4dChAY2hvcmVvZ3JhcGh5Um91dGluZS5yb3V0aW5lQmVhdCwgQGNob3Jlb2dyYXBoeVJvdXRpbmUucm91dGluZSlcclxuIiwiY2xhc3Mgd2luZG93LlF1ZXVlVmlld1xyXG4gIGNvbnN0cnVjdG9yOiAoQGNob3Jlb2dyYXBoeVJvdXRpbmUpIC0+XHJcbiAgICByZXR1cm5cclxuXHJcbiAgY3JlYXRlVmlldzogKHRhcmdldCkgLT5cclxuICAgIEBxdWV1ZUNvbnRhaW5lciA9ICQgXCI8ZGl2PlwiXHJcblxyXG4gICAgdGFyZ2V0LmFwcGVuZCBAcXVldWVDb250YWluZXJcclxuXHJcbiAgICBAY29udHJvbHMgPSAkIFwiPGRpdj5cIlxyXG5cclxuICAgIEBxdWV1ZUNvbnRhaW5lci5hcHBlbmQgQGNvbnRyb2xzXHJcblxyXG4gICAgQHB1c2hTdWNjZXNzZnVsID0gJCBcIjxkaXY+XCIsXHJcbiAgICAgIHRleHQ6IFwiUHVzaCBzdWNjZXNzZnVsXCJcclxuICAgICAgY2xhc3M6IFwiaGlkZVwiXHJcblxyXG4gICAgQGNvbnRyb2xzLmFwcGVuZCBAcHVzaFN1Y2Nlc3NmdWxcclxuXHJcbiAgICBAaW52YWxpZEpTT04gPSAkIFwiPGRpdj5cIixcclxuICAgICAgdGV4dDogXCJJbnZhbGlkIGpzb25cIlxyXG4gICAgICBjbGFzczogXCJoaWRlXCJcclxuXHJcbiAgICBAY29udHJvbHMuYXBwZW5kIEBpbnZhbGlkSlNPTlxyXG5cclxuICAgIEBxdWV1ZU5hbWUgPSAkIFwiPGlucHV0PlwiLFxyXG4gICAgICB0eXBlOiBcInRleHRcIlxyXG5cclxuICAgIEBjb250cm9scy5hcHBlbmQgQHF1ZXVlTmFtZVxyXG5cclxuICAgIEBwdXNoQnV0dG9uID0gJCBcIjxhPlwiLFxyXG4gICAgICBocmVmOiBcIiNcIlxyXG4gICAgICB0ZXh0OiBcIlB1c2hcIlxyXG5cclxuICAgIEBwdXNoQnV0dG9uLmNsaWNrIChlKSA9PlxyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgQG9uUHVzaCgpXHJcblxyXG4gICAgQGNvbnRyb2xzLmFwcGVuZCBAcHVzaEJ1dHRvblxyXG5cclxuICAgIEByb3V0aW5lVmlldyA9ICQgXCI8cHJlPlwiLFxyXG4gICAgICBpZDogJ3F1ZXVlJ1xyXG4gICAgICBjbGFzczogJ3Njcm9sbGFibGUgbm8tbWFyZ2luJ1xyXG4gICAgICBjb250ZW50ZWRpdGFibGU6IHRydWVcclxuXHJcbiAgICBAcm91dGluZVZpZXcua2V5ZG93biAoZSkgLT5cclxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgIEByb3V0aW5lVmlldy5vbiAnaW5wdXQnLCAoKSA9PlxyXG4gICAgICB0cnlcclxuICAgICAgICBuZXdKU09OID0gSlNPTi5wYXJzZShcIltcIiArIEByb3V0aW5lVmlldy50ZXh0KCkgKyBcIl1cIilcclxuICAgICAgY2F0Y2hcclxuICAgICAgICBAanNvbkludmFsaWQgPSB0cnVlXHJcbiAgICAgICAgQGludmFsaWRKU09OLnJlbW92ZUNsYXNzIFwiaGlkZVwiXHJcblxyXG4gICAgICBpZiAhbmV3SlNPTj8gfHwgbmV3SlNPTi5sZW5ndGggPT0gMFxyXG4gICAgICAgIEBqc29uSW52YWxpZCA9IHRydWVcclxuICAgICAgICBAaW52YWxpZEpTT04ucmVtb3ZlQ2xhc3MgXCJoaWRlXCJcclxuICAgICAgZWxzZVxyXG4gICAgICAgIEBqc29uSW52YWxpZCA9IGZhbHNlXHJcbiAgICAgICAgQGludmFsaWRKU09OLmFkZENsYXNzIFwiaGlkZVwiXHJcbiAgICAgICAgQHF1ZXVlID0gbmV3SlNPTlxyXG4gICAgICAgIEBjaG9yZW9ncmFwaHlSb3V0aW5lLnJvdXRpbmUgPSBAcXVldWVcclxuXHJcbiAgICBAcXVldWVDb250YWluZXIuaGVpZ2h0KHRhcmdldC5oZWlnaHQoKSAtIHRhcmdldC5maW5kKCdhJykuaGVpZ2h0KCkpXHJcbiAgICBAcm91dGluZVZpZXcuaGVpZ2h0KEBxdWV1ZUNvbnRhaW5lci5oZWlnaHQoKSAtIEBjb250cm9scy5oZWlnaHQoKSlcclxuXHJcbiAgICBAcXVldWVDb250YWluZXIuYXBwZW5kIEByb3V0aW5lVmlld1xyXG5cclxuICBvblB1c2g6ICgpIC0+XHJcbiAgICBpZiBAanNvbkludmFsaWRcclxuICAgICAgcmV0dXJuXHJcbiAgICBAY2hvcmVvZ3JhcGh5Um91dGluZS5jcmVhdGVSb3V0aW5lIEBxdWV1ZU5hbWUudmFsKCksID0+XHJcbiAgICAgIEBwdXNoU3VjY2Vzc2Z1bC5yZW1vdmVDbGFzcyBcImhpZGVcIlxyXG5cclxuICB1cGRhdGVUZXh0OiAoY3VycmVudEluZGV4LCByb3V0aW5lUXVldWUpIC0+XHJcbiAgICBAcHVzaFN1Y2Nlc3NmdWwuYWRkQ2xhc3MgXCJoaWRlXCJcclxuXHJcbiAgICBAcXVldWUgPSByb3V0aW5lUXVldWVcclxuICAgICMgRGlzcGxheSByb3V0aW5lUXVldWUgd2l0aCBjdXJyZW50IGluZGV4IGhpZ2hsaWdodGVkXHJcbiAgICBodG1sID0gW11cclxuXHJcbiAgICBmb3Igcm91dGluZSwgaSBpbiByb3V0aW5lUXVldWVcclxuICAgICAgaWYgaSA9PSBjdXJyZW50SW5kZXhcclxuICAgICAgICBodG1sLnB1c2goXCI8c3BhbiBjbGFzcz0nYm9sZCc+XCIpXHJcblxyXG4gICAgICBodG1sLnB1c2goQHN0cmluZ2lmeShyb3V0aW5lKSlcclxuXHJcbiAgICAgIGlmIGkgPT0gY3VycmVudEluZGV4XHJcbiAgICAgICAgaHRtbC5wdXNoKFwiPC9zcGFuPlwiKVxyXG5cclxuICAgICAgaHRtbC5wdXNoKCcsXFxuJylcclxuXHJcbiAgICBAcm91dGluZVZpZXcuaHRtbChodG1sLnNsaWNlKDAsIGh0bWwubGVuZ3RoLTEpLmpvaW4oXCJcIikpXHJcblxyXG4gIHN0cmluZ2lmeTogKGpzb24pIC0+XHJcbiAgICBKU09OLnN0cmluZ2lmeShqc29uLCB1bmRlZmluZWQsIDIpIiwiY2xhc3Mgd2luZG93LlJvdXRpbmVzVmlld1xyXG4gIGNvbnN0cnVjdG9yOiAoQGNob3Jlb2dyYXBoeVJvdXRpbmUsIEByb3V0aW5lc0NvbnRyb2xsZXIpIC0+XHJcbiAgICByZXR1cm5cclxuXHJcbiAgY3JlYXRlVmlldzogKHRhcmdldCkgLT5cclxuICAgICMgQWRkIHJvdXRpbmVzIHZpZXcgdG8gdGFyZ2V0XHJcbiAgICBAcm91dGluZXNDb250YWluZXIgPSAkIFwiPGRpdj5cIixcclxuICAgICAgaWQ6ICdyb3V0aW5lc0NvbnRhaW5lcidcclxuICAgICAgY2xhc3M6ICdoYWxmLWhlaWdodCBzY3JvbGxhYmxlJ1xyXG4gICAgdGFyZ2V0LmFwcGVuZCBAcm91dGluZXNDb250YWluZXJcclxuXHJcbiAgICBAc2VsZWN0b3IgPSAkIFwiPHNlbGVjdD5cIixcclxuICAgICAgaWQ6ICdyb3V0aW5lU2VsZWN0J1xyXG5cclxuICAgIEBzZWxlY3Rvci5jaGFuZ2UgKCkgPT5cclxuICAgICAgQG9uU2VsZWN0KCQoXCIjcm91dGluZVNlbGVjdCBvcHRpb246c2VsZWN0ZWRcIikudmFsKCkpXHJcblxyXG4gICAgQHJvdXRpbmVzQ29udGFpbmVyLmFwcGVuZCBAc2VsZWN0b3JcclxuXHJcbiAgICBAcXVldWVCdXR0b24gPSAkIFwiPGE+XCIsXHJcbiAgICAgIGhyZWY6IFwiI1wiXHJcbiAgICAgIHRleHQ6IFwiUXVldWVcIlxyXG5cclxuICAgIEBxdWV1ZUJ1dHRvbi5jbGljayAoZSkgPT5cclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgIEBvblF1ZXVlKClcclxuXHJcbiAgICBAcm91dGluZXNDb250YWluZXIuYXBwZW5kIEBxdWV1ZUJ1dHRvblxyXG5cclxuICAgIEByb3V0aW5lVmlldyA9ICQgXCI8cHJlPlwiLFxyXG4gICAgICBpZDogJ3JvdXRpbmVWaWV3J1xyXG5cclxuICAgIEByb3V0aW5lc0NvbnRhaW5lci5hcHBlbmQgQHJvdXRpbmVWaWV3XHJcblxyXG4gIHVwZGF0ZVRleHQ6IChyb3V0aW5lRGF0YSkgLT5cclxuICAgICMgRGlzcGxheSByb3V0aW5lIHRleHQgaW4gbWFpbiB2aWV3XHJcbiAgICBAY3VycmVudFJvdXRpbmUgPSByb3V0aW5lRGF0YVxyXG4gICAgQHJvdXRpbmVWaWV3Lmh0bWwoSlNPTi5zdHJpbmdpZnkocm91dGluZURhdGEsIHVuZGVmaW5lZCwgMikpXHJcblxyXG4gIHVwZGF0ZVJvdXRpbmVzOiAobmV4dCkgLT5cclxuICAgICMgRGlzcGxheSBuYW1lcyBvZiB0aGUgcm91dGluZXMgaW4gdGhlIHNlbGVjdFxyXG4gICAgQHJvdXRpbmVzQ29udHJvbGxlci5yZWZyZXNoUm91dGluZXMgKHJvdXRpbmVzKSA9PlxyXG4gICAgICBAc2VsZWN0b3IuZW1wdHkoKVxyXG4gICAgICBmb3Igcm91dGluZSBpbiByb3V0aW5lc1xyXG4gICAgICAgIGlmICFyb3V0aW5lPyB0aGVuIGNvbnRpbnVlXHJcbiAgICAgICAgb3B0aW9uID0gJCBcIjxvcHRpb24+XCIsXHJcbiAgICAgICAgICB2YWx1ZTogcm91dGluZS5pZFxyXG4gICAgICAgICAgdGV4dDogcm91dGluZS5uYW1lXHJcblxyXG4gICAgICAgIEBzZWxlY3Rvci5hcHBlbmQob3B0aW9uKVxyXG5cclxuICAgICAgaWYgbmV4dD8gdGhlbiBuZXh0KClcclxuXHJcbiAgb25RdWV1ZTogKCkgLT5cclxuICAgICMgUXVldWUgaW4gY2hvcmVvZ3JhcGh5IHJvdXRpbmVcclxuICAgIEBjaG9yZW9ncmFwaHlSb3V0aW5lLnF1ZXVlUm91dGluZShAY3VycmVudFJvdXRpbmUpXHJcblxyXG4gIG9uU2VsZWN0OiAoaWQpIC0+XHJcbiAgICAjIHVwZGF0ZVRleHQgd2l0aCByb3V0aW5lXHJcbiAgICBAcm91dGluZXNDb250cm9sbGVyLmdldFJvdXRpbmUgaWQsIChyb3V0aW5lKSA9PlxyXG4gICAgICBpZiByb3V0aW5lPy5kYXRhP1xyXG4gICAgICAgIEB1cGRhdGVUZXh0KHJvdXRpbmUuZGF0YSlcclxuIiwiLyoqXHJcbiAqIEBhdXRob3IgcWlhbyAvIGh0dHBzOi8vZ2l0aHViLmNvbS9xaWFvXHJcbiAqIEBhdXRob3IgbXJkb29iIC8gaHR0cDovL21yZG9vYi5jb21cclxuICogQGF1dGhvciBhbHRlcmVkcSAvIGh0dHA6Ly9hbHRlcmVkcXVhbGlhLmNvbS9cclxuICogQGF1dGhvciBXZXN0TGFuZ2xleSAvIGh0dHA6Ly9naXRodWIuY29tL1dlc3RMYW5nbGV5XHJcbiAqIEBhdXRob3IgZXJpY2g2NjYgLyBodHRwOi8vZXJpY2hhaW5lcy5jb21cclxuICovXHJcbi8qZ2xvYmFsIFRIUkVFLCBjb25zb2xlICovXHJcblxyXG4vLyBUaGlzIHNldCBvZiBjb250cm9scyBwZXJmb3JtcyBvcmJpdGluZywgZG9sbHlpbmcgKHpvb21pbmcpLCBhbmQgcGFubmluZy4gSXQgbWFpbnRhaW5zXHJcbi8vIHRoZSBcInVwXCIgZGlyZWN0aW9uIGFzICtZLCB1bmxpa2UgdGhlIFRyYWNrYmFsbENvbnRyb2xzLiBUb3VjaCBvbiB0YWJsZXQgYW5kIHBob25lcyBpc1xyXG4vLyBzdXBwb3J0ZWQuXHJcbi8vXHJcbi8vICAgIE9yYml0IC0gbGVmdCBtb3VzZSAvIHRvdWNoOiBvbmUgZmluZ2VyIG1vdmVcclxuLy8gICAgWm9vbSAtIG1pZGRsZSBtb3VzZSwgb3IgbW91c2V3aGVlbCAvIHRvdWNoOiB0d28gZmluZ2VyIHNwcmVhZCBvciBzcXVpc2hcclxuLy8gICAgUGFuIC0gcmlnaHQgbW91c2UsIG9yIGFycm93IGtleXMgLyB0b3VjaDogdGhyZWUgZmludGVyIHN3aXBlXHJcbi8vXHJcbi8vIFRoaXMgaXMgYSBkcm9wLWluIHJlcGxhY2VtZW50IGZvciAobW9zdCkgVHJhY2tiYWxsQ29udHJvbHMgdXNlZCBpbiBleGFtcGxlcy5cclxuLy8gVGhhdCBpcywgaW5jbHVkZSB0aGlzIGpzIGZpbGUgYW5kIHdoZXJldmVyIHlvdSBzZWU6XHJcbi8vICAgIFx0Y29udHJvbHMgPSBuZXcgVEhSRUUuVHJhY2tiYWxsQ29udHJvbHMoIGNhbWVyYSApO1xyXG4vLyAgICAgIGNvbnRyb2xzLnRhcmdldC56ID0gMTUwO1xyXG4vLyBTaW1wbGUgc3Vic3RpdHV0ZSBcIk9yYml0Q29udHJvbHNcIiBhbmQgdGhlIGNvbnRyb2wgc2hvdWxkIHdvcmsgYXMtaXMuXHJcblxyXG5USFJFRS5PcmJpdENvbnRyb2xzID0gZnVuY3Rpb24gKG9iamVjdCwgZG9tRWxlbWVudCkge1xyXG5cclxuICAgIHRoaXMub2JqZWN0ID0gb2JqZWN0O1xyXG4gICAgdGhpcy5kb21FbGVtZW50ID0gKCBkb21FbGVtZW50ICE9PSB1bmRlZmluZWQgKSA/IGRvbUVsZW1lbnQgOiBkb2N1bWVudDtcclxuXHJcbiAgICAvLyBBUElcclxuXHJcbiAgICAvLyBTZXQgdG8gZmFsc2UgdG8gZGlzYWJsZSB0aGlzIGNvbnRyb2xcclxuICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgLy8gXCJ0YXJnZXRcIiBzZXRzIHRoZSBsb2NhdGlvbiBvZiBmb2N1cywgd2hlcmUgdGhlIGNvbnRyb2wgb3JiaXRzIGFyb3VuZFxyXG4gICAgLy8gYW5kIHdoZXJlIGl0IHBhbnMgd2l0aCByZXNwZWN0IHRvLlxyXG4gICAgdGhpcy50YXJnZXQgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG5cclxuICAgIC8vIGNlbnRlciBpcyBvbGQsIGRlcHJlY2F0ZWQ7IHVzZSBcInRhcmdldFwiIGluc3RlYWRcclxuICAgIHRoaXMuY2VudGVyID0gdGhpcy50YXJnZXQ7XHJcblxyXG4gICAgLy8gVGhpcyBvcHRpb24gYWN0dWFsbHkgZW5hYmxlcyBkb2xseWluZyBpbiBhbmQgb3V0OyBsZWZ0IGFzIFwiem9vbVwiIGZvclxyXG4gICAgLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcclxuICAgIHRoaXMubm9ab29tID0gZmFsc2U7XHJcbiAgICB0aGlzLnpvb21TcGVlZCA9IDEuMDtcclxuXHJcbiAgICAvLyBMaW1pdHMgdG8gaG93IGZhciB5b3UgY2FuIGRvbGx5IGluIGFuZCBvdXRcclxuICAgIHRoaXMubWluRGlzdGFuY2UgPSAwO1xyXG4gICAgdGhpcy5tYXhEaXN0YW5jZSA9IEluZmluaXR5O1xyXG5cclxuICAgIC8vIFNldCB0byB0cnVlIHRvIGRpc2FibGUgdGhpcyBjb250cm9sXHJcbiAgICB0aGlzLm5vUm90YXRlID0gZmFsc2U7XHJcbiAgICB0aGlzLnJvdGF0ZVNwZWVkID0gMS4wO1xyXG5cclxuICAgIC8vIFNldCB0byB0cnVlIHRvIGRpc2FibGUgdGhpcyBjb250cm9sXHJcbiAgICB0aGlzLm5vUGFuID0gZmFsc2U7XHJcbiAgICB0aGlzLmtleVBhblNwZWVkID0gNy4wO1x0Ly8gcGl4ZWxzIG1vdmVkIHBlciBhcnJvdyBrZXkgcHVzaFxyXG5cclxuICAgIC8vIFNldCB0byB0cnVlIHRvIGF1dG9tYXRpY2FsbHkgcm90YXRlIGFyb3VuZCB0aGUgdGFyZ2V0XHJcbiAgICB0aGlzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcclxuICAgIHRoaXMuYXV0b1JvdGF0ZVNwZWVkID0gMi4wOyAvLyAzMCBzZWNvbmRzIHBlciByb3VuZCB3aGVuIGZwcyBpcyA2MFxyXG5cclxuICAgIC8vIEhvdyBmYXIgeW91IGNhbiBvcmJpdCB2ZXJ0aWNhbGx5LCB1cHBlciBhbmQgbG93ZXIgbGltaXRzLlxyXG4gICAgLy8gUmFuZ2UgaXMgMCB0byBNYXRoLlBJIHJhZGlhbnMuXHJcbiAgICB0aGlzLm1pblBvbGFyQW5nbGUgPSAwOyAvLyByYWRpYW5zXHJcbiAgICB0aGlzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJOyAvLyByYWRpYW5zXHJcblxyXG4gICAgLy8gU2V0IHRvIHRydWUgdG8gZGlzYWJsZSB1c2Ugb2YgdGhlIGtleXNcclxuICAgIHRoaXMubm9LZXlzID0gZmFsc2U7XHJcblxyXG4gICAgLy8gVGhlIGZvdXIgYXJyb3cga2V5c1xyXG4gICAgdGhpcy5rZXlzID0geyBMRUZUOiAzNywgVVA6IDM4LCBSSUdIVDogMzksIEJPVFRPTTogNDAgfTtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy9cclxuICAgIC8vIGludGVybmFsc1xyXG5cclxuICAgIHZhciBzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgdmFyIEVQUyA9IDAuMDAwMDAxO1xyXG5cclxuICAgIHZhciByb3RhdGVTdGFydCA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcbiAgICB2YXIgcm90YXRlRW5kID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuICAgIHZhciByb3RhdGVEZWx0YSA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcblxyXG4gICAgdmFyIHBhblN0YXJ0ID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuICAgIHZhciBwYW5FbmQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xyXG4gICAgdmFyIHBhbkRlbHRhID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuICAgIHZhciBwYW5PZmZzZXQgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG5cclxuICAgIHZhciBvZmZzZXQgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG5cclxuICAgIHZhciBkb2xseVN0YXJ0ID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuICAgIHZhciBkb2xseUVuZCA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcbiAgICB2YXIgZG9sbHlEZWx0YSA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcblxyXG4gICAgdmFyIHBoaURlbHRhID0gMDtcclxuICAgIHZhciB0aGV0YURlbHRhID0gMDtcclxuICAgIHZhciBzY2FsZSA9IDE7XHJcbiAgICB2YXIgcGFuID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuXHJcbiAgICB2YXIgbGFzdFBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICAgIHZhciBsYXN0UXVhdGVybmlvbiA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCk7XHJcblxyXG4gICAgdmFyIFNUQVRFID0geyBOT05FOiAtMSwgUk9UQVRFOiAwLCBET0xMWTogMSwgUEFOOiAyLCBUT1VDSF9ST1RBVEU6IDMsIFRPVUNIX0RPTExZOiA0LCBUT1VDSF9QQU46IDUgfTtcclxuXHJcbiAgICB2YXIgc3RhdGUgPSBTVEFURS5OT05FO1xyXG5cclxuICAgIC8vIGZvciByZXNldFxyXG5cclxuICAgIHRoaXMudGFyZ2V0MCA9IHRoaXMudGFyZ2V0LmNsb25lKCk7XHJcbiAgICB0aGlzLnBvc2l0aW9uMCA9IHRoaXMub2JqZWN0LnBvc2l0aW9uLmNsb25lKCk7XHJcblxyXG4gICAgLy8gc28gY2FtZXJhLnVwIGlzIHRoZSBvcmJpdCBheGlzXHJcblxyXG4gICAgdmFyIHF1YXQgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21Vbml0VmVjdG9ycyhvYmplY3QudXAsIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEsIDApKTtcclxuICAgIHZhciBxdWF0SW52ZXJzZSA9IHF1YXQuY2xvbmUoKS5pbnZlcnNlKCk7XHJcblxyXG4gICAgLy8gZXZlbnRzXHJcblxyXG4gICAgdmFyIGNoYW5nZUV2ZW50ID0geyB0eXBlOiAnY2hhbmdlJyB9O1xyXG4gICAgdmFyIHN0YXJ0RXZlbnQgPSB7IHR5cGU6ICdzdGFydCd9O1xyXG4gICAgdmFyIGVuZEV2ZW50ID0geyB0eXBlOiAnZW5kJ307XHJcblxyXG4gICAgdGhpcy5yb3RhdGVMZWZ0ID0gZnVuY3Rpb24gKGFuZ2xlKSB7XHJcblxyXG4gICAgICAgIGlmIChhbmdsZSA9PT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICBhbmdsZSA9IGdldEF1dG9Sb3RhdGlvbkFuZ2xlKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhldGFEZWx0YSAtPSBhbmdsZTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucm90YXRlVXAgPSBmdW5jdGlvbiAoYW5nbGUpIHtcclxuXHJcbiAgICAgICAgaWYgKGFuZ2xlID09PSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgICAgIGFuZ2xlID0gZ2V0QXV0b1JvdGF0aW9uQW5nbGUoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwaGlEZWx0YSAtPSBhbmdsZTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIHBhc3MgaW4gZGlzdGFuY2UgaW4gd29ybGQgc3BhY2UgdG8gbW92ZSBsZWZ0XHJcbiAgICB0aGlzLnBhbkxlZnQgPSBmdW5jdGlvbiAoZGlzdGFuY2UpIHtcclxuXHJcbiAgICAgICAgdmFyIHRlID0gdGhpcy5vYmplY3QubWF0cml4LmVsZW1lbnRzO1xyXG5cclxuICAgICAgICAvLyBnZXQgWCBjb2x1bW4gb2YgbWF0cml4XHJcbiAgICAgICAgcGFuT2Zmc2V0LnNldCh0ZVsgMCBdLCB0ZVsgMSBdLCB0ZVsgMiBdKTtcclxuICAgICAgICBwYW5PZmZzZXQubXVsdGlwbHlTY2FsYXIoLWRpc3RhbmNlKTtcclxuXHJcbiAgICAgICAgcGFuLmFkZChwYW5PZmZzZXQpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgLy8gcGFzcyBpbiBkaXN0YW5jZSBpbiB3b3JsZCBzcGFjZSB0byBtb3ZlIHVwXHJcbiAgICB0aGlzLnBhblVwID0gZnVuY3Rpb24gKGRpc3RhbmNlKSB7XHJcblxyXG4gICAgICAgIHZhciB0ZSA9IHRoaXMub2JqZWN0Lm1hdHJpeC5lbGVtZW50cztcclxuXHJcbiAgICAgICAgLy8gZ2V0IFkgY29sdW1uIG9mIG1hdHJpeFxyXG4gICAgICAgIHBhbk9mZnNldC5zZXQodGVbIDQgXSwgdGVbIDUgXSwgdGVbIDYgXSk7XHJcbiAgICAgICAgcGFuT2Zmc2V0Lm11bHRpcGx5U2NhbGFyKGRpc3RhbmNlKTtcclxuXHJcbiAgICAgICAgcGFuLmFkZChwYW5PZmZzZXQpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgLy8gcGFzcyBpbiB4LHkgb2YgY2hhbmdlIGRlc2lyZWQgaW4gcGl4ZWwgc3BhY2UsXHJcbiAgICAvLyByaWdodCBhbmQgZG93biBhcmUgcG9zaXRpdmVcclxuICAgIHRoaXMucGFuID0gZnVuY3Rpb24gKGRlbHRhWCwgZGVsdGFZKSB7XHJcblxyXG4gICAgICAgIHZhciBlbGVtZW50ID0gc2NvcGUuZG9tRWxlbWVudCA9PT0gZG9jdW1lbnQgPyBzY29wZS5kb21FbGVtZW50LmJvZHkgOiBzY29wZS5kb21FbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAoc2NvcGUub2JqZWN0LmZvdiAhPT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBwZXJzcGVjdGl2ZVxyXG4gICAgICAgICAgICB2YXIgcG9zaXRpb24gPSBzY29wZS5vYmplY3QucG9zaXRpb247XHJcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBwb3NpdGlvbi5jbG9uZSgpLnN1YihzY29wZS50YXJnZXQpO1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0RGlzdGFuY2UgPSBvZmZzZXQubGVuZ3RoKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBoYWxmIG9mIHRoZSBmb3YgaXMgY2VudGVyIHRvIHRvcCBvZiBzY3JlZW5cclxuICAgICAgICAgICAgdGFyZ2V0RGlzdGFuY2UgKj0gTWF0aC50YW4oKCBzY29wZS5vYmplY3QuZm92IC8gMiApICogTWF0aC5QSSAvIDE4MC4wKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHdlIGFjdHVhbGx5IGRvbid0IHVzZSBzY3JlZW5XaWR0aCwgc2luY2UgcGVyc3BlY3RpdmUgY2FtZXJhIGlzIGZpeGVkIHRvIHNjcmVlbiBoZWlnaHRcclxuICAgICAgICAgICAgc2NvcGUucGFuTGVmdCgyICogZGVsdGFYICogdGFyZ2V0RGlzdGFuY2UgLyBlbGVtZW50LmNsaWVudEhlaWdodCk7XHJcbiAgICAgICAgICAgIHNjb3BlLnBhblVwKDIgKiBkZWx0YVkgKiB0YXJnZXREaXN0YW5jZSAvIGVsZW1lbnQuY2xpZW50SGVpZ2h0KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChzY29wZS5vYmplY3QudG9wICE9PSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIG9ydGhvZ3JhcGhpY1xyXG4gICAgICAgICAgICBzY29wZS5wYW5MZWZ0KGRlbHRhWCAqIChzY29wZS5vYmplY3QucmlnaHQgLSBzY29wZS5vYmplY3QubGVmdCkgLyBlbGVtZW50LmNsaWVudFdpZHRoKTtcclxuICAgICAgICAgICAgc2NvcGUucGFuVXAoZGVsdGFZICogKHNjb3BlLm9iamVjdC50b3AgLSBzY29wZS5vYmplY3QuYm90dG9tKSAvIGVsZW1lbnQuY2xpZW50SGVpZ2h0KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIC8vIGNhbWVyYSBuZWl0aGVyIG9ydGhvZ3JhcGhpYyBvciBwZXJzcGVjdGl2ZVxyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1dBUk5JTkc6IE9yYml0Q29udHJvbHMuanMgZW5jb3VudGVyZWQgYW4gdW5rbm93biBjYW1lcmEgdHlwZSAtIHBhbiBkaXNhYmxlZC4nKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5kb2xseUluID0gZnVuY3Rpb24gKGRvbGx5U2NhbGUpIHtcclxuXHJcbiAgICAgICAgaWYgKGRvbGx5U2NhbGUgPT09IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICAgICAgZG9sbHlTY2FsZSA9IGdldFpvb21TY2FsZSgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNjYWxlIC89IGRvbGx5U2NhbGU7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmRvbGx5T3V0ID0gZnVuY3Rpb24gKGRvbGx5U2NhbGUpIHtcclxuXHJcbiAgICAgICAgaWYgKGRvbGx5U2NhbGUgPT09IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICAgICAgZG9sbHlTY2FsZSA9IGdldFpvb21TY2FsZSgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNjYWxlICo9IGRvbGx5U2NhbGU7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gdGhpcy5vYmplY3QucG9zaXRpb247XHJcblxyXG4gICAgICAgIG9mZnNldC5jb3B5KHBvc2l0aW9uKS5zdWIodGhpcy50YXJnZXQpO1xyXG5cclxuICAgICAgICAvLyByb3RhdGUgb2Zmc2V0IHRvIFwieS1heGlzLWlzLXVwXCIgc3BhY2VcclxuICAgICAgICBvZmZzZXQuYXBwbHlRdWF0ZXJuaW9uKHF1YXQpO1xyXG5cclxuICAgICAgICAvLyBhbmdsZSBmcm9tIHotYXhpcyBhcm91bmQgeS1heGlzXHJcblxyXG4gICAgICAgIHZhciB0aGV0YSA9IE1hdGguYXRhbjIob2Zmc2V0LngsIG9mZnNldC56KTtcclxuXHJcbiAgICAgICAgLy8gYW5nbGUgZnJvbSB5LWF4aXNcclxuXHJcbiAgICAgICAgdmFyIHBoaSA9IE1hdGguYXRhbjIoTWF0aC5zcXJ0KG9mZnNldC54ICogb2Zmc2V0LnggKyBvZmZzZXQueiAqIG9mZnNldC56KSwgb2Zmc2V0LnkpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5hdXRvUm90YXRlKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJvdGF0ZUxlZnQoZ2V0QXV0b1JvdGF0aW9uQW5nbGUoKSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhldGEgKz0gdGhldGFEZWx0YTtcclxuICAgICAgICBwaGkgKz0gcGhpRGVsdGE7XHJcblxyXG4gICAgICAgIC8vIHJlc3RyaWN0IHBoaSB0byBiZSBiZXR3ZWVuIGRlc2lyZWQgbGltaXRzXHJcbiAgICAgICAgcGhpID0gTWF0aC5tYXgodGhpcy5taW5Qb2xhckFuZ2xlLCBNYXRoLm1pbih0aGlzLm1heFBvbGFyQW5nbGUsIHBoaSkpO1xyXG5cclxuICAgICAgICAvLyByZXN0cmljdCBwaGkgdG8gYmUgYmV0d2VlIEVQUyBhbmQgUEktRVBTXHJcbiAgICAgICAgcGhpID0gTWF0aC5tYXgoRVBTLCBNYXRoLm1pbihNYXRoLlBJIC0gRVBTLCBwaGkpKTtcclxuXHJcbiAgICAgICAgdmFyIHJhZGl1cyA9IG9mZnNldC5sZW5ndGgoKSAqIHNjYWxlO1xyXG5cclxuICAgICAgICAvLyByZXN0cmljdCByYWRpdXMgdG8gYmUgYmV0d2VlbiBkZXNpcmVkIGxpbWl0c1xyXG4gICAgICAgIHJhZGl1cyA9IE1hdGgubWF4KHRoaXMubWluRGlzdGFuY2UsIE1hdGgubWluKHRoaXMubWF4RGlzdGFuY2UsIHJhZGl1cykpO1xyXG5cclxuICAgICAgICAvLyBtb3ZlIHRhcmdldCB0byBwYW5uZWQgbG9jYXRpb25cclxuICAgICAgICB0aGlzLnRhcmdldC5hZGQocGFuKTtcclxuXHJcbiAgICAgICAgb2Zmc2V0LnggPSByYWRpdXMgKiBNYXRoLnNpbihwaGkpICogTWF0aC5zaW4odGhldGEpO1xyXG4gICAgICAgIG9mZnNldC55ID0gcmFkaXVzICogTWF0aC5jb3MocGhpKTtcclxuICAgICAgICBvZmZzZXQueiA9IHJhZGl1cyAqIE1hdGguc2luKHBoaSkgKiBNYXRoLmNvcyh0aGV0YSk7XHJcblxyXG4gICAgICAgIC8vIHJvdGF0ZSBvZmZzZXQgYmFjayB0byBcImNhbWVyYS11cC12ZWN0b3ItaXMtdXBcIiBzcGFjZVxyXG4gICAgICAgIG9mZnNldC5hcHBseVF1YXRlcm5pb24ocXVhdEludmVyc2UpO1xyXG5cclxuICAgICAgICBwb3NpdGlvbi5jb3B5KHRoaXMudGFyZ2V0KS5hZGQob2Zmc2V0KTtcclxuXHJcbiAgICAgICAgdGhpcy5vYmplY3QubG9va0F0KHRoaXMudGFyZ2V0KTtcclxuXHJcbiAgICAgICAgdGhldGFEZWx0YSA9IDA7XHJcbiAgICAgICAgcGhpRGVsdGEgPSAwO1xyXG4gICAgICAgIHNjYWxlID0gMTtcclxuICAgICAgICBwYW4uc2V0KDAsIDAsIDApO1xyXG5cclxuICAgICAgICAvLyB1cGRhdGUgY29uZGl0aW9uIGlzOlxyXG4gICAgICAgIC8vIG1pbihjYW1lcmEgZGlzcGxhY2VtZW50LCBjYW1lcmEgcm90YXRpb24gaW4gcmFkaWFucyleMiA+IEVQU1xyXG4gICAgICAgIC8vIHVzaW5nIHNtYWxsLWFuZ2xlIGFwcHJveGltYXRpb24gY29zKHgvMikgPSAxIC0geF4yIC8gOFxyXG5cclxuICAgICAgICBpZiAobGFzdFBvc2l0aW9uLmRpc3RhbmNlVG9TcXVhcmVkKHRoaXMub2JqZWN0LnBvc2l0aW9uKSA+IEVQU1xyXG4gICAgICAgICAgICB8fCA4ICogKDEgLSBsYXN0UXVhdGVybmlvbi5kb3QodGhpcy5vYmplY3QucXVhdGVybmlvbikpID4gRVBTKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoY2hhbmdlRXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgbGFzdFBvc2l0aW9uLmNvcHkodGhpcy5vYmplY3QucG9zaXRpb24pO1xyXG4gICAgICAgICAgICBsYXN0UXVhdGVybmlvbi5jb3B5KHRoaXMub2JqZWN0LnF1YXRlcm5pb24pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBlbGVtZW50ID0gc2NvcGUuZG9tRWxlbWVudCA9PT0gZG9jdW1lbnQgPyBzY29wZS5kb21FbGVtZW50LmJvZHkgOiBzY29wZS5kb21FbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudC5jbGllbnRXaWR0aCA+IDAgJiYgZWxlbWVudC5jbGllbnRIZWlnaHQgPiAwKSB7XHJcbiAgICAgICAgICAgIC8vIHJvdGF0aW5nIGFjcm9zcyB3aG9sZSBzY3JlZW4gZ29lcyAzNjAgZGVncmVlcyBhcm91bmRcclxuICAgICAgICAgICAgc2NvcGUucm90YXRlTGVmdCgyICogTWF0aC5QSSAqIHJvdGF0ZURlbHRhLnggLyBlbGVtZW50LmNsaWVudFdpZHRoICogc2NvcGUucm90YXRlU3BlZWQpO1xyXG5cclxuICAgICAgICAgICAgLy8gcm90YXRpbmcgdXAgYW5kIGRvd24gYWxvbmcgd2hvbGUgc2NyZWVuIGF0dGVtcHRzIHRvIGdvIDM2MCwgYnV0IGxpbWl0ZWQgdG8gMTgwXHJcbiAgICAgICAgICAgIHNjb3BlLnJvdGF0ZVVwKDIgKiBNYXRoLlBJICogcm90YXRlRGVsdGEueSAvIGVsZW1lbnQuY2xpZW50SGVpZ2h0ICogc2NvcGUucm90YXRlU3BlZWQpO1xyXG5cclxuICAgICAgICAgICAgcm90YXRlRGVsdGEubXVsdGlwbHlTY2FsYXIoMC45OSlcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgdGhpcy5yZXNldCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgc3RhdGUgPSBTVEFURS5OT05FO1xyXG5cclxuICAgICAgICB0aGlzLnRhcmdldC5jb3B5KHRoaXMudGFyZ2V0MCk7XHJcbiAgICAgICAgdGhpcy5vYmplY3QucG9zaXRpb24uY29weSh0aGlzLnBvc2l0aW9uMCk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRBdXRvUm90YXRpb25BbmdsZSgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIDIgKiBNYXRoLlBJIC8gNjAgLyA2MCAqIHNjb3BlLmF1dG9Sb3RhdGVTcGVlZDtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Wm9vbVNjYWxlKCkge1xyXG5cclxuICAgICAgICByZXR1cm4gTWF0aC5wb3coMC45NSwgc2NvcGUuem9vbVNwZWVkKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25Nb3VzZURvd24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKSByZXR1cm47XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gMCkge1xyXG4gICAgICAgICAgICBpZiAoc2NvcGUubm9Sb3RhdGUgPT09IHRydWUpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHN0YXRlID0gU1RBVEUuUk9UQVRFO1xyXG5cclxuICAgICAgICAgICAgcm90YXRlU3RhcnQuc2V0KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gMSkge1xyXG4gICAgICAgICAgICBpZiAoc2NvcGUubm9ab29tID09PSB0cnVlKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBzdGF0ZSA9IFNUQVRFLkRPTExZO1xyXG5cclxuICAgICAgICAgICAgZG9sbHlTdGFydC5zZXQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuYnV0dG9uID09PSAyKSB7XHJcbiAgICAgICAgICAgIGlmIChzY29wZS5ub1BhbiA9PT0gdHJ1ZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5QQU47XHJcblxyXG4gICAgICAgICAgICBwYW5TdGFydC5zZXQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUsIGZhbHNlKTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwLCBmYWxzZSk7XHJcbiAgICAgICAgc2NvcGUuZGlzcGF0Y2hFdmVudChzdGFydEV2ZW50KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIHZhciBlbGVtZW50ID0gc2NvcGUuZG9tRWxlbWVudCA9PT0gZG9jdW1lbnQgPyBzY29wZS5kb21FbGVtZW50LmJvZHkgOiBzY29wZS5kb21FbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAoc3RhdGUgPT09IFNUQVRFLlJPVEFURSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHNjb3BlLm5vUm90YXRlID09PSB0cnVlKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICByb3RhdGVFbmQuc2V0KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xyXG4gICAgICAgICAgICByb3RhdGVEZWx0YS5zdWJWZWN0b3JzKHJvdGF0ZUVuZCwgcm90YXRlU3RhcnQpO1xyXG5cclxuICAgICAgICAgICAgLy8gcm90YXRpbmcgYWNyb3NzIHdob2xlIHNjcmVlbiBnb2VzIDM2MCBkZWdyZWVzIGFyb3VuZFxyXG4gICAgICAgICAgICBzY29wZS5yb3RhdGVMZWZ0KDIgKiBNYXRoLlBJICogcm90YXRlRGVsdGEueCAvIGVsZW1lbnQuY2xpZW50V2lkdGggKiBzY29wZS5yb3RhdGVTcGVlZCk7XHJcblxyXG4gICAgICAgICAgICAvLyByb3RhdGluZyB1cCBhbmQgZG93biBhbG9uZyB3aG9sZSBzY3JlZW4gYXR0ZW1wdHMgdG8gZ28gMzYwLCBidXQgbGltaXRlZCB0byAxODBcclxuICAgICAgICAgICAgc2NvcGUucm90YXRlVXAoMiAqIE1hdGguUEkgKiByb3RhdGVEZWx0YS55IC8gZWxlbWVudC5jbGllbnRIZWlnaHQgKiBzY29wZS5yb3RhdGVTcGVlZCk7XHJcblxyXG4gICAgICAgICAgICByb3RhdGVTdGFydC5jb3B5KHJvdGF0ZUVuZCk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IFNUQVRFLkRPTExZKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2NvcGUubm9ab29tID09PSB0cnVlKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBkb2xseUVuZC5zZXQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XHJcbiAgICAgICAgICAgIGRvbGx5RGVsdGEuc3ViVmVjdG9ycyhkb2xseUVuZCwgZG9sbHlTdGFydCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZG9sbHlEZWx0YS55ID4gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHNjb3BlLmRvbGx5SW4oKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgc2NvcGUuZG9sbHlPdXQoKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGRvbGx5U3RhcnQuY29weShkb2xseUVuZCk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IFNUQVRFLlBBTikge1xyXG5cclxuICAgICAgICAgICAgaWYgKHNjb3BlLm5vUGFuID09PSB0cnVlKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBwYW5FbmQuc2V0KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xyXG4gICAgICAgICAgICBwYW5EZWx0YS5zdWJWZWN0b3JzKHBhbkVuZCwgcGFuU3RhcnQpO1xyXG5cclxuICAgICAgICAgICAgc2NvcGUucGFuKHBhbkRlbHRhLngsIHBhbkRlbHRhLnkpO1xyXG5cclxuICAgICAgICAgICAgcGFuU3RhcnQuY29weShwYW5FbmQpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNjb3BlLnVwZGF0ZSgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbk1vdXNlVXAoLyogZXZlbnQgKi8pIHtcclxuXHJcbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlLCBmYWxzZSk7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCwgZmFsc2UpO1xyXG4gICAgICAgIHNjb3BlLmRpc3BhdGNoRXZlbnQoZW5kRXZlbnQpO1xyXG4gICAgICAgIHN0YXRlID0gU1RBVEUuTk9ORTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25Nb3VzZVdoZWVsKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIGlmIChzY29wZS5lbmFibGVkID09PSBmYWxzZSB8fCBzY29wZS5ub1pvb20gPT09IHRydWUpIHJldHVybjtcclxuXHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgdmFyIGRlbHRhID0gMDtcclxuXHJcbiAgICAgICAgaWYgKGV2ZW50LndoZWVsRGVsdGEgIT09IHVuZGVmaW5lZCkgeyAvLyBXZWJLaXQgLyBPcGVyYSAvIEV4cGxvcmVyIDlcclxuXHJcbiAgICAgICAgICAgIGRlbHRhID0gZXZlbnQud2hlZWxEZWx0YTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5kZXRhaWwgIT09IHVuZGVmaW5lZCkgeyAvLyBGaXJlZm94XHJcblxyXG4gICAgICAgICAgICBkZWx0YSA9IC1ldmVudC5kZXRhaWw7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRlbHRhID4gMCkge1xyXG5cclxuICAgICAgICAgICAgc2NvcGUuZG9sbHlPdXQoKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLmRvbGx5SW4oKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzY29wZS51cGRhdGUoKTtcclxuICAgICAgICBzY29wZS5kaXNwYXRjaEV2ZW50KHN0YXJ0RXZlbnQpO1xyXG4gICAgICAgIHNjb3BlLmRpc3BhdGNoRXZlbnQoZW5kRXZlbnQpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbktleURvd24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlIHx8IHNjb3BlLm5vS2V5cyA9PT0gdHJ1ZSB8fCBzY29wZS5ub1BhbiA9PT0gdHJ1ZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcclxuXHJcbiAgICAgICAgICAgIGNhc2Ugc2NvcGUua2V5cy5VUDpcclxuICAgICAgICAgICAgICAgIHNjb3BlLnBhbigwLCBzY29wZS5rZXlQYW5TcGVlZCk7XHJcbiAgICAgICAgICAgICAgICBzY29wZS51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBzY29wZS5rZXlzLkJPVFRPTTpcclxuICAgICAgICAgICAgICAgIHNjb3BlLnBhbigwLCAtc2NvcGUua2V5UGFuU3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgc2NvcGUudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2Ugc2NvcGUua2V5cy5MRUZUOlxyXG4gICAgICAgICAgICAgICAgc2NvcGUucGFuKHNjb3BlLmtleVBhblNwZWVkLCAwKTtcclxuICAgICAgICAgICAgICAgIHNjb3BlLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIHNjb3BlLmtleXMuUklHSFQ6XHJcbiAgICAgICAgICAgICAgICBzY29wZS5wYW4oLXNjb3BlLmtleVBhblNwZWVkLCAwKTtcclxuICAgICAgICAgICAgICAgIHNjb3BlLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG91Y2hzdGFydChldmVudCkge1xyXG5cclxuICAgICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UpIHJldHVybjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChldmVudC50b3VjaGVzLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgY2FzZSAxOlx0Ly8gb25lLWZpbmdlcmVkIHRvdWNoOiByb3RhdGVcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUubm9Sb3RhdGUgPT09IHRydWUpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IFNUQVRFLlRPVUNIX1JPVEFURTtcclxuXHJcbiAgICAgICAgICAgICAgICByb3RhdGVTdGFydC5zZXQoZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYLCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDI6XHQvLyB0d28tZmluZ2VyZWQgdG91Y2g6IGRvbGx5XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLm5vWm9vbSA9PT0gdHJ1ZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIHN0YXRlID0gU1RBVEUuVE9VQ0hfRE9MTFk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGR4ID0gZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYIC0gZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VYO1xyXG4gICAgICAgICAgICAgICAgdmFyIGR5ID0gZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZIC0gZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VZO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuICAgICAgICAgICAgICAgIGRvbGx5U3RhcnQuc2V0KDAsIGRpc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAzOiAvLyB0aHJlZS1maW5nZXJlZCB0b3VjaDogcGFuXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLm5vUGFuID09PSB0cnVlKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5UT1VDSF9QQU47XHJcblxyXG4gICAgICAgICAgICAgICAgcGFuU3RhcnQuc2V0KGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCwgZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IFNUQVRFLk5PTkU7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2NvcGUuZGlzcGF0Y2hFdmVudChzdGFydEV2ZW50KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG91Y2htb3ZlKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIGlmIChzY29wZS5lbmFibGVkID09PSBmYWxzZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICB2YXIgZWxlbWVudCA9IHNjb3BlLmRvbUVsZW1lbnQgPT09IGRvY3VtZW50ID8gc2NvcGUuZG9tRWxlbWVudC5ib2R5IDogc2NvcGUuZG9tRWxlbWVudDtcclxuXHJcbiAgICAgICAgc3dpdGNoIChldmVudC50b3VjaGVzLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgY2FzZSAxOiAvLyBvbmUtZmluZ2VyZWQgdG91Y2g6IHJvdGF0ZVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzY29wZS5ub1JvdGF0ZSA9PT0gdHJ1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlICE9PSBTVEFURS5UT1VDSF9ST1RBVEUpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICByb3RhdGVFbmQuc2V0KGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCwgZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZKTtcclxuICAgICAgICAgICAgICAgIHJvdGF0ZURlbHRhLnN1YlZlY3RvcnMocm90YXRlRW5kLCByb3RhdGVTdGFydCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gcm90YXRpbmcgYWNyb3NzIHdob2xlIHNjcmVlbiBnb2VzIDM2MCBkZWdyZWVzIGFyb3VuZFxyXG4gICAgICAgICAgICAgICAgc2NvcGUucm90YXRlTGVmdCgyICogTWF0aC5QSSAqIHJvdGF0ZURlbHRhLnggLyBlbGVtZW50LmNsaWVudFdpZHRoICogc2NvcGUucm90YXRlU3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgLy8gcm90YXRpbmcgdXAgYW5kIGRvd24gYWxvbmcgd2hvbGUgc2NyZWVuIGF0dGVtcHRzIHRvIGdvIDM2MCwgYnV0IGxpbWl0ZWQgdG8gMTgwXHJcbiAgICAgICAgICAgICAgICBzY29wZS5yb3RhdGVVcCgyICogTWF0aC5QSSAqIHJvdGF0ZURlbHRhLnkgLyBlbGVtZW50LmNsaWVudEhlaWdodCAqIHNjb3BlLnJvdGF0ZVNwZWVkKTtcclxuXHJcbiAgICAgICAgICAgICAgICByb3RhdGVTdGFydC5jb3B5KHJvdGF0ZUVuZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2NvcGUudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgMjogLy8gdHdvLWZpbmdlcmVkIHRvdWNoOiBkb2xseVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzY29wZS5ub1pvb20gPT09IHRydWUpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSAhPT0gU1RBVEUuVE9VQ0hfRE9MTFkpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZHggPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVg7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHkgPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRvbGx5RW5kLnNldCgwLCBkaXN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICBkb2xseURlbHRhLnN1YlZlY3RvcnMoZG9sbHlFbmQsIGRvbGx5U3RhcnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkb2xseURlbHRhLnkgPiAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmRvbGx5T3V0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuZG9sbHlJbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBkb2xseVN0YXJ0LmNvcHkoZG9sbHlFbmQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHNjb3BlLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDM6IC8vIHRocmVlLWZpbmdlcmVkIHRvdWNoOiBwYW5cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUubm9QYW4gPT09IHRydWUpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSAhPT0gU1RBVEUuVE9VQ0hfUEFOKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgcGFuRW5kLnNldChldmVudC50b3VjaGVzWyAwIF0ucGFnZVgsIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSk7XHJcbiAgICAgICAgICAgICAgICBwYW5EZWx0YS5zdWJWZWN0b3JzKHBhbkVuZCwgcGFuU3RhcnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHNjb3BlLnBhbihwYW5EZWx0YS54LCBwYW5EZWx0YS55KTtcclxuXHJcbiAgICAgICAgICAgICAgICBwYW5TdGFydC5jb3B5KHBhbkVuZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2NvcGUudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcblxyXG4gICAgICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5OT05FO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvdWNoZW5kKC8qIGV2ZW50ICovKSB7XHJcblxyXG4gICAgICAgIGlmIChzY29wZS5lbmFibGVkID09PSBmYWxzZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBzY29wZS5kaXNwYXRjaEV2ZW50KGVuZEV2ZW50KTtcclxuICAgICAgICBzdGF0ZSA9IFNUQVRFLk5PTkU7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9LCBmYWxzZSk7XHJcbiAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Nb3VzZURvd24sIGZhbHNlKTtcclxuICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXdoZWVsJywgb25Nb3VzZVdoZWVsLCBmYWxzZSk7XHJcbiAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLCBvbk1vdXNlV2hlZWwsIGZhbHNlKTsgLy8gZmlyZWZveFxyXG5cclxuICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdG91Y2hzdGFydCwgZmFsc2UpO1xyXG4gICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdG91Y2hlbmQsIGZhbHNlKTtcclxuICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0b3VjaG1vdmUsIGZhbHNlKTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5RG93biwgZmFsc2UpO1xyXG5cclxuICAgIC8vIGZvcmNlIGFuIHVwZGF0ZSBhdCBzdGFydFxyXG4gICAgdGhpcy51cGRhdGUoKTtcclxuXHJcbn07XHJcblxyXG5USFJFRS5PcmJpdENvbnRyb2xzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVEhSRUUuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIHdpbmRvdy5RdWV1ZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gUXVldWUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFpbCA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmhlYWQgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB0aGlzLm9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIC8vIExvY2sgdGhlIG9iamVjdCBkb3duXHJcbiAgICAgICAgICAgIE9iamVjdC5zZWFsKHRoaXMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIFF1ZXVlLnByb3RvdHlwZS5zaGlmdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub2Zmc2V0ID09PSB0aGlzLmhlYWQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG1wID0gdGhpcy5oZWFkO1xyXG4gICAgICAgICAgICAgICAgdG1wLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWQgPSB0aGlzLnRhaWw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhaWwgPSB0bXA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWFkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhlYWRbdGhpcy5vZmZzZXQrK107XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgUXVldWUucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50YWlsLnB1c2goaXRlbSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgUXVldWUucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVhZC5sZW5ndGggLSB0aGlzLm9mZnNldCArIHRoaXMudGFpbC5sZW5ndGg7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFF1ZXVlO1xyXG4gICAgfSkoKTtcclxufSkuY2FsbCh0aGlzKSJdfQ==
