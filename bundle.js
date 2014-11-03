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
require('./Config.coffee');

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
    this.refreshRoutines();
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
    this.updateText();
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
    var change, _i, _len, _ref, _results;
    if (this.routineBeat === this.routine.length - 1) {
      this.routineBeat = -1;
    }
    this.routineMoment = this.routine[++this.routineBeat];
    _ref = this.routineMoment;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      change = _ref[_i];
      _results.push(this.visualizer.receiveChoreography(change));
    }
    return _results;
  };

  ChoreographyRoutine.prototype.reset = function() {
    this.routine = [];
    this.routineMoment = [];
    return this.routineBeat = -1;
  };

  ChoreographyRoutine.prototype.updateText = function() {
    return this.visualizer["interface"].updateText(this.routine);
  };

  ChoreographyRoutine.prototype.refreshRoutines = function() {
    return $.ajax({
      url: Config.server + '/routines',
      jsonp: 'callback',
      dataType: 'jsonp',
      type: 'GET',
      success: (function(_this) {
        return function(data) {
          return _this.routines = JSON.parse(data);
        };
      })(this)
    });
  };

  ChoreographyRoutine.prototype.updateDancer = function(dancer) {
    this.dancer = dancer.constructor.name;
    this.danceMaterial = dancer.danceMaterial.constructor.name;
    return this.dance = dancer.dance.constructor.name;
  };

  return ChoreographyRoutine;

})();



},{"./Config.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\Config.coffee"}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\Config.coffee":[function(require,module,exports){
window.Config = (function() {
  function Config() {}

  Config.server = 'http://localhost:3000';

  return Config;

})();



},{}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\DatGUIInterface.coffee":[function(require,module,exports){
window.DatGUIInterface = (function() {
  function DatGUIInterface() {
    this.routineWindow = $('#routine');
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
    return this.setupPopup();
  };

  DatGUIInterface.prototype.setupPopup = function() {
    return $('#viewerButton').click((function(_this) {
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
  };

  DatGUIInterface.prototype.updateText = function(json) {
    return this.routineWindow.html(JSON.stringify(json, void 0, 2));
  };

  return DatGUIInterface;

})();



},{}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\Main.coffee":[function(require,module,exports){
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

require('./Visualizer.coffee');

require('../javascript/OrbitControls');

require('./Viewer.coffee');

require('./DatGUIInterface.coffee');

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



},{"../javascript/OrbitControls":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\javascript\\OrbitControls.js","./DatGUIInterface.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\DatGUIInterface.coffee","./Viewer.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\Viewer.coffee","./Visualizer.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\Visualizer.coffee"}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\Player.coffee":[function(require,module,exports){
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



},{"./AudioWindow.coffee":"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\AudioWindow.coffee"}],"C:\\Users\\Ulysses\\Development\\webgl-visualizer\\coffee\\ShaderLoader.coffee":[function(require,module,exports){
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

  function Visualizer(viewer, _interface) {
    this.viewer = viewer;
    this["interface"] = _interface;
    this.player = new Player();
    this.player.createLiveInput();
    this.choreographyRoutine = new ChoreographyRoutine(this);
    this["interface"].setupPopup();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxQcm9ncmFtRGF0YVxcY2hvY29sYXRleVxcbGliXFxub2RlanMuY29tbWFuZGxpbmUuMC4xMC4zM1xcdG9vbHNcXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzpcXFVzZXJzXFxVbHlzc2VzXFxEZXZlbG9wbWVudFxcd2ViZ2wtdmlzdWFsaXplclxcY29mZmVlXFxBdWRpb1dpbmRvdy5jb2ZmZWUiLCJDOlxcVXNlcnNcXFVseXNzZXNcXERldmVsb3BtZW50XFx3ZWJnbC12aXN1YWxpemVyXFxjb2ZmZWVcXENob3Jlb2dyYXBoeVJvdXRpbmUuY29mZmVlIiwiQzpcXFVzZXJzXFxVbHlzc2VzXFxEZXZlbG9wbWVudFxcd2ViZ2wtdmlzdWFsaXplclxcY29mZmVlXFxDb25maWcuY29mZmVlIiwiQzpcXFVzZXJzXFxVbHlzc2VzXFxEZXZlbG9wbWVudFxcd2ViZ2wtdmlzdWFsaXplclxcY29mZmVlXFxEYXRHVUlJbnRlcmZhY2UuY29mZmVlIiwiQzpcXFVzZXJzXFxVbHlzc2VzXFxEZXZlbG9wbWVudFxcd2ViZ2wtdmlzdWFsaXplclxcY29mZmVlXFxNYWluLmNvZmZlZSIsIkM6XFxVc2Vyc1xcVWx5c3Nlc1xcRGV2ZWxvcG1lbnRcXHdlYmdsLXZpc3VhbGl6ZXJcXGNvZmZlZVxcUGxheWVyLmNvZmZlZSIsIkM6XFxVc2Vyc1xcVWx5c3Nlc1xcRGV2ZWxvcG1lbnRcXHdlYmdsLXZpc3VhbGl6ZXJcXGNvZmZlZVxcU2hhZGVyTG9hZGVyLmNvZmZlZSIsIkM6XFxVc2Vyc1xcVWx5c3Nlc1xcRGV2ZWxvcG1lbnRcXHdlYmdsLXZpc3VhbGl6ZXJcXGNvZmZlZVxcVmlld2VyLmNvZmZlZSIsIkM6XFxVc2Vyc1xcVWx5c3Nlc1xcRGV2ZWxvcG1lbnRcXHdlYmdsLXZpc3VhbGl6ZXJcXGNvZmZlZVxcVmlzdWFsaXplci5jb2ZmZWUiLCJDOlxcVXNlcnNcXFVseXNzZXNcXERldmVsb3BtZW50XFx3ZWJnbC12aXN1YWxpemVyXFxjb2ZmZWVcXGRhbmNlTWF0ZXJpYWxzXFxDb2xvckRhbmNlTWF0ZXJpYWwuY29mZmVlIiwiQzpcXFVzZXJzXFxVbHlzc2VzXFxEZXZlbG9wbWVudFxcd2ViZ2wtdmlzdWFsaXplclxcY29mZmVlXFxkYW5jZU1hdGVyaWFsc1xcU2ltcGxlRnJlcXVlbmN5U2hhZGVyLmNvZmZlZSIsIkM6XFxVc2Vyc1xcVWx5c3Nlc1xcRGV2ZWxvcG1lbnRcXHdlYmdsLXZpc3VhbGl6ZXJcXGNvZmZlZVxcZGFuY2Vyc1xcQ3ViZURhbmNlci5jb2ZmZWUiLCJDOlxcVXNlcnNcXFVseXNzZXNcXERldmVsb3BtZW50XFx3ZWJnbC12aXN1YWxpemVyXFxjb2ZmZWVcXGRhbmNlcnNcXERhbmNlci5jb2ZmZWUiLCJDOlxcVXNlcnNcXFVseXNzZXNcXERldmVsb3BtZW50XFx3ZWJnbC12aXN1YWxpemVyXFxjb2ZmZWVcXGRhbmNlcnNcXFBvaW50Q2xvdWREYW5jZXIuY29mZmVlIiwiQzpcXFVzZXJzXFxVbHlzc2VzXFxEZXZlbG9wbWVudFxcd2ViZ2wtdmlzdWFsaXplclxcY29mZmVlXFxkYW5jZXJzXFxTcGhlcmVEYW5jZXIuY29mZmVlIiwiQzpcXFVzZXJzXFxVbHlzc2VzXFxEZXZlbG9wbWVudFxcd2ViZ2wtdmlzdWFsaXplclxcY29mZmVlXFxkYW5jZXNcXFBvc2l0aW9uRGFuY2UuY29mZmVlIiwiQzpcXFVzZXJzXFxVbHlzc2VzXFxEZXZlbG9wbWVudFxcd2ViZ2wtdmlzdWFsaXplclxcY29mZmVlXFxkYW5jZXNcXFJvdGF0ZURhbmNlLmNvZmZlZSIsIkM6XFxVc2Vyc1xcVWx5c3Nlc1xcRGV2ZWxvcG1lbnRcXHdlYmdsLXZpc3VhbGl6ZXJcXGNvZmZlZVxcZGFuY2VzXFxTY2FsZURhbmNlLmNvZmZlZSIsImphdmFzY3JpcHRcXE9yYml0Q29udHJvbHMuanMiLCJqYXZhc2NyaXB0XFxRdWV1ZS5qcyJdLCJuYW1lcyI6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Q0FBQTs7Ozs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIENvbnRhaW5zIHRoZSBmcmVxdWVuY3lTYW1wbGVzIGFuZCBkYlNhbXBsZXMgZm9yIGF1ZGlvXHJcbmNsYXNzIHdpbmRvdy5BdWRpb1dpbmRvd1xyXG4gIEBidWZmZXJTaXplOiAyMDQ4XHJcblxyXG4gIGNvbnN0cnVjdG9yOiAocmVzcG9uc2l2ZW5lc3MpIC0+XHJcbiAgICBAcmVzcG9uc2l2ZW5lc3MgPSByZXNwb25zaXZlbmVzc1xyXG4gICAgQGZyZXF1ZW5jeUJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KEBjb25zdHJ1Y3Rvci5idWZmZXJTaXplKVxyXG4gICAgQGRiQnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoQGNvbnN0cnVjdG9yLmJ1ZmZlclNpemUpXHJcbiAgICBAdGltZSA9IDBcclxuICAgIEBkZWx0YVRpbWUgPSAwXHJcblxyXG4gIHVwZGF0ZTogKGFuYWx5c2VyLCB0aW1lKSAtPlxyXG4gICAgaWYgIWFuYWx5c2VyXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgICMgS2VlcCB0cmFjayBvZiB0aGUgYXVkaW9Db250ZXh0IHRpbWUgaW4gbXNcclxuICAgIG5ld1RpbWUgPSB0aW1lICogMTAwMFxyXG4gICAgQGRlbHRhVGltZSA9IG5ld1RpbWUgLSBAdGltZVxyXG4gICAgQHRpbWUgPSBuZXdUaW1lXHJcblxyXG4gICAgYW5hbHlzZXIuZ2V0Qnl0ZVRpbWVEb21haW5EYXRhKEBkYkJ1ZmZlcilcclxuICAgIGFuYWx5c2VyLmdldEJ5dGVGcmVxdWVuY3lEYXRhKEBmcmVxdWVuY3lCdWZmZXIpXHJcblxyXG4gICAgcm1zID0gMFxyXG5cclxuICAgIGZvciBidWYgaW4gQGRiQnVmZmVyXHJcbiAgICAgICAgdmFsID0gKGJ1ZiAtIDEyOCkgLyAxMjhcclxuICAgICAgICBybXMgKz0gdmFsKnZhbFxyXG5cclxuICAgIEBhdmVyYWdlRGIgPSBNYXRoLnNxcnQocm1zIC8gQGNvbnN0cnVjdG9yLmJ1ZmZlclNpemUpICogQHJlc3BvbnNpdmVuZXNzIiwicmVxdWlyZSgnLi9Db25maWcuY29mZmVlJylcclxuXHJcbmNsYXNzIHdpbmRvdy5DaG9yZW9ncmFwaHlSb3V0aW5lXHJcbiAgY29uc3RydWN0b3I6IChAdmlzdWFsaXplcikgLT5cclxuICAgIEBpZCA9IDBcclxuICAgIEBkYW5jZXIgPSBcIkN1YmVEYW5jZXJcIlxyXG4gICAgQGRhbmNlID0gXCJTY2FsZURhbmNlXCJcclxuICAgIEBkYW5jZU1hdGVyaWFsID0gXCJDb2xvckRhbmNlTWF0ZXJpYWxcIlxyXG4gICAgQGRhbmNlclBhcmFtcyA9IHt9XHJcbiAgICBAZGFuY2VQYXJhbXMgPSB7fVxyXG4gICAgQGRhbmNlTWF0ZXJpYWxQYXJhbXMgPSB7fVxyXG5cclxuICAgIEByZWZyZXNoUm91dGluZXMoKVxyXG5cclxuICAgIEByZXNldCgpXHJcbiAgICBAcm91dGluZSA9IFtcclxuICAgICAgW1xyXG4gICAgICAgIHsgaWQ6IC0xIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6IDJcclxuICAgICAgICAgIGRhbmNlcjpcclxuICAgICAgICAgICAgdHlwZTogJ0N1YmVEYW5jZXInXHJcbiAgICAgICAgICBkYW5jZTpcclxuICAgICAgICAgICAgdHlwZTogJ1Bvc2l0aW9uRGFuY2UnXHJcbiAgICAgICAgICAgIHBhcmFtczpcclxuICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxyXG4gICAgICAgICAgICAgIGRpcmVjdGlvbjogWzAsIDQuMCwgMF1cclxuICAgICAgICAgIGRhbmNlTWF0ZXJpYWw6XHJcbiAgICAgICAgICAgIHR5cGU6ICdDb2xvckRhbmNlTWF0ZXJpYWwnXHJcbiAgICAgICAgICAgIHBhcmFtczpcclxuICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6IDBcclxuICAgICAgICAgIGRhbmNlcjpcclxuICAgICAgICAgICAgdHlwZTogJ1BvaW50Q2xvdWREYW5jZXInXHJcbiAgICAgICAgICBkYW5jZTpcclxuICAgICAgICAgICAgdHlwZTogJ1JvdGF0ZURhbmNlJ1xyXG4gICAgICAgICAgICBwYXJhbXM6XHJcbiAgICAgICAgICAgICAgYXhpczogWy0xLCAtMSwgMF1cclxuICAgICAgICAgIGRhbmNlTWF0ZXJpYWw6XHJcbiAgICAgICAgICAgIHR5cGU6ICdDb2xvckRhbmNlTWF0ZXJpYWwnXHJcbiAgICAgICAgICAgIHBhcmFtczpcclxuICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxyXG4gICAgICAgICAgICAgIG1pbkw6IDAuMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6IDFcclxuICAgICAgICAgIGRhbmNlcjpcclxuICAgICAgICAgICAgdHlwZTogJ1BvaW50Q2xvdWREYW5jZXInXHJcbiAgICAgICAgICBkYW5jZTpcclxuICAgICAgICAgICAgdHlwZTogJ1JvdGF0ZURhbmNlJ1xyXG4gICAgICAgICAgICBwYXJhbXM6XHJcbiAgICAgICAgICAgICAgYXhpczogWzAsIDEsIDFdXHJcbiAgICAgICAgICAgICAgc3BlZWQ6IDAuNVxyXG4gICAgICAgICAgZGFuY2VNYXRlcmlhbDpcclxuICAgICAgICAgICAgdHlwZTogJ0NvbG9yRGFuY2VNYXRlcmlhbCdcclxuICAgICAgICAgICAgcGFyYW1zOlxyXG4gICAgICAgICAgICAgIHNtb290aGluZ0ZhY3RvcjogMC41XHJcbiAgICAgICAgICAgICAgbWluTDogMC4wXHJcbiAgICAgICAgfVxyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6IDJcclxuICAgICAgICAgIGRhbmNlcjpcclxuICAgICAgICAgICAgdHlwZTogJ1NwaGVyZURhbmNlcidcclxuICAgICAgICAgICAgcGFyYW1zOlxyXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBbMC41LCAwLCAwLjVdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogM1xyXG4gICAgICAgICAgZGFuY2VyOlxyXG4gICAgICAgICAgICB0eXBlOiAnU3BoZXJlRGFuY2VyJ1xyXG4gICAgICAgICAgICBwYXJhbXM6XHJcbiAgICAgICAgICAgICAgcG9zaXRpb246IFswLjUsIDAsIC0wLjVdXHJcbiAgICAgICAgICBkYW5jZTpcclxuICAgICAgICAgICAgdHlwZTogJ1NjYWxlRGFuY2UnXHJcbiAgICAgICAgICAgIHBhcmFtczpcclxuICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxyXG4gICAgICAgICAgZGFuY2VNYXRlcmlhbDpcclxuICAgICAgICAgICAgdHlwZTogJ0NvbG9yRGFuY2VNYXRlcmlhbCdcclxuICAgICAgICAgICAgcGFyYW1zOlxyXG4gICAgICAgICAgICAgIHNtb290aGluZ0ZhY3RvcjogMC41XHJcbiAgICAgICAgICAgICAgd2lyZWZyYW1lOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogNFxyXG4gICAgICAgICAgZGFuY2VyOlxyXG4gICAgICAgICAgICB0eXBlOiAnU3BoZXJlRGFuY2VyJ1xyXG4gICAgICAgICAgICBwYXJhbXM6XHJcbiAgICAgICAgICAgICAgcG9zaXRpb246IFstMC41LCAwLCAwLjVdXHJcbiAgICAgICAgICBkYW5jZTpcclxuICAgICAgICAgICAgdHlwZTogJ1NjYWxlRGFuY2UnXHJcbiAgICAgICAgICAgIHBhcmFtczpcclxuICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxyXG4gICAgICAgICAgZGFuY2VNYXRlcmlhbDpcclxuICAgICAgICAgICAgdHlwZTogJ0NvbG9yRGFuY2VNYXRlcmlhbCdcclxuICAgICAgICAgICAgcGFyYW1zOlxyXG4gICAgICAgICAgICAgIHNtb290aGluZ0ZhY3RvcjogMC41XHJcbiAgICAgICAgICAgICAgd2lyZWZyYW1lOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogNVxyXG4gICAgICAgICAgZGFuY2VyOlxyXG4gICAgICAgICAgICB0eXBlOiAnU3BoZXJlRGFuY2VyJ1xyXG4gICAgICAgICAgICBwYXJhbXM6XHJcbiAgICAgICAgICAgICAgcG9zaXRpb246IFstMC41LCAwLCAtMC41XVxyXG4gICAgICAgICAgZGFuY2U6XHJcbiAgICAgICAgICAgIHR5cGU6ICdQb3NpdGlvbkRhbmNlJ1xyXG4gICAgICAgICAgICBwYXJhbXM6XHJcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcclxuICAgICAgICAgIGRhbmNlTWF0ZXJpYWw6XHJcbiAgICAgICAgICAgIHR5cGU6ICdDb2xvckRhbmNlTWF0ZXJpYWwnXHJcbiAgICAgICAgICAgIHBhcmFtczpcclxuICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxyXG4gICAgICAgICAgICAgIHdpcmVmcmFtZTogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgIF1cclxuICAgIF1cclxuXHJcbiAgICBAdXBkYXRlVGV4dCgpXHJcblxyXG4gIHByZXZpZXc6ICgpIC0+XHJcbiAgICBAdmlzdWFsaXplci5yZWNlaXZlQ2hvcmVvZ3JhcGh5XHJcbiAgICAgIGlkOiBAaWRcclxuICAgICAgZGFuY2VyOlxyXG4gICAgICAgIHR5cGU6IEBkYW5jZXJcclxuICAgICAgICBwYXJhbXM6IEBkYW5jZXJQYXJhbXNcclxuICAgICAgZGFuY2U6XHJcbiAgICAgICAgdHlwZTogQGRhbmNlXHJcbiAgICAgICAgcGFyYW1zOiBAZGFuY2VQYXJhbXNcclxuICAgICAgZGFuY2VNYXRlcmlhbDpcclxuICAgICAgICB0eXBlOiBAZGFuY2VNYXRlcmlhbFxyXG4gICAgICAgIHBhcmFtczogQGRhbmNlTWF0ZXJpYWxQYXJhbXNcclxuXHJcbiAgYWRkOiAoKSAtPlxyXG4gICAgQHJvdXRpbmVNb21lbnQucHVzaFxyXG4gICAgICBpZDogQGlkXHJcbiAgICAgIGRhbmNlcjpcclxuICAgICAgICB0eXBlOiBAZGFuY2VyXHJcbiAgICAgICAgcGFyYW1zOiBAZGFuY2VyUGFyYW1zXHJcbiAgICAgIGRhbmNlOlxyXG4gICAgICAgIHR5cGU6IEBkYW5jZVxyXG4gICAgICAgIHBhcmFtczogQGRhbmNlUGFyYW1zXHJcbiAgICAgIGRhbmNlTWF0ZXJpYWw6XHJcbiAgICAgICAgdHlwZTogQGRhbmNlTWF0ZXJpYWxcclxuICAgICAgICBwYXJhbXM6IEBkYW5jZU1hdGVyaWFsUGFyYW1zXHJcblxyXG4gICAgQHVwZGF0ZVRleHQoKVxyXG5cclxuICBpbnNlcnRCZWF0OiAoKSAtPlxyXG4gICAgQHJvdXRpbmVNb21lbnQgPSBbXVxyXG4gICAgQHJvdXRpbmUuc3BsaWNlKCsrQHJvdXRpbmVCZWF0LCAwLCBAcm91dGluZU1vbWVudClcclxuICAgIEB1cGRhdGVUZXh0KClcclxuXHJcbiAgcGxheU5leHQ6ICgpIC0+XHJcbiAgICBpZiBAcm91dGluZUJlYXQgPT0gQHJvdXRpbmUubGVuZ3RoIC0gMVxyXG4gICAgICBAcm91dGluZUJlYXQgPSAtMVxyXG5cclxuICAgIEByb3V0aW5lTW9tZW50ID0gQHJvdXRpbmVbKytAcm91dGluZUJlYXRdXHJcbiAgICBmb3IgY2hhbmdlIGluIEByb3V0aW5lTW9tZW50XHJcbiAgICAgIEB2aXN1YWxpemVyLnJlY2VpdmVDaG9yZW9ncmFwaHkgY2hhbmdlXHJcblxyXG4gIHJlc2V0OiAoKSAtPlxyXG4gICAgQHJvdXRpbmUgPSBbXVxyXG4gICAgQHJvdXRpbmVNb21lbnQgPSBbXVxyXG4gICAgQHJvdXRpbmVCZWF0ID0gLTFcclxuXHJcbiAgdXBkYXRlVGV4dDogKCkgLT5cclxuICAgIEB2aXN1YWxpemVyLmludGVyZmFjZS51cGRhdGVUZXh0KEByb3V0aW5lKVxyXG5cclxuICByZWZyZXNoUm91dGluZXM6ICgpIC0+XHJcbiAgICAkLmFqYXhcclxuICAgICAgdXJsOiBDb25maWcuc2VydmVyICsgJy9yb3V0aW5lcydcclxuICAgICAganNvbnA6ICdjYWxsYmFjaydcclxuICAgICAgZGF0YVR5cGU6ICdqc29ucCdcclxuICAgICAgdHlwZTogJ0dFVCdcclxuICAgICAgc3VjY2VzczogKGRhdGEpID0+XHJcbiAgICAgICAgQHJvdXRpbmVzID0gSlNPTi5wYXJzZShkYXRhKVxyXG5cclxuXHJcbiAgdXBkYXRlRGFuY2VyOiAoZGFuY2VyKSAtPlxyXG4gICAgQGRhbmNlciA9IGRhbmNlci5jb25zdHJ1Y3Rvci5uYW1lXHJcbiAgICBAZGFuY2VNYXRlcmlhbCA9IGRhbmNlci5kYW5jZU1hdGVyaWFsLmNvbnN0cnVjdG9yLm5hbWVcclxuICAgIEBkYW5jZSA9IGRhbmNlci5kYW5jZS5jb25zdHJ1Y3Rvci5uYW1lXHJcblxyXG4iLCJjbGFzcyB3aW5kb3cuQ29uZmlnXHJcbiAgICBAc2VydmVyOiAnaHR0cDovL2xvY2FsaG9zdDozMDAwJyIsImNsYXNzIHdpbmRvdy5EYXRHVUlJbnRlcmZhY2VcclxuICBjb25zdHJ1Y3RvcjogKCkgLT5cclxuICAgIEByb3V0aW5lV2luZG93ID0gJCgnI3JvdXRpbmUnKVxyXG5cclxuICBzZXR1cDogKEBwbGF5ZXIsIEBjaG9yZW9ncmFwaHlSb3V0aW5lLCBAdmlld2VyKSAtPlxyXG4gICAgZ3VpID0gbmV3IGRhdC5HVUkoKVxyXG5cclxuICAgIGd1aS5hZGQoQHBsYXllci5hdWRpb1dpbmRvdywgJ3Jlc3BvbnNpdmVuZXNzJywgMC4wLCA1LjApXHJcbiAgICBpZENvbnRyb2xsZXIgPSBndWkuYWRkKEBjaG9yZW9ncmFwaHlSb3V0aW5lLCAnaWQnKVxyXG5cclxuICAgIHNldHVwRm9sZGVyID0gKG5hbWUsIHZhck5hbWUsIGtleXMpID0+XHJcbiAgICAgIGNvbnRyb2xsZXIgPSBndWkuYWRkKEBjaG9yZW9ncmFwaHlSb3V0aW5lLCB2YXJOYW1lLCBrZXlzKVxyXG4gICAgICBmb2xkZXIgPSBndWkuYWRkRm9sZGVyKG5hbWUpXHJcbiAgICAgIGZvbGRlci5vcGVuKClcclxuICAgICAgcmV0dXJuIFsgY29udHJvbGxlciwgZm9sZGVyIF1cclxuXHJcbiAgICB1cGRhdGVGb2xkZXIgPSAodHlwZXMsIGZvbGRlciwgcGFyYW1zLCB2YWx1ZSwgb2JqKSAtPlxyXG4gICAgICBpZiAhdHlwZXNbdmFsdWVdP1xyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgICAgd2hpbGUgZm9sZGVyLl9fY29udHJvbGxlcnNbMF0/XHJcbiAgICAgICAgZm9sZGVyLnJlbW92ZShmb2xkZXIuX19jb250cm9sbGVyc1swXSlcclxuXHJcbiAgICAgIGZvciBwYXJhbSBpbiB0eXBlc1t2YWx1ZV0ucGFyYW1zXHJcbiAgICAgICAgcGFyYW1zW3BhcmFtLm5hbWVdID1cclxuICAgICAgICAgIGlmIG9iaj8ub3B0aW9ucz9bcGFyYW0ubmFtZV1cclxuICAgICAgICAgICAgb2JqLm9wdGlvbnNbcGFyYW0ubmFtZV1cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcGFyYW0uZGVmYXVsdFxyXG5cclxuICAgICAgICBmb2xkZXIuYWRkKHBhcmFtcywgcGFyYW0ubmFtZSlcclxuXHJcbiAgICBbZGFuY2VyQ29udHJvbGxlciwgZGFuY2VyRm9sZGVyXSA9IHNldHVwRm9sZGVyKCdEYW5jZXIgcGFyYW1ldGVycycsICdkYW5jZXInLCBPYmplY3Qua2V5cyhWaXN1YWxpemVyLmRhbmNlclR5cGVzKSlcclxuXHJcbiAgICB1cGRhdGVEYW5jZXJGb2xkZXIgPSAodmFsdWUsIG9iaikgPT5cclxuICAgICAgdXBkYXRlRm9sZGVyKFZpc3VhbGl6ZXIuZGFuY2VyVHlwZXMsIGRhbmNlckZvbGRlciwgQGNob3Jlb2dyYXBoeVJvdXRpbmUuZGFuY2VyUGFyYW1zLCB2YWx1ZSwgb2JqKVxyXG4gICAgZGFuY2VyQ29udHJvbGxlci5vbkNoYW5nZSB1cGRhdGVEYW5jZXJGb2xkZXJcclxuXHJcbiAgICBbZGFuY2VDb250cm9sbGVyLCBkYW5jZUZvbGRlcl0gPSBzZXR1cEZvbGRlcignRGFuY2UgcGFyYW1ldGVycycsICdkYW5jZScsIE9iamVjdC5rZXlzKFZpc3VhbGl6ZXIuZGFuY2VUeXBlcykpXHJcblxyXG4gICAgdXBkYXRlRGFuY2VGb2xkZXIgPSAodmFsdWUsIG9iaikgPT5cclxuICAgICAgdXBkYXRlRm9sZGVyKFZpc3VhbGl6ZXIuZGFuY2VUeXBlcywgZGFuY2VGb2xkZXIsIEBjaG9yZW9ncmFwaHlSb3V0aW5lLmRhbmNlUGFyYW1zLCB2YWx1ZSwgb2JqKVxyXG4gICAgZGFuY2VDb250cm9sbGVyLm9uQ2hhbmdlIHVwZGF0ZURhbmNlRm9sZGVyXHJcblxyXG4gICAgW2RhbmNlTWF0ZXJpYWxDb250cm9sbGVyLCBkYW5jZU1hdGVyaWFsRm9sZGVyXSA9IHNldHVwRm9sZGVyKCdEYW5jZSBtYXRlcmlhbCBwYXJhbWF0ZXJzJywgJ2RhbmNlTWF0ZXJpYWwnLFxyXG4gICAgICBPYmplY3Qua2V5cyhWaXN1YWxpemVyLmRhbmNlTWF0ZXJpYWxUeXBlcykpXHJcblxyXG4gICAgdXBkYXRlRGFuY2VNYXRlcmlhbEZvbGRlciA9ICh2YWx1ZSwgb2JqKSA9PlxyXG4gICAgICB1cGRhdGVGb2xkZXIoVmlzdWFsaXplci5kYW5jZU1hdGVyaWFsVHlwZXMsIGRhbmNlTWF0ZXJpYWxGb2xkZXIsIEBjaG9yZW9ncmFwaHlSb3V0aW5lLmRhbmNlTWF0ZXJpYWxQYXJhbXMsIHZhbHVlLFxyXG4gICAgICAgIG9iailcclxuICAgIGRhbmNlTWF0ZXJpYWxDb250cm9sbGVyLm9uQ2hhbmdlIHVwZGF0ZURhbmNlTWF0ZXJpYWxGb2xkZXJcclxuXHJcbiAgICBpZENvbnRyb2xsZXIub25DaGFuZ2UgKHZhbHVlKSA9PlxyXG4gICAgICBpZERhbmNlciA9IEB2aWV3ZXIuZ2V0RGFuY2VyKHZhbHVlKVxyXG4gICAgICBpZiBpZERhbmNlcj9cclxuICAgICAgICBAY2hvcmVvZ3JhcGh5Um91dGluZS51cGRhdGVEYW5jZXIgaWREYW5jZXJcclxuICAgICAgICBmb3IgY29udHJvbGxlciBpbiBndWkuX19jb250cm9sbGVyc1xyXG4gICAgICAgICAgY29udHJvbGxlci51cGRhdGVEaXNwbGF5KClcclxuXHJcbiAgICAgICAgdXBkYXRlRGFuY2VyRm9sZGVyKEBjaG9yZW9ncmFwaHlSb3V0aW5lLmRhbmNlciwgaWREYW5jZXIpXHJcbiAgICAgICAgdXBkYXRlRGFuY2VNYXRlcmlhbEZvbGRlcihAY2hvcmVvZ3JhcGh5Um91dGluZS5kYW5jZU1hdGVyaWFsLCBpZERhbmNlci5kYW5jZU1hdGVyaWFsKVxyXG4gICAgICAgIHVwZGF0ZURhbmNlRm9sZGVyKEBjaG9yZW9ncmFwaHlSb3V0aW5lLmRhbmNlLCBpZERhbmNlci5kYW5jZSlcclxuXHJcbiAgICBndWkuYWRkKEBjaG9yZW9ncmFwaHlSb3V0aW5lLCAncHJldmlldycpXHJcbiAgICBndWkuYWRkKEBjaG9yZW9ncmFwaHlSb3V0aW5lLCAnYWRkJylcclxuICAgIGd1aS5hZGQoQGNob3Jlb2dyYXBoeVJvdXRpbmUsICdpbnNlcnRCZWF0JylcclxuICAgIGd1aS5hZGQoQGNob3Jlb2dyYXBoeVJvdXRpbmUsICdwbGF5TmV4dCcpXHJcbiAgICBndWkuYWRkKEBjaG9yZW9ncmFwaHlSb3V0aW5lLCAncmVzZXQnKVxyXG5cclxuICAgIEBzZXR1cFBvcHVwKClcclxuXHJcblxyXG4gIHNldHVwUG9wdXA6ICgpIC0+XHJcbiAgICAkKCcjdmlld2VyQnV0dG9uJykuY2xpY2sgKGUpID0+XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICBAZG9tYWluID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0XHJcbiAgICAgIHBvcHVwVVJMID0gQGRvbWFpbiArIGxvY2F0aW9uLnBhdGhuYW1lICsgJ3ZpZXdlci5odG1sJ1xyXG4gICAgICBAcG9wdXAgPSB3aW5kb3cub3Blbihwb3B1cFVSTCwgJ215V2luZG93JylcclxuXHJcbiAgICAgICMgV2UgaGF2ZSB0byBkZWxheSBjYXRjaGluZyB0aGUgd2luZG93IHVwIGJlY2F1c2UgaXQgaGFzIHRvIGxvYWQgZmlyc3QuXHJcbiAgICAgIHNlbmRCZWF0cyA9ICgpID0+XHJcbiAgICAgICAgcm91dGluZUJlYXQgPSBAY2hvcmVvZ3JhcGh5Um91dGluZS5yb3V0aW5lQmVhdFxyXG4gICAgICAgIEBjaG9yZW9ncmFwaHlSb3V0aW5lLnJvdXRpbmVCZWF0ID0gLTFcclxuICAgICAgICB3aGlsZSBAY2hvcmVvZ3JhcGh5Um91dGluZS5yb3V0aW5lQmVhdCA8IHJvdXRpbmVCZWF0XHJcbiAgICAgICAgICBAY2hvcmVvZ3JhcGh5Um91dGluZS5wbGF5TmV4dCgpXHJcbiAgICAgIHNldFRpbWVvdXQgc2VuZEJlYXRzLCAxMDBcclxuXHJcbiAgdXBkYXRlVGV4dDogKGpzb24pIC0+XHJcbiAgICBAcm91dGluZVdpbmRvdy5odG1sKEpTT04uc3RyaW5naWZ5KGpzb24sIHVuZGVmaW5lZCwgMikpXHJcbiIsIiMgUmVxdWlyZSBhbGwgdGhlIHNoaXRcclxucmVxdWlyZSAnLi9WaXN1YWxpemVyLmNvZmZlZSdcclxucmVxdWlyZSAnLi4vamF2YXNjcmlwdC9PcmJpdENvbnRyb2xzJ1xyXG5yZXF1aXJlICcuL1ZpZXdlci5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vRGF0R1VJSW50ZXJmYWNlLmNvZmZlZSdcclxuXHJcbmNsYXNzIHdpbmRvdy5NYWluXHJcbiAgIyBDb25zdHJ1Y3QgdGhlIHNjZW5lXHJcbiAgY29uc3RydWN0b3I6IChpc1Zpc3VhbGl6ZXIpIC0+XHJcbiAgICBAc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKVxyXG4gICAgQHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoIHsgYW50aWFsaWFzOiB0cnVlLCBhbHBoYTogZmFsc2UgfSApXHJcbiAgICBAcmVuZGVyZXIuc2V0U2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApXHJcbiAgICBAcmVuZGVyZXIuYXV0b0NsZWFyID0gZmFsc2VcclxuXHJcbiAgICBAY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCA3NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMCApXHJcbiAgICBAY29udHJvbHMgPSBuZXcgVEhSRUUuT3JiaXRDb250cm9scyggQGNhbWVyYSwgQHJlbmRlcmVyLmRvbUVsZW1lbnQgKVxyXG4gICAgQGNvbnRyb2xzLmRhbXBpbmcgPSAwLjJcclxuXHJcbiAgICBjb250cm9sQ2hhbmdlID0gKCkgPT5cclxuICAgICAgQHJlbmRlcigpXHJcblxyXG4gICAgQGNvbnRyb2xzLmFkZEV2ZW50TGlzdGVuZXIoICdjaGFuZ2UnLCBjb250cm9sQ2hhbmdlIClcclxuXHJcbiAgICBAY2FtZXJhLnBvc2l0aW9uLnogPSAtNFxyXG4gICAgQGNhbWVyYS5wb3NpdGlvbi55ID0gM1xyXG4gICAgQGNvbnRyb2xzLnRhcmdldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCAwLCAwLCAwIClcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Jlc2l6ZScsIEBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UgKVxyXG5cclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoQHJlbmRlcmVyLmRvbUVsZW1lbnQpXHJcblxyXG4gICAgQHZpZXdlciA9IG5ldyBWaWV3ZXIoQHNjZW5lLCBAY2FtZXJhKVxyXG4gICAgaWYgaXNWaXN1YWxpemVyXHJcbiAgICAgIEB2aXN1YWxpemVyID0gbmV3IFZpc3VhbGl6ZXIoQHZpZXdlciwgbmV3IERhdEdVSUludGVyZmFjZSgpKVxyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIEB2aXN1YWxpemVyLm9uS2V5RG93bi5iaW5kKEB2aXN1YWxpemVyKSwgZmFsc2UpXHJcbiAgICBlbHNlXHJcbiAgICAgIEBkb21haW4gPSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3RcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ21lc3NhZ2UnLCAoZXZlbnQpID0+XHJcbiAgICAgICAgaWYgZXZlbnQub3JpZ2luICE9IEBkb21haW4gdGhlbiByZXR1cm5cclxuICAgICAgICBzZW50T2JqID0gZXZlbnQuZGF0YVxyXG4gICAgICAgIGlmIHNlbnRPYmoudHlwZSA9PSAncmVuZGVyJ1xyXG4gICAgICAgICAgQHZpZXdlci5yZW5kZXIgc2VudE9iai5kYXRhXHJcbiAgICAgICAgaWYgc2VudE9iai50eXBlID09ICdjaG9yZW9ncmFwaHknXHJcbiAgICAgICAgICBAdmlld2VyLnJlY2VpdmVDaG9yZW9ncmFwaHkgc2VudE9iai5kYXRhXHJcblxyXG4gIGFuaW1hdGU6ICgpIC0+XHJcbiAgICBAcmVuZGVyKClcclxuICAgIEBjb250cm9scy51cGRhdGUoKVxyXG5cclxuICByZW5kZXI6ICgpIC0+XHJcbiAgICBAdmlzdWFsaXplcj8ucmVuZGVyKCkgIFxyXG5cclxuICAgIEBzY2VuZS51cGRhdGVNYXRyaXhXb3JsZCgpXHJcbiAgICBAY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKVxyXG4gICAgQHJlbmRlcmVyLmNsZWFyKClcclxuICAgIEByZW5kZXJlci5yZW5kZXIoQHNjZW5lLCBAY2FtZXJhKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIG9uV2luZG93UmVzaXplOiAoKSA9PlxyXG4gICAgQGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodFxyXG4gICAgQGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KClcclxuICAgIEByZW5kZXJlci5zZXRTaXplKCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0IClcclxuXHJcbndpbmRvdy5hbmltYXRlID0gKCkgLT5cclxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUod2luZG93LmFuaW1hdGUpXHJcbiAgd2luZG93LmFwcC5hbmltYXRlKClcclxuXHJcbiQgLT5cclxuICBkYXQuR1VJLnByb3RvdHlwZS5yZW1vdmVGb2xkZXIgPSAobmFtZSkgLT5cclxuICAgIGZvbGRlciA9ICB0aGlzLl9fZm9sZGVyc1tuYW1lXVxyXG4gICAgaWYgIWZvbGRlclxyXG4gICAgICByZXR1cm5cclxuICAgIGZvbGRlci5jbG9zZSgpXHJcbiAgICB0aGlzLl9fdWwucmVtb3ZlQ2hpbGQoZm9sZGVyLmRvbUVsZW1lbnQucGFyZW50Tm9kZSlcclxuICAgIGRlbGV0ZSB0aGlzLl9fZm9sZGVyc1tuYW1lXVxyXG4gICAgdGhpcy5vblJlc2l6ZSgpIiwicmVxdWlyZSAnLi9BdWRpb1dpbmRvdy5jb2ZmZWUnXHJcblxyXG4jIFBsYXlzIHRoZSBhdWRpbyBhbmQgY3JlYXRlcyBhbiBhbmFseXNlclxyXG5jbGFzcyB3aW5kb3cuUGxheWVyXHJcbiAgY29uc3RydWN0b3I6ICgpIC0+XHJcbiAgICBAYXVkaW9XaW5kb3cgPSBuZXcgQXVkaW9XaW5kb3coMSk7XHJcbiAgICBAbG9hZGVkQXVkaW8gPSBuZXcgQXJyYXkoKVxyXG4gICAgQHN0YXJ0T2Zmc2V0ID0gMFxyXG4gICAgQHNldHVwQW5hbHlzZXIoKVxyXG5cclxuICBzZXR1cEFuYWx5c2VyOiAoKSAtPlxyXG4gICAgd2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dFxyXG4gICAgQGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKVxyXG4gICAgQGFuYWx5c2VyID0gQGF1ZGlvQ29udGV4dC5jcmVhdGVBbmFseXNlcigpXHJcbiAgICBAYW5hbHlzZXIuZmZ0U2l6ZSA9IEF1ZGlvV2luZG93LmJ1ZmZlclNpemVcclxuXHJcbiAgdXBkYXRlOiAoKSAtPlxyXG4gICAgQGF1ZGlvV2luZG93LnVwZGF0ZShAYW5hbHlzZXIsIEBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUpXHJcblxyXG4gIHBhdXNlOiAoKSAtPlxyXG4gICAgQHNvdXJjZS5zdG9wKClcclxuICAgIEBwbGF5aW5nID0gZmFsc2VcclxuICAgIEBzdGFydE9mZnNldCArPSBAYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lIC0gQHN0YXJ0VGltZVxyXG5cclxuICBjcmVhdGVMaXZlSW5wdXQ6ICgpIC0+XHJcbiAgICBnb3RTdHJlYW0gPSAoc3RyZWFtKSA9PlxyXG4gICAgICBAcGxheWluZyA9IHRydWVcclxuICAgICAgQHNvdXJjZSA9IEBhdWRpb0NvbnRleHQuY3JlYXRlTWVkaWFTdHJlYW1Tb3VyY2Ugc3RyZWFtXHJcbiAgICAgIEBzb3VyY2UuY29ubmVjdCBAYW5hbHlzZXJcclxuXHJcbiAgICBAZGJTYW1wbGVCdWYgPSBuZXcgVWludDhBcnJheSgyMDQ4KVxyXG5cclxuICAgIGlmICggbmF2aWdhdG9yLmdldFVzZXJNZWRpYSApXHJcbiAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSB9LCBnb3RTdHJlYW0sIChlcnIpIC0+XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyKSlcclxuICAgIGVsc2UgaWYgKG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWEgKVxyXG4gICAgICBuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSwgZ290U3RyZWFtLCAoZXJyKSAtPlxyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycikpXHJcbiAgICBlbHNlIGlmIChuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIClcclxuICAgICAgbmF2aWdhdG9yLm1vekdldFVzZXJNZWRpYSh7IGF1ZGlvOiB0cnVlIH0sIGdvdFN0cmVhbSwgKGVycikgLT5cclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpKVxyXG4gICAgZWxzZVxyXG4gICAgICByZXR1cm4oYWxlcnQoXCJFcnJvcjogZ2V0VXNlck1lZGlhIG5vdCBzdXBwb3J0ZWQhXCIpKTtcclxuXHJcbiAgcGxheTogKHVybCkgLT5cclxuICAgIEBjdXJyZW50bHlQbGF5aW5nID0gdXJsXHJcblxyXG4gICAgaWYgQGxvYWRlZEF1ZGlvW3VybF0/XHJcbiAgICAgIEBsb2FkRnJvbUJ1ZmZlcihAbG9hZGVkQXVkaW9bdXJsXSlcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXHJcbiAgICByZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKVxyXG4gICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInXHJcbiAgICByZXF1ZXN0Lm9ubG9hZCA9ICgpID0+XHJcbiAgICAgIEBhdWRpb0NvbnRleHQuZGVjb2RlQXVkaW9EYXRhIHJlcXVlc3QucmVzcG9uc2VcclxuICAgICAgLCAoYnVmZmVyKSA9PlxyXG4gICAgICAgIEBsb2FkZWRBdWRpb1t1cmxdID0gYnVmZmVyXHJcbiAgICAgICAgQGxvYWRGcm9tQnVmZmVyKGJ1ZmZlcilcclxuICAgICAgLCAoZXJyKSAtPlxyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgcmVxdWVzdC5zZW5kKClcclxuICAgIHJldHVyblxyXG5cclxuICBsb2FkRnJvbUJ1ZmZlcjogKGJ1ZmZlcikgLT5cclxuICAgIEBzdGFydFRpbWUgPSBAYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lXHJcbiAgICBAc291cmNlID0gQGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKVxyXG4gICAgQHNvdXJjZS5idWZmZXIgPSBidWZmZXJcclxuICAgIEBzb3VyY2UuY29ubmVjdChAYW5hbHlzZXIpXHJcbiAgICBAc291cmNlLmNvbm5lY3QoQGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbilcclxuICAgIEBwbGF5aW5nID0gdHJ1ZVxyXG4gICAgQHNvdXJjZS5zdGFydCgwLCBAc3RhcnRPZmZzZXQpXHJcblxyXG4gIHBhdXNlOiAoKSAtPlxyXG4gICAgaWYgQHBsYXllci5wbGF5aW5nIHRoZW4gQHBhdXNlKCkgZWxzZSBAcGxheShAY3VycmVudGx5UGxheWluZykiLCJjbGFzcyB3aW5kb3cuU2hhZGVyTG9hZGVyXHJcbiAgIyBDb25zdHJ1Y3QgdGhlIHNoYWRlciBjYWNoZVxyXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxyXG4gICAgQHNoYWRlcnMgPSBuZXcgQXJyYXkoKVxyXG5cclxuICAjIFRha2VzIGEgbmFtZSBhbmQgYSBjYWxsYmFjaywgbG9hZHMgdGhhdCBzaGFkZXIgZnJvbSAvc2hhZGVycywgY2FjaGVzIHRoZSByZXN1bHRcclxuICBsb2FkOiAobmFtZSwgbmV4dCkgLT5cclxuICAgIGlmIEBzaGFkZXJzW25hbWVdP1xyXG4gICAgICBuZXh0KEBzaGFkZXJzW25hbWVdKVxyXG4gICAgZWxzZVxyXG4gICAgICBAc2hhZGVyc1tuYW1lXSA9IHt2ZXJ0ZXhTaGFkZXI6ICcnLCBmcmFnbWVudFNoYWRlcjogJyd9XHJcbiAgICAgIEBsb2FkRnJvbVVybChuYW1lLCAnc2hhZGVycy8nICsgbmFtZSwgbmV4dClcclxuXHJcbiAgIyBMb2FkcyB0aGUgc2hhZGVyZnJvbSBhIFVSTFxyXG4gIGxvYWRGcm9tVXJsOiAobmFtZSwgdXJsLCBuZXh0KSAtPlxyXG5cclxuICAgIGxvYWRlZFNoYWRlciA9IChqcVhIUiwgdGV4dFN0YXR1cykgLT5cclxuICAgICAgQHNoYWRlcnNbQG5hbWVdW0B0eXBlXSA9IGpxWEhSLnJlc3BvbnNlVGV4dFxyXG4gICAgICBpZiAoQHNoYWRlcnNbQG5hbWVdLnZlcnRleFNoYWRlcj8gJiYgQHNoYWRlcnNbQG5hbWVdLmZyYWdtZW50U2hhZGVyKVxyXG4gICAgICAgIG5leHQoQHNoYWRlcnNbQG5hbWVdKVxyXG5cclxuICAgICQuYWpheFxyXG4gICAgICB1cmw6IHVybCArICcudmVydCdcclxuICAgICAgZGF0YVR5cGU6ICd0ZXh0J1xyXG4gICAgICBjb250ZXh0OiB7XHJcbiAgICAgICAgbmFtZTogbmFtZVxyXG4gICAgICAgIHR5cGU6ICd2ZXJ0ZXhTaGFkZXInXHJcbiAgICAgICAgbmV4dDogbmV4dFxyXG4gICAgICAgIHNoYWRlcnM6IEBzaGFkZXJzXHJcbiAgICAgIH1cclxuICAgICAgY29tcGxldGU6IGxvYWRlZFNoYWRlciBcclxuXHJcbiAgICAkLmFqYXhcclxuICAgICAgdXJsOiB1cmwgKyAnLmZyYWcnXHJcbiAgICAgIGRhdGFUeXBlOiAndGV4dCdcclxuICAgICAgY29udGV4dDoge1xyXG4gICAgICAgIG5hbWU6IG5hbWVcclxuICAgICAgICB0eXBlOiAnZnJhZ21lbnRTaGFkZXInXHJcbiAgICAgICAgbmV4dDogbmV4dFxyXG4gICAgICAgIHNoYWRlcnM6IEBzaGFkZXJzXHJcbiAgICAgIH1cclxuICAgICAgY29tcGxldGU6IGxvYWRlZFNoYWRlciBcclxuXHJcbiAgICByZXR1cm4iLCJyZXF1aXJlICcuL1NoYWRlckxvYWRlci5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4uL2phdmFzY3JpcHQvUXVldWUuanMnXHJcblxyXG5jbGFzcyB3aW5kb3cuVmlld2VyXHJcbiAgY29uc3RydWN0b3I6IChzY2VuZSwgY2FtZXJhKSAtPlxyXG4gICAgQHNjZW5lID0gc2NlbmVcclxuICAgIEBkYW5jZXJzID0gbmV3IEFycmF5KClcclxuICAgIEBzaGFkZXJMb2FkZXIgPSBuZXcgU2hhZGVyTG9hZGVyKClcclxuXHJcbiAgICBAY2hvcmVvZ3JhcGh5UXVldWUgPSBuZXcgUXVldWUoKVxyXG5cclxuICByZWNlaXZlQ2hvcmVvZ3JhcGh5OiAobW92ZSkgLT5cclxuICAgIEBjaG9yZW9ncmFwaHlRdWV1ZS5wdXNoKG1vdmUpXHJcblxyXG4gIGV4ZWN1dGVDaG9yZW9ncmFwaHk6ICh7aWQsIGRhbmNlciwgZGFuY2UsIGRhbmNlTWF0ZXJpYWwgfSkgLT5cclxuICAgIGlmIGlkID09IC0xXHJcbiAgICAgIGZvciBkYW5jZXIgaW4gQGRhbmNlcnNcclxuICAgICAgICBAc2NlbmUucmVtb3ZlKGRhbmNlci5ib2R5KVxyXG4gICAgICBAZGFuY2VycyA9IFtdXHJcbiAgICAgIHJldHVyblxyXG4gICAgaWYgQGRhbmNlcnNbaWRdP1xyXG4gICAgICAjIFRlc3QgZXZlcnl0aGluZyBlbHNlXHJcbiAgICAgIGN1cnJlbnREYW5jZXIgPSBAZGFuY2Vyc1tpZF1cclxuXHJcbiAgICAgICMgSWYgbm8gcGFyYW1ldGVycyBhcmUgc2V0LCBidXQgYW4gaWQgaXMsIHRoZW4gcmVtb3ZlIHRoZSBvYmplY3RcclxuICAgICAgaWYgIWRhbmNlcj8gJiYgIWRhbmNlICYmICFkYW5jZU1hdGVyaWFsXHJcbiAgICAgICAgQHNjZW5lLnJlbW92ZShjdXJyZW50RGFuY2VyLmJvZHkpXHJcbiAgICAgICAgQGRhbmNlcnMuc3BsaWNlKEBkYW5jZXJzLmluZGV4T2YoaWQpLCAxKVxyXG5cclxuICAgICAgaWYgZGFuY2U/IFxyXG4gICAgICAgIGlmICFkYW5jZXI/ICYmICFkYW5jZU1hdGVyaWFsP1xyXG4gICAgICAgICAgY3VycmVudERhbmNlci5yZXNldCgpXHJcbiAgICAgICAgICBjdXJyZW50RGFuY2VyLmRhbmNlID0gbmV3IFZpc3VhbGl6ZXIuZGFuY2VUeXBlc1tkYW5jZS50eXBlXShkYW5jZS5wYXJhbXMpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBuZXdEYW5jZSA9IG5ldyBWaXN1YWxpemVyLmRhbmNlVHlwZXNbZGFuY2UudHlwZV0oZGFuY2UucGFyYW1zKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgbmV3RGFuY2UgPSBjdXJyZW50RGFuY2VyLmRhbmNlXHJcblxyXG4gICAgICBhZGREYW5jZXIgPSAobmV3RGFuY2UsIG5ld01hdGVyaWFsKSA9PlxyXG4gICAgICAgIGlmIGRhbmNlcj9cclxuICAgICAgICAgIG5ld0RhbmNlciA9IG5ldyBWaXN1YWxpemVyLmRhbmNlclR5cGVzW2RhbmNlci50eXBlXShuZXdEYW5jZSwgbmV3TWF0ZXJpYWwsIGRhbmNlci5wYXJhbXMpXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgbmV3RGFuY2VyID0gbmV3IGN1cnJlbnREYW5jZXIuY29uc3RydWN0b3IobmV3RGFuY2UsIG5ld01hdGVyaWFsKVxyXG5cclxuICAgICAgICBjdXJyZW50RGFuY2VyLnJlc2V0KClcclxuICAgICAgICBAc2NlbmUucmVtb3ZlKGN1cnJlbnREYW5jZXIuYm9keSlcclxuICAgICAgICBAZGFuY2Vyc1tpZF0gPSBuZXdEYW5jZXJcclxuICAgICAgICBAc2NlbmUuYWRkKG5ld0RhbmNlci5ib2R5KVxyXG5cclxuICAgICAgaWYgZGFuY2VNYXRlcmlhbD9cclxuICAgICAgICAjIFNwZWNpYWwgY2FzZSBmb3Igc2hhZGVycyBiZWNhdXNlIGl0IGhhcyB0byBsb2FkIHRoZSBzaGFkZXIgZmlsZVxyXG4gICAgICAgICMgVGhpcyBpcyBhIHJlYWxseSBoYWNreSB3YXkgb2YgY2hlY2tpbmcgaWYgaXQncyBhIHNoYWRlci4gU2hvdWxkIGNoYW5nZS5cclxuICAgICAgICBpZiBkYW5jZU1hdGVyaWFsLnR5cGUuaW5kZXhPZignU2hhZGVyJykgPiAtMVxyXG4gICAgICAgICAgbmV3TWF0ZXJpYWwgPSBuZXcgVmlzdWFsaXplci5kYW5jZU1hdGVyaWFsVHlwZXNbZGFuY2VNYXRlcmlhbC50eXBlXShAc2hhZGVyTG9hZGVyKVxyXG4gICAgICAgICAgbmV3TWF0ZXJpYWwubG9hZFNoYWRlciAoc2hhZGVyTWF0ZXJpYWwpID0+XHJcbiAgICAgICAgICAgIGFkZERhbmNlciBuZXdEYW5jZSwgc2hhZGVyTWF0ZXJpYWxcclxuICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICBuZXdNYXRlcmlhbCA9IG5ldyBWaXN1YWxpemVyLmRhbmNlTWF0ZXJpYWxUeXBlc1tkYW5jZU1hdGVyaWFsLnR5cGVdKGRhbmNlTWF0ZXJpYWwucGFyYW1zKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgbmV3TWF0ZXJpYWwgPSBjdXJyZW50RGFuY2VyLmRhbmNlTWF0ZXJpYWxcclxuXHJcbiAgICAgIGFkZERhbmNlcihuZXdEYW5jZSwgbmV3TWF0ZXJpYWwpXHJcblxyXG4gICAgICByZXR1cm5cclxuICAgIGVsc2UgaWYgaWQ/XHJcbiAgICAgIEBkYW5jZXJzW2lkXSA9IG5ldyBWaXN1YWxpemVyLmRhbmNlclR5cGVzW2RhbmNlci50eXBlXShuZXcgVmlzdWFsaXplci5kYW5jZVR5cGVzW2RhbmNlLnR5cGVdKGRhbmNlLnBhcmFtcyksIG5ldyBWaXN1YWxpemVyLmRhbmNlTWF0ZXJpYWxUeXBlc1tkYW5jZU1hdGVyaWFsLnR5cGVdKGRhbmNlTWF0ZXJpYWwucGFyYW1zKSwgZGFuY2VyLnBhcmFtcylcclxuICAgICAgQHNjZW5lLmFkZCBAZGFuY2Vyc1tpZF0uYm9keVxyXG4gICAgICByZXR1cm5cclxuICAgIGVsc2VcclxuICAgICAgcmV0dXJuXHJcblxyXG4gIGdldERhbmNlcjogKGlkKSAtPlxyXG4gICAgQGRhbmNlcnNbaWRdXHJcblxyXG5cclxuICAjIFJlbmRlciB0aGUgc2NlbmUgYnkgZ29pbmcgdGhyb3VnaCB0aGUgQXVkaW9PYmplY3QgYXJyYXkgYW5kIGNhbGxpbmcgdXBkYXRlKGF1ZGlvRXZlbnQpIG9uIGVhY2ggb25lXHJcbiAgcmVuZGVyOiAoYXVkaW9XaW5kb3cpIC0+XHJcbiAgICB3aGlsZSBAY2hvcmVvZ3JhcGh5UXVldWUubGVuZ3RoKCkgPiAwXHJcbiAgICAgIEBleGVjdXRlQ2hvcmVvZ3JhcGh5IEBjaG9yZW9ncmFwaHlRdWV1ZS5zaGlmdCgpXHJcbiAgICAjIENyZWF0ZSBldmVudFxyXG4gICAgZm9yIGlkIGluIE9iamVjdC5rZXlzKEBkYW5jZXJzKVxyXG4gICAgICBAZGFuY2Vyc1tpZF0udXBkYXRlKGF1ZGlvV2luZG93KVxyXG5cclxuICAjIFJlbW92ZXMgdGhlIGxhc3QgZGFuY2VyLCByZXR1cm5zIHRoZSBkYW5jZXIncyBkYW5jZVxyXG4gIHJlbW92ZUxhc3REYW5jZXI6ICgpIC0+XHJcbiAgICBwcmV2RGFuY2VyID0gQGRhbmNlcnMucG9wKClcclxuICAgIEBzY2VuZS5yZW1vdmUocHJldkRhbmNlci5ib2R5KSBcclxuICAgIHJldHVybiBwcmV2RGFuY2VyLmRhbmNlIiwicmVxdWlyZSAnLi9QbGF5ZXIuY29mZmVlJ1xyXG5yZXF1aXJlICcuL0Nob3Jlb2dyYXBoeVJvdXRpbmUuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2RhbmNlcnMvQ3ViZURhbmNlci5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZGFuY2Vycy9TcGhlcmVEYW5jZXIuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2RhbmNlcnMvUG9pbnRDbG91ZERhbmNlci5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZGFuY2VzL1NjYWxlRGFuY2UuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2RhbmNlcy9Qb3NpdGlvbkRhbmNlLmNvZmZlZSdcclxucmVxdWlyZSAnLi9kYW5jZXMvUm90YXRlRGFuY2UuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2RhbmNlTWF0ZXJpYWxzL0NvbG9yRGFuY2VNYXRlcmlhbC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZGFuY2VNYXRlcmlhbHMvU2ltcGxlRnJlcXVlbmN5U2hhZGVyLmNvZmZlZSdcclxuXHJcbmNsYXNzIHdpbmRvdy5WaXN1YWxpemVyXHJcbiAgIyBHZXQgdGhvc2Uga2V5cyBzZXQgdXBcclxuICBrZXlzOiB7IFBBVVNFOiAzMiwgTkVYVDogNzggfVxyXG5cclxuICAjIFNldCB1cCB0aGUgc2NlbmUgYmFzZWQgb24gYSBNYWluIG9iamVjdCB3aGljaCBjb250YWlucyB0aGUgc2NlbmUuXHJcbiAgY29uc3RydWN0b3I6IChAdmlld2VyLCBAaW50ZXJmYWNlKSAtPlxyXG4gICAgQHBsYXllciA9IG5ldyBQbGF5ZXIoKVxyXG5cclxuICAgICMgTG9hZCB0aGUgc2FtcGxlIGF1ZGlvXHJcbiAgICAjIEBwbGF5KCdhdWRpby9Hby5tcDMnKVxyXG4gICAgIyBAcGxheSgnYXVkaW8vR2xhc3Nlci5tcDMnKVxyXG4gICAgIyBAcGxheSgnYXVkaW8vT25NeU1pbmQubXAzJylcclxuXHJcbiAgICBAcGxheWVyLmNyZWF0ZUxpdmVJbnB1dCgpXHJcblxyXG4gICAgQGNob3Jlb2dyYXBoeVJvdXRpbmUgPSBuZXcgQ2hvcmVvZ3JhcGh5Um91dGluZShAKVxyXG5cclxuICAgIEBpbnRlcmZhY2Uuc2V0dXBQb3B1cCgpXHJcbiAgICBAaW50ZXJmYWNlLnNldHVwKEBwbGF5ZXIsIEBjaG9yZW9ncmFwaHlSb3V0aW5lLCBAdmlld2VyKVxyXG5cclxuICAgIEBjaG9yZW9ncmFwaHlSb3V0aW5lLnBsYXlOZXh0KClcclxuXHJcbiAgcmVjZWl2ZUNob3Jlb2dyYXBoeTogKG1vdmUpIC0+XHJcbiAgICBAdmlld2VyLnJlY2VpdmVDaG9yZW9ncmFwaHkgbW92ZVxyXG4gICAgaWYgQHBvcHVwPyB0aGVuIEBwb3B1cC5wb3N0TWVzc2FnZShAd3JhcE1lc3NhZ2UoJ2Nob3Jlb2dyYXBoeScsIG1vdmUpLCBAZG9tYWluKVxyXG5cclxuICByZW5kZXI6ICgpIC0+XHJcbiAgICBpZiAhQHBsYXllci5wbGF5aW5nXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIEBwbGF5ZXIudXBkYXRlKClcclxuXHJcbiAgICBAdmlld2VyLnJlbmRlcihAcGxheWVyLmF1ZGlvV2luZG93KVxyXG4gICAgaWYgQHBvcHVwPyB0aGVuIEBwb3B1cC5wb3N0TWVzc2FnZShAd3JhcE1lc3NhZ2UoJ3JlbmRlcicsIEBwbGF5ZXIuYXVkaW9XaW5kb3cpLCBAZG9tYWluKVxyXG5cclxuICB3cmFwTWVzc2FnZTogKHR5cGUsIGRhdGEpIC0+XHJcbiAgICB0eXBlOiB0eXBlXHJcbiAgICBkYXRhOiBkYXRhXHJcblxyXG4gICNFdmVudCBtZXRob2RzXHJcbiAgb25LZXlEb3duOiAoZXZlbnQpIC0+XHJcbiAgICBzd2l0Y2ggZXZlbnQua2V5Q29kZVxyXG4gICAgICB3aGVuIEBrZXlzLlBBVVNFXHJcbiAgICAgICAgQHBsYXllci5wYXVzZSgpXHJcbiAgICAgIHdoZW4gQGtleXMuTkVYVFxyXG4gICAgICAgIEBjaG9yZW9ncmFwaHlSb3V0aW5lLnBsYXlOZXh0KClcclxuXHJcbiAgQGRhbmNlclR5cGVzOlxyXG4gICAgQ3ViZURhbmNlcjogQ3ViZURhbmNlclxyXG4gICAgU3BoZXJlRGFuY2VyOiBTcGhlcmVEYW5jZXJcclxuICAgIFBvaW50Q2xvdWREYW5jZXI6IFBvaW50Q2xvdWREYW5jZXJcclxuXHJcbiAgQGRhbmNlVHlwZXM6XHJcbiAgICBTY2FsZURhbmNlOiBTY2FsZURhbmNlXHJcbiAgICBQb3NpdGlvbkRhbmNlOiBQb3NpdGlvbkRhbmNlXHJcbiAgICBSb3RhdGVEYW5jZTogUm90YXRlRGFuY2VcclxuXHJcbiAgQGRhbmNlTWF0ZXJpYWxUeXBlczpcclxuICAgIENvbG9yRGFuY2VNYXRlcmlhbDogQ29sb3JEYW5jZU1hdGVyaWFsXHJcbiAgICBTaW1wbGVGcmVxdWVuY3lTaGFkZXI6IFNpbXBsZUZyZXF1ZW5jeVNoYWRlclxyXG4iLCJjbGFzcyB3aW5kb3cuQ29sb3JEYW5jZU1hdGVyaWFsXHJcbiAgQHBhcmFtczogXHJcbiAgICBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnc21vb3RoaW5nRmFjdG9yJyxcclxuICAgICAgICBkZWZhdWx0OiAwLjVcclxuICAgICAgfSwgXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnbWluTCcsXHJcbiAgICAgICAgZGVmYXVsdDogMC4xXHJcbiAgICAgIH0sIFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ21pblMnLFxyXG4gICAgICAgIGRlZmF1bHQ6IDAuM1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ3dpcmVmcmFtZSdcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICBdXHJcblxyXG4gIEBuYW1lOiBcIkNvbG9yRGFuY2VNYXRlcmlhbFwiXHJcblxyXG4gIGNvbnN0cnVjdG9yOiAoQG9wdGlvbnMpIC0+XHJcbiAgICBpZiBAb3B0aW9ucz8gdGhlbiB7IEBzbW9vdGhpbmdGYWN0b3IsIEBtaW5MLCBAbWluUywgQHdpcmVmcmFtZSB9ID0gQG9wdGlvbnNcclxuICAgIEBzbW9vdGhpbmdGYWN0b3IgPz0gMC41XHJcbiAgICBAbWluTCA/PSAwLjFcclxuICAgIEBtaW5TID89IDAuM1xyXG4gICAgQHdpcmVmcmFtZSA/PSBmYWxzZVxyXG4gICAgQGNvbG9yID0gbmV3IFRIUkVFLkNvbG9yKDEuMCwgMCwgMClcclxuICAgIEBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHsgY29sb3I6IDB4MDAwMDAsIHdpcmVmcmFtZTogQHdpcmVmcmFtZSB9KVxyXG4gICAgQGFwcGxpZWRDb2xvciA9IEBjb2xvci5jbG9uZSgpXHJcblxyXG4gIHVwZGF0ZTogKGF1ZGlvV2luZG93LCBkYW5jZXIpIC0+XHJcblxyXG4gICAgbWF4VmFsdWUgPSAwXHJcbiAgICBtYXhJbmRleCA9IC0xXHJcbiAgICBtYXhJbXBvcnRhbnRJbmRleCA9IDFcclxuICAgIGZvciBpIGluIFsxLi5BdWRpb1dpbmRvdy5idWZmZXJTaXplXVxyXG4gICAgICBmcmVxID0gYXVkaW9XaW5kb3cuZnJlcXVlbmN5QnVmZmVyW2ldXHJcbiAgICAgIHZhbHVlID0gZnJlcSAqIGlcclxuICAgICAgaWYgKHZhbHVlID4gbWF4VmFsdWUpXHJcbiAgICAgICAgbWF4VmFsdWUgPSB2YWx1ZVxyXG4gICAgICAgIG1heEluZGV4ID0gaVxyXG5cclxuICAgIG9sZENvbG9ySFNMID0gQGFwcGxpZWRDb2xvci5nZXRIU0woKVxyXG5cclxuICAgIG5ld0NvbG9yUyA9IG1heEluZGV4IC8gQXVkaW9XaW5kb3cuYnVmZmVyU2l6ZTtcclxuICAgIG5ld0NvbG9yUyA9IEBzbW9vdGhpbmdGYWN0b3IgKiBuZXdDb2xvclMgKyAoMSAtIEBzbW9vdGhpbmdGYWN0b3IpICogb2xkQ29sb3JIU0wuc1xyXG5cclxuICAgIG5ld0NvbG9yTCA9IGF1ZGlvV2luZG93LmF2ZXJhZ2VEYlxyXG4gICAgbmV3Q29sb3JMID0gQHNtb290aGluZ0ZhY3RvciAqIG5ld0NvbG9yTCArICgxIC0gQHNtb290aGluZ0ZhY3RvcikgKiBvbGRDb2xvckhTTC5sXHJcblxyXG4gICAgbCA9IEBtaW5MICsgbmV3Q29sb3JMICogKDEuMCAtIEBtaW5MKVxyXG4gICAgcyA9IEBtaW5TICsgbmV3Q29sb3JTICogKDEuMCAtIEBtaW5TKVxyXG5cclxuICAgIG5ld0NvbG9ySCA9ICgzNjAgKiAoYXVkaW9XaW5kb3cudGltZSAvIDEwMDAwKSAlIDM2MCkgLyAzNjBcclxuXHJcbiAgICBoc2wgPSBAY29sb3IuZ2V0SFNMKClcclxuICAgIEBhcHBsaWVkQ29sb3Iuc2V0SFNMKG5ld0NvbG9ySCwgcywgbClcclxuXHJcbiAgICBpZiBkYW5jZXI/XHJcbiAgICAgIGlmIGRhbmNlci5ib2R5Lm1hdGVyaWFsLmVtaXNzaXZlP1xyXG4gICAgICAgIGRhbmNlci5ib2R5Lm1hdGVyaWFsLmVtaXNzaXZlLmNvcHkoQGFwcGxpZWRDb2xvcilcclxuXHJcbiAgICAgIGRhbmNlci5ib2R5Lm1hdGVyaWFsLmNvbG9yLmNvcHkoQGFwcGxpZWRDb2xvcilcclxuIiwiY2xhc3Mgd2luZG93LlNpbXBsZUZyZXF1ZW5jeVNoYWRlclxyXG4gIEBwYXJhbXM6IFtdXHJcblxyXG4gIEBuYW1lOiBcIlNpbXBsZUZyZXF1ZW5jeVNoYWRlclwiXHJcbiAgXHJcbiAgY29uc3RydWN0b3I6IChzaGFkZXJMb2FkZXIpIC0+XHJcbiAgICBAdGFyZ2V0ID0gMTI4XHJcbiAgICBAc2l6ZSA9IDEwMjRcclxuICAgIEBzaGFkZXJMb2FkZXIgPSBzaGFkZXJMb2FkZXJcclxuICAgIEBuZXdUZXhBcnJheSA9IG5ldyBVaW50OEFycmF5KEB0YXJnZXQgKiBAdGFyZ2V0ICogNClcclxuXHJcbiAgbG9hZFNoYWRlcjogKG5leHQpIC0+XHJcbiAgICBAc2hhZGVyTG9hZGVyLmxvYWQgJ3NpbXBsZV9mcmVxdWVuY3knLCAoc2hhZGVyKSA9PlxyXG4gICAgICBzaGFkZXIudW5pZm9ybXMgPSB7XHJcbiAgICAgICAgZnJlcVRleHR1cmU6IHt0eXBlOiBcInRcIiwgdmFsdWU6IEF1ZGlvV2luZG93LmJ1ZmZlclNpemV9XHJcbiAgICAgICAgcmVzb2x1dGlvbjogeyB0eXBlOiBcInYyXCIsIHZhbHVlOiBuZXcgVEhSRUUuVmVjdG9yMigxMjgsIDEyOCl9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIEBtYXRlcmlhbCA9IG5ldyBUSFJFRS5TaGFkZXJNYXRlcmlhbChzaGFkZXIpXHJcbiAgICAgIEBtYXRlcmlhbC5zaWRlID0gVEhSRUUuRG91YmxlU2lkZVxyXG4gICAgICBAbWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlXHJcbiAgICAgIG5leHQoQClcclxuXHJcblxyXG4gIHVwZGF0ZTogKGF1ZGlvV2luZG93LCBkYW5jZXIpIC0+XHJcbiAgICBkYW5jZXIuYm9keS5tYXRlcmlhbC51bmlmb3Jtcy5mcmVxVGV4dHVyZS52YWx1ZSA9IEByZWR1Y2VBcnJheShhdWRpb1dpbmRvdy5mcmVxdWVuY3lCdWZmZXIpXHJcblxyXG4gIHJlZHVjZUFycmF5OiAoZnJlcUJ1ZikgLT5cclxuXHJcbiAgICBuZXdCdWYgPSBuZXcgQXJyYXkoQHRhcmdldClcclxuXHJcbiAgICBtb3ZpbmdTdW0gPSAwXHJcbiAgICBmbG9vcmVkUmF0aW8gPSBNYXRoLmZsb29yKEBzaXplIC8gQHRhcmdldClcclxuICAgIGZvciBpIGluIFsxLi4uQHNpemVdXHJcbiAgICAgIG1vdmluZ1N1bSArPSBmcmVxQnVmW2ldXHJcblxyXG4gICAgICBpZiAoKGkgKyAxKSAlIGZsb29yZWRSYXRpbykgPT0gMFxyXG4gICAgICAgIG5ld0J1ZltNYXRoLmZsb29yKGkgIC8gZmxvb3JlZFJhdGlvKV0gPSBtb3ZpbmdTdW0gLyBmbG9vcmVkUmF0aW9cclxuICAgICAgICBtb3ZpbmdTdW0gPSAwXHJcblxyXG5cclxuICAgIGZvciBpIGluIFswLi4uQHRhcmdldF1cclxuICAgICAgZm9yIGogaW4gWzAuLi5AdGFyZ2V0XVxyXG4gICAgICAgIGJhc2VJbmRleCA9IGkgKiBAdGFyZ2V0ICogNCArIGogKiA0O1xyXG4gICAgICAgIGlmIG5ld0J1ZltqXSA+IGkgKiAyXHJcbiAgICAgICAgICBAbmV3VGV4QXJyYXlbYmFzZUluZGV4XSA9IDI1NVxyXG4gICAgICAgICAgQG5ld1RleEFycmF5W2Jhc2VJbmRleCArIDFdID0gMjU1XHJcbiAgICAgICAgICBAbmV3VGV4QXJyYXlbYmFzZUluZGV4ICsgMl0gPSAyNTVcclxuICAgICAgICAgIEBuZXdUZXhBcnJheVtiYXNlSW5kZXggKyAzXSA9IDI1NVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAgICBAbmV3VGV4QXJyYXlbYmFzZUluZGV4XSA9IDBcclxuICAgICAgICAgIEBuZXdUZXhBcnJheVtiYXNlSW5kZXggKyAxXSA9IDBcclxuICAgICAgICAgIEBuZXdUZXhBcnJheVtiYXNlSW5kZXggKyAyXSA9IDBcclxuICAgICAgICAgIEBuZXdUZXhBcnJheVtiYXNlSW5kZXggKyAzXSA9IDBcclxuXHJcbiAgICB0ZXh0dXJlID0gbmV3IFRIUkVFLkRhdGFUZXh0dXJlKEBuZXdUZXhBcnJheSwgQHRhcmdldCwgQHRhcmdldCwgVEhSRUUuUkdCQUZvcm1hdCwgVEhSRUUuVW5zaWduZWRCeXRlKVxyXG4gICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWVcclxuICAgIHRleHR1cmUuZmxpcFkgPSBmYWxzZVxyXG4gICAgdGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgPSBmYWxzZVxyXG4gICAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5MaW5lYXJGaWx0ZXJcclxuICAgIHRleHR1cmUubWluRmlsdGVyID0gVEhSRUUuTGluZWFyRmlsdGVyXHJcbiAgICB0ZXh0dXJlLnVucGFja0FsaWdubWVudCA9IDFcclxuICAgIHRleHR1cmUud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZ1xyXG4gICAgdGV4dHVyZS53cmFwVCA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nXHJcbiAgICB0ZXh0dXJlLmFuaXNvdHJvcHkgPSA0XHJcblxyXG4gICAgcmV0dXJuIHRleHR1cmUiLCJyZXF1aXJlICcuL0RhbmNlci5jb2ZmZWUnXHJcblxyXG5jbGFzcyB3aW5kb3cuQ3ViZURhbmNlciBleHRlbmRzIERhbmNlclxyXG4gIEBuYW1lOiBcIkN1YmVEYW5jZXJcIlxyXG4gIFxyXG4gIGNvbnN0cnVjdG9yOiAoZGFuY2UsIGRhbmNlTWF0ZXJpYWwsIEBvcHRpb25zKSAtPlxyXG4gICAgaWYgQG9wdGlvbnM/IHRoZW4geyBwb3NpdGlvbiwgc2NhbGUgfSA9IEBvcHRpb25zXHJcbiAgICBzdXBlcihuZXcgVEhSRUUuQm94R2VvbWV0cnkoMSwgMSwgMSksIGRhbmNlLCBkYW5jZU1hdGVyaWFsLCBwb3NpdGlvbiwgc2NhbGUpIiwiIyBDb250YWlucyBhbiBPYmplY3QzRCBvZiBzb21lIGtpbmQsIHdpdGggYSBtZXNoIGRldGVybWluZWQgYnkgc3ViY2xhc3Nlcy5cclxuIyBJdCBoYXMgYW4gRWZmZWN0IGFuZCBhIERhbmNlTWF0ZXJpYWwgd2hpY2ggb3BlcmF0ZSBvbiB0aGUgdHJhbnNmb3JtIGFuZCB0aGUgbWF0ZXJpYWwgb2YgdGhlIE9iamVjdDNEIHJlc3BlY3Rpdmx5XHJcblxyXG5jbGFzcyB3aW5kb3cuRGFuY2VyXHJcbiAgQHR5cGUgPSBEYW5jZXJcclxuICBAcGFyYW1zID0gW1xyXG4gICAge1xyXG4gICAgICBuYW1lOiAncG9zaXRpb24nXHJcbiAgICAgIGRlZmF1bHQ6IFswLCAwLCAwXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3NjYWxlJ1xyXG4gICAgICBkZWZhdWx0OiBbMSwgMSwgMV1cclxuICAgIH1cclxuICBdXHJcblxyXG4gIGNvbnN0cnVjdG9yOiAoZ2VvbWV0cnksIGRhbmNlLCBkYW5jZU1hdGVyaWFsLCBwb3NpdGlvbiwgc2NhbGUpIC0+XHJcbiAgICAjIENvbnN0cnVjdCBhIGRlZmF1bHQgRGFuY2VyIHVzaW5nIEBib2R5IGFzIHRoZSBPYmplY3QzRFxyXG4gICAgbWF0ZXJpYWwgPSBkYW5jZU1hdGVyaWFsLm1hdGVyaWFsO1xyXG4gICAgQGRhbmNlID0gZGFuY2VcclxuICAgIEBkYW5jZU1hdGVyaWFsID0gZGFuY2VNYXRlcmlhbDtcclxuICAgIEBib2R5ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcclxuICAgIGlmIHBvc2l0aW9uPyAmJiBwb3NpdGlvbi5sZW5ndGggPT0gMyB0aGVuIEBib2R5LnBvc2l0aW9uLnNldChwb3NpdGlvblswXSwgcG9zaXRpb25bMV0sIHBvc2l0aW9uWzJdKVxyXG4gICAgaWYgc2NhbGU/ICYmIHNjYWxlLmxlbmd0aCA9PSAzIHRoZW4gQGJvZHkuc2NhbGUuc2V0KHNjYWxlWzBdLCBzY2FsZVsxXSwgc2NhbGVbMl0pXHJcblxyXG4gIGdlb21ldHJ5OiAoKSAtPlxyXG4gICAgbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoMSwgMSlcclxuXHJcbiAgcmVzZXQ6ICgpIC0+XHJcbiAgICBAZGFuY2UucmVzZXQoQClcclxuXHJcbiAgdXBkYXRlOiAoYXVkaW9XaW5kb3cpIC0+XHJcbiAgICAjIFJlYWN0IHRvIHRoZSBhdWRpbyBldmVudCBieSBwdW1waW5nIGl0IHRocm91Z2ggRWZmZWN0IGFuZCBTaGFkZXJcclxuICAgIEBkYW5jZS51cGRhdGUoYXVkaW9XaW5kb3csIEApXHJcbiAgICBAZGFuY2VNYXRlcmlhbC51cGRhdGUoYXVkaW9XaW5kb3csIEApIiwicmVxdWlyZSAnLi9EYW5jZXIuY29mZmVlJ1xyXG5cclxuY2xhc3Mgd2luZG93LlBvaW50Q2xvdWREYW5jZXIgZXh0ZW5kcyBEYW5jZXJcclxuICBAcGFyYW1zOiBcclxuICAgIFtcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdtaW5EaXN0YW5jZScsXHJcbiAgICAgICAgZGVmYXVsdDogNS4wXHJcbiAgICAgIH0sIFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ21heERpc3RhbmNlJyxcclxuICAgICAgICBkZWZhdWx0OiAxMC4wXHJcbiAgICAgIH0sIFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ2NvdW50JyxcclxuICAgICAgICBkZWZhdWx0OiA1MDBcclxuICAgICAgfVxyXG4gICAgXVxyXG5cclxuICBAbmFtZTogXCJQb2ludENsb3VkRGFuY2VyXCJcclxuXHJcbiAgY29uc3RydWN0b3I6IChAZGFuY2UsIEBkYW5jZU1hdGVyaWFsLCBAb3B0aW9ucykgLT5cclxuICAgIGlmIEBvcHRpb25zPyB0aGVuIHsgQG1pbkRpc3RhbmNlLCBAbWF4RGlzdGFuY2UsIEBjb3VudCB9ID0gQG9wdGlvbnNcclxuICAgIEBtaW5EaXN0YW5jZSA/PSA1LjBcclxuICAgIEBtYXhEaXN0YW5jZSA/PSAxMC4wXHJcbiAgICBAY291bnQgPz0gNTAwXHJcblxyXG4gICAgZGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxyXG4gICAgcG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKVxyXG5cclxuICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KClcclxuICAgIHBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkoQGNvdW50ICogMylcclxuXHJcbiAgICBmb3IgaSBpbiBbMC4uLkBjb3VudF1cclxuICAgICAgZGlyZWN0aW9uLnNldChNYXRoLnJhbmRvbSgpIC0gMC41LCBNYXRoLnJhbmRvbSgpIC0gMC41LCBNYXRoLnJhbmRvbSgpLSAwLjUpXHJcbiAgICAgIGRpcmVjdGlvbi5ub3JtYWxpemUoKVxyXG4gICAgICBkaXJlY3Rpb24ubXVsdGlwbHlTY2FsYXIoQG1pbkRpc3RhbmNlICsgTWF0aC5yYW5kb20oKSAqIChAbWF4RGlzdGFuY2UgLSBAbWluRGlzdGFuY2UpKVxyXG5cclxuICAgICAgcG9zaXRpb25zWzMgKiBpXSA9IHBvc2l0aW9uLnggKyBkaXJlY3Rpb24ueFxyXG4gICAgICBwb3NpdGlvbnNbMyAqIGkgKyAxXSA9IHBvc2l0aW9uLnkgKyBkaXJlY3Rpb24ueVxyXG4gICAgICBwb3NpdGlvbnNbMyAqIGkgKyAyXSA9IHBvc2l0aW9uLnogKyBkaXJlY3Rpb24uelxyXG5cclxuICAgIGdlb21ldHJ5LmFkZEF0dHJpYnV0ZSgncG9zaXRpb24nLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKHBvc2l0aW9ucywgMykpXHJcbiAgICBnZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKVxyXG5cclxuICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLlBvaW50Q2xvdWRNYXRlcmlhbCh7IHNpemU6IDAuNSwgY29sb3I6IEBkYW5jZU1hdGVyaWFsLmNvbG9yIH0pXHJcbiAgICBAYm9keSA9IG5ldyBUSFJFRS5Qb2ludENsb3VkKCBnZW9tZXRyeSwgbWF0ZXJpYWwgKSIsInJlcXVpcmUgJy4vRGFuY2VyLmNvZmZlZSdcclxuXHJcbmNsYXNzIHdpbmRvdy5TcGhlcmVEYW5jZXIgZXh0ZW5kcyBEYW5jZXJcclxuICBAbmFtZTogXCJTcGhlcmVEYW5jZXJcIlxyXG5cclxuICBjb25zdHJ1Y3RvcjogKGRhbmNlLCBkYW5jZU1hdGVyaWFsLCBAb3B0aW9ucykgLT5cclxuICAgIGlmIEBvcHRpb25zPyB0aGVuIHsgcG9zaXRpb24sIHNjYWxlIH0gPSBAb3B0aW9uc1xyXG4gICAgc3VwZXIobmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDEsIDMyLCAyNCksIGRhbmNlLCBkYW5jZU1hdGVyaWFsLCBwb3NpdGlvbiwgc2NhbGUpIiwiY2xhc3Mgd2luZG93LlBvc2l0aW9uRGFuY2VcclxuICBAcGFyYW1zOiBcclxuICAgIFtcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdzbW9vdGhpbmdGYWN0b3InXHJcbiAgICAgICAgZGVmYXVsdDogMC4yXHJcbiAgICAgIH0sIFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ2RpcmVjdGlvbidcclxuICAgICAgICBkZWZhdWx0OiBbMCwgMSwgMF1cclxuICAgICAgfVxyXG4gICAgXVxyXG5cclxuICBAbmFtZTogXCJQb3NpdGlvbkRhbmNlXCJcclxuXHJcbiAgY29uc3RydWN0b3I6IChAb3B0aW9ucykgLT5cclxuICAgIGlmIEBvcHRpb25zPyB0aGVuIHsgQHNtb290aGluZ0ZhY3RvciwgZGlyZWN0aW9uIH0gPSBAb3B0aW9uc1xyXG4gICAgQHNtb290aGluZ0ZhY3RvciA/PSAwLjJcclxuICAgIFxyXG4gICAgZGlyZWN0aW9uID89IFswLCAxLCAwXVxyXG4gICAgQGRpcmVjdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKGRpcmVjdGlvblswXSwgZGlyZWN0aW9uWzFdLCBkaXJlY3Rpb25bMl0pXHJcblxyXG4gICAgQGRpcmVjdGlvbkNvcHkgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG4gICAgQHBvc2l0aW9uQ2hhbmdlID0gMFxyXG5cclxuICB1cGRhdGU6IChhdWRpb1dpbmRvdywgZGFuY2VyKSAtPlxyXG4gICAgYmFzZVBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICAgIEBkaXJlY3Rpb25Db3B5LmNvcHkoQGRpcmVjdGlvbik7XHJcbiAgICBiYXNlUG9zaXRpb24uc3ViVmVjdG9ycyhkYW5jZXIuYm9keS5wb3NpdGlvbiwgQGRpcmVjdGlvbkNvcHkubXVsdGlwbHlTY2FsYXIoQHBvc2l0aW9uQ2hhbmdlKSlcclxuXHJcbiAgICBzbW9vdGhpbmdGYWN0b3IgPSBpZiBhdWRpb1dpbmRvdy5hdmVyYWdlRGIgPCBAcG9zaXRpb25DaGFuZ2UgdGhlbiBAc21vb3RoaW5nRmFjdG9yIGVsc2UgTWF0aC5tYXgoMSwgQHNtb290aGluZ0ZhY3RvciAqIDQpXHJcbiAgICBAcG9zaXRpb25DaGFuZ2UgPSBhdWRpb1dpbmRvdy5hdmVyYWdlRGIgKiBzbW9vdGhpbmdGYWN0b3IgKyAoMSAtIHNtb290aGluZ0ZhY3RvcikgKiBAcG9zaXRpb25DaGFuZ2VcclxuXHJcbiAgICBAZGlyZWN0aW9uQ29weS5jb3B5KEBkaXJlY3Rpb24pXHJcbiAgICBuZXdQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKClcclxuICAgIG5ld1Bvc2l0aW9uLmFkZFZlY3RvcnMoYmFzZVBvc2l0aW9uLCBAZGlyZWN0aW9uQ29weS5tdWx0aXBseVNjYWxhcihAcG9zaXRpb25DaGFuZ2UpKVxyXG5cclxuICAgIGRhbmNlci5ib2R5LnBvc2l0aW9uLnNldChuZXdQb3NpdGlvbi54LCBuZXdQb3NpdGlvbi55LCBuZXdQb3NpdGlvbi56KVxyXG5cclxuICByZXNldDogKGRhbmNlcikgLT5cclxuICAgIEBkaXJlY3Rpb25Db3B5LmNvcHkoQGRpcmVjdGlvbik7XHJcbiAgICBiYXNlUG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG4gICAgYmFzZVBvc2l0aW9uLnN1YlZlY3RvcnMoZGFuY2VyLmJvZHkucG9zaXRpb24sIEBkaXJlY3Rpb25Db3B5Lm11bHRpcGx5U2NhbGFyKEBwb3NpdGlvbkNoYW5nZSkpXHJcbiAgICBkYW5jZXIuYm9keS5wb3NpdGlvbi5zZXQoYmFzZVBvc2l0aW9uLngsIGJhc2VQb3NpdGlvbi55LCBiYXNlUG9zaXRpb24ueikiLCJjbGFzcyB3aW5kb3cuUm90YXRlRGFuY2VcclxuICBAbmFtZTogXCJSb3RhdGVEYW5jZVwiXHJcblxyXG4gIEBwYXJhbXM6XHJcbiAgICBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnYXhpcydcclxuICAgICAgICBkZWZhdWx0OiBbMCwgMSwgMF1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdtaW5Sb3RhdGlvbidcclxuICAgICAgICBkZWZhdWx0OiAwLjA1XHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnc3BlZWQnXHJcbiAgICAgICAgZGVmYXVsdDogMVxyXG4gICAgICB9LFxyXG4gICAgXVxyXG5cclxuICBjb25zdHJ1Y3RvcjogKEBvcHRpb25zKSAtPlxyXG4gICAgaWYgQG9wdGlvbnM/IHRoZW4geyBheGlzLCBAbWluUm90YXRpb24sIEBzcGVlZCB9ID0gQG9wdGlvbnNcclxuICAgIEBtaW5Sb3RhdGlvbiA/PSAwLjA1XHJcbiAgICBAc3BlZWQgPz0gMVxyXG5cclxuICAgIGF4aXMgPz0gWzAsIDEsIDBdXHJcbiAgICBAYXhpcyA9IG5ldyBUSFJFRS5WZWN0b3IzKGF4aXNbMF0sIGF4aXNbMV0sIGF4aXNbMl0pXHJcblxyXG4gICAgQHRpbWUgPSAwXHJcblxyXG4gIHVwZGF0ZTogKGF1ZGlvV2luZG93LCBkYW5jZXIpIC0+XHJcbiAgICBhYnNSb3RhdGlvbiA9IGF1ZGlvV2luZG93LmF2ZXJhZ2VEYiAqIEBzcGVlZFxyXG5cclxuICAgIGRhbmNlci5ib2R5LnJvdGF0ZU9uQXhpcyBAYXhpcywgKEBtaW5Sb3RhdGlvbiArIGFic1JvdGF0aW9uICogKDAuOSkpICogTWF0aC5QSSAqICgoYXVkaW9XaW5kb3cudGltZSAtIEB0aW1lKSAvIDEwMDApXHJcblxyXG4gICAgQHRpbWUgPSBhdWRpb1dpbmRvdy50aW1lXHJcblxyXG4gIHJlc2V0OiAoZGFuY2VyKSAtPlxyXG4gICAgZGFuY2VyLmJvZHkucm90YXRpb24uc2V0KDAsIDAsIDApXHJcbiIsIiMgQ29udHJvbHMgdGhlIG1lc2ggb2YgdGhlIHByb3ZpZGVkIERhbmNlcidzIGJvZHlcclxuY2xhc3Mgd2luZG93LlNjYWxlRGFuY2VcclxuICBAcGFyYW1zOlxyXG4gICAgW1xyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ3Ntb290aGluZ0ZhY3RvcidcclxuICAgICAgICBkZWZhdWx0OiAwLjVcclxuICAgICAgfSwgXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnbWluJ1xyXG4gICAgICAgIGRlZmF1bHQ6IFswLjUsIDAuNSwgMC41XVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ21heCdcclxuICAgICAgICBkZWZhdWx0OiBbMSwgMSwgMV1cclxuICAgICAgfVxyXG4gICAgXVxyXG5cclxuICBAbmFtZTogXCJTY2FsZURhbmNlXCJcclxuXHJcbiAgY29uc3RydWN0b3I6IChAb3B0aW9ucykgLT5cclxuICAgIGlmIEBvcHRpb25zPyB0aGVuIHsgQHNtb290aGluZ0ZhY3RvciwgbWluLCBtYXggfSA9IEBvcHRpb25zXHJcbiAgICBAc21vb3RoaW5nRmFjdG9yID89IDAuNVxyXG4gICAgQGF2ZXJhZ2VEYiA9IDBcclxuICAgIEBtaW4gPSBpZiBtaW4gdGhlbiBuZXcgVEhSRUUuVmVjdG9yMyhtaW5bMF0sIG1pblsxXSwgbWluWzJdKSBlbHNlIG5ldyBUSFJFRS5WZWN0b3IzKDAuNSwgMC41LCAwLjUpXHJcbiAgICBAbWF4ID0gaWYgbWF4IHRoZW4gbmV3IFRIUkVFLlZlY3RvcjMobWF4WzBdLCBtYXhbMV0sIG1heFsyXSkgZWxzZSBuZXcgVEhSRUUuVmVjdG9yMygxLCAxLCAxKVxyXG4gICAgQHNjYWxlID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxyXG5cclxuICB1cGRhdGU6IChhdWRpb1dpbmRvdywgZGFuY2VyKSAtPlxyXG4gICAgIyB1cGRhdGUgdGhlIERhbmNlcidzIGJvZHkgbWVzaCB0byByZWZsZWN0IHRoZSBhdWRpbyBldmVudFxyXG4gICAgaWYgKGF1ZGlvV2luZG93LmF2ZXJhZ2VEYiA8IEBhdmVyYWdlRGIpXHJcbiAgICBcdEBhdmVyYWdlRGIgPSBhdWRpb1dpbmRvdy5hdmVyYWdlRGIgKiBAc21vb3RoaW5nRmFjdG9yICsgKDEgLSBAc21vb3RoaW5nRmFjdG9yKSAqIEBhdmVyYWdlRGJcclxuICAgIGVsc2UgXHJcbiAgICBcdHNtb290aGluZ0ZhY3RvciA9IE1hdGgubWF4KDEsIEBzbW9vdGhpbmdGYWN0b3IgKiA0KVxyXG4gICAgXHRAYXZlcmFnZURiID0gYXVkaW9XaW5kb3cuYXZlcmFnZURiICogc21vb3RoaW5nRmFjdG9yICsgKDEgLSBzbW9vdGhpbmdGYWN0b3IpICogQGF2ZXJhZ2VEYlxyXG5cclxuICAgIEBzY2FsZS5jb3B5KEBtaW4pXHJcblxyXG4gICAgQHNjYWxlLmxlcnAoQG1heCwgQGF2ZXJhZ2VEYilcclxuXHJcbiAgICBkYW5jZXIuYm9keS5zY2FsZS5zZXQoQHNjYWxlLngsIEBzY2FsZS55LCBAc2NhbGUueilcclxuXHRcclxuICByZXNldDogKGRhbmNlcikgLT5cclxuICBcdGRhbmNlci5ib2R5LnNjYWxlLnNldCgxLCAxLCAxKVxyXG4iLCIvKipcclxuICogQGF1dGhvciBxaWFvIC8gaHR0cHM6Ly9naXRodWIuY29tL3FpYW9cclxuICogQGF1dGhvciBtcmRvb2IgLyBodHRwOi8vbXJkb29iLmNvbVxyXG4gKiBAYXV0aG9yIGFsdGVyZWRxIC8gaHR0cDovL2FsdGVyZWRxdWFsaWEuY29tL1xyXG4gKiBAYXV0aG9yIFdlc3RMYW5nbGV5IC8gaHR0cDovL2dpdGh1Yi5jb20vV2VzdExhbmdsZXlcclxuICogQGF1dGhvciBlcmljaDY2NiAvIGh0dHA6Ly9lcmljaGFpbmVzLmNvbVxyXG4gKi9cclxuLypnbG9iYWwgVEhSRUUsIGNvbnNvbGUgKi9cclxuXHJcbi8vIFRoaXMgc2V0IG9mIGNvbnRyb2xzIHBlcmZvcm1zIG9yYml0aW5nLCBkb2xseWluZyAoem9vbWluZyksIGFuZCBwYW5uaW5nLiBJdCBtYWludGFpbnNcclxuLy8gdGhlIFwidXBcIiBkaXJlY3Rpb24gYXMgK1ksIHVubGlrZSB0aGUgVHJhY2tiYWxsQ29udHJvbHMuIFRvdWNoIG9uIHRhYmxldCBhbmQgcGhvbmVzIGlzXHJcbi8vIHN1cHBvcnRlZC5cclxuLy9cclxuLy8gICAgT3JiaXQgLSBsZWZ0IG1vdXNlIC8gdG91Y2g6IG9uZSBmaW5nZXIgbW92ZVxyXG4vLyAgICBab29tIC0gbWlkZGxlIG1vdXNlLCBvciBtb3VzZXdoZWVsIC8gdG91Y2g6IHR3byBmaW5nZXIgc3ByZWFkIG9yIHNxdWlzaFxyXG4vLyAgICBQYW4gLSByaWdodCBtb3VzZSwgb3IgYXJyb3cga2V5cyAvIHRvdWNoOiB0aHJlZSBmaW50ZXIgc3dpcGVcclxuLy9cclxuLy8gVGhpcyBpcyBhIGRyb3AtaW4gcmVwbGFjZW1lbnQgZm9yIChtb3N0KSBUcmFja2JhbGxDb250cm9scyB1c2VkIGluIGV4YW1wbGVzLlxyXG4vLyBUaGF0IGlzLCBpbmNsdWRlIHRoaXMganMgZmlsZSBhbmQgd2hlcmV2ZXIgeW91IHNlZTpcclxuLy8gICAgXHRjb250cm9scyA9IG5ldyBUSFJFRS5UcmFja2JhbGxDb250cm9scyggY2FtZXJhICk7XHJcbi8vICAgICAgY29udHJvbHMudGFyZ2V0LnogPSAxNTA7XHJcbi8vIFNpbXBsZSBzdWJzdGl0dXRlIFwiT3JiaXRDb250cm9sc1wiIGFuZCB0aGUgY29udHJvbCBzaG91bGQgd29yayBhcy1pcy5cclxuXHJcblRIUkVFLk9yYml0Q29udHJvbHMgPSBmdW5jdGlvbiAob2JqZWN0LCBkb21FbGVtZW50KSB7XHJcblxyXG4gICAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XHJcbiAgICB0aGlzLmRvbUVsZW1lbnQgPSAoIGRvbUVsZW1lbnQgIT09IHVuZGVmaW5lZCApID8gZG9tRWxlbWVudCA6IGRvY3VtZW50O1xyXG5cclxuICAgIC8vIEFQSVxyXG5cclxuICAgIC8vIFNldCB0byBmYWxzZSB0byBkaXNhYmxlIHRoaXMgY29udHJvbFxyXG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcclxuXHJcbiAgICAvLyBcInRhcmdldFwiIHNldHMgdGhlIGxvY2F0aW9uIG9mIGZvY3VzLCB3aGVyZSB0aGUgY29udHJvbCBvcmJpdHMgYXJvdW5kXHJcbiAgICAvLyBhbmQgd2hlcmUgaXQgcGFucyB3aXRoIHJlc3BlY3QgdG8uXHJcbiAgICB0aGlzLnRhcmdldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcblxyXG4gICAgLy8gY2VudGVyIGlzIG9sZCwgZGVwcmVjYXRlZDsgdXNlIFwidGFyZ2V0XCIgaW5zdGVhZFxyXG4gICAgdGhpcy5jZW50ZXIgPSB0aGlzLnRhcmdldDtcclxuXHJcbiAgICAvLyBUaGlzIG9wdGlvbiBhY3R1YWxseSBlbmFibGVzIGRvbGx5aW5nIGluIGFuZCBvdXQ7IGxlZnQgYXMgXCJ6b29tXCIgZm9yXHJcbiAgICAvLyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxyXG4gICAgdGhpcy5ub1pvb20gPSBmYWxzZTtcclxuICAgIHRoaXMuem9vbVNwZWVkID0gMS4wO1xyXG5cclxuICAgIC8vIExpbWl0cyB0byBob3cgZmFyIHlvdSBjYW4gZG9sbHkgaW4gYW5kIG91dFxyXG4gICAgdGhpcy5taW5EaXN0YW5jZSA9IDA7XHJcbiAgICB0aGlzLm1heERpc3RhbmNlID0gSW5maW5pdHk7XHJcblxyXG4gICAgLy8gU2V0IHRvIHRydWUgdG8gZGlzYWJsZSB0aGlzIGNvbnRyb2xcclxuICAgIHRoaXMubm9Sb3RhdGUgPSBmYWxzZTtcclxuICAgIHRoaXMucm90YXRlU3BlZWQgPSAxLjA7XHJcblxyXG4gICAgLy8gU2V0IHRvIHRydWUgdG8gZGlzYWJsZSB0aGlzIGNvbnRyb2xcclxuICAgIHRoaXMubm9QYW4gPSBmYWxzZTtcclxuICAgIHRoaXMua2V5UGFuU3BlZWQgPSA3LjA7XHQvLyBwaXhlbHMgbW92ZWQgcGVyIGFycm93IGtleSBwdXNoXHJcblxyXG4gICAgLy8gU2V0IHRvIHRydWUgdG8gYXV0b21hdGljYWxseSByb3RhdGUgYXJvdW5kIHRoZSB0YXJnZXRcclxuICAgIHRoaXMuYXV0b1JvdGF0ZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5hdXRvUm90YXRlU3BlZWQgPSAyLjA7IC8vIDMwIHNlY29uZHMgcGVyIHJvdW5kIHdoZW4gZnBzIGlzIDYwXHJcblxyXG4gICAgLy8gSG93IGZhciB5b3UgY2FuIG9yYml0IHZlcnRpY2FsbHksIHVwcGVyIGFuZCBsb3dlciBsaW1pdHMuXHJcbiAgICAvLyBSYW5nZSBpcyAwIHRvIE1hdGguUEkgcmFkaWFucy5cclxuICAgIHRoaXMubWluUG9sYXJBbmdsZSA9IDA7IC8vIHJhZGlhbnNcclxuICAgIHRoaXMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEk7IC8vIHJhZGlhbnNcclxuXHJcbiAgICAvLyBTZXQgdG8gdHJ1ZSB0byBkaXNhYmxlIHVzZSBvZiB0aGUga2V5c1xyXG4gICAgdGhpcy5ub0tleXMgPSBmYWxzZTtcclxuXHJcbiAgICAvLyBUaGUgZm91ciBhcnJvdyBrZXlzXHJcbiAgICB0aGlzLmtleXMgPSB7IExFRlQ6IDM3LCBVUDogMzgsIFJJR0hUOiAzOSwgQk9UVE9NOiA0MCB9O1xyXG5cclxuICAgIC8vLy8vLy8vLy8vL1xyXG4gICAgLy8gaW50ZXJuYWxzXHJcblxyXG4gICAgdmFyIHNjb3BlID0gdGhpcztcclxuXHJcbiAgICB2YXIgRVBTID0gMC4wMDAwMDE7XHJcblxyXG4gICAgdmFyIHJvdGF0ZVN0YXJ0ID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuICAgIHZhciByb3RhdGVFbmQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xyXG4gICAgdmFyIHJvdGF0ZURlbHRhID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuXHJcbiAgICB2YXIgcGFuU3RhcnQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xyXG4gICAgdmFyIHBhbkVuZCA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcbiAgICB2YXIgcGFuRGVsdGEgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xyXG4gICAgdmFyIHBhbk9mZnNldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcblxyXG4gICAgdmFyIG9mZnNldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcblxyXG4gICAgdmFyIGRvbGx5U3RhcnQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xyXG4gICAgdmFyIGRvbGx5RW5kID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuICAgIHZhciBkb2xseURlbHRhID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuXHJcbiAgICB2YXIgcGhpRGVsdGEgPSAwO1xyXG4gICAgdmFyIHRoZXRhRGVsdGEgPSAwO1xyXG4gICAgdmFyIHNjYWxlID0gMTtcclxuICAgIHZhciBwYW4gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG5cclxuICAgIHZhciBsYXN0UG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG4gICAgdmFyIGxhc3RRdWF0ZXJuaW9uID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKTtcclxuXHJcbiAgICB2YXIgU1RBVEUgPSB7IE5PTkU6IC0xLCBST1RBVEU6IDAsIERPTExZOiAxLCBQQU46IDIsIFRPVUNIX1JPVEFURTogMywgVE9VQ0hfRE9MTFk6IDQsIFRPVUNIX1BBTjogNSB9O1xyXG5cclxuICAgIHZhciBzdGF0ZSA9IFNUQVRFLk5PTkU7XHJcblxyXG4gICAgLy8gZm9yIHJlc2V0XHJcblxyXG4gICAgdGhpcy50YXJnZXQwID0gdGhpcy50YXJnZXQuY2xvbmUoKTtcclxuICAgIHRoaXMucG9zaXRpb24wID0gdGhpcy5vYmplY3QucG9zaXRpb24uY2xvbmUoKTtcclxuXHJcbiAgICAvLyBzbyBjYW1lcmEudXAgaXMgdGhlIG9yYml0IGF4aXNcclxuXHJcbiAgICB2YXIgcXVhdCA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbVVuaXRWZWN0b3JzKG9iamVjdC51cCwgbmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCkpO1xyXG4gICAgdmFyIHF1YXRJbnZlcnNlID0gcXVhdC5jbG9uZSgpLmludmVyc2UoKTtcclxuXHJcbiAgICAvLyBldmVudHNcclxuXHJcbiAgICB2YXIgY2hhbmdlRXZlbnQgPSB7IHR5cGU6ICdjaGFuZ2UnIH07XHJcbiAgICB2YXIgc3RhcnRFdmVudCA9IHsgdHlwZTogJ3N0YXJ0J307XHJcbiAgICB2YXIgZW5kRXZlbnQgPSB7IHR5cGU6ICdlbmQnfTtcclxuXHJcbiAgICB0aGlzLnJvdGF0ZUxlZnQgPSBmdW5jdGlvbiAoYW5nbGUpIHtcclxuXHJcbiAgICAgICAgaWYgKGFuZ2xlID09PSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgICAgIGFuZ2xlID0gZ2V0QXV0b1JvdGF0aW9uQW5nbGUoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGV0YURlbHRhIC09IGFuZ2xlO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5yb3RhdGVVcCA9IGZ1bmN0aW9uIChhbmdsZSkge1xyXG5cclxuICAgICAgICBpZiAoYW5nbGUgPT09IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICAgICAgYW5nbGUgPSBnZXRBdXRvUm90YXRpb25BbmdsZSgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBoaURlbHRhIC09IGFuZ2xlO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgLy8gcGFzcyBpbiBkaXN0YW5jZSBpbiB3b3JsZCBzcGFjZSB0byBtb3ZlIGxlZnRcclxuICAgIHRoaXMucGFuTGVmdCA9IGZ1bmN0aW9uIChkaXN0YW5jZSkge1xyXG5cclxuICAgICAgICB2YXIgdGUgPSB0aGlzLm9iamVjdC5tYXRyaXguZWxlbWVudHM7XHJcblxyXG4gICAgICAgIC8vIGdldCBYIGNvbHVtbiBvZiBtYXRyaXhcclxuICAgICAgICBwYW5PZmZzZXQuc2V0KHRlWyAwIF0sIHRlWyAxIF0sIHRlWyAyIF0pO1xyXG4gICAgICAgIHBhbk9mZnNldC5tdWx0aXBseVNjYWxhcigtZGlzdGFuY2UpO1xyXG5cclxuICAgICAgICBwYW4uYWRkKHBhbk9mZnNldCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBwYXNzIGluIGRpc3RhbmNlIGluIHdvcmxkIHNwYWNlIHRvIG1vdmUgdXBcclxuICAgIHRoaXMucGFuVXAgPSBmdW5jdGlvbiAoZGlzdGFuY2UpIHtcclxuXHJcbiAgICAgICAgdmFyIHRlID0gdGhpcy5vYmplY3QubWF0cml4LmVsZW1lbnRzO1xyXG5cclxuICAgICAgICAvLyBnZXQgWSBjb2x1bW4gb2YgbWF0cml4XHJcbiAgICAgICAgcGFuT2Zmc2V0LnNldCh0ZVsgNCBdLCB0ZVsgNSBdLCB0ZVsgNiBdKTtcclxuICAgICAgICBwYW5PZmZzZXQubXVsdGlwbHlTY2FsYXIoZGlzdGFuY2UpO1xyXG5cclxuICAgICAgICBwYW4uYWRkKHBhbk9mZnNldCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBwYXNzIGluIHgseSBvZiBjaGFuZ2UgZGVzaXJlZCBpbiBwaXhlbCBzcGFjZSxcclxuICAgIC8vIHJpZ2h0IGFuZCBkb3duIGFyZSBwb3NpdGl2ZVxyXG4gICAgdGhpcy5wYW4gPSBmdW5jdGlvbiAoZGVsdGFYLCBkZWx0YVkpIHtcclxuXHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBzY29wZS5kb21FbGVtZW50ID09PSBkb2N1bWVudCA/IHNjb3BlLmRvbUVsZW1lbnQuYm9keSA6IHNjb3BlLmRvbUVsZW1lbnQ7XHJcblxyXG4gICAgICAgIGlmIChzY29wZS5vYmplY3QuZm92ICE9PSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIHBlcnNwZWN0aXZlXHJcbiAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IHNjb3BlLm9iamVjdC5wb3NpdGlvbjtcclxuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHBvc2l0aW9uLmNsb25lKCkuc3ViKHNjb3BlLnRhcmdldCk7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXREaXN0YW5jZSA9IG9mZnNldC5sZW5ndGgoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGhhbGYgb2YgdGhlIGZvdiBpcyBjZW50ZXIgdG8gdG9wIG9mIHNjcmVlblxyXG4gICAgICAgICAgICB0YXJnZXREaXN0YW5jZSAqPSBNYXRoLnRhbigoIHNjb3BlLm9iamVjdC5mb3YgLyAyICkgKiBNYXRoLlBJIC8gMTgwLjApO1xyXG5cclxuICAgICAgICAgICAgLy8gd2UgYWN0dWFsbHkgZG9uJ3QgdXNlIHNjcmVlbldpZHRoLCBzaW5jZSBwZXJzcGVjdGl2ZSBjYW1lcmEgaXMgZml4ZWQgdG8gc2NyZWVuIGhlaWdodFxyXG4gICAgICAgICAgICBzY29wZS5wYW5MZWZ0KDIgKiBkZWx0YVggKiB0YXJnZXREaXN0YW5jZSAvIGVsZW1lbnQuY2xpZW50SGVpZ2h0KTtcclxuICAgICAgICAgICAgc2NvcGUucGFuVXAoMiAqIGRlbHRhWSAqIHRhcmdldERpc3RhbmNlIC8gZWxlbWVudC5jbGllbnRIZWlnaHQpO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKHNjb3BlLm9iamVjdC50b3AgIT09IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICAgICAgLy8gb3J0aG9ncmFwaGljXHJcbiAgICAgICAgICAgIHNjb3BlLnBhbkxlZnQoZGVsdGFYICogKHNjb3BlLm9iamVjdC5yaWdodCAtIHNjb3BlLm9iamVjdC5sZWZ0KSAvIGVsZW1lbnQuY2xpZW50V2lkdGgpO1xyXG4gICAgICAgICAgICBzY29wZS5wYW5VcChkZWx0YVkgKiAoc2NvcGUub2JqZWN0LnRvcCAtIHNjb3BlLm9iamVjdC5ib3R0b20pIC8gZWxlbWVudC5jbGllbnRIZWlnaHQpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgLy8gY2FtZXJhIG5laXRoZXIgb3J0aG9ncmFwaGljIG9yIHBlcnNwZWN0aXZlXHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignV0FSTklORzogT3JiaXRDb250cm9scy5qcyBlbmNvdW50ZXJlZCBhbiB1bmtub3duIGNhbWVyYSB0eXBlIC0gcGFuIGRpc2FibGVkLicpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmRvbGx5SW4gPSBmdW5jdGlvbiAoZG9sbHlTY2FsZSkge1xyXG5cclxuICAgICAgICBpZiAoZG9sbHlTY2FsZSA9PT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICBkb2xseVNjYWxlID0gZ2V0Wm9vbVNjYWxlKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2NhbGUgLz0gZG9sbHlTY2FsZTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZG9sbHlPdXQgPSBmdW5jdGlvbiAoZG9sbHlTY2FsZSkge1xyXG5cclxuICAgICAgICBpZiAoZG9sbHlTY2FsZSA9PT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICBkb2xseVNjYWxlID0gZ2V0Wm9vbVNjYWxlKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2NhbGUgKj0gZG9sbHlTY2FsZTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB2YXIgcG9zaXRpb24gPSB0aGlzLm9iamVjdC5wb3NpdGlvbjtcclxuXHJcbiAgICAgICAgb2Zmc2V0LmNvcHkocG9zaXRpb24pLnN1Yih0aGlzLnRhcmdldCk7XHJcblxyXG4gICAgICAgIC8vIHJvdGF0ZSBvZmZzZXQgdG8gXCJ5LWF4aXMtaXMtdXBcIiBzcGFjZVxyXG4gICAgICAgIG9mZnNldC5hcHBseVF1YXRlcm5pb24ocXVhdCk7XHJcblxyXG4gICAgICAgIC8vIGFuZ2xlIGZyb20gei1heGlzIGFyb3VuZCB5LWF4aXNcclxuXHJcbiAgICAgICAgdmFyIHRoZXRhID0gTWF0aC5hdGFuMihvZmZzZXQueCwgb2Zmc2V0LnopO1xyXG5cclxuICAgICAgICAvLyBhbmdsZSBmcm9tIHktYXhpc1xyXG5cclxuICAgICAgICB2YXIgcGhpID0gTWF0aC5hdGFuMihNYXRoLnNxcnQob2Zmc2V0LnggKiBvZmZzZXQueCArIG9mZnNldC56ICogb2Zmc2V0LnopLCBvZmZzZXQueSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmF1dG9Sb3RhdGUpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucm90YXRlTGVmdChnZXRBdXRvUm90YXRpb25BbmdsZSgpKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGV0YSArPSB0aGV0YURlbHRhO1xyXG4gICAgICAgIHBoaSArPSBwaGlEZWx0YTtcclxuXHJcbiAgICAgICAgLy8gcmVzdHJpY3QgcGhpIHRvIGJlIGJldHdlZW4gZGVzaXJlZCBsaW1pdHNcclxuICAgICAgICBwaGkgPSBNYXRoLm1heCh0aGlzLm1pblBvbGFyQW5nbGUsIE1hdGgubWluKHRoaXMubWF4UG9sYXJBbmdsZSwgcGhpKSk7XHJcblxyXG4gICAgICAgIC8vIHJlc3RyaWN0IHBoaSB0byBiZSBiZXR3ZWUgRVBTIGFuZCBQSS1FUFNcclxuICAgICAgICBwaGkgPSBNYXRoLm1heChFUFMsIE1hdGgubWluKE1hdGguUEkgLSBFUFMsIHBoaSkpO1xyXG5cclxuICAgICAgICB2YXIgcmFkaXVzID0gb2Zmc2V0Lmxlbmd0aCgpICogc2NhbGU7XHJcblxyXG4gICAgICAgIC8vIHJlc3RyaWN0IHJhZGl1cyB0byBiZSBiZXR3ZWVuIGRlc2lyZWQgbGltaXRzXHJcbiAgICAgICAgcmFkaXVzID0gTWF0aC5tYXgodGhpcy5taW5EaXN0YW5jZSwgTWF0aC5taW4odGhpcy5tYXhEaXN0YW5jZSwgcmFkaXVzKSk7XHJcblxyXG4gICAgICAgIC8vIG1vdmUgdGFyZ2V0IHRvIHBhbm5lZCBsb2NhdGlvblxyXG4gICAgICAgIHRoaXMudGFyZ2V0LmFkZChwYW4pO1xyXG5cclxuICAgICAgICBvZmZzZXQueCA9IHJhZGl1cyAqIE1hdGguc2luKHBoaSkgKiBNYXRoLnNpbih0aGV0YSk7XHJcbiAgICAgICAgb2Zmc2V0LnkgPSByYWRpdXMgKiBNYXRoLmNvcyhwaGkpO1xyXG4gICAgICAgIG9mZnNldC56ID0gcmFkaXVzICogTWF0aC5zaW4ocGhpKSAqIE1hdGguY29zKHRoZXRhKTtcclxuXHJcbiAgICAgICAgLy8gcm90YXRlIG9mZnNldCBiYWNrIHRvIFwiY2FtZXJhLXVwLXZlY3Rvci1pcy11cFwiIHNwYWNlXHJcbiAgICAgICAgb2Zmc2V0LmFwcGx5UXVhdGVybmlvbihxdWF0SW52ZXJzZSk7XHJcblxyXG4gICAgICAgIHBvc2l0aW9uLmNvcHkodGhpcy50YXJnZXQpLmFkZChvZmZzZXQpO1xyXG5cclxuICAgICAgICB0aGlzLm9iamVjdC5sb29rQXQodGhpcy50YXJnZXQpO1xyXG5cclxuICAgICAgICB0aGV0YURlbHRhID0gMDtcclxuICAgICAgICBwaGlEZWx0YSA9IDA7XHJcbiAgICAgICAgc2NhbGUgPSAxO1xyXG4gICAgICAgIHBhbi5zZXQoMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIC8vIHVwZGF0ZSBjb25kaXRpb24gaXM6XHJcbiAgICAgICAgLy8gbWluKGNhbWVyYSBkaXNwbGFjZW1lbnQsIGNhbWVyYSByb3RhdGlvbiBpbiByYWRpYW5zKV4yID4gRVBTXHJcbiAgICAgICAgLy8gdXNpbmcgc21hbGwtYW5nbGUgYXBwcm94aW1hdGlvbiBjb3MoeC8yKSA9IDEgLSB4XjIgLyA4XHJcblxyXG4gICAgICAgIGlmIChsYXN0UG9zaXRpb24uZGlzdGFuY2VUb1NxdWFyZWQodGhpcy5vYmplY3QucG9zaXRpb24pID4gRVBTXHJcbiAgICAgICAgICAgIHx8IDggKiAoMSAtIGxhc3RRdWF0ZXJuaW9uLmRvdCh0aGlzLm9iamVjdC5xdWF0ZXJuaW9uKSkgPiBFUFMpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChjaGFuZ2VFdmVudCk7XHJcblxyXG4gICAgICAgICAgICBsYXN0UG9zaXRpb24uY29weSh0aGlzLm9iamVjdC5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgIGxhc3RRdWF0ZXJuaW9uLmNvcHkodGhpcy5vYmplY3QucXVhdGVybmlvbik7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBzY29wZS5kb21FbGVtZW50ID09PSBkb2N1bWVudCA/IHNjb3BlLmRvbUVsZW1lbnQuYm9keSA6IHNjb3BlLmRvbUVsZW1lbnQ7XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50LmNsaWVudFdpZHRoID4gMCAmJiBlbGVtZW50LmNsaWVudEhlaWdodCA+IDApIHtcclxuICAgICAgICAgICAgLy8gcm90YXRpbmcgYWNyb3NzIHdob2xlIHNjcmVlbiBnb2VzIDM2MCBkZWdyZWVzIGFyb3VuZFxyXG4gICAgICAgICAgICBzY29wZS5yb3RhdGVMZWZ0KDIgKiBNYXRoLlBJICogcm90YXRlRGVsdGEueCAvIGVsZW1lbnQuY2xpZW50V2lkdGggKiBzY29wZS5yb3RhdGVTcGVlZCk7XHJcblxyXG4gICAgICAgICAgICAvLyByb3RhdGluZyB1cCBhbmQgZG93biBhbG9uZyB3aG9sZSBzY3JlZW4gYXR0ZW1wdHMgdG8gZ28gMzYwLCBidXQgbGltaXRlZCB0byAxODBcclxuICAgICAgICAgICAgc2NvcGUucm90YXRlVXAoMiAqIE1hdGguUEkgKiByb3RhdGVEZWx0YS55IC8gZWxlbWVudC5jbGllbnRIZWlnaHQgKiBzY29wZS5yb3RhdGVTcGVlZCk7XHJcblxyXG4gICAgICAgICAgICByb3RhdGVEZWx0YS5tdWx0aXBseVNjYWxhcigwLjk5KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICB0aGlzLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICBzdGF0ZSA9IFNUQVRFLk5PTkU7XHJcblxyXG4gICAgICAgIHRoaXMudGFyZ2V0LmNvcHkodGhpcy50YXJnZXQwKTtcclxuICAgICAgICB0aGlzLm9iamVjdC5wb3NpdGlvbi5jb3B5KHRoaXMucG9zaXRpb24wKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldEF1dG9Sb3RhdGlvbkFuZ2xlKCkge1xyXG5cclxuICAgICAgICByZXR1cm4gMiAqIE1hdGguUEkgLyA2MCAvIDYwICogc2NvcGUuYXV0b1JvdGF0ZVNwZWVkO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRab29tU2NhbGUoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiBNYXRoLnBvdygwLjk1LCBzY29wZS56b29tU3BlZWQpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbk1vdXNlRG93bihldmVudCkge1xyXG5cclxuICAgICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UpIHJldHVybjtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBpZiAoZXZlbnQuYnV0dG9uID09PSAwKSB7XHJcbiAgICAgICAgICAgIGlmIChzY29wZS5ub1JvdGF0ZSA9PT0gdHJ1ZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5ST1RBVEU7XHJcblxyXG4gICAgICAgICAgICByb3RhdGVTdGFydC5zZXQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuYnV0dG9uID09PSAxKSB7XHJcbiAgICAgICAgICAgIGlmIChzY29wZS5ub1pvb20gPT09IHRydWUpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHN0YXRlID0gU1RBVEUuRE9MTFk7XHJcblxyXG4gICAgICAgICAgICBkb2xseVN0YXJ0LnNldChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5idXR0b24gPT09IDIpIHtcclxuICAgICAgICAgICAgaWYgKHNjb3BlLm5vUGFuID09PSB0cnVlKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBzdGF0ZSA9IFNUQVRFLlBBTjtcclxuXHJcbiAgICAgICAgICAgIHBhblN0YXJ0LnNldChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSwgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXAsIGZhbHNlKTtcclxuICAgICAgICBzY29wZS5kaXNwYXRjaEV2ZW50KHN0YXJ0RXZlbnQpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xyXG5cclxuICAgICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UpIHJldHVybjtcclxuXHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBzY29wZS5kb21FbGVtZW50ID09PSBkb2N1bWVudCA/IHNjb3BlLmRvbUVsZW1lbnQuYm9keSA6IHNjb3BlLmRvbUVsZW1lbnQ7XHJcblxyXG4gICAgICAgIGlmIChzdGF0ZSA9PT0gU1RBVEUuUk9UQVRFKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2NvcGUubm9Sb3RhdGUgPT09IHRydWUpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHJvdGF0ZUVuZC5zZXQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XHJcbiAgICAgICAgICAgIHJvdGF0ZURlbHRhLnN1YlZlY3RvcnMocm90YXRlRW5kLCByb3RhdGVTdGFydCk7XHJcblxyXG4gICAgICAgICAgICAvLyByb3RhdGluZyBhY3Jvc3Mgd2hvbGUgc2NyZWVuIGdvZXMgMzYwIGRlZ3JlZXMgYXJvdW5kXHJcbiAgICAgICAgICAgIHNjb3BlLnJvdGF0ZUxlZnQoMiAqIE1hdGguUEkgKiByb3RhdGVEZWx0YS54IC8gZWxlbWVudC5jbGllbnRXaWR0aCAqIHNjb3BlLnJvdGF0ZVNwZWVkKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHJvdGF0aW5nIHVwIGFuZCBkb3duIGFsb25nIHdob2xlIHNjcmVlbiBhdHRlbXB0cyB0byBnbyAzNjAsIGJ1dCBsaW1pdGVkIHRvIDE4MFxyXG4gICAgICAgICAgICBzY29wZS5yb3RhdGVVcCgyICogTWF0aC5QSSAqIHJvdGF0ZURlbHRhLnkgLyBlbGVtZW50LmNsaWVudEhlaWdodCAqIHNjb3BlLnJvdGF0ZVNwZWVkKTtcclxuXHJcbiAgICAgICAgICAgIHJvdGF0ZVN0YXJ0LmNvcHkocm90YXRlRW5kKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gU1RBVEUuRE9MTFkpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChzY29wZS5ub1pvb20gPT09IHRydWUpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGRvbGx5RW5kLnNldChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcclxuICAgICAgICAgICAgZG9sbHlEZWx0YS5zdWJWZWN0b3JzKGRvbGx5RW5kLCBkb2xseVN0YXJ0KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkb2xseURlbHRhLnkgPiAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgc2NvcGUuZG9sbHlJbigpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzY29wZS5kb2xseU91dCgpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZG9sbHlTdGFydC5jb3B5KGRvbGx5RW5kKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gU1RBVEUuUEFOKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2NvcGUubm9QYW4gPT09IHRydWUpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHBhbkVuZC5zZXQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XHJcbiAgICAgICAgICAgIHBhbkRlbHRhLnN1YlZlY3RvcnMocGFuRW5kLCBwYW5TdGFydCk7XHJcblxyXG4gICAgICAgICAgICBzY29wZS5wYW4ocGFuRGVsdGEueCwgcGFuRGVsdGEueSk7XHJcblxyXG4gICAgICAgICAgICBwYW5TdGFydC5jb3B5KHBhbkVuZCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2NvcGUudXBkYXRlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG9uTW91c2VVcCgvKiBldmVudCAqLykge1xyXG5cclxuICAgICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UpIHJldHVybjtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUsIGZhbHNlKTtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwLCBmYWxzZSk7XHJcbiAgICAgICAgc2NvcGUuZGlzcGF0Y2hFdmVudChlbmRFdmVudCk7XHJcbiAgICAgICAgc3RhdGUgPSBTVEFURS5OT05FO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbk1vdXNlV2hlZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlIHx8IHNjb3BlLm5vWm9vbSA9PT0gdHJ1ZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICB2YXIgZGVsdGEgPSAwO1xyXG5cclxuICAgICAgICBpZiAoZXZlbnQud2hlZWxEZWx0YSAhPT0gdW5kZWZpbmVkKSB7IC8vIFdlYktpdCAvIE9wZXJhIC8gRXhwbG9yZXIgOVxyXG5cclxuICAgICAgICAgICAgZGVsdGEgPSBldmVudC53aGVlbERlbHRhO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmRldGFpbCAhPT0gdW5kZWZpbmVkKSB7IC8vIEZpcmVmb3hcclxuXHJcbiAgICAgICAgICAgIGRlbHRhID0gLWV2ZW50LmRldGFpbDtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGVsdGEgPiAwKSB7XHJcblxyXG4gICAgICAgICAgICBzY29wZS5kb2xseU91dCgpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgc2NvcGUuZG9sbHlJbigpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNjb3BlLnVwZGF0ZSgpO1xyXG4gICAgICAgIHNjb3BlLmRpc3BhdGNoRXZlbnQoc3RhcnRFdmVudCk7XHJcbiAgICAgICAgc2NvcGUuZGlzcGF0Y2hFdmVudChlbmRFdmVudCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG9uS2V5RG93bihldmVudCkge1xyXG5cclxuICAgICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UgfHwgc2NvcGUubm9LZXlzID09PSB0cnVlIHx8IHNjb3BlLm5vUGFuID09PSB0cnVlKSByZXR1cm47XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xyXG5cclxuICAgICAgICAgICAgY2FzZSBzY29wZS5rZXlzLlVQOlxyXG4gICAgICAgICAgICAgICAgc2NvcGUucGFuKDAsIHNjb3BlLmtleVBhblNwZWVkKTtcclxuICAgICAgICAgICAgICAgIHNjb3BlLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIHNjb3BlLmtleXMuQk9UVE9NOlxyXG4gICAgICAgICAgICAgICAgc2NvcGUucGFuKDAsIC1zY29wZS5rZXlQYW5TcGVlZCk7XHJcbiAgICAgICAgICAgICAgICBzY29wZS51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBzY29wZS5rZXlzLkxFRlQ6XHJcbiAgICAgICAgICAgICAgICBzY29wZS5wYW4oc2NvcGUua2V5UGFuU3BlZWQsIDApO1xyXG4gICAgICAgICAgICAgICAgc2NvcGUudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2Ugc2NvcGUua2V5cy5SSUdIVDpcclxuICAgICAgICAgICAgICAgIHNjb3BlLnBhbigtc2NvcGUua2V5UGFuU3BlZWQsIDApO1xyXG4gICAgICAgICAgICAgICAgc2NvcGUudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0b3VjaHN0YXJ0KGV2ZW50KSB7XHJcblxyXG4gICAgICAgIGlmIChzY29wZS5lbmFibGVkID09PSBmYWxzZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGV2ZW50LnRvdWNoZXMubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDE6XHQvLyBvbmUtZmluZ2VyZWQgdG91Y2g6IHJvdGF0ZVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzY29wZS5ub1JvdGF0ZSA9PT0gdHJ1ZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIHN0YXRlID0gU1RBVEUuVE9VQ0hfUk9UQVRFO1xyXG5cclxuICAgICAgICAgICAgICAgIHJvdGF0ZVN0YXJ0LnNldChldmVudC50b3VjaGVzWyAwIF0ucGFnZVgsIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgMjpcdC8vIHR3by1maW5nZXJlZCB0b3VjaDogZG9sbHlcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUubm9ab29tID09PSB0cnVlKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5UT1VDSF9ET0xMWTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZHggPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVg7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHkgPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG4gICAgICAgICAgICAgICAgZG9sbHlTdGFydC5zZXQoMCwgZGlzdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDM6IC8vIHRocmVlLWZpbmdlcmVkIHRvdWNoOiBwYW5cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUubm9QYW4gPT09IHRydWUpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IFNUQVRFLlRPVUNIX1BBTjtcclxuXHJcbiAgICAgICAgICAgICAgICBwYW5TdGFydC5zZXQoZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYLCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG5cclxuICAgICAgICAgICAgICAgIHN0YXRlID0gU1RBVEUuTk9ORTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzY29wZS5kaXNwYXRjaEV2ZW50KHN0YXJ0RXZlbnQpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0b3VjaG1vdmUoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgIHZhciBlbGVtZW50ID0gc2NvcGUuZG9tRWxlbWVudCA9PT0gZG9jdW1lbnQgPyBzY29wZS5kb21FbGVtZW50LmJvZHkgOiBzY29wZS5kb21FbGVtZW50O1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGV2ZW50LnRvdWNoZXMubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDE6IC8vIG9uZS1maW5nZXJlZCB0b3VjaDogcm90YXRlXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLm5vUm90YXRlID09PSB0cnVlKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgIT09IFNUQVRFLlRPVUNIX1JPVEFURSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIHJvdGF0ZUVuZC5zZXQoZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYLCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkpO1xyXG4gICAgICAgICAgICAgICAgcm90YXRlRGVsdGEuc3ViVmVjdG9ycyhyb3RhdGVFbmQsIHJvdGF0ZVN0YXJ0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyByb3RhdGluZyBhY3Jvc3Mgd2hvbGUgc2NyZWVuIGdvZXMgMzYwIGRlZ3JlZXMgYXJvdW5kXHJcbiAgICAgICAgICAgICAgICBzY29wZS5yb3RhdGVMZWZ0KDIgKiBNYXRoLlBJICogcm90YXRlRGVsdGEueCAvIGVsZW1lbnQuY2xpZW50V2lkdGggKiBzY29wZS5yb3RhdGVTcGVlZCk7XHJcbiAgICAgICAgICAgICAgICAvLyByb3RhdGluZyB1cCBhbmQgZG93biBhbG9uZyB3aG9sZSBzY3JlZW4gYXR0ZW1wdHMgdG8gZ28gMzYwLCBidXQgbGltaXRlZCB0byAxODBcclxuICAgICAgICAgICAgICAgIHNjb3BlLnJvdGF0ZVVwKDIgKiBNYXRoLlBJICogcm90YXRlRGVsdGEueSAvIGVsZW1lbnQuY2xpZW50SGVpZ2h0ICogc2NvcGUucm90YXRlU3BlZWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJvdGF0ZVN0YXJ0LmNvcHkocm90YXRlRW5kKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzY29wZS51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAyOiAvLyB0d28tZmluZ2VyZWQgdG91Y2g6IGRvbGx5XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLm5vWm9vbSA9PT0gdHJ1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlICE9PSBTVEFURS5UT1VDSF9ET0xMWSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBkeCA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCAtIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWDtcclxuICAgICAgICAgICAgICAgIHZhciBkeSA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSAtIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWTtcclxuICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZG9sbHlFbmQuc2V0KDAsIGRpc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIGRvbGx5RGVsdGEuc3ViVmVjdG9ycyhkb2xseUVuZCwgZG9sbHlTdGFydCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRvbGx5RGVsdGEueSA+IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuZG9sbHlPdXQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5kb2xseUluKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGRvbGx5U3RhcnQuY29weShkb2xseUVuZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2NvcGUudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgMzogLy8gdGhyZWUtZmluZ2VyZWQgdG91Y2g6IHBhblxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzY29wZS5ub1BhbiA9PT0gdHJ1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlICE9PSBTVEFURS5UT1VDSF9QQU4pIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICBwYW5FbmQuc2V0KGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCwgZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZKTtcclxuICAgICAgICAgICAgICAgIHBhbkRlbHRhLnN1YlZlY3RvcnMocGFuRW5kLCBwYW5TdGFydCk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2NvcGUucGFuKHBhbkRlbHRhLngsIHBhbkRlbHRhLnkpO1xyXG5cclxuICAgICAgICAgICAgICAgIHBhblN0YXJ0LmNvcHkocGFuRW5kKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzY29wZS51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IFNUQVRFLk5PTkU7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG91Y2hlbmQoLyogZXZlbnQgKi8pIHtcclxuXHJcbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKSByZXR1cm47XHJcblxyXG4gICAgICAgIHNjb3BlLmRpc3BhdGNoRXZlbnQoZW5kRXZlbnQpO1xyXG4gICAgICAgIHN0YXRlID0gU1RBVEUuTk9ORTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH0sIGZhbHNlKTtcclxuICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk1vdXNlRG93biwgZmFsc2UpO1xyXG4gICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNld2hlZWwnLCBvbk1vdXNlV2hlZWwsIGZhbHNlKTtcclxuICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Nb3VzZVNjcm9sbCcsIG9uTW91c2VXaGVlbCwgZmFsc2UpOyAvLyBmaXJlZm94XHJcblxyXG4gICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0b3VjaHN0YXJ0LCBmYWxzZSk7XHJcbiAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0b3VjaGVuZCwgZmFsc2UpO1xyXG4gICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRvdWNobW92ZSwgZmFsc2UpO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXlEb3duLCBmYWxzZSk7XHJcblxyXG4gICAgLy8gZm9yY2UgYW4gdXBkYXRlIGF0IHN0YXJ0XHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxufTtcclxuXHJcblRIUkVFLk9yYml0Q29udHJvbHMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShUSFJFRS5FdmVudERpc3BhdGNoZXIucHJvdG90eXBlKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgd2luZG93LlF1ZXVlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiBRdWV1ZSgpIHtcclxuICAgICAgICAgICAgdGhpcy50YWlsID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuaGVhZCA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gMDtcclxuICAgICAgICAgICAgLy8gTG9jayB0aGUgb2JqZWN0IGRvd25cclxuICAgICAgICAgICAgT2JqZWN0LnNlYWwodGhpcyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgUXVldWUucHJvdG90eXBlLnNoaWZ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vZmZzZXQgPT09IHRoaXMuaGVhZC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0bXAgPSB0aGlzLmhlYWQ7XHJcbiAgICAgICAgICAgICAgICB0bXAubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVhZCA9IHRoaXMudGFpbDtcclxuICAgICAgICAgICAgICAgIHRoaXMudGFpbCA9IHRtcDtcclxuICAgICAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gMDtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhlYWQubGVuZ3RoID09PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVhZFt0aGlzLm9mZnNldCsrXTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBRdWV1ZS5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhaWwucHVzaChpdGVtKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBRdWV1ZS5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oZWFkLmxlbmd0aCAtIHRoaXMub2Zmc2V0ICsgdGhpcy50YWlsLmxlbmd0aDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gUXVldWU7XHJcbiAgICB9KSgpO1xyXG59KS5jYWxsKHRoaXMpIl19
