(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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



},{}],2:[function(require,module,exports){
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

  ChoreographyRoutine.prototype.updateDancer = function(dancer) {
    this.dancer = dancer.constructor.name;
    this.danceMaterial = dancer.danceMaterial.constructor.name;
    return this.dance = dancer.dance.constructor.name;
  };

  return ChoreographyRoutine;

})();



},{}],3:[function(require,module,exports){
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



},{}],4:[function(require,module,exports){
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



},{"../javascript/OrbitControls":18,"./DatGUIInterface.coffee":3,"./Viewer.coffee":7,"./Visualizer.coffee":8}],5:[function(require,module,exports){
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



},{"./AudioWindow.coffee":1}],6:[function(require,module,exports){
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



},{}],7:[function(require,module,exports){
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



},{"../javascript/Queue.js":19,"./ShaderLoader.coffee":6}],8:[function(require,module,exports){
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



},{"./ChoreographyRoutine.coffee":2,"./Player.coffee":5,"./danceMaterials/ColorDanceMaterial.coffee":9,"./danceMaterials/SimpleFrequencyShader.coffee":10,"./dancers/CubeDancer.coffee":11,"./dancers/PointCloudDancer.coffee":13,"./dancers/SphereDancer.coffee":14,"./dances/PositionDance.coffee":15,"./dances/RotateDance.coffee":16,"./dances/ScaleDance.coffee":17}],9:[function(require,module,exports){
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



},{}],10:[function(require,module,exports){
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



},{}],11:[function(require,module,exports){
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



},{"./Dancer.coffee":12}],12:[function(require,module,exports){
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



},{}],13:[function(require,module,exports){
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



},{"./Dancer.coffee":12}],14:[function(require,module,exports){
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



},{"./Dancer.coffee":12}],15:[function(require,module,exports){
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



},{}],16:[function(require,module,exports){
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



},{}],17:[function(require,module,exports){
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



},{}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
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
},{}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcQXBwRGF0YVxcUm9hbWluZ1xcbnBtXFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkM6XFxVc2Vyc1xcVWx5c3Nlc1xcRGV2ZWxvcG1lbnRcXHdlYmdsLXZpc3VhbGl6ZXJcXGNvZmZlZVxcQXVkaW9XaW5kb3cuY29mZmVlIiwiQzpcXFVzZXJzXFxVbHlzc2VzXFxEZXZlbG9wbWVudFxcd2ViZ2wtdmlzdWFsaXplclxcY29mZmVlXFxDaG9yZW9ncmFwaHlSb3V0aW5lLmNvZmZlZSIsIkM6XFxVc2Vyc1xcVWx5c3Nlc1xcRGV2ZWxvcG1lbnRcXHdlYmdsLXZpc3VhbGl6ZXJcXGNvZmZlZVxcRGF0R1VJSW50ZXJmYWNlLmNvZmZlZSIsIkM6XFxVc2Vyc1xcVWx5c3Nlc1xcRGV2ZWxvcG1lbnRcXHdlYmdsLXZpc3VhbGl6ZXJcXGNvZmZlZVxcTWFpbi5jb2ZmZWUiLCJDOlxcVXNlcnNcXFVseXNzZXNcXERldmVsb3BtZW50XFx3ZWJnbC12aXN1YWxpemVyXFxjb2ZmZWVcXFBsYXllci5jb2ZmZWUiLCJDOlxcVXNlcnNcXFVseXNzZXNcXERldmVsb3BtZW50XFx3ZWJnbC12aXN1YWxpemVyXFxjb2ZmZWVcXFNoYWRlckxvYWRlci5jb2ZmZWUiLCJDOlxcVXNlcnNcXFVseXNzZXNcXERldmVsb3BtZW50XFx3ZWJnbC12aXN1YWxpemVyXFxjb2ZmZWVcXFZpZXdlci5jb2ZmZWUiLCJDOlxcVXNlcnNcXFVseXNzZXNcXERldmVsb3BtZW50XFx3ZWJnbC12aXN1YWxpemVyXFxjb2ZmZWVcXFZpc3VhbGl6ZXIuY29mZmVlIiwiQzpcXFVzZXJzXFxVbHlzc2VzXFxEZXZlbG9wbWVudFxcd2ViZ2wtdmlzdWFsaXplclxcY29mZmVlXFxkYW5jZU1hdGVyaWFsc1xcQ29sb3JEYW5jZU1hdGVyaWFsLmNvZmZlZSIsIkM6XFxVc2Vyc1xcVWx5c3Nlc1xcRGV2ZWxvcG1lbnRcXHdlYmdsLXZpc3VhbGl6ZXJcXGNvZmZlZVxcZGFuY2VNYXRlcmlhbHNcXFNpbXBsZUZyZXF1ZW5jeVNoYWRlci5jb2ZmZWUiLCJDOlxcVXNlcnNcXFVseXNzZXNcXERldmVsb3BtZW50XFx3ZWJnbC12aXN1YWxpemVyXFxjb2ZmZWVcXGRhbmNlcnNcXEN1YmVEYW5jZXIuY29mZmVlIiwiQzpcXFVzZXJzXFxVbHlzc2VzXFxEZXZlbG9wbWVudFxcd2ViZ2wtdmlzdWFsaXplclxcY29mZmVlXFxkYW5jZXJzXFxEYW5jZXIuY29mZmVlIiwiQzpcXFVzZXJzXFxVbHlzc2VzXFxEZXZlbG9wbWVudFxcd2ViZ2wtdmlzdWFsaXplclxcY29mZmVlXFxkYW5jZXJzXFxQb2ludENsb3VkRGFuY2VyLmNvZmZlZSIsIkM6XFxVc2Vyc1xcVWx5c3Nlc1xcRGV2ZWxvcG1lbnRcXHdlYmdsLXZpc3VhbGl6ZXJcXGNvZmZlZVxcZGFuY2Vyc1xcU3BoZXJlRGFuY2VyLmNvZmZlZSIsIkM6XFxVc2Vyc1xcVWx5c3Nlc1xcRGV2ZWxvcG1lbnRcXHdlYmdsLXZpc3VhbGl6ZXJcXGNvZmZlZVxcZGFuY2VzXFxQb3NpdGlvbkRhbmNlLmNvZmZlZSIsIkM6XFxVc2Vyc1xcVWx5c3Nlc1xcRGV2ZWxvcG1lbnRcXHdlYmdsLXZpc3VhbGl6ZXJcXGNvZmZlZVxcZGFuY2VzXFxSb3RhdGVEYW5jZS5jb2ZmZWUiLCJDOlxcVXNlcnNcXFVseXNzZXNcXERldmVsb3BtZW50XFx3ZWJnbC12aXN1YWxpemVyXFxjb2ZmZWVcXGRhbmNlc1xcU2NhbGVEYW5jZS5jb2ZmZWUiLCJqYXZhc2NyaXB0XFxPcmJpdENvbnRyb2xzLmpzIiwiamF2YXNjcmlwdFxcUXVldWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNDQSxNQUFZLENBQUM7QUFDWCxFQUFBLFdBQUMsQ0FBQSxVQUFELEdBQWEsSUFBYixDQUFBOztBQUVhLEVBQUEscUJBQUMsY0FBRCxHQUFBO0FBQ1gsSUFBQSxJQUFDLENBQUEsY0FBRCxHQUFrQixjQUFsQixDQUFBO0FBQUEs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QyxJQUFDLENBQUEsS0FBSyxDQUFDLENBQXZDLEVBQTBDLElBQUMsQ0FBQSxLQUFLLENBQUMsQ0FBakQsRUFaTTtFQUFBLENBMUJSLENBQUE7O0FBQUEsdUJBd0NBLEtBQUEsR0FBTyxTQUFDLE1BQUQsR0FBQTtXQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQWxCLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLEVBQTRCLENBQTVCLEVBRE07RUFBQSxDQXhDUCxDQUFBOztvQkFBQTs7SUFERixDQUFBOzs7OztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMgQ29udGFpbnMgdGhlIGZyZXF1ZW5jeVNhbXBsZXMgYW5kIGRiU2FtcGxlcyBmb3IgYXVkaW9cclxuY2xhc3Mgd2luZG93LkF1ZGlvV2luZG93XHJcbiAgQGJ1ZmZlclNpemU6IDIwNDhcclxuXHJcbiAgY29uc3RydWN0b3I6IChyZXNwb25zaXZlbmVzcykgLT5cclxuICAgIEByZXNwb25zaXZlbmVzcyA9IHJlc3BvbnNpdmVuZXNzXHJcbiAgICBAZnJlcXVlbmN5QnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoQGNvbnN0cnVjdG9yLmJ1ZmZlclNpemUpXHJcbiAgICBAZGJCdWZmZXIgPSBuZXcgVWludDhBcnJheShAY29uc3RydWN0b3IuYnVmZmVyU2l6ZSlcclxuICAgIEB0aW1lID0gMFxyXG4gICAgQGRlbHRhVGltZSA9IDBcclxuXHJcbiAgdXBkYXRlOiAoYW5hbHlzZXIsIHRpbWUpIC0+XHJcbiAgICBpZiAhYW5hbHlzZXJcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgIyBLZWVwIHRyYWNrIG9mIHRoZSBhdWRpb0NvbnRleHQgdGltZSBpbiBtc1xyXG4gICAgbmV3VGltZSA9IHRpbWUgKiAxMDAwXHJcbiAgICBAZGVsdGFUaW1lID0gbmV3VGltZSAtIEB0aW1lXHJcbiAgICBAdGltZSA9IG5ld1RpbWVcclxuXHJcbiAgICBhbmFseXNlci5nZXRCeXRlVGltZURvbWFpbkRhdGEoQGRiQnVmZmVyKVxyXG4gICAgYW5hbHlzZXIuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEoQGZyZXF1ZW5jeUJ1ZmZlcilcclxuXHJcbiAgICBybXMgPSAwXHJcblxyXG4gICAgZm9yIGJ1ZiBpbiBAZGJCdWZmZXJcclxuICAgICAgICB2YWwgPSAoYnVmIC0gMTI4KSAvIDEyOFxyXG4gICAgICAgIHJtcyArPSB2YWwqdmFsXHJcblxyXG4gICAgQGF2ZXJhZ2VEYiA9IE1hdGguc3FydChybXMgLyBAY29uc3RydWN0b3IuYnVmZmVyU2l6ZSkgKiBAcmVzcG9uc2l2ZW5lc3MiLCJjbGFzcyB3aW5kb3cuQ2hvcmVvZ3JhcGh5Um91dGluZVxyXG4gIGNvbnN0cnVjdG9yOiAoQHZpc3VhbGl6ZXIpIC0+XHJcbiAgICBAaWQgPSAwXHJcbiAgICBAZGFuY2VyID0gXCJDdWJlRGFuY2VyXCJcclxuICAgIEBkYW5jZSA9IFwiU2NhbGVEYW5jZVwiXHJcbiAgICBAZGFuY2VNYXRlcmlhbCA9IFwiQ29sb3JEYW5jZU1hdGVyaWFsXCJcclxuICAgIEBkYW5jZXJQYXJhbXMgPSB7fVxyXG4gICAgQGRhbmNlUGFyYW1zID0ge31cclxuICAgIEBkYW5jZU1hdGVyaWFsUGFyYW1zID0ge31cclxuXHJcbiAgICBAcmVzZXQoKVxyXG4gICAgQHJvdXRpbmUgPSBbXHJcbiAgICAgIFtcclxuICAgICAgICB7IGlkOiAtMSB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAyXHJcbiAgICAgICAgICBkYW5jZXI6XHJcbiAgICAgICAgICAgIHR5cGU6ICdDdWJlRGFuY2VyJ1xyXG4gICAgICAgICAgZGFuY2U6XHJcbiAgICAgICAgICAgIHR5cGU6ICdQb3NpdGlvbkRhbmNlJ1xyXG4gICAgICAgICAgICBwYXJhbXM6XHJcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcclxuICAgICAgICAgICAgICBkaXJlY3Rpb246IFswLCA0LjAsIDBdXHJcbiAgICAgICAgICBkYW5jZU1hdGVyaWFsOlxyXG4gICAgICAgICAgICB0eXBlOiAnQ29sb3JEYW5jZU1hdGVyaWFsJ1xyXG4gICAgICAgICAgICBwYXJhbXM6XHJcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAwXHJcbiAgICAgICAgICBkYW5jZXI6XHJcbiAgICAgICAgICAgIHR5cGU6ICdQb2ludENsb3VkRGFuY2VyJ1xyXG4gICAgICAgICAgZGFuY2U6XHJcbiAgICAgICAgICAgIHR5cGU6ICdSb3RhdGVEYW5jZSdcclxuICAgICAgICAgICAgcGFyYW1zOlxyXG4gICAgICAgICAgICAgIGF4aXM6IFstMSwgLTEsIDBdXHJcbiAgICAgICAgICBkYW5jZU1hdGVyaWFsOlxyXG4gICAgICAgICAgICB0eXBlOiAnQ29sb3JEYW5jZU1hdGVyaWFsJ1xyXG4gICAgICAgICAgICBwYXJhbXM6XHJcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcclxuICAgICAgICAgICAgICBtaW5MOiAwLjBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAxXHJcbiAgICAgICAgICBkYW5jZXI6XHJcbiAgICAgICAgICAgIHR5cGU6ICdQb2ludENsb3VkRGFuY2VyJ1xyXG4gICAgICAgICAgZGFuY2U6XHJcbiAgICAgICAgICAgIHR5cGU6ICdSb3RhdGVEYW5jZSdcclxuICAgICAgICAgICAgcGFyYW1zOlxyXG4gICAgICAgICAgICAgIGF4aXM6IFswLCAxLCAxXVxyXG4gICAgICAgICAgICAgIHNwZWVkOiAwLjVcclxuICAgICAgICAgIGRhbmNlTWF0ZXJpYWw6XHJcbiAgICAgICAgICAgIHR5cGU6ICdDb2xvckRhbmNlTWF0ZXJpYWwnXHJcbiAgICAgICAgICAgIHBhcmFtczpcclxuICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxyXG4gICAgICAgICAgICAgIG1pbkw6IDAuMFxyXG4gICAgICAgIH1cclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAyXHJcbiAgICAgICAgICBkYW5jZXI6XHJcbiAgICAgICAgICAgIHR5cGU6ICdTcGhlcmVEYW5jZXInXHJcbiAgICAgICAgICAgIHBhcmFtczpcclxuICAgICAgICAgICAgICBwb3NpdGlvbjogWzAuNSwgMCwgMC41XVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6IDNcclxuICAgICAgICAgIGRhbmNlcjpcclxuICAgICAgICAgICAgdHlwZTogJ1NwaGVyZURhbmNlcidcclxuICAgICAgICAgICAgcGFyYW1zOlxyXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBbMC41LCAwLCAtMC41XVxyXG4gICAgICAgICAgZGFuY2U6XHJcbiAgICAgICAgICAgIHR5cGU6ICdTY2FsZURhbmNlJ1xyXG4gICAgICAgICAgICBwYXJhbXM6XHJcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcclxuICAgICAgICAgIGRhbmNlTWF0ZXJpYWw6XHJcbiAgICAgICAgICAgIHR5cGU6ICdDb2xvckRhbmNlTWF0ZXJpYWwnXHJcbiAgICAgICAgICAgIHBhcmFtczpcclxuICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxyXG4gICAgICAgICAgICAgIHdpcmVmcmFtZTogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6IDRcclxuICAgICAgICAgIGRhbmNlcjpcclxuICAgICAgICAgICAgdHlwZTogJ1NwaGVyZURhbmNlcidcclxuICAgICAgICAgICAgcGFyYW1zOlxyXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBbLTAuNSwgMCwgMC41XVxyXG4gICAgICAgICAgZGFuY2U6XHJcbiAgICAgICAgICAgIHR5cGU6ICdTY2FsZURhbmNlJ1xyXG4gICAgICAgICAgICBwYXJhbXM6XHJcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcclxuICAgICAgICAgIGRhbmNlTWF0ZXJpYWw6XHJcbiAgICAgICAgICAgIHR5cGU6ICdDb2xvckRhbmNlTWF0ZXJpYWwnXHJcbiAgICAgICAgICAgIHBhcmFtczpcclxuICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxyXG4gICAgICAgICAgICAgIHdpcmVmcmFtZTogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6IDVcclxuICAgICAgICAgIGRhbmNlcjpcclxuICAgICAgICAgICAgdHlwZTogJ1NwaGVyZURhbmNlcidcclxuICAgICAgICAgICAgcGFyYW1zOlxyXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBbLTAuNSwgMCwgLTAuNV1cclxuICAgICAgICAgIGRhbmNlOlxyXG4gICAgICAgICAgICB0eXBlOiAnUG9zaXRpb25EYW5jZSdcclxuICAgICAgICAgICAgcGFyYW1zOlxyXG4gICAgICAgICAgICAgIHNtb290aGluZ0ZhY3RvcjogMC41XHJcbiAgICAgICAgICBkYW5jZU1hdGVyaWFsOlxyXG4gICAgICAgICAgICB0eXBlOiAnQ29sb3JEYW5jZU1hdGVyaWFsJ1xyXG4gICAgICAgICAgICBwYXJhbXM6XHJcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcclxuICAgICAgICAgICAgICB3aXJlZnJhbWU6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICBdXHJcbiAgICBdXHJcblxyXG4gICAgQHVwZGF0ZVRleHQoKVxyXG5cclxuICBwcmV2aWV3OiAoKSAtPlxyXG4gICAgQHZpc3VhbGl6ZXIucmVjZWl2ZUNob3Jlb2dyYXBoeVxyXG4gICAgICBpZDogQGlkXHJcbiAgICAgIGRhbmNlcjpcclxuICAgICAgICB0eXBlOiBAZGFuY2VyXHJcbiAgICAgICAgcGFyYW1zOiBAZGFuY2VyUGFyYW1zXHJcbiAgICAgIGRhbmNlOlxyXG4gICAgICAgIHR5cGU6IEBkYW5jZVxyXG4gICAgICAgIHBhcmFtczogQGRhbmNlUGFyYW1zXHJcbiAgICAgIGRhbmNlTWF0ZXJpYWw6XHJcbiAgICAgICAgdHlwZTogQGRhbmNlTWF0ZXJpYWxcclxuICAgICAgICBwYXJhbXM6IEBkYW5jZU1hdGVyaWFsUGFyYW1zXHJcblxyXG4gIGFkZDogKCkgLT5cclxuICAgIEByb3V0aW5lTW9tZW50LnB1c2hcclxuICAgICAgaWQ6IEBpZFxyXG4gICAgICBkYW5jZXI6XHJcbiAgICAgICAgdHlwZTogQGRhbmNlclxyXG4gICAgICAgIHBhcmFtczogQGRhbmNlclBhcmFtc1xyXG4gICAgICBkYW5jZTpcclxuICAgICAgICB0eXBlOiBAZGFuY2VcclxuICAgICAgICBwYXJhbXM6IEBkYW5jZVBhcmFtc1xyXG4gICAgICBkYW5jZU1hdGVyaWFsOlxyXG4gICAgICAgIHR5cGU6IEBkYW5jZU1hdGVyaWFsXHJcbiAgICAgICAgcGFyYW1zOiBAZGFuY2VNYXRlcmlhbFBhcmFtc1xyXG5cclxuICAgIEB1cGRhdGVUZXh0KClcclxuXHJcbiAgaW5zZXJ0QmVhdDogKCkgLT5cclxuICAgIEByb3V0aW5lTW9tZW50ID0gW11cclxuICAgIEByb3V0aW5lLnNwbGljZSgrK0Byb3V0aW5lQmVhdCwgMCwgQHJvdXRpbmVNb21lbnQpXHJcbiAgICBAdXBkYXRlVGV4dCgpXHJcblxyXG4gIHBsYXlOZXh0OiAoKSAtPlxyXG4gICAgaWYgQHJvdXRpbmVCZWF0ID09IEByb3V0aW5lLmxlbmd0aCAtIDFcclxuICAgICAgQHJvdXRpbmVCZWF0ID0gLTFcclxuXHJcbiAgICBAcm91dGluZU1vbWVudCA9IEByb3V0aW5lWysrQHJvdXRpbmVCZWF0XVxyXG4gICAgZm9yIGNoYW5nZSBpbiBAcm91dGluZU1vbWVudFxyXG4gICAgICBAdmlzdWFsaXplci5yZWNlaXZlQ2hvcmVvZ3JhcGh5IGNoYW5nZVxyXG5cclxuICByZXNldDogKCkgLT5cclxuICAgIEByb3V0aW5lID0gW11cclxuICAgIEByb3V0aW5lTW9tZW50ID0gW11cclxuICAgIEByb3V0aW5lQmVhdCA9IC0xXHJcblxyXG4gIHVwZGF0ZVRleHQ6ICgpIC0+XHJcbiAgICBAdmlzdWFsaXplci5pbnRlcmZhY2UudXBkYXRlVGV4dChAcm91dGluZSlcclxuXHJcbiAgdXBkYXRlRGFuY2VyOiAoZGFuY2VyKSAtPlxyXG4gICAgQGRhbmNlciA9IGRhbmNlci5jb25zdHJ1Y3Rvci5uYW1lXHJcbiAgICBAZGFuY2VNYXRlcmlhbCA9IGRhbmNlci5kYW5jZU1hdGVyaWFsLmNvbnN0cnVjdG9yLm5hbWVcclxuICAgIEBkYW5jZSA9IGRhbmNlci5kYW5jZS5jb25zdHJ1Y3Rvci5uYW1lXHJcblxyXG4iLCJjbGFzcyB3aW5kb3cuRGF0R1VJSW50ZXJmYWNlXHJcbiAgY29uc3RydWN0b3I6ICgpIC0+XHJcbiAgICBAcm91dGluZVdpbmRvdyA9ICQoJyNyb3V0aW5lJylcclxuXHJcbiAgc2V0dXA6IChAcGxheWVyLCBAY2hvcmVvZ3JhcGh5Um91dGluZSwgQHZpZXdlcikgLT5cclxuICAgIGd1aSA9IG5ldyBkYXQuR1VJKClcclxuXHJcbiAgICBndWkuYWRkKEBwbGF5ZXIuYXVkaW9XaW5kb3csICdyZXNwb25zaXZlbmVzcycsIDAuMCwgNS4wKVxyXG4gICAgaWRDb250cm9sbGVyID0gZ3VpLmFkZChAY2hvcmVvZ3JhcGh5Um91dGluZSwgJ2lkJylcclxuXHJcbiAgICBzZXR1cEZvbGRlciA9IChuYW1lLCB2YXJOYW1lLCBrZXlzKSA9PlxyXG4gICAgICBjb250cm9sbGVyID0gZ3VpLmFkZChAY2hvcmVvZ3JhcGh5Um91dGluZSwgdmFyTmFtZSwga2V5cylcclxuICAgICAgZm9sZGVyID0gZ3VpLmFkZEZvbGRlcihuYW1lKVxyXG4gICAgICBmb2xkZXIub3BlbigpXHJcbiAgICAgIHJldHVybiBbIGNvbnRyb2xsZXIsIGZvbGRlciBdXHJcblxyXG4gICAgdXBkYXRlRm9sZGVyID0gKHR5cGVzLCBmb2xkZXIsIHBhcmFtcywgdmFsdWUsIG9iaikgLT5cclxuICAgICAgaWYgIXR5cGVzW3ZhbHVlXT9cclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgIHdoaWxlIGZvbGRlci5fX2NvbnRyb2xsZXJzWzBdP1xyXG4gICAgICAgIGZvbGRlci5yZW1vdmUoZm9sZGVyLl9fY29udHJvbGxlcnNbMF0pXHJcblxyXG4gICAgICBmb3IgcGFyYW0gaW4gdHlwZXNbdmFsdWVdLnBhcmFtc1xyXG4gICAgICAgIHBhcmFtc1twYXJhbS5uYW1lXSA9XHJcbiAgICAgICAgICBpZiBvYmo/Lm9wdGlvbnM/W3BhcmFtLm5hbWVdXHJcbiAgICAgICAgICAgIG9iai5vcHRpb25zW3BhcmFtLm5hbWVdXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHBhcmFtLmRlZmF1bHRcclxuXHJcbiAgICAgICAgZm9sZGVyLmFkZChwYXJhbXMsIHBhcmFtLm5hbWUpXHJcblxyXG4gICAgW2RhbmNlckNvbnRyb2xsZXIsIGRhbmNlckZvbGRlcl0gPSBzZXR1cEZvbGRlcignRGFuY2VyIHBhcmFtZXRlcnMnLCAnZGFuY2VyJywgT2JqZWN0LmtleXMoVmlzdWFsaXplci5kYW5jZXJUeXBlcykpXHJcblxyXG4gICAgdXBkYXRlRGFuY2VyRm9sZGVyID0gKHZhbHVlLCBvYmopID0+XHJcbiAgICAgIHVwZGF0ZUZvbGRlcihWaXN1YWxpemVyLmRhbmNlclR5cGVzLCBkYW5jZXJGb2xkZXIsIEBjaG9yZW9ncmFwaHlSb3V0aW5lLmRhbmNlclBhcmFtcywgdmFsdWUsIG9iailcclxuICAgIGRhbmNlckNvbnRyb2xsZXIub25DaGFuZ2UgdXBkYXRlRGFuY2VyRm9sZGVyXHJcblxyXG4gICAgW2RhbmNlQ29udHJvbGxlciwgZGFuY2VGb2xkZXJdID0gc2V0dXBGb2xkZXIoJ0RhbmNlIHBhcmFtZXRlcnMnLCAnZGFuY2UnLCBPYmplY3Qua2V5cyhWaXN1YWxpemVyLmRhbmNlVHlwZXMpKVxyXG5cclxuICAgIHVwZGF0ZURhbmNlRm9sZGVyID0gKHZhbHVlLCBvYmopID0+XHJcbiAgICAgIHVwZGF0ZUZvbGRlcihWaXN1YWxpemVyLmRhbmNlVHlwZXMsIGRhbmNlRm9sZGVyLCBAY2hvcmVvZ3JhcGh5Um91dGluZS5kYW5jZVBhcmFtcywgdmFsdWUsIG9iailcclxuICAgIGRhbmNlQ29udHJvbGxlci5vbkNoYW5nZSB1cGRhdGVEYW5jZUZvbGRlclxyXG5cclxuICAgIFtkYW5jZU1hdGVyaWFsQ29udHJvbGxlciwgZGFuY2VNYXRlcmlhbEZvbGRlcl0gPSBzZXR1cEZvbGRlcignRGFuY2UgbWF0ZXJpYWwgcGFyYW1hdGVycycsICdkYW5jZU1hdGVyaWFsJyxcclxuICAgICAgT2JqZWN0LmtleXMoVmlzdWFsaXplci5kYW5jZU1hdGVyaWFsVHlwZXMpKVxyXG5cclxuICAgIHVwZGF0ZURhbmNlTWF0ZXJpYWxGb2xkZXIgPSAodmFsdWUsIG9iaikgPT5cclxuICAgICAgdXBkYXRlRm9sZGVyKFZpc3VhbGl6ZXIuZGFuY2VNYXRlcmlhbFR5cGVzLCBkYW5jZU1hdGVyaWFsRm9sZGVyLCBAY2hvcmVvZ3JhcGh5Um91dGluZS5kYW5jZU1hdGVyaWFsUGFyYW1zLCB2YWx1ZSxcclxuICAgICAgICBvYmopXHJcbiAgICBkYW5jZU1hdGVyaWFsQ29udHJvbGxlci5vbkNoYW5nZSB1cGRhdGVEYW5jZU1hdGVyaWFsRm9sZGVyXHJcblxyXG4gICAgaWRDb250cm9sbGVyLm9uQ2hhbmdlICh2YWx1ZSkgPT5cclxuICAgICAgaWREYW5jZXIgPSBAdmlld2VyLmdldERhbmNlcih2YWx1ZSlcclxuICAgICAgaWYgaWREYW5jZXI/XHJcbiAgICAgICAgQGNob3Jlb2dyYXBoeVJvdXRpbmUudXBkYXRlRGFuY2VyIGlkRGFuY2VyXHJcbiAgICAgICAgZm9yIGNvbnRyb2xsZXIgaW4gZ3VpLl9fY29udHJvbGxlcnNcclxuICAgICAgICAgIGNvbnRyb2xsZXIudXBkYXRlRGlzcGxheSgpXHJcblxyXG4gICAgICAgIHVwZGF0ZURhbmNlckZvbGRlcihAY2hvcmVvZ3JhcGh5Um91dGluZS5kYW5jZXIsIGlkRGFuY2VyKVxyXG4gICAgICAgIHVwZGF0ZURhbmNlTWF0ZXJpYWxGb2xkZXIoQGNob3Jlb2dyYXBoeVJvdXRpbmUuZGFuY2VNYXRlcmlhbCwgaWREYW5jZXIuZGFuY2VNYXRlcmlhbClcclxuICAgICAgICB1cGRhdGVEYW5jZUZvbGRlcihAY2hvcmVvZ3JhcGh5Um91dGluZS5kYW5jZSwgaWREYW5jZXIuZGFuY2UpXHJcblxyXG4gICAgZ3VpLmFkZChAY2hvcmVvZ3JhcGh5Um91dGluZSwgJ3ByZXZpZXcnKVxyXG4gICAgZ3VpLmFkZChAY2hvcmVvZ3JhcGh5Um91dGluZSwgJ2FkZCcpXHJcbiAgICBndWkuYWRkKEBjaG9yZW9ncmFwaHlSb3V0aW5lLCAnaW5zZXJ0QmVhdCcpXHJcbiAgICBndWkuYWRkKEBjaG9yZW9ncmFwaHlSb3V0aW5lLCAncGxheU5leHQnKVxyXG4gICAgZ3VpLmFkZChAY2hvcmVvZ3JhcGh5Um91dGluZSwgJ3Jlc2V0JylcclxuXHJcbiAgICBAc2V0dXBQb3B1cCgpXHJcblxyXG5cclxuICBzZXR1cFBvcHVwOiAoKSAtPlxyXG4gICAgJCgnI3ZpZXdlckJ1dHRvbicpLmNsaWNrIChlKSA9PlxyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgQGRvbWFpbiA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdFxyXG4gICAgICBwb3B1cFVSTCA9IEBkb21haW4gKyBsb2NhdGlvbi5wYXRobmFtZSArICd2aWV3ZXIuaHRtbCdcclxuICAgICAgQHBvcHVwID0gd2luZG93Lm9wZW4ocG9wdXBVUkwsICdteVdpbmRvdycpXHJcblxyXG4gICAgICAjIFdlIGhhdmUgdG8gZGVsYXkgY2F0Y2hpbmcgdGhlIHdpbmRvdyB1cCBiZWNhdXNlIGl0IGhhcyB0byBsb2FkIGZpcnN0LlxyXG4gICAgICBzZW5kQmVhdHMgPSAoKSA9PlxyXG4gICAgICAgIHJvdXRpbmVCZWF0ID0gQGNob3Jlb2dyYXBoeVJvdXRpbmUucm91dGluZUJlYXRcclxuICAgICAgICBAY2hvcmVvZ3JhcGh5Um91dGluZS5yb3V0aW5lQmVhdCA9IC0xXHJcbiAgICAgICAgd2hpbGUgQGNob3Jlb2dyYXBoeVJvdXRpbmUucm91dGluZUJlYXQgPCByb3V0aW5lQmVhdFxyXG4gICAgICAgICAgQGNob3Jlb2dyYXBoeVJvdXRpbmUucGxheU5leHQoKVxyXG4gICAgICBzZXRUaW1lb3V0IHNlbmRCZWF0cywgMTAwXHJcblxyXG4gIHVwZGF0ZVRleHQ6IChqc29uKSAtPlxyXG4gICAgQHJvdXRpbmVXaW5kb3cuaHRtbChKU09OLnN0cmluZ2lmeShqc29uLCB1bmRlZmluZWQsIDIpKVxyXG4iLCIjIFJlcXVpcmUgYWxsIHRoZSBzaGl0XHJcbnJlcXVpcmUgJy4vVmlzdWFsaXplci5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4uL2phdmFzY3JpcHQvT3JiaXRDb250cm9scydcclxucmVxdWlyZSAnLi9WaWV3ZXIuY29mZmVlJ1xyXG5yZXF1aXJlICcuL0RhdEdVSUludGVyZmFjZS5jb2ZmZWUnXHJcblxyXG5jbGFzcyB3aW5kb3cuTWFpblxyXG4gICMgQ29uc3RydWN0IHRoZSBzY2VuZVxyXG4gIGNvbnN0cnVjdG9yOiAoaXNWaXN1YWxpemVyKSAtPlxyXG4gICAgQHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKClcclxuICAgIEByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCB7IGFudGlhbGlhczogdHJ1ZSwgYWxwaGE6IGZhbHNlIH0gKVxyXG4gICAgQHJlbmRlcmVyLnNldFNpemUoIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKVxyXG4gICAgQHJlbmRlcmVyLmF1dG9DbGVhciA9IGZhbHNlXHJcblxyXG4gICAgQGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSggNzUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAwLjEsIDEwMDAgKVxyXG4gICAgQGNvbnRyb2xzID0gbmV3IFRIUkVFLk9yYml0Q29udHJvbHMoIEBjYW1lcmEsIEByZW5kZXJlci5kb21FbGVtZW50IClcclxuICAgIEBjb250cm9scy5kYW1waW5nID0gMC4yXHJcblxyXG4gICAgY29udHJvbENoYW5nZSA9ICgpID0+XHJcbiAgICAgIEByZW5kZXIoKVxyXG5cclxuICAgIEBjb250cm9scy5hZGRFdmVudExpc3RlbmVyKCAnY2hhbmdlJywgY29udHJvbENoYW5nZSApXHJcblxyXG4gICAgQGNhbWVyYS5wb3NpdGlvbi56ID0gLTRcclxuICAgIEBjYW1lcmEucG9zaXRpb24ueSA9IDNcclxuICAgIEBjb250cm9scy50YXJnZXQgPSBuZXcgVEhSRUUuVmVjdG9yMyggMCwgMCwgMCApXHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdyZXNpemUnLCBAb25XaW5kb3dSZXNpemUsIGZhbHNlIClcclxuXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKEByZW5kZXJlci5kb21FbGVtZW50KVxyXG5cclxuICAgIEB2aWV3ZXIgPSBuZXcgVmlld2VyKEBzY2VuZSwgQGNhbWVyYSlcclxuICAgIGlmIGlzVmlzdWFsaXplclxyXG4gICAgICBAdmlzdWFsaXplciA9IG5ldyBWaXN1YWxpemVyKEB2aWV3ZXIsIG5ldyBEYXRHVUlJbnRlcmZhY2UoKSlcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBAdmlzdWFsaXplci5vbktleURvd24uYmluZChAdmlzdWFsaXplciksIGZhbHNlKVxyXG4gICAgZWxzZVxyXG4gICAgICBAZG9tYWluID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0XHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdtZXNzYWdlJywgKGV2ZW50KSA9PlxyXG4gICAgICAgIGlmIGV2ZW50Lm9yaWdpbiAhPSBAZG9tYWluIHRoZW4gcmV0dXJuXHJcbiAgICAgICAgc2VudE9iaiA9IGV2ZW50LmRhdGFcclxuICAgICAgICBpZiBzZW50T2JqLnR5cGUgPT0gJ3JlbmRlcidcclxuICAgICAgICAgIEB2aWV3ZXIucmVuZGVyIHNlbnRPYmouZGF0YVxyXG4gICAgICAgIGlmIHNlbnRPYmoudHlwZSA9PSAnY2hvcmVvZ3JhcGh5J1xyXG4gICAgICAgICAgQHZpZXdlci5yZWNlaXZlQ2hvcmVvZ3JhcGh5IHNlbnRPYmouZGF0YVxyXG5cclxuICBhbmltYXRlOiAoKSAtPlxyXG4gICAgQHJlbmRlcigpXHJcbiAgICBAY29udHJvbHMudXBkYXRlKClcclxuXHJcbiAgcmVuZGVyOiAoKSAtPlxyXG4gICAgQHZpc3VhbGl6ZXI/LnJlbmRlcigpICBcclxuXHJcbiAgICBAc2NlbmUudXBkYXRlTWF0cml4V29ybGQoKVxyXG4gICAgQGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KClcclxuICAgIEByZW5kZXJlci5jbGVhcigpXHJcbiAgICBAcmVuZGVyZXIucmVuZGVyKEBzY2VuZSwgQGNhbWVyYSlcclxuICAgIHJldHVyblxyXG5cclxuICBvbldpbmRvd1Jlc2l6ZTogKCkgPT5cclxuICAgIEBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHRcclxuICAgIEBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpXHJcbiAgICBAcmVuZGVyZXIuc2V0U2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApXHJcblxyXG53aW5kb3cuYW5pbWF0ZSA9ICgpIC0+XHJcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHdpbmRvdy5hbmltYXRlKVxyXG4gIHdpbmRvdy5hcHAuYW5pbWF0ZSgpXHJcblxyXG4kIC0+XHJcbiAgZGF0LkdVSS5wcm90b3R5cGUucmVtb3ZlRm9sZGVyID0gKG5hbWUpIC0+XHJcbiAgICBmb2xkZXIgPSAgdGhpcy5fX2ZvbGRlcnNbbmFtZV1cclxuICAgIGlmICFmb2xkZXJcclxuICAgICAgcmV0dXJuXHJcbiAgICBmb2xkZXIuY2xvc2UoKVxyXG4gICAgdGhpcy5fX3VsLnJlbW92ZUNoaWxkKGZvbGRlci5kb21FbGVtZW50LnBhcmVudE5vZGUpXHJcbiAgICBkZWxldGUgdGhpcy5fX2ZvbGRlcnNbbmFtZV1cclxuICAgIHRoaXMub25SZXNpemUoKSIsInJlcXVpcmUgJy4vQXVkaW9XaW5kb3cuY29mZmVlJ1xyXG5cclxuIyBQbGF5cyB0aGUgYXVkaW8gYW5kIGNyZWF0ZXMgYW4gYW5hbHlzZXJcclxuY2xhc3Mgd2luZG93LlBsYXllclxyXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxyXG4gICAgQGF1ZGlvV2luZG93ID0gbmV3IEF1ZGlvV2luZG93KDEpO1xyXG4gICAgQGxvYWRlZEF1ZGlvID0gbmV3IEFycmF5KClcclxuICAgIEBzdGFydE9mZnNldCA9IDBcclxuICAgIEBzZXR1cEFuYWx5c2VyKClcclxuXHJcbiAgc2V0dXBBbmFseXNlcjogKCkgLT5cclxuICAgIHdpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHRcclxuICAgIEBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KClcclxuICAgIEBhbmFseXNlciA9IEBhdWRpb0NvbnRleHQuY3JlYXRlQW5hbHlzZXIoKVxyXG4gICAgQGFuYWx5c2VyLmZmdFNpemUgPSBBdWRpb1dpbmRvdy5idWZmZXJTaXplXHJcblxyXG4gIHVwZGF0ZTogKCkgLT5cclxuICAgIEBhdWRpb1dpbmRvdy51cGRhdGUoQGFuYWx5c2VyLCBAYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKVxyXG5cclxuICBwYXVzZTogKCkgLT5cclxuICAgIEBzb3VyY2Uuc3RvcCgpXHJcbiAgICBAcGxheWluZyA9IGZhbHNlXHJcbiAgICBAc3RhcnRPZmZzZXQgKz0gQGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSAtIEBzdGFydFRpbWVcclxuXHJcbiAgY3JlYXRlTGl2ZUlucHV0OiAoKSAtPlxyXG4gICAgZ290U3RyZWFtID0gKHN0cmVhbSkgPT5cclxuICAgICAgQHBsYXlpbmcgPSB0cnVlXHJcbiAgICAgIEBzb3VyY2UgPSBAYXVkaW9Db250ZXh0LmNyZWF0ZU1lZGlhU3RyZWFtU291cmNlIHN0cmVhbVxyXG4gICAgICBAc291cmNlLmNvbm5lY3QgQGFuYWx5c2VyXHJcblxyXG4gICAgQGRiU2FtcGxlQnVmID0gbmV3IFVpbnQ4QXJyYXkoMjA0OClcclxuXHJcbiAgICBpZiAoIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgKVxyXG4gICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSwgZ290U3RyZWFtLCAoZXJyKSAtPlxyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycikpXHJcbiAgICBlbHNlIGlmIChuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhIClcclxuICAgICAgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSh7IGF1ZGlvOiB0cnVlIH0sIGdvdFN0cmVhbSwgKGVycikgLT5cclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpKVxyXG4gICAgZWxzZSBpZiAobmF2aWdhdG9yLm1vekdldFVzZXJNZWRpYSApXHJcbiAgICAgIG5hdmlnYXRvci5tb3pHZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSB9LCBnb3RTdHJlYW0sIChlcnIpIC0+XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyKSlcclxuICAgIGVsc2VcclxuICAgICAgcmV0dXJuKGFsZXJ0KFwiRXJyb3I6IGdldFVzZXJNZWRpYSBub3Qgc3VwcG9ydGVkIVwiKSk7XHJcblxyXG4gIHBsYXk6ICh1cmwpIC0+XHJcbiAgICBAY3VycmVudGx5UGxheWluZyA9IHVybFxyXG5cclxuICAgIGlmIEBsb2FkZWRBdWRpb1t1cmxdP1xyXG4gICAgICBAbG9hZEZyb21CdWZmZXIoQGxvYWRlZEF1ZGlvW3VybF0pXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxyXG4gICAgcmVxdWVzdC5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSlcclxuICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJ1xyXG4gICAgcmVxdWVzdC5vbmxvYWQgPSAoKSA9PlxyXG4gICAgICBAYXVkaW9Db250ZXh0LmRlY29kZUF1ZGlvRGF0YSByZXF1ZXN0LnJlc3BvbnNlXHJcbiAgICAgICwgKGJ1ZmZlcikgPT5cclxuICAgICAgICBAbG9hZGVkQXVkaW9bdXJsXSA9IGJ1ZmZlclxyXG4gICAgICAgIEBsb2FkRnJvbUJ1ZmZlcihidWZmZXIpXHJcbiAgICAgICwgKGVycikgLT5cclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIHJlcXVlc3Quc2VuZCgpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgbG9hZEZyb21CdWZmZXI6IChidWZmZXIpIC0+XHJcbiAgICBAc3RhcnRUaW1lID0gQGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZVxyXG4gICAgQHNvdXJjZSA9IEBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKClcclxuICAgIEBzb3VyY2UuYnVmZmVyID0gYnVmZmVyXHJcbiAgICBAc291cmNlLmNvbm5lY3QoQGFuYWx5c2VyKVxyXG4gICAgQHNvdXJjZS5jb25uZWN0KEBhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pXHJcbiAgICBAcGxheWluZyA9IHRydWVcclxuICAgIEBzb3VyY2Uuc3RhcnQoMCwgQHN0YXJ0T2Zmc2V0KVxyXG5cclxuICBwYXVzZTogKCkgLT5cclxuICAgIGlmIEBwbGF5ZXIucGxheWluZyB0aGVuIEBwYXVzZSgpIGVsc2UgQHBsYXkoQGN1cnJlbnRseVBsYXlpbmcpIiwiY2xhc3Mgd2luZG93LlNoYWRlckxvYWRlclxyXG4gICMgQ29uc3RydWN0IHRoZSBzaGFkZXIgY2FjaGVcclxuICBjb25zdHJ1Y3RvcjogKCkgLT5cclxuICAgIEBzaGFkZXJzID0gbmV3IEFycmF5KClcclxuXHJcbiAgIyBUYWtlcyBhIG5hbWUgYW5kIGEgY2FsbGJhY2ssIGxvYWRzIHRoYXQgc2hhZGVyIGZyb20gL3NoYWRlcnMsIGNhY2hlcyB0aGUgcmVzdWx0XHJcbiAgbG9hZDogKG5hbWUsIG5leHQpIC0+XHJcbiAgICBpZiBAc2hhZGVyc1tuYW1lXT9cclxuICAgICAgbmV4dChAc2hhZGVyc1tuYW1lXSlcclxuICAgIGVsc2VcclxuICAgICAgQHNoYWRlcnNbbmFtZV0gPSB7dmVydGV4U2hhZGVyOiAnJywgZnJhZ21lbnRTaGFkZXI6ICcnfVxyXG4gICAgICBAbG9hZEZyb21VcmwobmFtZSwgJ3NoYWRlcnMvJyArIG5hbWUsIG5leHQpXHJcblxyXG4gICMgTG9hZHMgdGhlIHNoYWRlcmZyb20gYSBVUkxcclxuICBsb2FkRnJvbVVybDogKG5hbWUsIHVybCwgbmV4dCkgLT5cclxuXHJcbiAgICBsb2FkZWRTaGFkZXIgPSAoanFYSFIsIHRleHRTdGF0dXMpIC0+XHJcbiAgICAgIEBzaGFkZXJzW0BuYW1lXVtAdHlwZV0gPSBqcVhIUi5yZXNwb25zZVRleHRcclxuICAgICAgaWYgKEBzaGFkZXJzW0BuYW1lXS52ZXJ0ZXhTaGFkZXI/ICYmIEBzaGFkZXJzW0BuYW1lXS5mcmFnbWVudFNoYWRlcilcclxuICAgICAgICBuZXh0KEBzaGFkZXJzW0BuYW1lXSlcclxuXHJcbiAgICAkLmFqYXhcclxuICAgICAgdXJsOiB1cmwgKyAnLnZlcnQnXHJcbiAgICAgIGRhdGFUeXBlOiAndGV4dCdcclxuICAgICAgY29udGV4dDoge1xyXG4gICAgICAgIG5hbWU6IG5hbWVcclxuICAgICAgICB0eXBlOiAndmVydGV4U2hhZGVyJ1xyXG4gICAgICAgIG5leHQ6IG5leHRcclxuICAgICAgICBzaGFkZXJzOiBAc2hhZGVyc1xyXG4gICAgICB9XHJcbiAgICAgIGNvbXBsZXRlOiBsb2FkZWRTaGFkZXIgXHJcblxyXG4gICAgJC5hamF4XHJcbiAgICAgIHVybDogdXJsICsgJy5mcmFnJ1xyXG4gICAgICBkYXRhVHlwZTogJ3RleHQnXHJcbiAgICAgIGNvbnRleHQ6IHtcclxuICAgICAgICBuYW1lOiBuYW1lXHJcbiAgICAgICAgdHlwZTogJ2ZyYWdtZW50U2hhZGVyJ1xyXG4gICAgICAgIG5leHQ6IG5leHRcclxuICAgICAgICBzaGFkZXJzOiBAc2hhZGVyc1xyXG4gICAgICB9XHJcbiAgICAgIGNvbXBsZXRlOiBsb2FkZWRTaGFkZXIgXHJcblxyXG4gICAgcmV0dXJuIiwicmVxdWlyZSAnLi9TaGFkZXJMb2FkZXIuY29mZmVlJ1xyXG5yZXF1aXJlICcuLi9qYXZhc2NyaXB0L1F1ZXVlLmpzJ1xyXG5cclxuY2xhc3Mgd2luZG93LlZpZXdlclxyXG4gIGNvbnN0cnVjdG9yOiAoc2NlbmUsIGNhbWVyYSkgLT5cclxuICAgIEBzY2VuZSA9IHNjZW5lXHJcbiAgICBAZGFuY2VycyA9IG5ldyBBcnJheSgpXHJcbiAgICBAc2hhZGVyTG9hZGVyID0gbmV3IFNoYWRlckxvYWRlcigpXHJcblxyXG4gICAgQGNob3Jlb2dyYXBoeVF1ZXVlID0gbmV3IFF1ZXVlKClcclxuXHJcbiAgcmVjZWl2ZUNob3Jlb2dyYXBoeTogKG1vdmUpIC0+XHJcbiAgICBAY2hvcmVvZ3JhcGh5UXVldWUucHVzaChtb3ZlKVxyXG5cclxuICBleGVjdXRlQ2hvcmVvZ3JhcGh5OiAoe2lkLCBkYW5jZXIsIGRhbmNlLCBkYW5jZU1hdGVyaWFsIH0pIC0+XHJcbiAgICBpZiBpZCA9PSAtMVxyXG4gICAgICBmb3IgZGFuY2VyIGluIEBkYW5jZXJzXHJcbiAgICAgICAgQHNjZW5lLnJlbW92ZShkYW5jZXIuYm9keSlcclxuICAgICAgQGRhbmNlcnMgPSBbXVxyXG4gICAgICByZXR1cm5cclxuICAgIGlmIEBkYW5jZXJzW2lkXT9cclxuICAgICAgIyBUZXN0IGV2ZXJ5dGhpbmcgZWxzZVxyXG4gICAgICBjdXJyZW50RGFuY2VyID0gQGRhbmNlcnNbaWRdXHJcblxyXG4gICAgICAjIElmIG5vIHBhcmFtZXRlcnMgYXJlIHNldCwgYnV0IGFuIGlkIGlzLCB0aGVuIHJlbW92ZSB0aGUgb2JqZWN0XHJcbiAgICAgIGlmICFkYW5jZXI/ICYmICFkYW5jZSAmJiAhZGFuY2VNYXRlcmlhbFxyXG4gICAgICAgIEBzY2VuZS5yZW1vdmUoY3VycmVudERhbmNlci5ib2R5KVxyXG4gICAgICAgIEBkYW5jZXJzLnNwbGljZShAZGFuY2Vycy5pbmRleE9mKGlkKSwgMSlcclxuXHJcbiAgICAgIGlmIGRhbmNlPyBcclxuICAgICAgICBpZiAhZGFuY2VyPyAmJiAhZGFuY2VNYXRlcmlhbD9cclxuICAgICAgICAgIGN1cnJlbnREYW5jZXIucmVzZXQoKVxyXG4gICAgICAgICAgY3VycmVudERhbmNlci5kYW5jZSA9IG5ldyBWaXN1YWxpemVyLmRhbmNlVHlwZXNbZGFuY2UudHlwZV0oZGFuY2UucGFyYW1zKVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgbmV3RGFuY2UgPSBuZXcgVmlzdWFsaXplci5kYW5jZVR5cGVzW2RhbmNlLnR5cGVdKGRhbmNlLnBhcmFtcylcclxuICAgICAgZWxzZVxyXG4gICAgICAgIG5ld0RhbmNlID0gY3VycmVudERhbmNlci5kYW5jZVxyXG5cclxuICAgICAgYWRkRGFuY2VyID0gKG5ld0RhbmNlLCBuZXdNYXRlcmlhbCkgPT5cclxuICAgICAgICBpZiBkYW5jZXI/XHJcbiAgICAgICAgICBuZXdEYW5jZXIgPSBuZXcgVmlzdWFsaXplci5kYW5jZXJUeXBlc1tkYW5jZXIudHlwZV0obmV3RGFuY2UsIG5ld01hdGVyaWFsLCBkYW5jZXIucGFyYW1zKVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIG5ld0RhbmNlciA9IG5ldyBjdXJyZW50RGFuY2VyLmNvbnN0cnVjdG9yKG5ld0RhbmNlLCBuZXdNYXRlcmlhbClcclxuXHJcbiAgICAgICAgY3VycmVudERhbmNlci5yZXNldCgpXHJcbiAgICAgICAgQHNjZW5lLnJlbW92ZShjdXJyZW50RGFuY2VyLmJvZHkpXHJcbiAgICAgICAgQGRhbmNlcnNbaWRdID0gbmV3RGFuY2VyXHJcbiAgICAgICAgQHNjZW5lLmFkZChuZXdEYW5jZXIuYm9keSlcclxuXHJcbiAgICAgIGlmIGRhbmNlTWF0ZXJpYWw/XHJcbiAgICAgICAgIyBTcGVjaWFsIGNhc2UgZm9yIHNoYWRlcnMgYmVjYXVzZSBpdCBoYXMgdG8gbG9hZCB0aGUgc2hhZGVyIGZpbGVcclxuICAgICAgICAjIFRoaXMgaXMgYSByZWFsbHkgaGFja3kgd2F5IG9mIGNoZWNraW5nIGlmIGl0J3MgYSBzaGFkZXIuIFNob3VsZCBjaGFuZ2UuXHJcbiAgICAgICAgaWYgZGFuY2VNYXRlcmlhbC50eXBlLmluZGV4T2YoJ1NoYWRlcicpID4gLTFcclxuICAgICAgICAgIG5ld01hdGVyaWFsID0gbmV3IFZpc3VhbGl6ZXIuZGFuY2VNYXRlcmlhbFR5cGVzW2RhbmNlTWF0ZXJpYWwudHlwZV0oQHNoYWRlckxvYWRlcilcclxuICAgICAgICAgIG5ld01hdGVyaWFsLmxvYWRTaGFkZXIgKHNoYWRlck1hdGVyaWFsKSA9PlxyXG4gICAgICAgICAgICBhZGREYW5jZXIgbmV3RGFuY2UsIHNoYWRlck1hdGVyaWFsXHJcbiAgICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgICAgbmV3TWF0ZXJpYWwgPSBuZXcgVmlzdWFsaXplci5kYW5jZU1hdGVyaWFsVHlwZXNbZGFuY2VNYXRlcmlhbC50eXBlXShkYW5jZU1hdGVyaWFsLnBhcmFtcylcclxuICAgICAgZWxzZVxyXG4gICAgICAgIG5ld01hdGVyaWFsID0gY3VycmVudERhbmNlci5kYW5jZU1hdGVyaWFsXHJcblxyXG4gICAgICBhZGREYW5jZXIobmV3RGFuY2UsIG5ld01hdGVyaWFsKVxyXG5cclxuICAgICAgcmV0dXJuXHJcbiAgICBlbHNlIGlmIGlkP1xyXG4gICAgICBAZGFuY2Vyc1tpZF0gPSBuZXcgVmlzdWFsaXplci5kYW5jZXJUeXBlc1tkYW5jZXIudHlwZV0obmV3IFZpc3VhbGl6ZXIuZGFuY2VUeXBlc1tkYW5jZS50eXBlXShkYW5jZS5wYXJhbXMpLCBuZXcgVmlzdWFsaXplci5kYW5jZU1hdGVyaWFsVHlwZXNbZGFuY2VNYXRlcmlhbC50eXBlXShkYW5jZU1hdGVyaWFsLnBhcmFtcyksIGRhbmNlci5wYXJhbXMpXHJcbiAgICAgIEBzY2VuZS5hZGQgQGRhbmNlcnNbaWRdLmJvZHlcclxuICAgICAgcmV0dXJuXHJcbiAgICBlbHNlXHJcbiAgICAgIHJldHVyblxyXG5cclxuICBnZXREYW5jZXI6IChpZCkgLT5cclxuICAgIEBkYW5jZXJzW2lkXVxyXG5cclxuXHJcbiAgIyBSZW5kZXIgdGhlIHNjZW5lIGJ5IGdvaW5nIHRocm91Z2ggdGhlIEF1ZGlvT2JqZWN0IGFycmF5IGFuZCBjYWxsaW5nIHVwZGF0ZShhdWRpb0V2ZW50KSBvbiBlYWNoIG9uZVxyXG4gIHJlbmRlcjogKGF1ZGlvV2luZG93KSAtPlxyXG4gICAgd2hpbGUgQGNob3Jlb2dyYXBoeVF1ZXVlLmxlbmd0aCgpID4gMFxyXG4gICAgICBAZXhlY3V0ZUNob3Jlb2dyYXBoeSBAY2hvcmVvZ3JhcGh5UXVldWUuc2hpZnQoKVxyXG4gICAgIyBDcmVhdGUgZXZlbnRcclxuICAgIGZvciBpZCBpbiBPYmplY3Qua2V5cyhAZGFuY2VycylcclxuICAgICAgQGRhbmNlcnNbaWRdLnVwZGF0ZShhdWRpb1dpbmRvdylcclxuXHJcbiAgIyBSZW1vdmVzIHRoZSBsYXN0IGRhbmNlciwgcmV0dXJucyB0aGUgZGFuY2VyJ3MgZGFuY2VcclxuICByZW1vdmVMYXN0RGFuY2VyOiAoKSAtPlxyXG4gICAgcHJldkRhbmNlciA9IEBkYW5jZXJzLnBvcCgpXHJcbiAgICBAc2NlbmUucmVtb3ZlKHByZXZEYW5jZXIuYm9keSkgXHJcbiAgICByZXR1cm4gcHJldkRhbmNlci5kYW5jZSIsInJlcXVpcmUgJy4vUGxheWVyLmNvZmZlZSdcclxucmVxdWlyZSAnLi9DaG9yZW9ncmFwaHlSb3V0aW5lLmNvZmZlZSdcclxucmVxdWlyZSAnLi9kYW5jZXJzL0N1YmVEYW5jZXIuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2RhbmNlcnMvU3BoZXJlRGFuY2VyLmNvZmZlZSdcclxucmVxdWlyZSAnLi9kYW5jZXJzL1BvaW50Q2xvdWREYW5jZXIuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2RhbmNlcy9TY2FsZURhbmNlLmNvZmZlZSdcclxucmVxdWlyZSAnLi9kYW5jZXMvUG9zaXRpb25EYW5jZS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZGFuY2VzL1JvdGF0ZURhbmNlLmNvZmZlZSdcclxucmVxdWlyZSAnLi9kYW5jZU1hdGVyaWFscy9Db2xvckRhbmNlTWF0ZXJpYWwuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2RhbmNlTWF0ZXJpYWxzL1NpbXBsZUZyZXF1ZW5jeVNoYWRlci5jb2ZmZWUnXHJcblxyXG5jbGFzcyB3aW5kb3cuVmlzdWFsaXplclxyXG4gICMgR2V0IHRob3NlIGtleXMgc2V0IHVwXHJcbiAga2V5czogeyBQQVVTRTogMzIsIE5FWFQ6IDc4IH1cclxuXHJcbiAgIyBTZXQgdXAgdGhlIHNjZW5lIGJhc2VkIG9uIGEgTWFpbiBvYmplY3Qgd2hpY2ggY29udGFpbnMgdGhlIHNjZW5lLlxyXG4gIGNvbnN0cnVjdG9yOiAoQHZpZXdlciwgQGludGVyZmFjZSkgLT5cclxuICAgIEBwbGF5ZXIgPSBuZXcgUGxheWVyKClcclxuXHJcbiAgICAjIExvYWQgdGhlIHNhbXBsZSBhdWRpb1xyXG4gICAgIyBAcGxheSgnYXVkaW8vR28ubXAzJylcclxuICAgICMgQHBsYXkoJ2F1ZGlvL0dsYXNzZXIubXAzJylcclxuICAgICMgQHBsYXkoJ2F1ZGlvL09uTXlNaW5kLm1wMycpXHJcblxyXG4gICAgQHBsYXllci5jcmVhdGVMaXZlSW5wdXQoKVxyXG5cclxuICAgIEBjaG9yZW9ncmFwaHlSb3V0aW5lID0gbmV3IENob3Jlb2dyYXBoeVJvdXRpbmUoQClcclxuXHJcbiAgICBAaW50ZXJmYWNlLnNldHVwUG9wdXAoKVxyXG4gICAgQGludGVyZmFjZS5zZXR1cChAcGxheWVyLCBAY2hvcmVvZ3JhcGh5Um91dGluZSwgQHZpZXdlcilcclxuXHJcbiAgICBAY2hvcmVvZ3JhcGh5Um91dGluZS5wbGF5TmV4dCgpXHJcblxyXG4gIHJlY2VpdmVDaG9yZW9ncmFwaHk6IChtb3ZlKSAtPlxyXG4gICAgQHZpZXdlci5yZWNlaXZlQ2hvcmVvZ3JhcGh5IG1vdmVcclxuICAgIGlmIEBwb3B1cD8gdGhlbiBAcG9wdXAucG9zdE1lc3NhZ2UoQHdyYXBNZXNzYWdlKCdjaG9yZW9ncmFwaHknLCBtb3ZlKSwgQGRvbWFpbilcclxuXHJcbiAgcmVuZGVyOiAoKSAtPlxyXG4gICAgaWYgIUBwbGF5ZXIucGxheWluZ1xyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICBAcGxheWVyLnVwZGF0ZSgpXHJcblxyXG4gICAgQHZpZXdlci5yZW5kZXIoQHBsYXllci5hdWRpb1dpbmRvdylcclxuICAgIGlmIEBwb3B1cD8gdGhlbiBAcG9wdXAucG9zdE1lc3NhZ2UoQHdyYXBNZXNzYWdlKCdyZW5kZXInLCBAcGxheWVyLmF1ZGlvV2luZG93KSwgQGRvbWFpbilcclxuXHJcbiAgd3JhcE1lc3NhZ2U6ICh0eXBlLCBkYXRhKSAtPlxyXG4gICAgdHlwZTogdHlwZVxyXG4gICAgZGF0YTogZGF0YVxyXG5cclxuICAjRXZlbnQgbWV0aG9kc1xyXG4gIG9uS2V5RG93bjogKGV2ZW50KSAtPlxyXG4gICAgc3dpdGNoIGV2ZW50LmtleUNvZGVcclxuICAgICAgd2hlbiBAa2V5cy5QQVVTRVxyXG4gICAgICAgIEBwbGF5ZXIucGF1c2UoKVxyXG4gICAgICB3aGVuIEBrZXlzLk5FWFRcclxuICAgICAgICBAY2hvcmVvZ3JhcGh5Um91dGluZS5wbGF5TmV4dCgpXHJcblxyXG4gIEBkYW5jZXJUeXBlczpcclxuICAgIEN1YmVEYW5jZXI6IEN1YmVEYW5jZXJcclxuICAgIFNwaGVyZURhbmNlcjogU3BoZXJlRGFuY2VyXHJcbiAgICBQb2ludENsb3VkRGFuY2VyOiBQb2ludENsb3VkRGFuY2VyXHJcblxyXG4gIEBkYW5jZVR5cGVzOlxyXG4gICAgU2NhbGVEYW5jZTogU2NhbGVEYW5jZVxyXG4gICAgUG9zaXRpb25EYW5jZTogUG9zaXRpb25EYW5jZVxyXG4gICAgUm90YXRlRGFuY2U6IFJvdGF0ZURhbmNlXHJcblxyXG4gIEBkYW5jZU1hdGVyaWFsVHlwZXM6XHJcbiAgICBDb2xvckRhbmNlTWF0ZXJpYWw6IENvbG9yRGFuY2VNYXRlcmlhbFxyXG4gICAgU2ltcGxlRnJlcXVlbmN5U2hhZGVyOiBTaW1wbGVGcmVxdWVuY3lTaGFkZXJcclxuIiwiY2xhc3Mgd2luZG93LkNvbG9yRGFuY2VNYXRlcmlhbFxyXG4gIEBwYXJhbXM6IFxyXG4gICAgW1xyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ3Ntb290aGluZ0ZhY3RvcicsXHJcbiAgICAgICAgZGVmYXVsdDogMC41XHJcbiAgICAgIH0sIFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ21pbkwnLFxyXG4gICAgICAgIGRlZmF1bHQ6IDAuMVxyXG4gICAgICB9LCBcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdtaW5TJyxcclxuICAgICAgICBkZWZhdWx0OiAwLjNcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICd3aXJlZnJhbWUnXHJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgfVxyXG4gICAgXVxyXG5cclxuICBAbmFtZTogXCJDb2xvckRhbmNlTWF0ZXJpYWxcIlxyXG5cclxuICBjb25zdHJ1Y3RvcjogKEBvcHRpb25zKSAtPlxyXG4gICAgaWYgQG9wdGlvbnM/IHRoZW4geyBAc21vb3RoaW5nRmFjdG9yLCBAbWluTCwgQG1pblMsIEB3aXJlZnJhbWUgfSA9IEBvcHRpb25zXHJcbiAgICBAc21vb3RoaW5nRmFjdG9yID89IDAuNVxyXG4gICAgQG1pbkwgPz0gMC4xXHJcbiAgICBAbWluUyA/PSAwLjNcclxuICAgIEB3aXJlZnJhbWUgPz0gZmFsc2VcclxuICAgIEBjb2xvciA9IG5ldyBUSFJFRS5Db2xvcigxLjAsIDAsIDApXHJcbiAgICBAbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IGNvbG9yOiAweDAwMDAwLCB3aXJlZnJhbWU6IEB3aXJlZnJhbWUgfSlcclxuICAgIEBhcHBsaWVkQ29sb3IgPSBAY29sb3IuY2xvbmUoKVxyXG5cclxuICB1cGRhdGU6IChhdWRpb1dpbmRvdywgZGFuY2VyKSAtPlxyXG5cclxuICAgIG1heFZhbHVlID0gMFxyXG4gICAgbWF4SW5kZXggPSAtMVxyXG4gICAgbWF4SW1wb3J0YW50SW5kZXggPSAxXHJcbiAgICBmb3IgaSBpbiBbMS4uQXVkaW9XaW5kb3cuYnVmZmVyU2l6ZV1cclxuICAgICAgZnJlcSA9IGF1ZGlvV2luZG93LmZyZXF1ZW5jeUJ1ZmZlcltpXVxyXG4gICAgICB2YWx1ZSA9IGZyZXEgKiBpXHJcbiAgICAgIGlmICh2YWx1ZSA+IG1heFZhbHVlKVxyXG4gICAgICAgIG1heFZhbHVlID0gdmFsdWVcclxuICAgICAgICBtYXhJbmRleCA9IGlcclxuXHJcbiAgICBvbGRDb2xvckhTTCA9IEBhcHBsaWVkQ29sb3IuZ2V0SFNMKClcclxuXHJcbiAgICBuZXdDb2xvclMgPSBtYXhJbmRleCAvIEF1ZGlvV2luZG93LmJ1ZmZlclNpemU7XHJcbiAgICBuZXdDb2xvclMgPSBAc21vb3RoaW5nRmFjdG9yICogbmV3Q29sb3JTICsgKDEgLSBAc21vb3RoaW5nRmFjdG9yKSAqIG9sZENvbG9ySFNMLnNcclxuXHJcbiAgICBuZXdDb2xvckwgPSBhdWRpb1dpbmRvdy5hdmVyYWdlRGJcclxuICAgIG5ld0NvbG9yTCA9IEBzbW9vdGhpbmdGYWN0b3IgKiBuZXdDb2xvckwgKyAoMSAtIEBzbW9vdGhpbmdGYWN0b3IpICogb2xkQ29sb3JIU0wubFxyXG5cclxuICAgIGwgPSBAbWluTCArIG5ld0NvbG9yTCAqICgxLjAgLSBAbWluTClcclxuICAgIHMgPSBAbWluUyArIG5ld0NvbG9yUyAqICgxLjAgLSBAbWluUylcclxuXHJcbiAgICBuZXdDb2xvckggPSAoMzYwICogKGF1ZGlvV2luZG93LnRpbWUgLyAxMDAwMCkgJSAzNjApIC8gMzYwXHJcblxyXG4gICAgaHNsID0gQGNvbG9yLmdldEhTTCgpXHJcbiAgICBAYXBwbGllZENvbG9yLnNldEhTTChuZXdDb2xvckgsIHMsIGwpXHJcblxyXG4gICAgaWYgZGFuY2VyP1xyXG4gICAgICBpZiBkYW5jZXIuYm9keS5tYXRlcmlhbC5lbWlzc2l2ZT9cclxuICAgICAgICBkYW5jZXIuYm9keS5tYXRlcmlhbC5lbWlzc2l2ZS5jb3B5KEBhcHBsaWVkQ29sb3IpXHJcblxyXG4gICAgICBkYW5jZXIuYm9keS5tYXRlcmlhbC5jb2xvci5jb3B5KEBhcHBsaWVkQ29sb3IpXHJcbiIsImNsYXNzIHdpbmRvdy5TaW1wbGVGcmVxdWVuY3lTaGFkZXJcclxuICBAcGFyYW1zOiBbXVxyXG5cclxuICBAbmFtZTogXCJTaW1wbGVGcmVxdWVuY3lTaGFkZXJcIlxyXG4gIFxyXG4gIGNvbnN0cnVjdG9yOiAoc2hhZGVyTG9hZGVyKSAtPlxyXG4gICAgQHRhcmdldCA9IDEyOFxyXG4gICAgQHNpemUgPSAxMDI0XHJcbiAgICBAc2hhZGVyTG9hZGVyID0gc2hhZGVyTG9hZGVyXHJcbiAgICBAbmV3VGV4QXJyYXkgPSBuZXcgVWludDhBcnJheShAdGFyZ2V0ICogQHRhcmdldCAqIDQpXHJcblxyXG4gIGxvYWRTaGFkZXI6IChuZXh0KSAtPlxyXG4gICAgQHNoYWRlckxvYWRlci5sb2FkICdzaW1wbGVfZnJlcXVlbmN5JywgKHNoYWRlcikgPT5cclxuICAgICAgc2hhZGVyLnVuaWZvcm1zID0ge1xyXG4gICAgICAgIGZyZXFUZXh0dXJlOiB7dHlwZTogXCJ0XCIsIHZhbHVlOiBBdWRpb1dpbmRvdy5idWZmZXJTaXplfVxyXG4gICAgICAgIHJlc29sdXRpb246IHsgdHlwZTogXCJ2MlwiLCB2YWx1ZTogbmV3IFRIUkVFLlZlY3RvcjIoMTI4LCAxMjgpfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBAbWF0ZXJpYWwgPSBuZXcgVEhSRUUuU2hhZGVyTWF0ZXJpYWwoc2hhZGVyKVxyXG4gICAgICBAbWF0ZXJpYWwuc2lkZSA9IFRIUkVFLkRvdWJsZVNpZGVcclxuICAgICAgQG1hdGVyaWFsLnRyYW5zcGFyZW50ID0gdHJ1ZVxyXG4gICAgICBuZXh0KEApXHJcblxyXG5cclxuICB1cGRhdGU6IChhdWRpb1dpbmRvdywgZGFuY2VyKSAtPlxyXG4gICAgZGFuY2VyLmJvZHkubWF0ZXJpYWwudW5pZm9ybXMuZnJlcVRleHR1cmUudmFsdWUgPSBAcmVkdWNlQXJyYXkoYXVkaW9XaW5kb3cuZnJlcXVlbmN5QnVmZmVyKVxyXG5cclxuICByZWR1Y2VBcnJheTogKGZyZXFCdWYpIC0+XHJcblxyXG4gICAgbmV3QnVmID0gbmV3IEFycmF5KEB0YXJnZXQpXHJcblxyXG4gICAgbW92aW5nU3VtID0gMFxyXG4gICAgZmxvb3JlZFJhdGlvID0gTWF0aC5mbG9vcihAc2l6ZSAvIEB0YXJnZXQpXHJcbiAgICBmb3IgaSBpbiBbMS4uLkBzaXplXVxyXG4gICAgICBtb3ZpbmdTdW0gKz0gZnJlcUJ1ZltpXVxyXG5cclxuICAgICAgaWYgKChpICsgMSkgJSBmbG9vcmVkUmF0aW8pID09IDBcclxuICAgICAgICBuZXdCdWZbTWF0aC5mbG9vcihpICAvIGZsb29yZWRSYXRpbyldID0gbW92aW5nU3VtIC8gZmxvb3JlZFJhdGlvXHJcbiAgICAgICAgbW92aW5nU3VtID0gMFxyXG5cclxuXHJcbiAgICBmb3IgaSBpbiBbMC4uLkB0YXJnZXRdXHJcbiAgICAgIGZvciBqIGluIFswLi4uQHRhcmdldF1cclxuICAgICAgICBiYXNlSW5kZXggPSBpICogQHRhcmdldCAqIDQgKyBqICogNDtcclxuICAgICAgICBpZiBuZXdCdWZbal0gPiBpICogMlxyXG4gICAgICAgICAgQG5ld1RleEFycmF5W2Jhc2VJbmRleF0gPSAyNTVcclxuICAgICAgICAgIEBuZXdUZXhBcnJheVtiYXNlSW5kZXggKyAxXSA9IDI1NVxyXG4gICAgICAgICAgQG5ld1RleEFycmF5W2Jhc2VJbmRleCArIDJdID0gMjU1XHJcbiAgICAgICAgICBAbmV3VGV4QXJyYXlbYmFzZUluZGV4ICsgM10gPSAyNTVcclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgQG5ld1RleEFycmF5W2Jhc2VJbmRleF0gPSAwXHJcbiAgICAgICAgICBAbmV3VGV4QXJyYXlbYmFzZUluZGV4ICsgMV0gPSAwXHJcbiAgICAgICAgICBAbmV3VGV4QXJyYXlbYmFzZUluZGV4ICsgMl0gPSAwXHJcbiAgICAgICAgICBAbmV3VGV4QXJyYXlbYmFzZUluZGV4ICsgM10gPSAwXHJcblxyXG4gICAgdGV4dHVyZSA9IG5ldyBUSFJFRS5EYXRhVGV4dHVyZShAbmV3VGV4QXJyYXksIEB0YXJnZXQsIEB0YXJnZXQsIFRIUkVFLlJHQkFGb3JtYXQsIFRIUkVFLlVuc2lnbmVkQnl0ZSlcclxuICAgIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlXHJcbiAgICB0ZXh0dXJlLmZsaXBZID0gZmFsc2VcclxuICAgIHRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzID0gZmFsc2VcclxuICAgIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTGluZWFyRmlsdGVyXHJcbiAgICB0ZXh0dXJlLm1pbkZpbHRlciA9IFRIUkVFLkxpbmVhckZpbHRlclxyXG4gICAgdGV4dHVyZS51bnBhY2tBbGlnbm1lbnQgPSAxXHJcbiAgICB0ZXh0dXJlLndyYXBTID0gVEhSRUUuUmVwZWF0V3JhcHBpbmdcclxuICAgIHRleHR1cmUud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZ1xyXG4gICAgdGV4dHVyZS5hbmlzb3Ryb3B5ID0gNFxyXG5cclxuICAgIHJldHVybiB0ZXh0dXJlIiwicmVxdWlyZSAnLi9EYW5jZXIuY29mZmVlJ1xyXG5cclxuY2xhc3Mgd2luZG93LkN1YmVEYW5jZXIgZXh0ZW5kcyBEYW5jZXJcclxuICBAbmFtZTogXCJDdWJlRGFuY2VyXCJcclxuICBcclxuICBjb25zdHJ1Y3RvcjogKGRhbmNlLCBkYW5jZU1hdGVyaWFsLCBAb3B0aW9ucykgLT5cclxuICAgIGlmIEBvcHRpb25zPyB0aGVuIHsgcG9zaXRpb24sIHNjYWxlIH0gPSBAb3B0aW9uc1xyXG4gICAgc3VwZXIobmV3IFRIUkVFLkJveEdlb21ldHJ5KDEsIDEsIDEpLCBkYW5jZSwgZGFuY2VNYXRlcmlhbCwgcG9zaXRpb24sIHNjYWxlKSIsIiMgQ29udGFpbnMgYW4gT2JqZWN0M0Qgb2Ygc29tZSBraW5kLCB3aXRoIGEgbWVzaCBkZXRlcm1pbmVkIGJ5IHN1YmNsYXNzZXMuXHJcbiMgSXQgaGFzIGFuIEVmZmVjdCBhbmQgYSBEYW5jZU1hdGVyaWFsIHdoaWNoIG9wZXJhdGUgb24gdGhlIHRyYW5zZm9ybSBhbmQgdGhlIG1hdGVyaWFsIG9mIHRoZSBPYmplY3QzRCByZXNwZWN0aXZseVxyXG5cclxuY2xhc3Mgd2luZG93LkRhbmNlclxyXG4gIEB0eXBlID0gRGFuY2VyXHJcbiAgQHBhcmFtcyA9IFtcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3Bvc2l0aW9uJ1xyXG4gICAgICBkZWZhdWx0OiBbMCwgMCwgMF1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdzY2FsZSdcclxuICAgICAgZGVmYXVsdDogWzEsIDEsIDFdXHJcbiAgICB9XHJcbiAgXVxyXG5cclxuICBjb25zdHJ1Y3RvcjogKGdlb21ldHJ5LCBkYW5jZSwgZGFuY2VNYXRlcmlhbCwgcG9zaXRpb24sIHNjYWxlKSAtPlxyXG4gICAgIyBDb25zdHJ1Y3QgYSBkZWZhdWx0IERhbmNlciB1c2luZyBAYm9keSBhcyB0aGUgT2JqZWN0M0RcclxuICAgIG1hdGVyaWFsID0gZGFuY2VNYXRlcmlhbC5tYXRlcmlhbDtcclxuICAgIEBkYW5jZSA9IGRhbmNlXHJcbiAgICBAZGFuY2VNYXRlcmlhbCA9IGRhbmNlTWF0ZXJpYWw7XHJcbiAgICBAYm9keSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XHJcbiAgICBpZiBwb3NpdGlvbj8gJiYgcG9zaXRpb24ubGVuZ3RoID09IDMgdGhlbiBAYm9keS5wb3NpdGlvbi5zZXQocG9zaXRpb25bMF0sIHBvc2l0aW9uWzFdLCBwb3NpdGlvblsyXSlcclxuICAgIGlmIHNjYWxlPyAmJiBzY2FsZS5sZW5ndGggPT0gMyB0aGVuIEBib2R5LnNjYWxlLnNldChzY2FsZVswXSwgc2NhbGVbMV0sIHNjYWxlWzJdKVxyXG5cclxuICBnZW9tZXRyeTogKCkgLT5cclxuICAgIG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDEsIDEpXHJcblxyXG4gIHJlc2V0OiAoKSAtPlxyXG4gICAgQGRhbmNlLnJlc2V0KEApXHJcblxyXG4gIHVwZGF0ZTogKGF1ZGlvV2luZG93KSAtPlxyXG4gICAgIyBSZWFjdCB0byB0aGUgYXVkaW8gZXZlbnQgYnkgcHVtcGluZyBpdCB0aHJvdWdoIEVmZmVjdCBhbmQgU2hhZGVyXHJcbiAgICBAZGFuY2UudXBkYXRlKGF1ZGlvV2luZG93LCBAKVxyXG4gICAgQGRhbmNlTWF0ZXJpYWwudXBkYXRlKGF1ZGlvV2luZG93LCBAKSIsInJlcXVpcmUgJy4vRGFuY2VyLmNvZmZlZSdcclxuXHJcbmNsYXNzIHdpbmRvdy5Qb2ludENsb3VkRGFuY2VyIGV4dGVuZHMgRGFuY2VyXHJcbiAgQHBhcmFtczogXHJcbiAgICBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnbWluRGlzdGFuY2UnLFxyXG4gICAgICAgIGRlZmF1bHQ6IDUuMFxyXG4gICAgICB9LCBcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdtYXhEaXN0YW5jZScsXHJcbiAgICAgICAgZGVmYXVsdDogMTAuMFxyXG4gICAgICB9LCBcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdjb3VudCcsXHJcbiAgICAgICAgZGVmYXVsdDogNTAwXHJcbiAgICAgIH1cclxuICAgIF1cclxuXHJcbiAgQG5hbWU6IFwiUG9pbnRDbG91ZERhbmNlclwiXHJcblxyXG4gIGNvbnN0cnVjdG9yOiAoQGRhbmNlLCBAZGFuY2VNYXRlcmlhbCwgQG9wdGlvbnMpIC0+XHJcbiAgICBpZiBAb3B0aW9ucz8gdGhlbiB7IEBtaW5EaXN0YW5jZSwgQG1heERpc3RhbmNlLCBAY291bnQgfSA9IEBvcHRpb25zXHJcbiAgICBAbWluRGlzdGFuY2UgPz0gNS4wXHJcbiAgICBAbWF4RGlzdGFuY2UgPz0gMTAuMFxyXG4gICAgQGNvdW50ID89IDUwMFxyXG5cclxuICAgIGRpcmVjdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKClcclxuICAgIHBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMClcclxuXHJcbiAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpXHJcbiAgICBwb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KEBjb3VudCAqIDMpXHJcblxyXG4gICAgZm9yIGkgaW4gWzAuLi5AY291bnRdXHJcbiAgICAgIGRpcmVjdGlvbi5zZXQoTWF0aC5yYW5kb20oKSAtIDAuNSwgTWF0aC5yYW5kb20oKSAtIDAuNSwgTWF0aC5yYW5kb20oKS0gMC41KVxyXG4gICAgICBkaXJlY3Rpb24ubm9ybWFsaXplKClcclxuICAgICAgZGlyZWN0aW9uLm11bHRpcGx5U2NhbGFyKEBtaW5EaXN0YW5jZSArIE1hdGgucmFuZG9tKCkgKiAoQG1heERpc3RhbmNlIC0gQG1pbkRpc3RhbmNlKSlcclxuXHJcbiAgICAgIHBvc2l0aW9uc1szICogaV0gPSBwb3NpdGlvbi54ICsgZGlyZWN0aW9uLnhcclxuICAgICAgcG9zaXRpb25zWzMgKiBpICsgMV0gPSBwb3NpdGlvbi55ICsgZGlyZWN0aW9uLnlcclxuICAgICAgcG9zaXRpb25zWzMgKiBpICsgMl0gPSBwb3NpdGlvbi56ICsgZGlyZWN0aW9uLnpcclxuXHJcbiAgICBnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShwb3NpdGlvbnMsIDMpKVxyXG4gICAgZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KClcclxuXHJcbiAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5Qb2ludENsb3VkTWF0ZXJpYWwoeyBzaXplOiAwLjUsIGNvbG9yOiBAZGFuY2VNYXRlcmlhbC5jb2xvciB9KVxyXG4gICAgQGJvZHkgPSBuZXcgVEhSRUUuUG9pbnRDbG91ZCggZ2VvbWV0cnksIG1hdGVyaWFsICkiLCJyZXF1aXJlICcuL0RhbmNlci5jb2ZmZWUnXHJcblxyXG5jbGFzcyB3aW5kb3cuU3BoZXJlRGFuY2VyIGV4dGVuZHMgRGFuY2VyXHJcbiAgQG5hbWU6IFwiU3BoZXJlRGFuY2VyXCJcclxuXHJcbiAgY29uc3RydWN0b3I6IChkYW5jZSwgZGFuY2VNYXRlcmlhbCwgQG9wdGlvbnMpIC0+XHJcbiAgICBpZiBAb3B0aW9ucz8gdGhlbiB7IHBvc2l0aW9uLCBzY2FsZSB9ID0gQG9wdGlvbnNcclxuICAgIHN1cGVyKG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgxLCAzMiwgMjQpLCBkYW5jZSwgZGFuY2VNYXRlcmlhbCwgcG9zaXRpb24sIHNjYWxlKSIsImNsYXNzIHdpbmRvdy5Qb3NpdGlvbkRhbmNlXHJcbiAgQHBhcmFtczogXHJcbiAgICBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnc21vb3RoaW5nRmFjdG9yJ1xyXG4gICAgICAgIGRlZmF1bHQ6IDAuMlxyXG4gICAgICB9LCBcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdkaXJlY3Rpb24nXHJcbiAgICAgICAgZGVmYXVsdDogWzAsIDEsIDBdXHJcbiAgICAgIH1cclxuICAgIF1cclxuXHJcbiAgQG5hbWU6IFwiUG9zaXRpb25EYW5jZVwiXHJcblxyXG4gIGNvbnN0cnVjdG9yOiAoQG9wdGlvbnMpIC0+XHJcbiAgICBpZiBAb3B0aW9ucz8gdGhlbiB7IEBzbW9vdGhpbmdGYWN0b3IsIGRpcmVjdGlvbiB9ID0gQG9wdGlvbnNcclxuICAgIEBzbW9vdGhpbmdGYWN0b3IgPz0gMC4yXHJcbiAgICBcclxuICAgIGRpcmVjdGlvbiA/PSBbMCwgMSwgMF1cclxuICAgIEBkaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMyhkaXJlY3Rpb25bMF0sIGRpcmVjdGlvblsxXSwgZGlyZWN0aW9uWzJdKVxyXG5cclxuICAgIEBkaXJlY3Rpb25Db3B5ID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICAgIEBwb3NpdGlvbkNoYW5nZSA9IDBcclxuXHJcbiAgdXBkYXRlOiAoYXVkaW9XaW5kb3csIGRhbmNlcikgLT5cclxuICAgIGJhc2VQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgICBAZGlyZWN0aW9uQ29weS5jb3B5KEBkaXJlY3Rpb24pO1xyXG4gICAgYmFzZVBvc2l0aW9uLnN1YlZlY3RvcnMoZGFuY2VyLmJvZHkucG9zaXRpb24sIEBkaXJlY3Rpb25Db3B5Lm11bHRpcGx5U2NhbGFyKEBwb3NpdGlvbkNoYW5nZSkpXHJcblxyXG4gICAgc21vb3RoaW5nRmFjdG9yID0gaWYgYXVkaW9XaW5kb3cuYXZlcmFnZURiIDwgQHBvc2l0aW9uQ2hhbmdlIHRoZW4gQHNtb290aGluZ0ZhY3RvciBlbHNlIE1hdGgubWF4KDEsIEBzbW9vdGhpbmdGYWN0b3IgKiA0KVxyXG4gICAgQHBvc2l0aW9uQ2hhbmdlID0gYXVkaW9XaW5kb3cuYXZlcmFnZURiICogc21vb3RoaW5nRmFjdG9yICsgKDEgLSBzbW9vdGhpbmdGYWN0b3IpICogQHBvc2l0aW9uQ2hhbmdlXHJcblxyXG4gICAgQGRpcmVjdGlvbkNvcHkuY29weShAZGlyZWN0aW9uKVxyXG4gICAgbmV3UG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpXHJcbiAgICBuZXdQb3NpdGlvbi5hZGRWZWN0b3JzKGJhc2VQb3NpdGlvbiwgQGRpcmVjdGlvbkNvcHkubXVsdGlwbHlTY2FsYXIoQHBvc2l0aW9uQ2hhbmdlKSlcclxuXHJcbiAgICBkYW5jZXIuYm9keS5wb3NpdGlvbi5zZXQobmV3UG9zaXRpb24ueCwgbmV3UG9zaXRpb24ueSwgbmV3UG9zaXRpb24ueilcclxuXHJcbiAgcmVzZXQ6IChkYW5jZXIpIC0+XHJcbiAgICBAZGlyZWN0aW9uQ29weS5jb3B5KEBkaXJlY3Rpb24pO1xyXG4gICAgYmFzZVBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICAgIGJhc2VQb3NpdGlvbi5zdWJWZWN0b3JzKGRhbmNlci5ib2R5LnBvc2l0aW9uLCBAZGlyZWN0aW9uQ29weS5tdWx0aXBseVNjYWxhcihAcG9zaXRpb25DaGFuZ2UpKVxyXG4gICAgZGFuY2VyLmJvZHkucG9zaXRpb24uc2V0KGJhc2VQb3NpdGlvbi54LCBiYXNlUG9zaXRpb24ueSwgYmFzZVBvc2l0aW9uLnopIiwiY2xhc3Mgd2luZG93LlJvdGF0ZURhbmNlXHJcbiAgQG5hbWU6IFwiUm90YXRlRGFuY2VcIlxyXG5cclxuICBAcGFyYW1zOlxyXG4gICAgW1xyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ2F4aXMnXHJcbiAgICAgICAgZGVmYXVsdDogWzAsIDEsIDBdXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnbWluUm90YXRpb24nXHJcbiAgICAgICAgZGVmYXVsdDogMC4wNVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ3NwZWVkJ1xyXG4gICAgICAgIGRlZmF1bHQ6IDFcclxuICAgICAgfSxcclxuICAgIF1cclxuXHJcbiAgY29uc3RydWN0b3I6IChAb3B0aW9ucykgLT5cclxuICAgIGlmIEBvcHRpb25zPyB0aGVuIHsgYXhpcywgQG1pblJvdGF0aW9uLCBAc3BlZWQgfSA9IEBvcHRpb25zXHJcbiAgICBAbWluUm90YXRpb24gPz0gMC4wNVxyXG4gICAgQHNwZWVkID89IDFcclxuXHJcbiAgICBheGlzID89IFswLCAxLCAwXVxyXG4gICAgQGF4aXMgPSBuZXcgVEhSRUUuVmVjdG9yMyhheGlzWzBdLCBheGlzWzFdLCBheGlzWzJdKVxyXG5cclxuICAgIEB0aW1lID0gMFxyXG5cclxuICB1cGRhdGU6IChhdWRpb1dpbmRvdywgZGFuY2VyKSAtPlxyXG4gICAgYWJzUm90YXRpb24gPSBhdWRpb1dpbmRvdy5hdmVyYWdlRGIgKiBAc3BlZWRcclxuXHJcbiAgICBkYW5jZXIuYm9keS5yb3RhdGVPbkF4aXMgQGF4aXMsIChAbWluUm90YXRpb24gKyBhYnNSb3RhdGlvbiAqICgwLjkpKSAqIE1hdGguUEkgKiAoKGF1ZGlvV2luZG93LnRpbWUgLSBAdGltZSkgLyAxMDAwKVxyXG5cclxuICAgIEB0aW1lID0gYXVkaW9XaW5kb3cudGltZVxyXG5cclxuICByZXNldDogKGRhbmNlcikgLT5cclxuICAgIGRhbmNlci5ib2R5LnJvdGF0aW9uLnNldCgwLCAwLCAwKVxyXG4iLCIjIENvbnRyb2xzIHRoZSBtZXNoIG9mIHRoZSBwcm92aWRlZCBEYW5jZXIncyBib2R5XHJcbmNsYXNzIHdpbmRvdy5TY2FsZURhbmNlXHJcbiAgQHBhcmFtczpcclxuICAgIFtcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdzbW9vdGhpbmdGYWN0b3InXHJcbiAgICAgICAgZGVmYXVsdDogMC41XHJcbiAgICAgIH0sIFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ21pbidcclxuICAgICAgICBkZWZhdWx0OiBbMC41LCAwLjUsIDAuNV1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdtYXgnXHJcbiAgICAgICAgZGVmYXVsdDogWzEsIDEsIDFdXHJcbiAgICAgIH1cclxuICAgIF1cclxuXHJcbiAgQG5hbWU6IFwiU2NhbGVEYW5jZVwiXHJcblxyXG4gIGNvbnN0cnVjdG9yOiAoQG9wdGlvbnMpIC0+XHJcbiAgICBpZiBAb3B0aW9ucz8gdGhlbiB7IEBzbW9vdGhpbmdGYWN0b3IsIG1pbiwgbWF4IH0gPSBAb3B0aW9uc1xyXG4gICAgQHNtb290aGluZ0ZhY3RvciA/PSAwLjVcclxuICAgIEBhdmVyYWdlRGIgPSAwXHJcbiAgICBAbWluID0gaWYgbWluIHRoZW4gbmV3IFRIUkVFLlZlY3RvcjMobWluWzBdLCBtaW5bMV0sIG1pblsyXSkgZWxzZSBuZXcgVEhSRUUuVmVjdG9yMygwLjUsIDAuNSwgMC41KVxyXG4gICAgQG1heCA9IGlmIG1heCB0aGVuIG5ldyBUSFJFRS5WZWN0b3IzKG1heFswXSwgbWF4WzFdLCBtYXhbMl0pIGVsc2UgbmV3IFRIUkVFLlZlY3RvcjMoMSwgMSwgMSlcclxuICAgIEBzY2FsZSA9IG5ldyBUSFJFRS5WZWN0b3IzKClcclxuXHJcbiAgdXBkYXRlOiAoYXVkaW9XaW5kb3csIGRhbmNlcikgLT5cclxuICAgICMgdXBkYXRlIHRoZSBEYW5jZXIncyBib2R5IG1lc2ggdG8gcmVmbGVjdCB0aGUgYXVkaW8gZXZlbnRcclxuICAgIGlmIChhdWRpb1dpbmRvdy5hdmVyYWdlRGIgPCBAYXZlcmFnZURiKVxyXG4gICAgXHRAYXZlcmFnZURiID0gYXVkaW9XaW5kb3cuYXZlcmFnZURiICogQHNtb290aGluZ0ZhY3RvciArICgxIC0gQHNtb290aGluZ0ZhY3RvcikgKiBAYXZlcmFnZURiXHJcbiAgICBlbHNlIFxyXG4gICAgXHRzbW9vdGhpbmdGYWN0b3IgPSBNYXRoLm1heCgxLCBAc21vb3RoaW5nRmFjdG9yICogNClcclxuICAgIFx0QGF2ZXJhZ2VEYiA9IGF1ZGlvV2luZG93LmF2ZXJhZ2VEYiAqIHNtb290aGluZ0ZhY3RvciArICgxIC0gc21vb3RoaW5nRmFjdG9yKSAqIEBhdmVyYWdlRGJcclxuXHJcbiAgICBAc2NhbGUuY29weShAbWluKVxyXG5cclxuICAgIEBzY2FsZS5sZXJwKEBtYXgsIEBhdmVyYWdlRGIpXHJcblxyXG4gICAgZGFuY2VyLmJvZHkuc2NhbGUuc2V0KEBzY2FsZS54LCBAc2NhbGUueSwgQHNjYWxlLnopXHJcblx0XHJcbiAgcmVzZXQ6IChkYW5jZXIpIC0+XHJcbiAgXHRkYW5jZXIuYm9keS5zY2FsZS5zZXQoMSwgMSwgMSlcclxuIiwiLyoqXHJcbiAqIEBhdXRob3IgcWlhbyAvIGh0dHBzOi8vZ2l0aHViLmNvbS9xaWFvXHJcbiAqIEBhdXRob3IgbXJkb29iIC8gaHR0cDovL21yZG9vYi5jb21cclxuICogQGF1dGhvciBhbHRlcmVkcSAvIGh0dHA6Ly9hbHRlcmVkcXVhbGlhLmNvbS9cclxuICogQGF1dGhvciBXZXN0TGFuZ2xleSAvIGh0dHA6Ly9naXRodWIuY29tL1dlc3RMYW5nbGV5XHJcbiAqIEBhdXRob3IgZXJpY2g2NjYgLyBodHRwOi8vZXJpY2hhaW5lcy5jb21cclxuICovXHJcbi8qZ2xvYmFsIFRIUkVFLCBjb25zb2xlICovXHJcblxyXG4vLyBUaGlzIHNldCBvZiBjb250cm9scyBwZXJmb3JtcyBvcmJpdGluZywgZG9sbHlpbmcgKHpvb21pbmcpLCBhbmQgcGFubmluZy4gSXQgbWFpbnRhaW5zXHJcbi8vIHRoZSBcInVwXCIgZGlyZWN0aW9uIGFzICtZLCB1bmxpa2UgdGhlIFRyYWNrYmFsbENvbnRyb2xzLiBUb3VjaCBvbiB0YWJsZXQgYW5kIHBob25lcyBpc1xyXG4vLyBzdXBwb3J0ZWQuXHJcbi8vXHJcbi8vICAgIE9yYml0IC0gbGVmdCBtb3VzZSAvIHRvdWNoOiBvbmUgZmluZ2VyIG1vdmVcclxuLy8gICAgWm9vbSAtIG1pZGRsZSBtb3VzZSwgb3IgbW91c2V3aGVlbCAvIHRvdWNoOiB0d28gZmluZ2VyIHNwcmVhZCBvciBzcXVpc2hcclxuLy8gICAgUGFuIC0gcmlnaHQgbW91c2UsIG9yIGFycm93IGtleXMgLyB0b3VjaDogdGhyZWUgZmludGVyIHN3aXBlXHJcbi8vXHJcbi8vIFRoaXMgaXMgYSBkcm9wLWluIHJlcGxhY2VtZW50IGZvciAobW9zdCkgVHJhY2tiYWxsQ29udHJvbHMgdXNlZCBpbiBleGFtcGxlcy5cclxuLy8gVGhhdCBpcywgaW5jbHVkZSB0aGlzIGpzIGZpbGUgYW5kIHdoZXJldmVyIHlvdSBzZWU6XHJcbi8vICAgIFx0Y29udHJvbHMgPSBuZXcgVEhSRUUuVHJhY2tiYWxsQ29udHJvbHMoIGNhbWVyYSApO1xyXG4vLyAgICAgIGNvbnRyb2xzLnRhcmdldC56ID0gMTUwO1xyXG4vLyBTaW1wbGUgc3Vic3RpdHV0ZSBcIk9yYml0Q29udHJvbHNcIiBhbmQgdGhlIGNvbnRyb2wgc2hvdWxkIHdvcmsgYXMtaXMuXHJcblxyXG5USFJFRS5PcmJpdENvbnRyb2xzID0gZnVuY3Rpb24gKG9iamVjdCwgZG9tRWxlbWVudCkge1xyXG5cclxuICAgIHRoaXMub2JqZWN0ID0gb2JqZWN0O1xyXG4gICAgdGhpcy5kb21FbGVtZW50ID0gKCBkb21FbGVtZW50ICE9PSB1bmRlZmluZWQgKSA/IGRvbUVsZW1lbnQgOiBkb2N1bWVudDtcclxuXHJcbiAgICAvLyBBUElcclxuXHJcbiAgICAvLyBTZXQgdG8gZmFsc2UgdG8gZGlzYWJsZSB0aGlzIGNvbnRyb2xcclxuICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgLy8gXCJ0YXJnZXRcIiBzZXRzIHRoZSBsb2NhdGlvbiBvZiBmb2N1cywgd2hlcmUgdGhlIGNvbnRyb2wgb3JiaXRzIGFyb3VuZFxyXG4gICAgLy8gYW5kIHdoZXJlIGl0IHBhbnMgd2l0aCByZXNwZWN0IHRvLlxyXG4gICAgdGhpcy50YXJnZXQgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG5cclxuICAgIC8vIGNlbnRlciBpcyBvbGQsIGRlcHJlY2F0ZWQ7IHVzZSBcInRhcmdldFwiIGluc3RlYWRcclxuICAgIHRoaXMuY2VudGVyID0gdGhpcy50YXJnZXQ7XHJcblxyXG4gICAgLy8gVGhpcyBvcHRpb24gYWN0dWFsbHkgZW5hYmxlcyBkb2xseWluZyBpbiBhbmQgb3V0OyBsZWZ0IGFzIFwiem9vbVwiIGZvclxyXG4gICAgLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcclxuICAgIHRoaXMubm9ab29tID0gZmFsc2U7XHJcbiAgICB0aGlzLnpvb21TcGVlZCA9IDEuMDtcclxuXHJcbiAgICAvLyBMaW1pdHMgdG8gaG93IGZhciB5b3UgY2FuIGRvbGx5IGluIGFuZCBvdXRcclxuICAgIHRoaXMubWluRGlzdGFuY2UgPSAwO1xyXG4gICAgdGhpcy5tYXhEaXN0YW5jZSA9IEluZmluaXR5O1xyXG5cclxuICAgIC8vIFNldCB0byB0cnVlIHRvIGRpc2FibGUgdGhpcyBjb250cm9sXHJcbiAgICB0aGlzLm5vUm90YXRlID0gZmFsc2U7XHJcbiAgICB0aGlzLnJvdGF0ZVNwZWVkID0gMS4wO1xyXG5cclxuICAgIC8vIFNldCB0byB0cnVlIHRvIGRpc2FibGUgdGhpcyBjb250cm9sXHJcbiAgICB0aGlzLm5vUGFuID0gZmFsc2U7XHJcbiAgICB0aGlzLmtleVBhblNwZWVkID0gNy4wO1x0Ly8gcGl4ZWxzIG1vdmVkIHBlciBhcnJvdyBrZXkgcHVzaFxyXG5cclxuICAgIC8vIFNldCB0byB0cnVlIHRvIGF1dG9tYXRpY2FsbHkgcm90YXRlIGFyb3VuZCB0aGUgdGFyZ2V0XHJcbiAgICB0aGlzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcclxuICAgIHRoaXMuYXV0b1JvdGF0ZVNwZWVkID0gMi4wOyAvLyAzMCBzZWNvbmRzIHBlciByb3VuZCB3aGVuIGZwcyBpcyA2MFxyXG5cclxuICAgIC8vIEhvdyBmYXIgeW91IGNhbiBvcmJpdCB2ZXJ0aWNhbGx5LCB1cHBlciBhbmQgbG93ZXIgbGltaXRzLlxyXG4gICAgLy8gUmFuZ2UgaXMgMCB0byBNYXRoLlBJIHJhZGlhbnMuXHJcbiAgICB0aGlzLm1pblBvbGFyQW5nbGUgPSAwOyAvLyByYWRpYW5zXHJcbiAgICB0aGlzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJOyAvLyByYWRpYW5zXHJcblxyXG4gICAgLy8gU2V0IHRvIHRydWUgdG8gZGlzYWJsZSB1c2Ugb2YgdGhlIGtleXNcclxuICAgIHRoaXMubm9LZXlzID0gZmFsc2U7XHJcblxyXG4gICAgLy8gVGhlIGZvdXIgYXJyb3cga2V5c1xyXG4gICAgdGhpcy5rZXlzID0geyBMRUZUOiAzNywgVVA6IDM4LCBSSUdIVDogMzksIEJPVFRPTTogNDAgfTtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy9cclxuICAgIC8vIGludGVybmFsc1xyXG5cclxuICAgIHZhciBzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgdmFyIEVQUyA9IDAuMDAwMDAxO1xyXG5cclxuICAgIHZhciByb3RhdGVTdGFydCA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcbiAgICB2YXIgcm90YXRlRW5kID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuICAgIHZhciByb3RhdGVEZWx0YSA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcblxyXG4gICAgdmFyIHBhblN0YXJ0ID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuICAgIHZhciBwYW5FbmQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xyXG4gICAgdmFyIHBhbkRlbHRhID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuICAgIHZhciBwYW5PZmZzZXQgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG5cclxuICAgIHZhciBvZmZzZXQgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG5cclxuICAgIHZhciBkb2xseVN0YXJ0ID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuICAgIHZhciBkb2xseUVuZCA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcbiAgICB2YXIgZG9sbHlEZWx0YSA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcblxyXG4gICAgdmFyIHBoaURlbHRhID0gMDtcclxuICAgIHZhciB0aGV0YURlbHRhID0gMDtcclxuICAgIHZhciBzY2FsZSA9IDE7XHJcbiAgICB2YXIgcGFuID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuXHJcbiAgICB2YXIgbGFzdFBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICAgIHZhciBsYXN0UXVhdGVybmlvbiA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCk7XHJcblxyXG4gICAgdmFyIFNUQVRFID0geyBOT05FOiAtMSwgUk9UQVRFOiAwLCBET0xMWTogMSwgUEFOOiAyLCBUT1VDSF9ST1RBVEU6IDMsIFRPVUNIX0RPTExZOiA0LCBUT1VDSF9QQU46IDUgfTtcclxuXHJcbiAgICB2YXIgc3RhdGUgPSBTVEFURS5OT05FO1xyXG5cclxuICAgIC8vIGZvciByZXNldFxyXG5cclxuICAgIHRoaXMudGFyZ2V0MCA9IHRoaXMudGFyZ2V0LmNsb25lKCk7XHJcbiAgICB0aGlzLnBvc2l0aW9uMCA9IHRoaXMub2JqZWN0LnBvc2l0aW9uLmNsb25lKCk7XHJcblxyXG4gICAgLy8gc28gY2FtZXJhLnVwIGlzIHRoZSBvcmJpdCBheGlzXHJcblxyXG4gICAgdmFyIHF1YXQgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21Vbml0VmVjdG9ycyhvYmplY3QudXAsIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEsIDApKTtcclxuICAgIHZhciBxdWF0SW52ZXJzZSA9IHF1YXQuY2xvbmUoKS5pbnZlcnNlKCk7XHJcblxyXG4gICAgLy8gZXZlbnRzXHJcblxyXG4gICAgdmFyIGNoYW5nZUV2ZW50ID0geyB0eXBlOiAnY2hhbmdlJyB9O1xyXG4gICAgdmFyIHN0YXJ0RXZlbnQgPSB7IHR5cGU6ICdzdGFydCd9O1xyXG4gICAgdmFyIGVuZEV2ZW50ID0geyB0eXBlOiAnZW5kJ307XHJcblxyXG4gICAgdGhpcy5yb3RhdGVMZWZ0ID0gZnVuY3Rpb24gKGFuZ2xlKSB7XHJcblxyXG4gICAgICAgIGlmIChhbmdsZSA9PT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICBhbmdsZSA9IGdldEF1dG9Sb3RhdGlvbkFuZ2xlKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhldGFEZWx0YSAtPSBhbmdsZTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucm90YXRlVXAgPSBmdW5jdGlvbiAoYW5nbGUpIHtcclxuXHJcbiAgICAgICAgaWYgKGFuZ2xlID09PSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgICAgIGFuZ2xlID0gZ2V0QXV0b1JvdGF0aW9uQW5nbGUoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwaGlEZWx0YSAtPSBhbmdsZTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIHBhc3MgaW4gZGlzdGFuY2UgaW4gd29ybGQgc3BhY2UgdG8gbW92ZSBsZWZ0XHJcbiAgICB0aGlzLnBhbkxlZnQgPSBmdW5jdGlvbiAoZGlzdGFuY2UpIHtcclxuXHJcbiAgICAgICAgdmFyIHRlID0gdGhpcy5vYmplY3QubWF0cml4LmVsZW1lbnRzO1xyXG5cclxuICAgICAgICAvLyBnZXQgWCBjb2x1bW4gb2YgbWF0cml4XHJcbiAgICAgICAgcGFuT2Zmc2V0LnNldCh0ZVsgMCBdLCB0ZVsgMSBdLCB0ZVsgMiBdKTtcclxuICAgICAgICBwYW5PZmZzZXQubXVsdGlwbHlTY2FsYXIoLWRpc3RhbmNlKTtcclxuXHJcbiAgICAgICAgcGFuLmFkZChwYW5PZmZzZXQpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgLy8gcGFzcyBpbiBkaXN0YW5jZSBpbiB3b3JsZCBzcGFjZSB0byBtb3ZlIHVwXHJcbiAgICB0aGlzLnBhblVwID0gZnVuY3Rpb24gKGRpc3RhbmNlKSB7XHJcblxyXG4gICAgICAgIHZhciB0ZSA9IHRoaXMub2JqZWN0Lm1hdHJpeC5lbGVtZW50cztcclxuXHJcbiAgICAgICAgLy8gZ2V0IFkgY29sdW1uIG9mIG1hdHJpeFxyXG4gICAgICAgIHBhbk9mZnNldC5zZXQodGVbIDQgXSwgdGVbIDUgXSwgdGVbIDYgXSk7XHJcbiAgICAgICAgcGFuT2Zmc2V0Lm11bHRpcGx5U2NhbGFyKGRpc3RhbmNlKTtcclxuXHJcbiAgICAgICAgcGFuLmFkZChwYW5PZmZzZXQpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgLy8gcGFzcyBpbiB4LHkgb2YgY2hhbmdlIGRlc2lyZWQgaW4gcGl4ZWwgc3BhY2UsXHJcbiAgICAvLyByaWdodCBhbmQgZG93biBhcmUgcG9zaXRpdmVcclxuICAgIHRoaXMucGFuID0gZnVuY3Rpb24gKGRlbHRhWCwgZGVsdGFZKSB7XHJcblxyXG4gICAgICAgIHZhciBlbGVtZW50ID0gc2NvcGUuZG9tRWxlbWVudCA9PT0gZG9jdW1lbnQgPyBzY29wZS5kb21FbGVtZW50LmJvZHkgOiBzY29wZS5kb21FbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAoc2NvcGUub2JqZWN0LmZvdiAhPT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBwZXJzcGVjdGl2ZVxyXG4gICAgICAgICAgICB2YXIgcG9zaXRpb24gPSBzY29wZS5vYmplY3QucG9zaXRpb247XHJcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBwb3NpdGlvbi5jbG9uZSgpLnN1YihzY29wZS50YXJnZXQpO1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0RGlzdGFuY2UgPSBvZmZzZXQubGVuZ3RoKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBoYWxmIG9mIHRoZSBmb3YgaXMgY2VudGVyIHRvIHRvcCBvZiBzY3JlZW5cclxuICAgICAgICAgICAgdGFyZ2V0RGlzdGFuY2UgKj0gTWF0aC50YW4oKCBzY29wZS5vYmplY3QuZm92IC8gMiApICogTWF0aC5QSSAvIDE4MC4wKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHdlIGFjdHVhbGx5IGRvbid0IHVzZSBzY3JlZW5XaWR0aCwgc2luY2UgcGVyc3BlY3RpdmUgY2FtZXJhIGlzIGZpeGVkIHRvIHNjcmVlbiBoZWlnaHRcclxuICAgICAgICAgICAgc2NvcGUucGFuTGVmdCgyICogZGVsdGFYICogdGFyZ2V0RGlzdGFuY2UgLyBlbGVtZW50LmNsaWVudEhlaWdodCk7XHJcbiAgICAgICAgICAgIHNjb3BlLnBhblVwKDIgKiBkZWx0YVkgKiB0YXJnZXREaXN0YW5jZSAvIGVsZW1lbnQuY2xpZW50SGVpZ2h0KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChzY29wZS5vYmplY3QudG9wICE9PSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIG9ydGhvZ3JhcGhpY1xyXG4gICAgICAgICAgICBzY29wZS5wYW5MZWZ0KGRlbHRhWCAqIChzY29wZS5vYmplY3QucmlnaHQgLSBzY29wZS5vYmplY3QubGVmdCkgLyBlbGVtZW50LmNsaWVudFdpZHRoKTtcclxuICAgICAgICAgICAgc2NvcGUucGFuVXAoZGVsdGFZICogKHNjb3BlLm9iamVjdC50b3AgLSBzY29wZS5vYmplY3QuYm90dG9tKSAvIGVsZW1lbnQuY2xpZW50SGVpZ2h0KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIC8vIGNhbWVyYSBuZWl0aGVyIG9ydGhvZ3JhcGhpYyBvciBwZXJzcGVjdGl2ZVxyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1dBUk5JTkc6IE9yYml0Q29udHJvbHMuanMgZW5jb3VudGVyZWQgYW4gdW5rbm93biBjYW1lcmEgdHlwZSAtIHBhbiBkaXNhYmxlZC4nKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5kb2xseUluID0gZnVuY3Rpb24gKGRvbGx5U2NhbGUpIHtcclxuXHJcbiAgICAgICAgaWYgKGRvbGx5U2NhbGUgPT09IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICAgICAgZG9sbHlTY2FsZSA9IGdldFpvb21TY2FsZSgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNjYWxlIC89IGRvbGx5U2NhbGU7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmRvbGx5T3V0ID0gZnVuY3Rpb24gKGRvbGx5U2NhbGUpIHtcclxuXHJcbiAgICAgICAgaWYgKGRvbGx5U2NhbGUgPT09IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICAgICAgZG9sbHlTY2FsZSA9IGdldFpvb21TY2FsZSgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNjYWxlICo9IGRvbGx5U2NhbGU7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gdGhpcy5vYmplY3QucG9zaXRpb247XHJcblxyXG4gICAgICAgIG9mZnNldC5jb3B5KHBvc2l0aW9uKS5zdWIodGhpcy50YXJnZXQpO1xyXG5cclxuICAgICAgICAvLyByb3RhdGUgb2Zmc2V0IHRvIFwieS1heGlzLWlzLXVwXCIgc3BhY2VcclxuICAgICAgICBvZmZzZXQuYXBwbHlRdWF0ZXJuaW9uKHF1YXQpO1xyXG5cclxuICAgICAgICAvLyBhbmdsZSBmcm9tIHotYXhpcyBhcm91bmQgeS1heGlzXHJcblxyXG4gICAgICAgIHZhciB0aGV0YSA9IE1hdGguYXRhbjIob2Zmc2V0LngsIG9mZnNldC56KTtcclxuXHJcbiAgICAgICAgLy8gYW5nbGUgZnJvbSB5LWF4aXNcclxuXHJcbiAgICAgICAgdmFyIHBoaSA9IE1hdGguYXRhbjIoTWF0aC5zcXJ0KG9mZnNldC54ICogb2Zmc2V0LnggKyBvZmZzZXQueiAqIG9mZnNldC56KSwgb2Zmc2V0LnkpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5hdXRvUm90YXRlKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJvdGF0ZUxlZnQoZ2V0QXV0b1JvdGF0aW9uQW5nbGUoKSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhldGEgKz0gdGhldGFEZWx0YTtcclxuICAgICAgICBwaGkgKz0gcGhpRGVsdGE7XHJcblxyXG4gICAgICAgIC8vIHJlc3RyaWN0IHBoaSB0byBiZSBiZXR3ZWVuIGRlc2lyZWQgbGltaXRzXHJcbiAgICAgICAgcGhpID0gTWF0aC5tYXgodGhpcy5taW5Qb2xhckFuZ2xlLCBNYXRoLm1pbih0aGlzLm1heFBvbGFyQW5nbGUsIHBoaSkpO1xyXG5cclxuICAgICAgICAvLyByZXN0cmljdCBwaGkgdG8gYmUgYmV0d2VlIEVQUyBhbmQgUEktRVBTXHJcbiAgICAgICAgcGhpID0gTWF0aC5tYXgoRVBTLCBNYXRoLm1pbihNYXRoLlBJIC0gRVBTLCBwaGkpKTtcclxuXHJcbiAgICAgICAgdmFyIHJhZGl1cyA9IG9mZnNldC5sZW5ndGgoKSAqIHNjYWxlO1xyXG5cclxuICAgICAgICAvLyByZXN0cmljdCByYWRpdXMgdG8gYmUgYmV0d2VlbiBkZXNpcmVkIGxpbWl0c1xyXG4gICAgICAgIHJhZGl1cyA9IE1hdGgubWF4KHRoaXMubWluRGlzdGFuY2UsIE1hdGgubWluKHRoaXMubWF4RGlzdGFuY2UsIHJhZGl1cykpO1xyXG5cclxuICAgICAgICAvLyBtb3ZlIHRhcmdldCB0byBwYW5uZWQgbG9jYXRpb25cclxuICAgICAgICB0aGlzLnRhcmdldC5hZGQocGFuKTtcclxuXHJcbiAgICAgICAgb2Zmc2V0LnggPSByYWRpdXMgKiBNYXRoLnNpbihwaGkpICogTWF0aC5zaW4odGhldGEpO1xyXG4gICAgICAgIG9mZnNldC55ID0gcmFkaXVzICogTWF0aC5jb3MocGhpKTtcclxuICAgICAgICBvZmZzZXQueiA9IHJhZGl1cyAqIE1hdGguc2luKHBoaSkgKiBNYXRoLmNvcyh0aGV0YSk7XHJcblxyXG4gICAgICAgIC8vIHJvdGF0ZSBvZmZzZXQgYmFjayB0byBcImNhbWVyYS11cC12ZWN0b3ItaXMtdXBcIiBzcGFjZVxyXG4gICAgICAgIG9mZnNldC5hcHBseVF1YXRlcm5pb24ocXVhdEludmVyc2UpO1xyXG5cclxuICAgICAgICBwb3NpdGlvbi5jb3B5KHRoaXMudGFyZ2V0KS5hZGQob2Zmc2V0KTtcclxuXHJcbiAgICAgICAgdGhpcy5vYmplY3QubG9va0F0KHRoaXMudGFyZ2V0KTtcclxuXHJcbiAgICAgICAgdGhldGFEZWx0YSA9IDA7XHJcbiAgICAgICAgcGhpRGVsdGEgPSAwO1xyXG4gICAgICAgIHNjYWxlID0gMTtcclxuICAgICAgICBwYW4uc2V0KDAsIDAsIDApO1xyXG5cclxuICAgICAgICAvLyB1cGRhdGUgY29uZGl0aW9uIGlzOlxyXG4gICAgICAgIC8vIG1pbihjYW1lcmEgZGlzcGxhY2VtZW50LCBjYW1lcmEgcm90YXRpb24gaW4gcmFkaWFucyleMiA+IEVQU1xyXG4gICAgICAgIC8vIHVzaW5nIHNtYWxsLWFuZ2xlIGFwcHJveGltYXRpb24gY29zKHgvMikgPSAxIC0geF4yIC8gOFxyXG5cclxuICAgICAgICBpZiAobGFzdFBvc2l0aW9uLmRpc3RhbmNlVG9TcXVhcmVkKHRoaXMub2JqZWN0LnBvc2l0aW9uKSA+IEVQU1xyXG4gICAgICAgICAgICB8fCA4ICogKDEgLSBsYXN0UXVhdGVybmlvbi5kb3QodGhpcy5vYmplY3QucXVhdGVybmlvbikpID4gRVBTKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoY2hhbmdlRXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgbGFzdFBvc2l0aW9uLmNvcHkodGhpcy5vYmplY3QucG9zaXRpb24pO1xyXG4gICAgICAgICAgICBsYXN0UXVhdGVybmlvbi5jb3B5KHRoaXMub2JqZWN0LnF1YXRlcm5pb24pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBlbGVtZW50ID0gc2NvcGUuZG9tRWxlbWVudCA9PT0gZG9jdW1lbnQgPyBzY29wZS5kb21FbGVtZW50LmJvZHkgOiBzY29wZS5kb21FbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudC5jbGllbnRXaWR0aCA+IDAgJiYgZWxlbWVudC5jbGllbnRIZWlnaHQgPiAwKSB7XHJcbiAgICAgICAgICAgIC8vIHJvdGF0aW5nIGFjcm9zcyB3aG9sZSBzY3JlZW4gZ29lcyAzNjAgZGVncmVlcyBhcm91bmRcclxuICAgICAgICAgICAgc2NvcGUucm90YXRlTGVmdCgyICogTWF0aC5QSSAqIHJvdGF0ZURlbHRhLnggLyBlbGVtZW50LmNsaWVudFdpZHRoICogc2NvcGUucm90YXRlU3BlZWQpO1xyXG5cclxuICAgICAgICAgICAgLy8gcm90YXRpbmcgdXAgYW5kIGRvd24gYWxvbmcgd2hvbGUgc2NyZWVuIGF0dGVtcHRzIHRvIGdvIDM2MCwgYnV0IGxpbWl0ZWQgdG8gMTgwXHJcbiAgICAgICAgICAgIHNjb3BlLnJvdGF0ZVVwKDIgKiBNYXRoLlBJICogcm90YXRlRGVsdGEueSAvIGVsZW1lbnQuY2xpZW50SGVpZ2h0ICogc2NvcGUucm90YXRlU3BlZWQpO1xyXG5cclxuICAgICAgICAgICAgcm90YXRlRGVsdGEubXVsdGlwbHlTY2FsYXIoMC45OSlcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgdGhpcy5yZXNldCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgc3RhdGUgPSBTVEFURS5OT05FO1xyXG5cclxuICAgICAgICB0aGlzLnRhcmdldC5jb3B5KHRoaXMudGFyZ2V0MCk7XHJcbiAgICAgICAgdGhpcy5vYmplY3QucG9zaXRpb24uY29weSh0aGlzLnBvc2l0aW9uMCk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRBdXRvUm90YXRpb25BbmdsZSgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIDIgKiBNYXRoLlBJIC8gNjAgLyA2MCAqIHNjb3BlLmF1dG9Sb3RhdGVTcGVlZDtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Wm9vbVNjYWxlKCkge1xyXG5cclxuICAgICAgICByZXR1cm4gTWF0aC5wb3coMC45NSwgc2NvcGUuem9vbVNwZWVkKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25Nb3VzZURvd24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKSByZXR1cm47XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gMCkge1xyXG4gICAgICAgICAgICBpZiAoc2NvcGUubm9Sb3RhdGUgPT09IHRydWUpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHN0YXRlID0gU1RBVEUuUk9UQVRFO1xyXG5cclxuICAgICAgICAgICAgcm90YXRlU3RhcnQuc2V0KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gMSkge1xyXG4gICAgICAgICAgICBpZiAoc2NvcGUubm9ab29tID09PSB0cnVlKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBzdGF0ZSA9IFNUQVRFLkRPTExZO1xyXG5cclxuICAgICAgICAgICAgZG9sbHlTdGFydC5zZXQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuYnV0dG9uID09PSAyKSB7XHJcbiAgICAgICAgICAgIGlmIChzY29wZS5ub1BhbiA9PT0gdHJ1ZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5QQU47XHJcblxyXG4gICAgICAgICAgICBwYW5TdGFydC5zZXQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUsIGZhbHNlKTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwLCBmYWxzZSk7XHJcbiAgICAgICAgc2NvcGUuZGlzcGF0Y2hFdmVudChzdGFydEV2ZW50KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIHZhciBlbGVtZW50ID0gc2NvcGUuZG9tRWxlbWVudCA9PT0gZG9jdW1lbnQgPyBzY29wZS5kb21FbGVtZW50LmJvZHkgOiBzY29wZS5kb21FbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAoc3RhdGUgPT09IFNUQVRFLlJPVEFURSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHNjb3BlLm5vUm90YXRlID09PSB0cnVlKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICByb3RhdGVFbmQuc2V0KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xyXG4gICAgICAgICAgICByb3RhdGVEZWx0YS5zdWJWZWN0b3JzKHJvdGF0ZUVuZCwgcm90YXRlU3RhcnQpO1xyXG5cclxuICAgICAgICAgICAgLy8gcm90YXRpbmcgYWNyb3NzIHdob2xlIHNjcmVlbiBnb2VzIDM2MCBkZWdyZWVzIGFyb3VuZFxyXG4gICAgICAgICAgICBzY29wZS5yb3RhdGVMZWZ0KDIgKiBNYXRoLlBJICogcm90YXRlRGVsdGEueCAvIGVsZW1lbnQuY2xpZW50V2lkdGggKiBzY29wZS5yb3RhdGVTcGVlZCk7XHJcblxyXG4gICAgICAgICAgICAvLyByb3RhdGluZyB1cCBhbmQgZG93biBhbG9uZyB3aG9sZSBzY3JlZW4gYXR0ZW1wdHMgdG8gZ28gMzYwLCBidXQgbGltaXRlZCB0byAxODBcclxuICAgICAgICAgICAgc2NvcGUucm90YXRlVXAoMiAqIE1hdGguUEkgKiByb3RhdGVEZWx0YS55IC8gZWxlbWVudC5jbGllbnRIZWlnaHQgKiBzY29wZS5yb3RhdGVTcGVlZCk7XHJcblxyXG4gICAgICAgICAgICByb3RhdGVTdGFydC5jb3B5KHJvdGF0ZUVuZCk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IFNUQVRFLkRPTExZKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2NvcGUubm9ab29tID09PSB0cnVlKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBkb2xseUVuZC5zZXQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XHJcbiAgICAgICAgICAgIGRvbGx5RGVsdGEuc3ViVmVjdG9ycyhkb2xseUVuZCwgZG9sbHlTdGFydCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZG9sbHlEZWx0YS55ID4gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHNjb3BlLmRvbGx5SW4oKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgc2NvcGUuZG9sbHlPdXQoKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGRvbGx5U3RhcnQuY29weShkb2xseUVuZCk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IFNUQVRFLlBBTikge1xyXG5cclxuICAgICAgICAgICAgaWYgKHNjb3BlLm5vUGFuID09PSB0cnVlKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBwYW5FbmQuc2V0KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xyXG4gICAgICAgICAgICBwYW5EZWx0YS5zdWJWZWN0b3JzKHBhbkVuZCwgcGFuU3RhcnQpO1xyXG5cclxuICAgICAgICAgICAgc2NvcGUucGFuKHBhbkRlbHRhLngsIHBhbkRlbHRhLnkpO1xyXG5cclxuICAgICAgICAgICAgcGFuU3RhcnQuY29weShwYW5FbmQpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNjb3BlLnVwZGF0ZSgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbk1vdXNlVXAoLyogZXZlbnQgKi8pIHtcclxuXHJcbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlLCBmYWxzZSk7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCwgZmFsc2UpO1xyXG4gICAgICAgIHNjb3BlLmRpc3BhdGNoRXZlbnQoZW5kRXZlbnQpO1xyXG4gICAgICAgIHN0YXRlID0gU1RBVEUuTk9ORTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25Nb3VzZVdoZWVsKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIGlmIChzY29wZS5lbmFibGVkID09PSBmYWxzZSB8fCBzY29wZS5ub1pvb20gPT09IHRydWUpIHJldHVybjtcclxuXHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgdmFyIGRlbHRhID0gMDtcclxuXHJcbiAgICAgICAgaWYgKGV2ZW50LndoZWVsRGVsdGEgIT09IHVuZGVmaW5lZCkgeyAvLyBXZWJLaXQgLyBPcGVyYSAvIEV4cGxvcmVyIDlcclxuXHJcbiAgICAgICAgICAgIGRlbHRhID0gZXZlbnQud2hlZWxEZWx0YTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5kZXRhaWwgIT09IHVuZGVmaW5lZCkgeyAvLyBGaXJlZm94XHJcblxyXG4gICAgICAgICAgICBkZWx0YSA9IC1ldmVudC5kZXRhaWw7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRlbHRhID4gMCkge1xyXG5cclxuICAgICAgICAgICAgc2NvcGUuZG9sbHlPdXQoKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLmRvbGx5SW4oKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzY29wZS51cGRhdGUoKTtcclxuICAgICAgICBzY29wZS5kaXNwYXRjaEV2ZW50KHN0YXJ0RXZlbnQpO1xyXG4gICAgICAgIHNjb3BlLmRpc3BhdGNoRXZlbnQoZW5kRXZlbnQpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbktleURvd24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlIHx8IHNjb3BlLm5vS2V5cyA9PT0gdHJ1ZSB8fCBzY29wZS5ub1BhbiA9PT0gdHJ1ZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcclxuXHJcbiAgICAgICAgICAgIGNhc2Ugc2NvcGUua2V5cy5VUDpcclxuICAgICAgICAgICAgICAgIHNjb3BlLnBhbigwLCBzY29wZS5rZXlQYW5TcGVlZCk7XHJcbiAgICAgICAgICAgICAgICBzY29wZS51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBzY29wZS5rZXlzLkJPVFRPTTpcclxuICAgICAgICAgICAgICAgIHNjb3BlLnBhbigwLCAtc2NvcGUua2V5UGFuU3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgc2NvcGUudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2Ugc2NvcGUua2V5cy5MRUZUOlxyXG4gICAgICAgICAgICAgICAgc2NvcGUucGFuKHNjb3BlLmtleVBhblNwZWVkLCAwKTtcclxuICAgICAgICAgICAgICAgIHNjb3BlLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIHNjb3BlLmtleXMuUklHSFQ6XHJcbiAgICAgICAgICAgICAgICBzY29wZS5wYW4oLXNjb3BlLmtleVBhblNwZWVkLCAwKTtcclxuICAgICAgICAgICAgICAgIHNjb3BlLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG91Y2hzdGFydChldmVudCkge1xyXG5cclxuICAgICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UpIHJldHVybjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChldmVudC50b3VjaGVzLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgY2FzZSAxOlx0Ly8gb25lLWZpbmdlcmVkIHRvdWNoOiByb3RhdGVcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUubm9Sb3RhdGUgPT09IHRydWUpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IFNUQVRFLlRPVUNIX1JPVEFURTtcclxuXHJcbiAgICAgICAgICAgICAgICByb3RhdGVTdGFydC5zZXQoZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYLCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDI6XHQvLyB0d28tZmluZ2VyZWQgdG91Y2g6IGRvbGx5XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLm5vWm9vbSA9PT0gdHJ1ZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIHN0YXRlID0gU1RBVEUuVE9VQ0hfRE9MTFk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGR4ID0gZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYIC0gZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VYO1xyXG4gICAgICAgICAgICAgICAgdmFyIGR5ID0gZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZIC0gZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VZO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuICAgICAgICAgICAgICAgIGRvbGx5U3RhcnQuc2V0KDAsIGRpc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAzOiAvLyB0aHJlZS1maW5nZXJlZCB0b3VjaDogcGFuXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLm5vUGFuID09PSB0cnVlKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5UT1VDSF9QQU47XHJcblxyXG4gICAgICAgICAgICAgICAgcGFuU3RhcnQuc2V0KGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCwgZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IFNUQVRFLk5PTkU7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2NvcGUuZGlzcGF0Y2hFdmVudChzdGFydEV2ZW50KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG91Y2htb3ZlKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIGlmIChzY29wZS5lbmFibGVkID09PSBmYWxzZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICB2YXIgZWxlbWVudCA9IHNjb3BlLmRvbUVsZW1lbnQgPT09IGRvY3VtZW50ID8gc2NvcGUuZG9tRWxlbWVudC5ib2R5IDogc2NvcGUuZG9tRWxlbWVudDtcclxuXHJcbiAgICAgICAgc3dpdGNoIChldmVudC50b3VjaGVzLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgY2FzZSAxOiAvLyBvbmUtZmluZ2VyZWQgdG91Y2g6IHJvdGF0ZVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzY29wZS5ub1JvdGF0ZSA9PT0gdHJ1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlICE9PSBTVEFURS5UT1VDSF9ST1RBVEUpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICByb3RhdGVFbmQuc2V0KGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCwgZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZKTtcclxuICAgICAgICAgICAgICAgIHJvdGF0ZURlbHRhLnN1YlZlY3RvcnMocm90YXRlRW5kLCByb3RhdGVTdGFydCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gcm90YXRpbmcgYWNyb3NzIHdob2xlIHNjcmVlbiBnb2VzIDM2MCBkZWdyZWVzIGFyb3VuZFxyXG4gICAgICAgICAgICAgICAgc2NvcGUucm90YXRlTGVmdCgyICogTWF0aC5QSSAqIHJvdGF0ZURlbHRhLnggLyBlbGVtZW50LmNsaWVudFdpZHRoICogc2NvcGUucm90YXRlU3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgLy8gcm90YXRpbmcgdXAgYW5kIGRvd24gYWxvbmcgd2hvbGUgc2NyZWVuIGF0dGVtcHRzIHRvIGdvIDM2MCwgYnV0IGxpbWl0ZWQgdG8gMTgwXHJcbiAgICAgICAgICAgICAgICBzY29wZS5yb3RhdGVVcCgyICogTWF0aC5QSSAqIHJvdGF0ZURlbHRhLnkgLyBlbGVtZW50LmNsaWVudEhlaWdodCAqIHNjb3BlLnJvdGF0ZVNwZWVkKTtcclxuXHJcbiAgICAgICAgICAgICAgICByb3RhdGVTdGFydC5jb3B5KHJvdGF0ZUVuZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2NvcGUudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgMjogLy8gdHdvLWZpbmdlcmVkIHRvdWNoOiBkb2xseVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzY29wZS5ub1pvb20gPT09IHRydWUpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSAhPT0gU1RBVEUuVE9VQ0hfRE9MTFkpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZHggPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVg7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHkgPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRvbGx5RW5kLnNldCgwLCBkaXN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICBkb2xseURlbHRhLnN1YlZlY3RvcnMoZG9sbHlFbmQsIGRvbGx5U3RhcnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkb2xseURlbHRhLnkgPiAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmRvbGx5T3V0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuZG9sbHlJbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBkb2xseVN0YXJ0LmNvcHkoZG9sbHlFbmQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHNjb3BlLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDM6IC8vIHRocmVlLWZpbmdlcmVkIHRvdWNoOiBwYW5cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUubm9QYW4gPT09IHRydWUpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSAhPT0gU1RBVEUuVE9VQ0hfUEFOKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgcGFuRW5kLnNldChldmVudC50b3VjaGVzWyAwIF0ucGFnZVgsIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSk7XHJcbiAgICAgICAgICAgICAgICBwYW5EZWx0YS5zdWJWZWN0b3JzKHBhbkVuZCwgcGFuU3RhcnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHNjb3BlLnBhbihwYW5EZWx0YS54LCBwYW5EZWx0YS55KTtcclxuXHJcbiAgICAgICAgICAgICAgICBwYW5TdGFydC5jb3B5KHBhbkVuZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2NvcGUudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcblxyXG4gICAgICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5OT05FO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvdWNoZW5kKC8qIGV2ZW50ICovKSB7XHJcblxyXG4gICAgICAgIGlmIChzY29wZS5lbmFibGVkID09PSBmYWxzZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBzY29wZS5kaXNwYXRjaEV2ZW50KGVuZEV2ZW50KTtcclxuICAgICAgICBzdGF0ZSA9IFNUQVRFLk5PTkU7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9LCBmYWxzZSk7XHJcbiAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Nb3VzZURvd24sIGZhbHNlKTtcclxuICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXdoZWVsJywgb25Nb3VzZVdoZWVsLCBmYWxzZSk7XHJcbiAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLCBvbk1vdXNlV2hlZWwsIGZhbHNlKTsgLy8gZmlyZWZveFxyXG5cclxuICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdG91Y2hzdGFydCwgZmFsc2UpO1xyXG4gICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdG91Y2hlbmQsIGZhbHNlKTtcclxuICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0b3VjaG1vdmUsIGZhbHNlKTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5RG93biwgZmFsc2UpO1xyXG5cclxuICAgIC8vIGZvcmNlIGFuIHVwZGF0ZSBhdCBzdGFydFxyXG4gICAgdGhpcy51cGRhdGUoKTtcclxuXHJcbn07XHJcblxyXG5USFJFRS5PcmJpdENvbnRyb2xzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVEhSRUUuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIHdpbmRvdy5RdWV1ZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gUXVldWUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFpbCA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmhlYWQgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB0aGlzLm9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIC8vIExvY2sgdGhlIG9iamVjdCBkb3duXHJcbiAgICAgICAgICAgIE9iamVjdC5zZWFsKHRoaXMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIFF1ZXVlLnByb3RvdHlwZS5zaGlmdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub2Zmc2V0ID09PSB0aGlzLmhlYWQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG1wID0gdGhpcy5oZWFkO1xyXG4gICAgICAgICAgICAgICAgdG1wLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWQgPSB0aGlzLnRhaWw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhaWwgPSB0bXA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWFkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhlYWRbdGhpcy5vZmZzZXQrK107XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgUXVldWUucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50YWlsLnB1c2goaXRlbSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgUXVldWUucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVhZC5sZW5ndGggLSB0aGlzLm9mZnNldCArIHRoaXMudGFpbC5sZW5ndGg7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFF1ZXVlO1xyXG4gICAgfSkoKTtcclxufSkuY2FsbCh0aGlzKSJdfQ==
