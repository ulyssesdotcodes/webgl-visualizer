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
    this.routines = [];
    this.reset();
  }

  ChoreographyRoutine.prototype.loadRoutineById = function(id, next) {
    return $.ajax({
      url: Config.server + '/routines/' + id,
      type: "GET",
      success: (function(_this) {
        return function(routine) {
          _this.routines[id].data = routine.data;
          return next(_this.routines[routine.id]);
        };
      })(this)
    });
  };

  ChoreographyRoutine.prototype.queueRoutine = function(id) {
    Array.prototype.push.apply(this.routine, JSON.parse(this.routines[id].data));
    return this.updateText();
  };

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

  ChoreographyRoutine.prototype.refreshRoutines = function(next) {
    return $.ajax({
      url: Config.server + '/routines',
      type: 'GET',
      success: (function(_this) {
        return function(data) {
          var routine, _i, _len;
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            routine = data[_i];
            _this.routines[routine.id] = routine;
          }
          return next();
        };
      })(this)
    });
  };

  ChoreographyRoutine.prototype.pushCurrentRoutine = function(name, next) {
    return $.ajax({
      url: Config.server + '/routines',
      type: 'POST',
      data: JSON.stringify({
        name: name,
        data: JSON.stringify(this.routine)
      }),
      success: next
    });
  };

  ChoreographyRoutine.prototype.updateDancer = function(dancer) {
    this.dancer = dancer.constructor.name;
    this.danceMaterial = dancer.danceMaterial.constructor.name;
    return this.dance = dancer.dance.constructor.name;
  };

  return ChoreographyRoutine;

})();



},{"./Config.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/Config.coffee"}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/Config.coffee":[function(require,module,exports){
window.Config = (function() {
  function Config() {}

  Config.server = 'http://localhost:3000';

  return Config;

})();



},{}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/DatGUIInterface.coffee":[function(require,module,exports){
window.DatGUIInterface = (function() {
  function DatGUIInterface() {
    this.routineWindow = $('#routine');
    this.routineStage = $('#routineStage');
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

  DatGUIInterface.prototype.setupRoutineStage = function() {
    this.refreshRoutines();
    $('#routinePush').click((function(_this) {
      return function(e) {
        e.preventDefault();
        return _this.choreographyRoutine.pushCurrentRoutine($('#pushName').val(), function() {
          return _this.refreshRoutines();
        });
      };
    })(this));
    $('#routineSelect').change((function(_this) {
      return function(e) {
        _this.currentRoutineId = $('#routineSelect option:selected').val();
        return _this.choreographyRoutine.loadRoutineById(_this.currentRoutineId, function(routine) {
          return _this.routineStage.html(_this.choreographyRoutine.routines[_this.currentRoutineId].data);
        });
      };
    })(this));
    return $('#routineQueue').click((function(_this) {
      return function(e) {
        e.preventDefault();
        return _this.choreographyRoutine.queueRoutine(_this.currentRoutineId);
      };
    })(this));
  };

  DatGUIInterface.prototype.refreshRoutines = function() {
    var key, value, _i, _len, _ref, _results;
    $('#routineSelect').empty();
    _ref = Object.keys(this.choreographyRoutine.routines);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      value = this.choreographyRoutine.routines[key];
      _results.push($('#routineSelect').append($("<option></option>").attr("value", key).text(value.name)));
    }
    return _results;
  };

  DatGUIInterface.prototype.updateText = function(json) {
    return this.routineWindow.html(JSON.stringify(json, void 0, 2));
  };

  return DatGUIInterface;

})();



},{}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/Main.coffee":[function(require,module,exports){
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



},{"../javascript/OrbitControls":"/Users/ulyssespopple/Development/js/webgl-visualizer/javascript/OrbitControls.js","./DatGUIInterface.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/DatGUIInterface.coffee","./Viewer.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/Viewer.coffee","./Visualizer.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/Visualizer.coffee"}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/Player.coffee":[function(require,module,exports){
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



},{"./AudioWindow.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/AudioWindow.coffee"}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/ShaderLoader.coffee":[function(require,module,exports){
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
    this["interface"].setupPopup();
    this["interface"].setup(this.player, this.choreographyRoutine, this.viewer);
    this.choreographyRoutine.refreshRoutines((function(_this) {
      return function() {
        _this.choreographyRoutine.loadRoutineById(1, function() {
          _this.choreographyRoutine.queueRoutine(1);
          return _this.choreographyRoutine.playNext();
        });
        return _this["interface"].setupRoutineStage();
      };
    })(this));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9BdWRpb1dpbmRvdy5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9DaG9yZW9ncmFwaHlSb3V0aW5lLmNvZmZlZSIsIi9Vc2Vycy91bHlzc2VzcG9wcGxlL0RldmVsb3BtZW50L2pzL3dlYmdsLXZpc3VhbGl6ZXIvY29mZmVlL0NvbmZpZy5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9EYXRHVUlJbnRlcmZhY2UuY29mZmVlIiwiL1VzZXJzL3VseXNzZXNwb3BwbGUvRGV2ZWxvcG1lbnQvanMvd2ViZ2wtdmlzdWFsaXplci9jb2ZmZWUvTWFpbi5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9QbGF5ZXIuY29mZmVlIiwiL1VzZXJzL3VseXNzZXNwb3BwbGUvRGV2ZWxvcG1lbnQvanMvd2ViZ2wtdmlzdWFsaXplci9jb2ZmZWUvU2hhZGVyTG9hZGVyLmNvZmZlZSIsIi9Vc2Vycy91bHlzc2VzcG9wcGxlL0RldmVsb3BtZW50L2pzL3dlYmdsLXZpc3VhbGl6ZXIvY29mZmVlL1ZpZXdlci5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9WaXN1YWxpemVyLmNvZmZlZSIsIi9Vc2Vycy91bHlzc2VzcG9wcGxlL0RldmVsb3BtZW50L2pzL3dlYmdsLXZpc3VhbGl6ZXIvY29mZmVlL2RhbmNlTWF0ZXJpYWxzL0NvbG9yRGFuY2VNYXRlcmlhbC5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9kYW5jZU1hdGVyaWFscy9TaW1wbGVGcmVxdWVuY3lTaGFkZXIuY29mZmVlIiwiL1VzZXJzL3VseXNzZXNwb3BwbGUvRGV2ZWxvcG1lbnQvanMvd2ViZ2wtdmlzdWFsaXplci9jb2ZmZWUvZGFuY2Vycy9DdWJlRGFuY2VyLmNvZmZlZSIsIi9Vc2Vycy91bHlzc2VzcG9wcGxlL0RldmVsb3BtZW50L2pzL3dlYmdsLXZpc3VhbGl6ZXIvY29mZmVlL2RhbmNlcnMvRGFuY2VyLmNvZmZlZSIsIi9Vc2Vycy91bHlzc2VzcG9wcGxlL0RldmVsb3BtZW50L2pzL3dlYmdsLXZpc3VhbGl6ZXIvY29mZmVlL2RhbmNlcnMvUG9pbnRDbG91ZERhbmNlci5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9kYW5jZXJzL1NwaGVyZURhbmNlci5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9kYW5jZXMvUG9zaXRpb25EYW5jZS5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9kYW5jZXMvUm90YXRlRGFuY2UuY29mZmVlIiwiL1VzZXJzL3VseXNzZXNwb3BwbGUvRGV2ZWxvcG1lbnQvanMvd2ViZ2wtdmlzdWFsaXplci9jb2ZmZWUvZGFuY2VzL1NjYWxlRGFuY2UuY29mZmVlIiwiamF2YXNjcmlwdC9PcmJpdENvbnRyb2xzLmpzIiwiamF2YXNjcmlwdC9RdWV1ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0NBLE1BQVksQ0FBQztBQUNYLEVBQUEsV0FBQyxD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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIENvbnRhaW5zIHRoZSBmcmVxdWVuY3lTYW1wbGVzIGFuZCBkYlNhbXBsZXMgZm9yIGF1ZGlvXG5jbGFzcyB3aW5kb3cuQXVkaW9XaW5kb3dcbiAgQGJ1ZmZlclNpemU6IDIwNDhcblxuICBjb25zdHJ1Y3RvcjogKHJlc3BvbnNpdmVuZXNzKSAtPlxuICAgIEByZXNwb25zaXZlbmVzcyA9IHJlc3BvbnNpdmVuZXNzXG4gICAgQGZyZXF1ZW5jeUJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KEBjb25zdHJ1Y3Rvci5idWZmZXJTaXplKVxuICAgIEBkYkJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KEBjb25zdHJ1Y3Rvci5idWZmZXJTaXplKVxuICAgIEB0aW1lID0gMFxuICAgIEBkZWx0YVRpbWUgPSAwXG5cbiAgdXBkYXRlOiAoYW5hbHlzZXIsIHRpbWUpIC0+XG4gICAgaWYgIWFuYWx5c2VyXG4gICAgICByZXR1cm5cblxuICAgICMgS2VlcCB0cmFjayBvZiB0aGUgYXVkaW9Db250ZXh0IHRpbWUgaW4gbXNcbiAgICBuZXdUaW1lID0gdGltZSAqIDEwMDBcbiAgICBAZGVsdGFUaW1lID0gbmV3VGltZSAtIEB0aW1lXG4gICAgQHRpbWUgPSBuZXdUaW1lXG5cbiAgICBhbmFseXNlci5nZXRCeXRlVGltZURvbWFpbkRhdGEoQGRiQnVmZmVyKVxuICAgIGFuYWx5c2VyLmdldEJ5dGVGcmVxdWVuY3lEYXRhKEBmcmVxdWVuY3lCdWZmZXIpXG5cbiAgICBybXMgPSAwXG5cbiAgICBmb3IgYnVmIGluIEBkYkJ1ZmZlclxuICAgICAgICB2YWwgPSAoYnVmIC0gMTI4KSAvIDEyOFxuICAgICAgICBybXMgKz0gdmFsKnZhbFxuXG4gICAgQGF2ZXJhZ2VEYiA9IE1hdGguc3FydChybXMgLyBAY29uc3RydWN0b3IuYnVmZmVyU2l6ZSkgKiBAcmVzcG9uc2l2ZW5lc3MiLCJyZXF1aXJlKCcuL0NvbmZpZy5jb2ZmZWUnKVxuXG5jbGFzcyB3aW5kb3cuQ2hvcmVvZ3JhcGh5Um91dGluZVxuICBjb25zdHJ1Y3RvcjogKEB2aXN1YWxpemVyKSAtPlxuICAgIEBpZCA9IDBcbiAgICBAZGFuY2VyID0gXCJDdWJlRGFuY2VyXCJcbiAgICBAZGFuY2UgPSBcIlNjYWxlRGFuY2VcIlxuICAgIEBkYW5jZU1hdGVyaWFsID0gXCJDb2xvckRhbmNlTWF0ZXJpYWxcIlxuICAgIEBkYW5jZXJQYXJhbXMgPSB7fVxuICAgIEBkYW5jZVBhcmFtcyA9IHt9XG4gICAgQGRhbmNlTWF0ZXJpYWxQYXJhbXMgPSB7fVxuICAgIEByb3V0aW5lcyA9IFtdXG5cbiAgICBAcmVzZXQoKVxuXG4gIGxvYWRSb3V0aW5lQnlJZDogKGlkLCBuZXh0KSAtPlxuICAgICQuYWpheFxuICAgICAgdXJsOiBDb25maWcuc2VydmVyICsgJy9yb3V0aW5lcy8nICsgaWRcbiAgICAgIHR5cGU6IFwiR0VUXCJcbiAgICAgIHN1Y2Nlc3M6IChyb3V0aW5lKSA9PlxuICAgICAgICBfdGhpcy5yb3V0aW5lc1tpZF0uZGF0YSA9IHJvdXRpbmUuZGF0YVxuICAgICAgICBuZXh0KF90aGlzLnJvdXRpbmVzW3JvdXRpbmUuaWRdKVxuXG4gIHF1ZXVlUm91dGluZTogKGlkKSAtPlxuICAgIEFycmF5OjpwdXNoLmFwcGx5IEByb3V0aW5lLCBKU09OLnBhcnNlKEByb3V0aW5lc1tpZF0uZGF0YSlcbiAgICBAdXBkYXRlVGV4dCgpXG5cbiMgICAgVGhlIGZpcnN0IHJvdXRpbmUuIFRoaXMgc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSBzZXJ2ZXIgYmVmb3JlIHJ1bm5pbmcgaXQuXG4jXG4jICAgIEByb3V0aW5lID0gW1xuIyAgICAgIFtcbiMgICAgICAgIHsgaWQ6IC0xIH0sXG4jICAgICAgICB7XG4jICAgICAgICAgIGlkOiAyXG4jICAgICAgICAgIGRhbmNlcjpcbiMgICAgICAgICAgICB0eXBlOiAnQ3ViZURhbmNlcidcbiMgICAgICAgICAgZGFuY2U6XG4jICAgICAgICAgICAgdHlwZTogJ1Bvc2l0aW9uRGFuY2UnXG4jICAgICAgICAgICAgcGFyYW1zOlxuIyAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcbiMgICAgICAgICAgICAgIGRpcmVjdGlvbjogWzAsIDQuMCwgMF1cbiMgICAgICAgICAgZGFuY2VNYXRlcmlhbDpcbiMgICAgICAgICAgICB0eXBlOiAnQ29sb3JEYW5jZU1hdGVyaWFsJ1xuIyAgICAgICAgICAgIHBhcmFtczpcbiMgICAgICAgICAgICAgIHNtb290aGluZ0ZhY3RvcjogMC41XG4jICAgICAgICB9LFxuIyAgICAgICAge1xuIyAgICAgICAgICBpZDogMFxuIyAgICAgICAgICBkYW5jZXI6XG4jICAgICAgICAgICAgdHlwZTogJ1BvaW50Q2xvdWREYW5jZXInXG4jICAgICAgICAgIGRhbmNlOlxuIyAgICAgICAgICAgIHR5cGU6ICdSb3RhdGVEYW5jZSdcbiMgICAgICAgICAgICBwYXJhbXM6XG4jICAgICAgICAgICAgICBheGlzOiBbLTEsIC0xLCAwXVxuIyAgICAgICAgICBkYW5jZU1hdGVyaWFsOlxuIyAgICAgICAgICAgIHR5cGU6ICdDb2xvckRhbmNlTWF0ZXJpYWwnXG4jICAgICAgICAgICAgcGFyYW1zOlxuIyAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcbiMgICAgICAgICAgICAgIG1pbkw6IDAuMFxuIyAgICAgICAgfSxcbiMgICAgICAgIHtcbiMgICAgICAgICAgaWQ6IDFcbiMgICAgICAgICAgZGFuY2VyOlxuIyAgICAgICAgICAgIHR5cGU6ICdQb2ludENsb3VkRGFuY2VyJ1xuIyAgICAgICAgICBkYW5jZTpcbiMgICAgICAgICAgICB0eXBlOiAnUm90YXRlRGFuY2UnXG4jICAgICAgICAgICAgcGFyYW1zOlxuIyAgICAgICAgICAgICAgYXhpczogWzAsIDEsIDFdXG4jICAgICAgICAgICAgICBzcGVlZDogMC41XG4jICAgICAgICAgIGRhbmNlTWF0ZXJpYWw6XG4jICAgICAgICAgICAgdHlwZTogJ0NvbG9yRGFuY2VNYXRlcmlhbCdcbiMgICAgICAgICAgICBwYXJhbXM6XG4jICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxuIyAgICAgICAgICAgICAgbWluTDogMC4wXG4jICAgICAgICB9XG4jICAgICAgXSxcbiMgICAgICBbXG4jICAgICAgICB7XG4jICAgICAgICAgIGlkOiAyXG4jICAgICAgICAgIGRhbmNlcjpcbiMgICAgICAgICAgICB0eXBlOiAnU3BoZXJlRGFuY2VyJ1xuIyAgICAgICAgICAgIHBhcmFtczpcbiMgICAgICAgICAgICAgIHBvc2l0aW9uOiBbMC41LCAwLCAwLjVdXG4jICAgICAgICB9LFxuIyAgICAgICAge1xuIyAgICAgICAgICBpZDogM1xuIyAgICAgICAgICBkYW5jZXI6XG4jICAgICAgICAgICAgdHlwZTogJ1NwaGVyZURhbmNlcidcbiMgICAgICAgICAgICBwYXJhbXM6XG4jICAgICAgICAgICAgICBwb3NpdGlvbjogWzAuNSwgMCwgLTAuNV1cbiMgICAgICAgICAgZGFuY2U6XG4jICAgICAgICAgICAgdHlwZTogJ1NjYWxlRGFuY2UnXG4jICAgICAgICAgICAgcGFyYW1zOlxuIyAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcbiMgICAgICAgICAgZGFuY2VNYXRlcmlhbDpcbiMgICAgICAgICAgICB0eXBlOiAnQ29sb3JEYW5jZU1hdGVyaWFsJ1xuIyAgICAgICAgICAgIHBhcmFtczpcbiMgICAgICAgICAgICAgIHNtb290aGluZ0ZhY3RvcjogMC41XG4jICAgICAgICAgICAgICB3aXJlZnJhbWU6IHRydWVcbiMgICAgICAgIH0sXG4jICAgICAgICB7XG4jICAgICAgICAgIGlkOiA0XG4jICAgICAgICAgIGRhbmNlcjpcbiMgICAgICAgICAgICB0eXBlOiAnU3BoZXJlRGFuY2VyJ1xuIyAgICAgICAgICAgIHBhcmFtczpcbiMgICAgICAgICAgICAgIHBvc2l0aW9uOiBbLTAuNSwgMCwgMC41XVxuIyAgICAgICAgICBkYW5jZTpcbiMgICAgICAgICAgICB0eXBlOiAnU2NhbGVEYW5jZSdcbiMgICAgICAgICAgICBwYXJhbXM6XG4jICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxuIyAgICAgICAgICBkYW5jZU1hdGVyaWFsOlxuIyAgICAgICAgICAgIHR5cGU6ICdDb2xvckRhbmNlTWF0ZXJpYWwnXG4jICAgICAgICAgICAgcGFyYW1zOlxuIyAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcbiMgICAgICAgICAgICAgIHdpcmVmcmFtZTogdHJ1ZVxuIyAgICAgICAgfSxcbiMgICAgICAgIHtcbiMgICAgICAgICAgaWQ6IDVcbiMgICAgICAgICAgZGFuY2VyOlxuIyAgICAgICAgICAgIHR5cGU6ICdTcGhlcmVEYW5jZXInXG4jICAgICAgICAgICAgcGFyYW1zOlxuIyAgICAgICAgICAgICAgcG9zaXRpb246IFstMC41LCAwLCAtMC41XVxuIyAgICAgICAgICBkYW5jZTpcbiMgICAgICAgICAgICB0eXBlOiAnUG9zaXRpb25EYW5jZSdcbiMgICAgICAgICAgICBwYXJhbXM6XG4jICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxuIyAgICAgICAgICBkYW5jZU1hdGVyaWFsOlxuIyAgICAgICAgICAgIHR5cGU6ICdDb2xvckRhbmNlTWF0ZXJpYWwnXG4jICAgICAgICAgICAgcGFyYW1zOlxuIyAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcbiMgICAgICAgICAgICAgIHdpcmVmcmFtZTogdHJ1ZVxuIyAgICAgICAgfSxcbiMgICAgICBdXG4jICAgIF1cblxuICBwcmV2aWV3OiAoKSAtPlxuICAgIEB2aXN1YWxpemVyLnJlY2VpdmVDaG9yZW9ncmFwaHlcbiAgICAgIGlkOiBAaWRcbiAgICAgIGRhbmNlcjpcbiAgICAgICAgdHlwZTogQGRhbmNlclxuICAgICAgICBwYXJhbXM6IEBkYW5jZXJQYXJhbXNcbiAgICAgIGRhbmNlOlxuICAgICAgICB0eXBlOiBAZGFuY2VcbiAgICAgICAgcGFyYW1zOiBAZGFuY2VQYXJhbXNcbiAgICAgIGRhbmNlTWF0ZXJpYWw6XG4gICAgICAgIHR5cGU6IEBkYW5jZU1hdGVyaWFsXG4gICAgICAgIHBhcmFtczogQGRhbmNlTWF0ZXJpYWxQYXJhbXNcblxuICBhZGQ6ICgpIC0+XG4gICAgQHJvdXRpbmVNb21lbnQucHVzaFxuICAgICAgaWQ6IEBpZFxuICAgICAgZGFuY2VyOlxuICAgICAgICB0eXBlOiBAZGFuY2VyXG4gICAgICAgIHBhcmFtczogQGRhbmNlclBhcmFtc1xuICAgICAgZGFuY2U6XG4gICAgICAgIHR5cGU6IEBkYW5jZVxuICAgICAgICBwYXJhbXM6IEBkYW5jZVBhcmFtc1xuICAgICAgZGFuY2VNYXRlcmlhbDpcbiAgICAgICAgdHlwZTogQGRhbmNlTWF0ZXJpYWxcbiAgICAgICAgcGFyYW1zOiBAZGFuY2VNYXRlcmlhbFBhcmFtc1xuXG4gICAgQHVwZGF0ZVRleHQoKVxuXG4gIGluc2VydEJlYXQ6ICgpIC0+XG4gICAgQHJvdXRpbmVNb21lbnQgPSBbXVxuICAgIEByb3V0aW5lLnNwbGljZSgrK0Byb3V0aW5lQmVhdCwgMCwgQHJvdXRpbmVNb21lbnQpXG4gICAgQHVwZGF0ZVRleHQoKVxuXG4gIHBsYXlOZXh0OiAoKSAtPlxuICAgIGlmIEByb3V0aW5lQmVhdCA9PSBAcm91dGluZS5sZW5ndGggLSAxXG4gICAgICBAcm91dGluZUJlYXQgPSAtMVxuXG4gICAgQHJvdXRpbmVNb21lbnQgPSBAcm91dGluZVsrK0Byb3V0aW5lQmVhdF1cbiAgICBmb3IgY2hhbmdlIGluIEByb3V0aW5lTW9tZW50XG4gICAgICBAdmlzdWFsaXplci5yZWNlaXZlQ2hvcmVvZ3JhcGh5IGNoYW5nZVxuXG4gIHJlc2V0OiAoKSAtPlxuICAgIEByb3V0aW5lID0gW11cbiAgICBAcm91dGluZU1vbWVudCA9IFtdXG4gICAgQHJvdXRpbmVCZWF0ID0gLTFcblxuICB1cGRhdGVUZXh0OiAoKSAtPlxuICAgIEB2aXN1YWxpemVyLmludGVyZmFjZS51cGRhdGVUZXh0KEByb3V0aW5lKVxuXG4gIHJlZnJlc2hSb3V0aW5lczogKG5leHQpIC0+XG4gICAgJC5hamF4XG4gICAgICB1cmw6IENvbmZpZy5zZXJ2ZXIgKyAnL3JvdXRpbmVzJ1xuICAgICAgdHlwZTogJ0dFVCdcbiAgICAgIHN1Y2Nlc3M6IChkYXRhKSA9PlxuICAgICAgICBmb3Igcm91dGluZSBpbiBkYXRhXG4gICAgICAgICAgQHJvdXRpbmVzW3JvdXRpbmUuaWRdID0gcm91dGluZVxuICAgICAgICBuZXh0KClcblxuICBwdXNoQ3VycmVudFJvdXRpbmU6IChuYW1lLCBuZXh0KSAtPlxuICAgICQuYWpheFxuICAgICAgdXJsOiBDb25maWcuc2VydmVyICsgJy9yb3V0aW5lcydcbiAgICAgIHR5cGU6ICdQT1NUJ1xuICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnlcbiAgICAgICAgbmFtZTogbmFtZVxuICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShAcm91dGluZSlcbiAgICAgIHN1Y2Nlc3M6IG5leHRcblxuICB1cGRhdGVEYW5jZXI6IChkYW5jZXIpIC0+XG4gICAgQGRhbmNlciA9IGRhbmNlci5jb25zdHJ1Y3Rvci5uYW1lXG4gICAgQGRhbmNlTWF0ZXJpYWwgPSBkYW5jZXIuZGFuY2VNYXRlcmlhbC5jb25zdHJ1Y3Rvci5uYW1lXG4gICAgQGRhbmNlID0gZGFuY2VyLmRhbmNlLmNvbnN0cnVjdG9yLm5hbWVcblxuIiwiY2xhc3Mgd2luZG93LkNvbmZpZ1xuICAgIEBzZXJ2ZXI6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnIiwiY2xhc3Mgd2luZG93LkRhdEdVSUludGVyZmFjZVxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICBAcm91dGluZVdpbmRvdyA9ICQoJyNyb3V0aW5lJylcbiAgICBAcm91dGluZVN0YWdlID0gJCgnI3JvdXRpbmVTdGFnZScpXG5cbiAgc2V0dXA6IChAcGxheWVyLCBAY2hvcmVvZ3JhcGh5Um91dGluZSwgQHZpZXdlcikgLT5cbiAgICBndWkgPSBuZXcgZGF0LkdVSSgpXG5cbiAgICBndWkuYWRkKEBwbGF5ZXIuYXVkaW9XaW5kb3csICdyZXNwb25zaXZlbmVzcycsIDAuMCwgNS4wKVxuICAgIGlkQ29udHJvbGxlciA9IGd1aS5hZGQoQGNob3Jlb2dyYXBoeVJvdXRpbmUsICdpZCcpXG5cbiAgICBzZXR1cEZvbGRlciA9IChuYW1lLCB2YXJOYW1lLCBrZXlzKSA9PlxuICAgICAgY29udHJvbGxlciA9IGd1aS5hZGQoQGNob3Jlb2dyYXBoeVJvdXRpbmUsIHZhck5hbWUsIGtleXMpXG4gICAgICBmb2xkZXIgPSBndWkuYWRkRm9sZGVyKG5hbWUpXG4gICAgICBmb2xkZXIub3BlbigpXG4gICAgICByZXR1cm4gWyBjb250cm9sbGVyLCBmb2xkZXIgXVxuXG4gICAgdXBkYXRlRm9sZGVyID0gKHR5cGVzLCBmb2xkZXIsIHBhcmFtcywgdmFsdWUsIG9iaikgLT5cbiAgICAgIGlmICF0eXBlc1t2YWx1ZV0/XG4gICAgICAgIHJldHVyblxuXG4gICAgICB3aGlsZSBmb2xkZXIuX19jb250cm9sbGVyc1swXT9cbiAgICAgICAgZm9sZGVyLnJlbW92ZShmb2xkZXIuX19jb250cm9sbGVyc1swXSlcblxuICAgICAgZm9yIHBhcmFtIGluIHR5cGVzW3ZhbHVlXS5wYXJhbXNcbiAgICAgICAgcGFyYW1zW3BhcmFtLm5hbWVdID1cbiAgICAgICAgICBpZiBvYmo/Lm9wdGlvbnM/W3BhcmFtLm5hbWVdXG4gICAgICAgICAgICBvYmoub3B0aW9uc1twYXJhbS5uYW1lXVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHBhcmFtLmRlZmF1bHRcblxuICAgICAgICBmb2xkZXIuYWRkKHBhcmFtcywgcGFyYW0ubmFtZSlcblxuICAgIFtkYW5jZXJDb250cm9sbGVyLCBkYW5jZXJGb2xkZXJdID0gc2V0dXBGb2xkZXIoJ0RhbmNlciBwYXJhbWV0ZXJzJywgJ2RhbmNlcicsIE9iamVjdC5rZXlzKFZpc3VhbGl6ZXIuZGFuY2VyVHlwZXMpKVxuXG4gICAgdXBkYXRlRGFuY2VyRm9sZGVyID0gKHZhbHVlLCBvYmopID0+XG4gICAgICB1cGRhdGVGb2xkZXIoVmlzdWFsaXplci5kYW5jZXJUeXBlcywgZGFuY2VyRm9sZGVyLCBAY2hvcmVvZ3JhcGh5Um91dGluZS5kYW5jZXJQYXJhbXMsIHZhbHVlLCBvYmopXG4gICAgZGFuY2VyQ29udHJvbGxlci5vbkNoYW5nZSB1cGRhdGVEYW5jZXJGb2xkZXJcblxuICAgIFtkYW5jZUNvbnRyb2xsZXIsIGRhbmNlRm9sZGVyXSA9IHNldHVwRm9sZGVyKCdEYW5jZSBwYXJhbWV0ZXJzJywgJ2RhbmNlJywgT2JqZWN0LmtleXMoVmlzdWFsaXplci5kYW5jZVR5cGVzKSlcblxuICAgIHVwZGF0ZURhbmNlRm9sZGVyID0gKHZhbHVlLCBvYmopID0+XG4gICAgICB1cGRhdGVGb2xkZXIoVmlzdWFsaXplci5kYW5jZVR5cGVzLCBkYW5jZUZvbGRlciwgQGNob3Jlb2dyYXBoeVJvdXRpbmUuZGFuY2VQYXJhbXMsIHZhbHVlLCBvYmopXG4gICAgZGFuY2VDb250cm9sbGVyLm9uQ2hhbmdlIHVwZGF0ZURhbmNlRm9sZGVyXG5cbiAgICBbZGFuY2VNYXRlcmlhbENvbnRyb2xsZXIsIGRhbmNlTWF0ZXJpYWxGb2xkZXJdID0gc2V0dXBGb2xkZXIoJ0RhbmNlIG1hdGVyaWFsIHBhcmFtYXRlcnMnLCAnZGFuY2VNYXRlcmlhbCcsXG4gICAgICBPYmplY3Qua2V5cyhWaXN1YWxpemVyLmRhbmNlTWF0ZXJpYWxUeXBlcykpXG5cbiAgICB1cGRhdGVEYW5jZU1hdGVyaWFsRm9sZGVyID0gKHZhbHVlLCBvYmopID0+XG4gICAgICB1cGRhdGVGb2xkZXIoVmlzdWFsaXplci5kYW5jZU1hdGVyaWFsVHlwZXMsIGRhbmNlTWF0ZXJpYWxGb2xkZXIsIEBjaG9yZW9ncmFwaHlSb3V0aW5lLmRhbmNlTWF0ZXJpYWxQYXJhbXMsIHZhbHVlLFxuICAgICAgICBvYmopXG4gICAgZGFuY2VNYXRlcmlhbENvbnRyb2xsZXIub25DaGFuZ2UgdXBkYXRlRGFuY2VNYXRlcmlhbEZvbGRlclxuXG4gICAgaWRDb250cm9sbGVyLm9uQ2hhbmdlICh2YWx1ZSkgPT5cbiAgICAgIGlkRGFuY2VyID0gQHZpZXdlci5nZXREYW5jZXIodmFsdWUpXG4gICAgICBpZiBpZERhbmNlcj9cbiAgICAgICAgQGNob3Jlb2dyYXBoeVJvdXRpbmUudXBkYXRlRGFuY2VyIGlkRGFuY2VyXG4gICAgICAgIGZvciBjb250cm9sbGVyIGluIGd1aS5fX2NvbnRyb2xsZXJzXG4gICAgICAgICAgY29udHJvbGxlci51cGRhdGVEaXNwbGF5KClcblxuICAgICAgICB1cGRhdGVEYW5jZXJGb2xkZXIoQGNob3Jlb2dyYXBoeVJvdXRpbmUuZGFuY2VyLCBpZERhbmNlcilcbiAgICAgICAgdXBkYXRlRGFuY2VNYXRlcmlhbEZvbGRlcihAY2hvcmVvZ3JhcGh5Um91dGluZS5kYW5jZU1hdGVyaWFsLCBpZERhbmNlci5kYW5jZU1hdGVyaWFsKVxuICAgICAgICB1cGRhdGVEYW5jZUZvbGRlcihAY2hvcmVvZ3JhcGh5Um91dGluZS5kYW5jZSwgaWREYW5jZXIuZGFuY2UpXG5cbiAgICBndWkuYWRkKEBjaG9yZW9ncmFwaHlSb3V0aW5lLCAncHJldmlldycpXG4gICAgZ3VpLmFkZChAY2hvcmVvZ3JhcGh5Um91dGluZSwgJ2FkZCcpXG4gICAgZ3VpLmFkZChAY2hvcmVvZ3JhcGh5Um91dGluZSwgJ2luc2VydEJlYXQnKVxuICAgIGd1aS5hZGQoQGNob3Jlb2dyYXBoeVJvdXRpbmUsICdwbGF5TmV4dCcpXG4gICAgZ3VpLmFkZChAY2hvcmVvZ3JhcGh5Um91dGluZSwgJ3Jlc2V0JylcblxuICAgIEBzZXR1cFBvcHVwKClcblxuXG4gIHNldHVwUG9wdXA6ICgpIC0+XG4gICAgJCgnI3ZpZXdlckJ1dHRvbicpLmNsaWNrIChlKSA9PlxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBAZG9tYWluID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0XG4gICAgICBwb3B1cFVSTCA9IEBkb21haW4gKyBsb2NhdGlvbi5wYXRobmFtZSArICd2aWV3ZXIuaHRtbCdcbiAgICAgIEBwb3B1cCA9IHdpbmRvdy5vcGVuKHBvcHVwVVJMLCAnbXlXaW5kb3cnKVxuXG4gICAgICAjIFdlIGhhdmUgdG8gZGVsYXkgY2F0Y2hpbmcgdGhlIHdpbmRvdyB1cCBiZWNhdXNlIGl0IGhhcyB0byBsb2FkIGZpcnN0LlxuICAgICAgc2VuZEJlYXRzID0gKCkgPT5cbiAgICAgICAgcm91dGluZUJlYXQgPSBAY2hvcmVvZ3JhcGh5Um91dGluZS5yb3V0aW5lQmVhdFxuICAgICAgICBAY2hvcmVvZ3JhcGh5Um91dGluZS5yb3V0aW5lQmVhdCA9IC0xXG4gICAgICAgIHdoaWxlIEBjaG9yZW9ncmFwaHlSb3V0aW5lLnJvdXRpbmVCZWF0IDwgcm91dGluZUJlYXRcbiAgICAgICAgICBAY2hvcmVvZ3JhcGh5Um91dGluZS5wbGF5TmV4dCgpXG4gICAgICBzZXRUaW1lb3V0IHNlbmRCZWF0cywgMTAwXG5cbiAgc2V0dXBSb3V0aW5lU3RhZ2U6ICgpIC0+XG4gICAgQHJlZnJlc2hSb3V0aW5lcygpXG4gICAgJCgnI3JvdXRpbmVQdXNoJykuY2xpY2sgKGUpID0+XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIEBjaG9yZW9ncmFwaHlSb3V0aW5lLnB1c2hDdXJyZW50Um91dGluZSAkKCcjcHVzaE5hbWUnKS52YWwoKSwgKCkgPT5cbiAgICAgICAgQHJlZnJlc2hSb3V0aW5lcygpXG5cbiAgICAkKCcjcm91dGluZVNlbGVjdCcpLmNoYW5nZSAoZSkgPT5cbiAgICAgIEBjdXJyZW50Um91dGluZUlkID0gJCgnI3JvdXRpbmVTZWxlY3Qgb3B0aW9uOnNlbGVjdGVkJykudmFsKClcbiAgICAgIEBjaG9yZW9ncmFwaHlSb3V0aW5lLmxvYWRSb3V0aW5lQnlJZCBAY3VycmVudFJvdXRpbmVJZCwgKHJvdXRpbmUpID0+XG4gICAgICAgIEByb3V0aW5lU3RhZ2UuaHRtbChAY2hvcmVvZ3JhcGh5Um91dGluZS5yb3V0aW5lc1tAY3VycmVudFJvdXRpbmVJZF0uZGF0YSlcblxuXG4gICAgJCgnI3JvdXRpbmVRdWV1ZScpLmNsaWNrIChlKSA9PlxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBAY2hvcmVvZ3JhcGh5Um91dGluZS5xdWV1ZVJvdXRpbmUoQGN1cnJlbnRSb3V0aW5lSWQpXG5cbiAgcmVmcmVzaFJvdXRpbmVzOiAoKSAtPlxuICAgICQoJyNyb3V0aW5lU2VsZWN0JykuZW1wdHkoKVxuICAgIGZvciBrZXkgaW4gT2JqZWN0LmtleXMoQGNob3Jlb2dyYXBoeVJvdXRpbmUucm91dGluZXMpXG4gICAgICB2YWx1ZSA9IEBjaG9yZW9ncmFwaHlSb3V0aW5lLnJvdXRpbmVzW2tleV1cbiAgICAgICQoJyNyb3V0aW5lU2VsZWN0JykuYXBwZW5kKCQoXCI8b3B0aW9uPjwvb3B0aW9uPlwiKS5hdHRyKFwidmFsdWVcIiwga2V5KS50ZXh0KHZhbHVlLm5hbWUpKTtcblxuICB1cGRhdGVUZXh0OiAoanNvbikgLT5cbiAgICBAcm91dGluZVdpbmRvdy5odG1sKEpTT04uc3RyaW5naWZ5KGpzb24sIHVuZGVmaW5lZCwgMikpXG4iLCIjIFJlcXVpcmUgYWxsIHRoZSBzaGl0XG5yZXF1aXJlICcuL1Zpc3VhbGl6ZXIuY29mZmVlJ1xucmVxdWlyZSAnLi4vamF2YXNjcmlwdC9PcmJpdENvbnRyb2xzJ1xucmVxdWlyZSAnLi9WaWV3ZXIuY29mZmVlJ1xucmVxdWlyZSAnLi9EYXRHVUlJbnRlcmZhY2UuY29mZmVlJ1xuXG5jbGFzcyB3aW5kb3cuTWFpblxuICAjIENvbnN0cnVjdCB0aGUgc2NlbmVcbiAgY29uc3RydWN0b3I6IChpc1Zpc3VhbGl6ZXIpIC0+XG4gICAgQHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKClcbiAgICBAcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlciggeyBhbnRpYWxpYXM6IHRydWUsIGFscGhhOiBmYWxzZSB9IClcbiAgICBAcmVuZGVyZXIuc2V0U2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApXG4gICAgQHJlbmRlcmVyLmF1dG9DbGVhciA9IGZhbHNlXG5cbiAgICBAY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCA3NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMCApXG4gICAgQGNvbnRyb2xzID0gbmV3IFRIUkVFLk9yYml0Q29udHJvbHMoIEBjYW1lcmEsIEByZW5kZXJlci5kb21FbGVtZW50IClcbiAgICBAY29udHJvbHMuZGFtcGluZyA9IDAuMlxuXG4gICAgY29udHJvbENoYW5nZSA9ICgpID0+XG4gICAgICBAcmVuZGVyKClcblxuICAgIEBjb250cm9scy5hZGRFdmVudExpc3RlbmVyKCAnY2hhbmdlJywgY29udHJvbENoYW5nZSApXG5cbiAgICBAY2FtZXJhLnBvc2l0aW9uLnogPSAtNFxuICAgIEBjYW1lcmEucG9zaXRpb24ueSA9IDNcbiAgICBAY29udHJvbHMudGFyZ2V0ID0gbmV3IFRIUkVFLlZlY3RvcjMoIDAsIDAsIDAgKVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdyZXNpemUnLCBAb25XaW5kb3dSZXNpemUsIGZhbHNlIClcblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoQHJlbmRlcmVyLmRvbUVsZW1lbnQpXG5cbiAgICBAdmlld2VyID0gbmV3IFZpZXdlcihAc2NlbmUsIEBjYW1lcmEpXG4gICAgaWYgaXNWaXN1YWxpemVyXG4gICAgICBAdmlzdWFsaXplciA9IG5ldyBWaXN1YWxpemVyKEB2aWV3ZXIsIG5ldyBEYXRHVUlJbnRlcmZhY2UoKSlcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgQHZpc3VhbGl6ZXIub25LZXlEb3duLmJpbmQoQHZpc3VhbGl6ZXIpLCBmYWxzZSlcbiAgICBlbHNlXG4gICAgICBAZG9tYWluID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAnbWVzc2FnZScsIChldmVudCkgPT5cbiAgICAgICAgaWYgZXZlbnQub3JpZ2luICE9IEBkb21haW4gdGhlbiByZXR1cm5cbiAgICAgICAgc2VudE9iaiA9IGV2ZW50LmRhdGFcbiAgICAgICAgaWYgc2VudE9iai50eXBlID09ICdyZW5kZXInXG4gICAgICAgICAgQHZpZXdlci5yZW5kZXIgc2VudE9iai5kYXRhXG4gICAgICAgIGlmIHNlbnRPYmoudHlwZSA9PSAnY2hvcmVvZ3JhcGh5J1xuICAgICAgICAgIEB2aWV3ZXIucmVjZWl2ZUNob3Jlb2dyYXBoeSBzZW50T2JqLmRhdGFcblxuICBhbmltYXRlOiAoKSAtPlxuICAgIEByZW5kZXIoKVxuICAgIEBjb250cm9scy51cGRhdGUoKVxuXG4gIHJlbmRlcjogKCkgLT5cbiAgICBAdmlzdWFsaXplcj8ucmVuZGVyKCkgIFxuXG4gICAgQHNjZW5lLnVwZGF0ZU1hdHJpeFdvcmxkKClcbiAgICBAY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKVxuICAgIEByZW5kZXJlci5jbGVhcigpXG4gICAgQHJlbmRlcmVyLnJlbmRlcihAc2NlbmUsIEBjYW1lcmEpXG4gICAgcmV0dXJuXG5cbiAgb25XaW5kb3dSZXNpemU6ICgpID0+XG4gICAgQGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodFxuICAgIEBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpXG4gICAgQHJlbmRlcmVyLnNldFNpemUoIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKVxuXG53aW5kb3cuYW5pbWF0ZSA9ICgpIC0+XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSh3aW5kb3cuYW5pbWF0ZSlcbiAgd2luZG93LmFwcC5hbmltYXRlKClcblxuJCAtPlxuICBkYXQuR1VJLnByb3RvdHlwZS5yZW1vdmVGb2xkZXIgPSAobmFtZSkgLT5cbiAgICBmb2xkZXIgPSAgdGhpcy5fX2ZvbGRlcnNbbmFtZV1cbiAgICBpZiAhZm9sZGVyXG4gICAgICByZXR1cm5cbiAgICBmb2xkZXIuY2xvc2UoKVxuICAgIHRoaXMuX191bC5yZW1vdmVDaGlsZChmb2xkZXIuZG9tRWxlbWVudC5wYXJlbnROb2RlKVxuICAgIGRlbGV0ZSB0aGlzLl9fZm9sZGVyc1tuYW1lXVxuICAgIHRoaXMub25SZXNpemUoKSIsInJlcXVpcmUgJy4vQXVkaW9XaW5kb3cuY29mZmVlJ1xuXG4jIFBsYXlzIHRoZSBhdWRpbyBhbmQgY3JlYXRlcyBhbiBhbmFseXNlclxuY2xhc3Mgd2luZG93LlBsYXllclxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICBAYXVkaW9XaW5kb3cgPSBuZXcgQXVkaW9XaW5kb3coMSk7XG4gICAgQGxvYWRlZEF1ZGlvID0gbmV3IEFycmF5KClcbiAgICBAc3RhcnRPZmZzZXQgPSAwXG4gICAgQHNldHVwQW5hbHlzZXIoKVxuXG4gIHNldHVwQW5hbHlzZXI6ICgpIC0+XG4gICAgd2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dFxuICAgIEBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KClcbiAgICBAYW5hbHlzZXIgPSBAYXVkaW9Db250ZXh0LmNyZWF0ZUFuYWx5c2VyKClcbiAgICBAYW5hbHlzZXIuZmZ0U2l6ZSA9IEF1ZGlvV2luZG93LmJ1ZmZlclNpemVcblxuICB1cGRhdGU6ICgpIC0+XG4gICAgQGF1ZGlvV2luZG93LnVwZGF0ZShAYW5hbHlzZXIsIEBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUpXG5cbiAgcGF1c2U6ICgpIC0+XG4gICAgQHNvdXJjZS5zdG9wKClcbiAgICBAcGxheWluZyA9IGZhbHNlXG4gICAgQHN0YXJ0T2Zmc2V0ICs9IEBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgLSBAc3RhcnRUaW1lXG5cbiAgY3JlYXRlTGl2ZUlucHV0OiAoKSAtPlxuICAgIGdvdFN0cmVhbSA9IChzdHJlYW0pID0+XG4gICAgICBAcGxheWluZyA9IHRydWVcbiAgICAgIEBzb3VyY2UgPSBAYXVkaW9Db250ZXh0LmNyZWF0ZU1lZGlhU3RyZWFtU291cmNlIHN0cmVhbVxuICAgICAgQHNvdXJjZS5jb25uZWN0IEBhbmFseXNlclxuXG4gICAgQGRiU2FtcGxlQnVmID0gbmV3IFVpbnQ4QXJyYXkoMjA0OClcblxuICAgIGlmICggbmF2aWdhdG9yLmdldFVzZXJNZWRpYSApXG4gICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSwgZ290U3RyZWFtLCAoZXJyKSAtPlxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpKVxuICAgIGVsc2UgaWYgKG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWEgKVxuICAgICAgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSh7IGF1ZGlvOiB0cnVlIH0sIGdvdFN0cmVhbSwgKGVycikgLT5cbiAgICAgICAgY29uc29sZS5sb2coZXJyKSlcbiAgICBlbHNlIGlmIChuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIClcbiAgICAgIG5hdmlnYXRvci5tb3pHZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSB9LCBnb3RTdHJlYW0sIChlcnIpIC0+XG4gICAgICAgIGNvbnNvbGUubG9nKGVycikpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuKGFsZXJ0KFwiRXJyb3I6IGdldFVzZXJNZWRpYSBub3Qgc3VwcG9ydGVkIVwiKSk7XG5cbiAgcGxheTogKHVybCkgLT5cbiAgICBAY3VycmVudGx5UGxheWluZyA9IHVybFxuXG4gICAgaWYgQGxvYWRlZEF1ZGlvW3VybF0/XG4gICAgICBAbG9hZEZyb21CdWZmZXIoQGxvYWRlZEF1ZGlvW3VybF0pXG4gICAgICByZXR1cm5cblxuICAgIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHJlcXVlc3Qub3BlbihcIkdFVFwiLCB1cmwsIHRydWUpXG4gICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInXG4gICAgcmVxdWVzdC5vbmxvYWQgPSAoKSA9PlxuICAgICAgQGF1ZGlvQ29udGV4dC5kZWNvZGVBdWRpb0RhdGEgcmVxdWVzdC5yZXNwb25zZVxuICAgICAgLCAoYnVmZmVyKSA9PlxuICAgICAgICBAbG9hZGVkQXVkaW9bdXJsXSA9IGJ1ZmZlclxuICAgICAgICBAbG9hZEZyb21CdWZmZXIoYnVmZmVyKVxuICAgICAgLCAoZXJyKSAtPlxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgICByZXR1cm5cblxuICAgIHJlcXVlc3Quc2VuZCgpXG4gICAgcmV0dXJuXG5cbiAgbG9hZEZyb21CdWZmZXI6IChidWZmZXIpIC0+XG4gICAgQHN0YXJ0VGltZSA9IEBhdWRpb0NvbnRleHQuY3VycmVudFRpbWVcbiAgICBAc291cmNlID0gQGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKVxuICAgIEBzb3VyY2UuYnVmZmVyID0gYnVmZmVyXG4gICAgQHNvdXJjZS5jb25uZWN0KEBhbmFseXNlcilcbiAgICBAc291cmNlLmNvbm5lY3QoQGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbilcbiAgICBAcGxheWluZyA9IHRydWVcbiAgICBAc291cmNlLnN0YXJ0KDAsIEBzdGFydE9mZnNldClcblxuICBwYXVzZTogKCkgLT5cbiAgICBpZiBAcGxheWVyLnBsYXlpbmcgdGhlbiBAcGF1c2UoKSBlbHNlIEBwbGF5KEBjdXJyZW50bHlQbGF5aW5nKSIsImNsYXNzIHdpbmRvdy5TaGFkZXJMb2FkZXJcbiAgIyBDb25zdHJ1Y3QgdGhlIHNoYWRlciBjYWNoZVxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICBAc2hhZGVycyA9IG5ldyBBcnJheSgpXG5cbiAgIyBUYWtlcyBhIG5hbWUgYW5kIGEgY2FsbGJhY2ssIGxvYWRzIHRoYXQgc2hhZGVyIGZyb20gL3NoYWRlcnMsIGNhY2hlcyB0aGUgcmVzdWx0XG4gIGxvYWQ6IChuYW1lLCBuZXh0KSAtPlxuICAgIGlmIEBzaGFkZXJzW25hbWVdP1xuICAgICAgbmV4dChAc2hhZGVyc1tuYW1lXSlcbiAgICBlbHNlXG4gICAgICBAc2hhZGVyc1tuYW1lXSA9IHt2ZXJ0ZXhTaGFkZXI6ICcnLCBmcmFnbWVudFNoYWRlcjogJyd9XG4gICAgICBAbG9hZEZyb21VcmwobmFtZSwgJ3NoYWRlcnMvJyArIG5hbWUsIG5leHQpXG5cbiAgIyBMb2FkcyB0aGUgc2hhZGVyZnJvbSBhIFVSTFxuICBsb2FkRnJvbVVybDogKG5hbWUsIHVybCwgbmV4dCkgLT5cblxuICAgIGxvYWRlZFNoYWRlciA9IChqcVhIUiwgdGV4dFN0YXR1cykgLT5cbiAgICAgIEBzaGFkZXJzW0BuYW1lXVtAdHlwZV0gPSBqcVhIUi5yZXNwb25zZVRleHRcbiAgICAgIGlmIChAc2hhZGVyc1tAbmFtZV0udmVydGV4U2hhZGVyPyAmJiBAc2hhZGVyc1tAbmFtZV0uZnJhZ21lbnRTaGFkZXIpXG4gICAgICAgIG5leHQoQHNoYWRlcnNbQG5hbWVdKVxuXG4gICAgJC5hamF4XG4gICAgICB1cmw6IHVybCArICcudmVydCdcbiAgICAgIGRhdGFUeXBlOiAndGV4dCdcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgbmFtZTogbmFtZVxuICAgICAgICB0eXBlOiAndmVydGV4U2hhZGVyJ1xuICAgICAgICBuZXh0OiBuZXh0XG4gICAgICAgIHNoYWRlcnM6IEBzaGFkZXJzXG4gICAgICB9XG4gICAgICBjb21wbGV0ZTogbG9hZGVkU2hhZGVyIFxuXG4gICAgJC5hamF4XG4gICAgICB1cmw6IHVybCArICcuZnJhZydcbiAgICAgIGRhdGFUeXBlOiAndGV4dCdcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgbmFtZTogbmFtZVxuICAgICAgICB0eXBlOiAnZnJhZ21lbnRTaGFkZXInXG4gICAgICAgIG5leHQ6IG5leHRcbiAgICAgICAgc2hhZGVyczogQHNoYWRlcnNcbiAgICAgIH1cbiAgICAgIGNvbXBsZXRlOiBsb2FkZWRTaGFkZXIgXG5cbiAgICByZXR1cm4iLCJyZXF1aXJlICcuL1NoYWRlckxvYWRlci5jb2ZmZWUnXG5yZXF1aXJlICcuLi9qYXZhc2NyaXB0L1F1ZXVlLmpzJ1xuXG5jbGFzcyB3aW5kb3cuVmlld2VyXG4gIGNvbnN0cnVjdG9yOiAoc2NlbmUsIGNhbWVyYSkgLT5cbiAgICBAc2NlbmUgPSBzY2VuZVxuICAgIEBkYW5jZXJzID0gbmV3IEFycmF5KClcbiAgICBAc2hhZGVyTG9hZGVyID0gbmV3IFNoYWRlckxvYWRlcigpXG5cbiAgICBAY2hvcmVvZ3JhcGh5UXVldWUgPSBuZXcgUXVldWUoKVxuXG4gIHJlY2VpdmVDaG9yZW9ncmFwaHk6IChtb3ZlKSAtPlxuICAgIEBjaG9yZW9ncmFwaHlRdWV1ZS5wdXNoKG1vdmUpXG5cbiAgZXhlY3V0ZUNob3Jlb2dyYXBoeTogKHtpZCwgZGFuY2VyLCBkYW5jZSwgZGFuY2VNYXRlcmlhbCB9KSAtPlxuICAgIGlmIGlkID09IC0xXG4gICAgICBmb3IgZGFuY2VyIGluIEBkYW5jZXJzXG4gICAgICAgIEBzY2VuZS5yZW1vdmUoZGFuY2VyLmJvZHkpXG4gICAgICBAZGFuY2VycyA9IFtdXG4gICAgICByZXR1cm5cbiAgICBpZiBAZGFuY2Vyc1tpZF0/XG4gICAgICAjIFRlc3QgZXZlcnl0aGluZyBlbHNlXG4gICAgICBjdXJyZW50RGFuY2VyID0gQGRhbmNlcnNbaWRdXG5cbiAgICAgICMgSWYgbm8gcGFyYW1ldGVycyBhcmUgc2V0LCBidXQgYW4gaWQgaXMsIHRoZW4gcmVtb3ZlIHRoZSBvYmplY3RcbiAgICAgIGlmICFkYW5jZXI/ICYmICFkYW5jZSAmJiAhZGFuY2VNYXRlcmlhbFxuICAgICAgICBAc2NlbmUucmVtb3ZlKGN1cnJlbnREYW5jZXIuYm9keSlcbiAgICAgICAgQGRhbmNlcnMuc3BsaWNlKEBkYW5jZXJzLmluZGV4T2YoaWQpLCAxKVxuXG4gICAgICBpZiBkYW5jZT8gXG4gICAgICAgIGlmICFkYW5jZXI/ICYmICFkYW5jZU1hdGVyaWFsP1xuICAgICAgICAgIGN1cnJlbnREYW5jZXIucmVzZXQoKVxuICAgICAgICAgIGN1cnJlbnREYW5jZXIuZGFuY2UgPSBuZXcgVmlzdWFsaXplci5kYW5jZVR5cGVzW2RhbmNlLnR5cGVdKGRhbmNlLnBhcmFtcylcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgZWxzZVxuICAgICAgICAgIG5ld0RhbmNlID0gbmV3IFZpc3VhbGl6ZXIuZGFuY2VUeXBlc1tkYW5jZS50eXBlXShkYW5jZS5wYXJhbXMpXG4gICAgICBlbHNlXG4gICAgICAgIG5ld0RhbmNlID0gY3VycmVudERhbmNlci5kYW5jZVxuXG4gICAgICBhZGREYW5jZXIgPSAobmV3RGFuY2UsIG5ld01hdGVyaWFsKSA9PlxuICAgICAgICBpZiBkYW5jZXI/XG4gICAgICAgICAgbmV3RGFuY2VyID0gbmV3IFZpc3VhbGl6ZXIuZGFuY2VyVHlwZXNbZGFuY2VyLnR5cGVdKG5ld0RhbmNlLCBuZXdNYXRlcmlhbCwgZGFuY2VyLnBhcmFtcylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG5ld0RhbmNlciA9IG5ldyBjdXJyZW50RGFuY2VyLmNvbnN0cnVjdG9yKG5ld0RhbmNlLCBuZXdNYXRlcmlhbClcblxuICAgICAgICBjdXJyZW50RGFuY2VyLnJlc2V0KClcbiAgICAgICAgQHNjZW5lLnJlbW92ZShjdXJyZW50RGFuY2VyLmJvZHkpXG4gICAgICAgIEBkYW5jZXJzW2lkXSA9IG5ld0RhbmNlclxuICAgICAgICBAc2NlbmUuYWRkKG5ld0RhbmNlci5ib2R5KVxuXG4gICAgICBpZiBkYW5jZU1hdGVyaWFsP1xuICAgICAgICAjIFNwZWNpYWwgY2FzZSBmb3Igc2hhZGVycyBiZWNhdXNlIGl0IGhhcyB0byBsb2FkIHRoZSBzaGFkZXIgZmlsZVxuICAgICAgICAjIFRoaXMgaXMgYSByZWFsbHkgaGFja3kgd2F5IG9mIGNoZWNraW5nIGlmIGl0J3MgYSBzaGFkZXIuIFNob3VsZCBjaGFuZ2UuXG4gICAgICAgIGlmIGRhbmNlTWF0ZXJpYWwudHlwZS5pbmRleE9mKCdTaGFkZXInKSA+IC0xXG4gICAgICAgICAgbmV3TWF0ZXJpYWwgPSBuZXcgVmlzdWFsaXplci5kYW5jZU1hdGVyaWFsVHlwZXNbZGFuY2VNYXRlcmlhbC50eXBlXShAc2hhZGVyTG9hZGVyKVxuICAgICAgICAgIG5ld01hdGVyaWFsLmxvYWRTaGFkZXIgKHNoYWRlck1hdGVyaWFsKSA9PlxuICAgICAgICAgICAgYWRkRGFuY2VyIG5ld0RhbmNlLCBzaGFkZXJNYXRlcmlhbFxuICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIG5ld01hdGVyaWFsID0gbmV3IFZpc3VhbGl6ZXIuZGFuY2VNYXRlcmlhbFR5cGVzW2RhbmNlTWF0ZXJpYWwudHlwZV0oZGFuY2VNYXRlcmlhbC5wYXJhbXMpXG4gICAgICBlbHNlXG4gICAgICAgIG5ld01hdGVyaWFsID0gY3VycmVudERhbmNlci5kYW5jZU1hdGVyaWFsXG5cbiAgICAgIGFkZERhbmNlcihuZXdEYW5jZSwgbmV3TWF0ZXJpYWwpXG5cbiAgICAgIHJldHVyblxuICAgIGVsc2UgaWYgaWQ/XG4gICAgICBAZGFuY2Vyc1tpZF0gPSBuZXcgVmlzdWFsaXplci5kYW5jZXJUeXBlc1tkYW5jZXIudHlwZV0obmV3IFZpc3VhbGl6ZXIuZGFuY2VUeXBlc1tkYW5jZS50eXBlXShkYW5jZS5wYXJhbXMpLCBuZXcgVmlzdWFsaXplci5kYW5jZU1hdGVyaWFsVHlwZXNbZGFuY2VNYXRlcmlhbC50eXBlXShkYW5jZU1hdGVyaWFsLnBhcmFtcyksIGRhbmNlci5wYXJhbXMpXG4gICAgICBAc2NlbmUuYWRkIEBkYW5jZXJzW2lkXS5ib2R5XG4gICAgICByZXR1cm5cbiAgICBlbHNlXG4gICAgICByZXR1cm5cblxuICBnZXREYW5jZXI6IChpZCkgLT5cbiAgICBAZGFuY2Vyc1tpZF1cblxuXG4gICMgUmVuZGVyIHRoZSBzY2VuZSBieSBnb2luZyB0aHJvdWdoIHRoZSBBdWRpb09iamVjdCBhcnJheSBhbmQgY2FsbGluZyB1cGRhdGUoYXVkaW9FdmVudCkgb24gZWFjaCBvbmVcbiAgcmVuZGVyOiAoYXVkaW9XaW5kb3cpIC0+XG4gICAgd2hpbGUgQGNob3Jlb2dyYXBoeVF1ZXVlLmxlbmd0aCgpID4gMFxuICAgICAgQGV4ZWN1dGVDaG9yZW9ncmFwaHkgQGNob3Jlb2dyYXBoeVF1ZXVlLnNoaWZ0KClcbiAgICAjIENyZWF0ZSBldmVudFxuICAgIGZvciBpZCBpbiBPYmplY3Qua2V5cyhAZGFuY2VycylcbiAgICAgIEBkYW5jZXJzW2lkXS51cGRhdGUoYXVkaW9XaW5kb3cpXG5cbiAgIyBSZW1vdmVzIHRoZSBsYXN0IGRhbmNlciwgcmV0dXJucyB0aGUgZGFuY2VyJ3MgZGFuY2VcbiAgcmVtb3ZlTGFzdERhbmNlcjogKCkgLT5cbiAgICBwcmV2RGFuY2VyID0gQGRhbmNlcnMucG9wKClcbiAgICBAc2NlbmUucmVtb3ZlKHByZXZEYW5jZXIuYm9keSkgXG4gICAgcmV0dXJuIHByZXZEYW5jZXIuZGFuY2UiLCJyZXF1aXJlICcuL1BsYXllci5jb2ZmZWUnXG5yZXF1aXJlICcuL0Nob3Jlb2dyYXBoeVJvdXRpbmUuY29mZmVlJ1xucmVxdWlyZSAnLi9kYW5jZXJzL0N1YmVEYW5jZXIuY29mZmVlJ1xucmVxdWlyZSAnLi9kYW5jZXJzL1NwaGVyZURhbmNlci5jb2ZmZWUnXG5yZXF1aXJlICcuL2RhbmNlcnMvUG9pbnRDbG91ZERhbmNlci5jb2ZmZWUnXG5yZXF1aXJlICcuL2RhbmNlcy9TY2FsZURhbmNlLmNvZmZlZSdcbnJlcXVpcmUgJy4vZGFuY2VzL1Bvc2l0aW9uRGFuY2UuY29mZmVlJ1xucmVxdWlyZSAnLi9kYW5jZXMvUm90YXRlRGFuY2UuY29mZmVlJ1xucmVxdWlyZSAnLi9kYW5jZU1hdGVyaWFscy9Db2xvckRhbmNlTWF0ZXJpYWwuY29mZmVlJ1xucmVxdWlyZSAnLi9kYW5jZU1hdGVyaWFscy9TaW1wbGVGcmVxdWVuY3lTaGFkZXIuY29mZmVlJ1xuXG5jbGFzcyB3aW5kb3cuVmlzdWFsaXplclxuICAjIEdldCB0aG9zZSBrZXlzIHNldCB1cFxuICBrZXlzOiB7IFBBVVNFOiAzMiwgTkVYVDogNzggfVxuXG4gICMgU2V0IHVwIHRoZSBzY2VuZSBiYXNlZCBvbiBhIE1haW4gb2JqZWN0IHdoaWNoIGNvbnRhaW5zIHRoZSBzY2VuZS5cbiAgY29uc3RydWN0b3I6IChAdmlld2VyLCBAaW50ZXJmYWNlKSAtPlxuICAgIEBwbGF5ZXIgPSBuZXcgUGxheWVyKClcblxuICAgICMgTG9hZCB0aGUgc2FtcGxlIGF1ZGlvXG4gICAgIyBAcGxheSgnYXVkaW8vR28ubXAzJylcbiAgICAjIEBwbGF5KCdhdWRpby9HbGFzc2VyLm1wMycpXG4gICAgIyBAcGxheSgnYXVkaW8vT25NeU1pbmQubXAzJylcblxuICAgIEBwbGF5ZXIuY3JlYXRlTGl2ZUlucHV0KClcblxuICAgIEBjaG9yZW9ncmFwaHlSb3V0aW5lID0gbmV3IENob3Jlb2dyYXBoeVJvdXRpbmUoQClcblxuICAgIEBpbnRlcmZhY2Uuc2V0dXBQb3B1cCgpXG4gICAgQGludGVyZmFjZS5zZXR1cChAcGxheWVyLCBAY2hvcmVvZ3JhcGh5Um91dGluZSwgQHZpZXdlcilcblxuICAgIEBjaG9yZW9ncmFwaHlSb3V0aW5lLnJlZnJlc2hSb3V0aW5lcyAoKSA9PlxuICAgICAgQGNob3Jlb2dyYXBoeVJvdXRpbmUubG9hZFJvdXRpbmVCeUlkIDEsICgpID0+XG4gICAgICAgIEBjaG9yZW9ncmFwaHlSb3V0aW5lLnF1ZXVlUm91dGluZSgxKVxuICAgICAgICBAY2hvcmVvZ3JhcGh5Um91dGluZS5wbGF5TmV4dCgpXG4gICAgICBAaW50ZXJmYWNlLnNldHVwUm91dGluZVN0YWdlKClcblxuICByZWNlaXZlQ2hvcmVvZ3JhcGh5OiAobW92ZSkgLT5cbiAgICBAdmlld2VyLnJlY2VpdmVDaG9yZW9ncmFwaHkgbW92ZVxuICAgIGlmIEBwb3B1cD8gdGhlbiBAcG9wdXAucG9zdE1lc3NhZ2UoQHdyYXBNZXNzYWdlKCdjaG9yZW9ncmFwaHknLCBtb3ZlKSwgQGRvbWFpbilcblxuICByZW5kZXI6ICgpIC0+XG4gICAgaWYgIUBwbGF5ZXIucGxheWluZ1xuICAgICAgcmV0dXJuXG5cbiAgICBAcGxheWVyLnVwZGF0ZSgpXG5cbiAgICBAdmlld2VyLnJlbmRlcihAcGxheWVyLmF1ZGlvV2luZG93KVxuICAgIGlmIEBwb3B1cD8gdGhlbiBAcG9wdXAucG9zdE1lc3NhZ2UoQHdyYXBNZXNzYWdlKCdyZW5kZXInLCBAcGxheWVyLmF1ZGlvV2luZG93KSwgQGRvbWFpbilcblxuICB3cmFwTWVzc2FnZTogKHR5cGUsIGRhdGEpIC0+XG4gICAgdHlwZTogdHlwZVxuICAgIGRhdGE6IGRhdGFcblxuICAjRXZlbnQgbWV0aG9kc1xuICBvbktleURvd246IChldmVudCkgLT5cbiAgICBzd2l0Y2ggZXZlbnQua2V5Q29kZVxuICAgICAgd2hlbiBAa2V5cy5QQVVTRVxuICAgICAgICBAcGxheWVyLnBhdXNlKClcbiAgICAgIHdoZW4gQGtleXMuTkVYVFxuICAgICAgICBAY2hvcmVvZ3JhcGh5Um91dGluZS5wbGF5TmV4dCgpXG5cbiAgQGRhbmNlclR5cGVzOlxuICAgIEN1YmVEYW5jZXI6IEN1YmVEYW5jZXJcbiAgICBTcGhlcmVEYW5jZXI6IFNwaGVyZURhbmNlclxuICAgIFBvaW50Q2xvdWREYW5jZXI6IFBvaW50Q2xvdWREYW5jZXJcblxuICBAZGFuY2VUeXBlczpcbiAgICBTY2FsZURhbmNlOiBTY2FsZURhbmNlXG4gICAgUG9zaXRpb25EYW5jZTogUG9zaXRpb25EYW5jZVxuICAgIFJvdGF0ZURhbmNlOiBSb3RhdGVEYW5jZVxuXG4gIEBkYW5jZU1hdGVyaWFsVHlwZXM6XG4gICAgQ29sb3JEYW5jZU1hdGVyaWFsOiBDb2xvckRhbmNlTWF0ZXJpYWxcbiAgICBTaW1wbGVGcmVxdWVuY3lTaGFkZXI6IFNpbXBsZUZyZXF1ZW5jeVNoYWRlclxuIiwiY2xhc3Mgd2luZG93LkNvbG9yRGFuY2VNYXRlcmlhbFxuICBAcGFyYW1zOiBcbiAgICBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdzbW9vdGhpbmdGYWN0b3InLFxuICAgICAgICBkZWZhdWx0OiAwLjVcbiAgICAgIH0sIFxuICAgICAge1xuICAgICAgICBuYW1lOiAnbWluTCcsXG4gICAgICAgIGRlZmF1bHQ6IDAuMVxuICAgICAgfSwgXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdtaW5TJyxcbiAgICAgICAgZGVmYXVsdDogMC4zXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnd2lyZWZyYW1lJ1xuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgfVxuICAgIF1cblxuICBAbmFtZTogXCJDb2xvckRhbmNlTWF0ZXJpYWxcIlxuXG4gIGNvbnN0cnVjdG9yOiAoQG9wdGlvbnMpIC0+XG4gICAgaWYgQG9wdGlvbnM/IHRoZW4geyBAc21vb3RoaW5nRmFjdG9yLCBAbWluTCwgQG1pblMsIEB3aXJlZnJhbWUgfSA9IEBvcHRpb25zXG4gICAgQHNtb290aGluZ0ZhY3RvciA/PSAwLjVcbiAgICBAbWluTCA/PSAwLjFcbiAgICBAbWluUyA/PSAwLjNcbiAgICBAd2lyZWZyYW1lID89IGZhbHNlXG4gICAgQGNvbG9yID0gbmV3IFRIUkVFLkNvbG9yKDEuMCwgMCwgMClcbiAgICBAbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IGNvbG9yOiAweDAwMDAwLCB3aXJlZnJhbWU6IEB3aXJlZnJhbWUgfSlcbiAgICBAYXBwbGllZENvbG9yID0gQGNvbG9yLmNsb25lKClcblxuICB1cGRhdGU6IChhdWRpb1dpbmRvdywgZGFuY2VyKSAtPlxuXG4gICAgbWF4VmFsdWUgPSAwXG4gICAgbWF4SW5kZXggPSAtMVxuICAgIG1heEltcG9ydGFudEluZGV4ID0gMVxuICAgIGZvciBpIGluIFsxLi5BdWRpb1dpbmRvdy5idWZmZXJTaXplXVxuICAgICAgZnJlcSA9IGF1ZGlvV2luZG93LmZyZXF1ZW5jeUJ1ZmZlcltpXVxuICAgICAgdmFsdWUgPSBmcmVxICogaVxuICAgICAgaWYgKHZhbHVlID4gbWF4VmFsdWUpXG4gICAgICAgIG1heFZhbHVlID0gdmFsdWVcbiAgICAgICAgbWF4SW5kZXggPSBpXG5cbiAgICBvbGRDb2xvckhTTCA9IEBhcHBsaWVkQ29sb3IuZ2V0SFNMKClcblxuICAgIG5ld0NvbG9yUyA9IG1heEluZGV4IC8gQXVkaW9XaW5kb3cuYnVmZmVyU2l6ZTtcbiAgICBuZXdDb2xvclMgPSBAc21vb3RoaW5nRmFjdG9yICogbmV3Q29sb3JTICsgKDEgLSBAc21vb3RoaW5nRmFjdG9yKSAqIG9sZENvbG9ySFNMLnNcblxuICAgIG5ld0NvbG9yTCA9IGF1ZGlvV2luZG93LmF2ZXJhZ2VEYlxuICAgIG5ld0NvbG9yTCA9IEBzbW9vdGhpbmdGYWN0b3IgKiBuZXdDb2xvckwgKyAoMSAtIEBzbW9vdGhpbmdGYWN0b3IpICogb2xkQ29sb3JIU0wubFxuXG4gICAgbCA9IEBtaW5MICsgbmV3Q29sb3JMICogKDEuMCAtIEBtaW5MKVxuICAgIHMgPSBAbWluUyArIG5ld0NvbG9yUyAqICgxLjAgLSBAbWluUylcblxuICAgIG5ld0NvbG9ySCA9ICgzNjAgKiAoYXVkaW9XaW5kb3cudGltZSAvIDEwMDAwKSAlIDM2MCkgLyAzNjBcblxuICAgIGhzbCA9IEBjb2xvci5nZXRIU0woKVxuICAgIEBhcHBsaWVkQ29sb3Iuc2V0SFNMKG5ld0NvbG9ySCwgcywgbClcblxuICAgIGlmIGRhbmNlcj9cbiAgICAgIGlmIGRhbmNlci5ib2R5Lm1hdGVyaWFsLmVtaXNzaXZlP1xuICAgICAgICBkYW5jZXIuYm9keS5tYXRlcmlhbC5lbWlzc2l2ZS5jb3B5KEBhcHBsaWVkQ29sb3IpXG5cbiAgICAgIGRhbmNlci5ib2R5Lm1hdGVyaWFsLmNvbG9yLmNvcHkoQGFwcGxpZWRDb2xvcilcbiIsImNsYXNzIHdpbmRvdy5TaW1wbGVGcmVxdWVuY3lTaGFkZXJcbiAgQHBhcmFtczogW11cblxuICBAbmFtZTogXCJTaW1wbGVGcmVxdWVuY3lTaGFkZXJcIlxuICBcbiAgY29uc3RydWN0b3I6IChzaGFkZXJMb2FkZXIpIC0+XG4gICAgQHRhcmdldCA9IDEyOFxuICAgIEBzaXplID0gMTAyNFxuICAgIEBzaGFkZXJMb2FkZXIgPSBzaGFkZXJMb2FkZXJcbiAgICBAbmV3VGV4QXJyYXkgPSBuZXcgVWludDhBcnJheShAdGFyZ2V0ICogQHRhcmdldCAqIDQpXG5cbiAgbG9hZFNoYWRlcjogKG5leHQpIC0+XG4gICAgQHNoYWRlckxvYWRlci5sb2FkICdzaW1wbGVfZnJlcXVlbmN5JywgKHNoYWRlcikgPT5cbiAgICAgIHNoYWRlci51bmlmb3JtcyA9IHtcbiAgICAgICAgZnJlcVRleHR1cmU6IHt0eXBlOiBcInRcIiwgdmFsdWU6IEF1ZGlvV2luZG93LmJ1ZmZlclNpemV9XG4gICAgICAgIHJlc29sdXRpb246IHsgdHlwZTogXCJ2MlwiLCB2YWx1ZTogbmV3IFRIUkVFLlZlY3RvcjIoMTI4LCAxMjgpfVxuICAgICAgfVxuXG4gICAgICBAbWF0ZXJpYWwgPSBuZXcgVEhSRUUuU2hhZGVyTWF0ZXJpYWwoc2hhZGVyKVxuICAgICAgQG1hdGVyaWFsLnNpZGUgPSBUSFJFRS5Eb3VibGVTaWRlXG4gICAgICBAbWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlXG4gICAgICBuZXh0KEApXG5cblxuICB1cGRhdGU6IChhdWRpb1dpbmRvdywgZGFuY2VyKSAtPlxuICAgIGRhbmNlci5ib2R5Lm1hdGVyaWFsLnVuaWZvcm1zLmZyZXFUZXh0dXJlLnZhbHVlID0gQHJlZHVjZUFycmF5KGF1ZGlvV2luZG93LmZyZXF1ZW5jeUJ1ZmZlcilcblxuICByZWR1Y2VBcnJheTogKGZyZXFCdWYpIC0+XG5cbiAgICBuZXdCdWYgPSBuZXcgQXJyYXkoQHRhcmdldClcblxuICAgIG1vdmluZ1N1bSA9IDBcbiAgICBmbG9vcmVkUmF0aW8gPSBNYXRoLmZsb29yKEBzaXplIC8gQHRhcmdldClcbiAgICBmb3IgaSBpbiBbMS4uLkBzaXplXVxuICAgICAgbW92aW5nU3VtICs9IGZyZXFCdWZbaV1cblxuICAgICAgaWYgKChpICsgMSkgJSBmbG9vcmVkUmF0aW8pID09IDBcbiAgICAgICAgbmV3QnVmW01hdGguZmxvb3IoaSAgLyBmbG9vcmVkUmF0aW8pXSA9IG1vdmluZ1N1bSAvIGZsb29yZWRSYXRpb1xuICAgICAgICBtb3ZpbmdTdW0gPSAwXG5cblxuICAgIGZvciBpIGluIFswLi4uQHRhcmdldF1cbiAgICAgIGZvciBqIGluIFswLi4uQHRhcmdldF1cbiAgICAgICAgYmFzZUluZGV4ID0gaSAqIEB0YXJnZXQgKiA0ICsgaiAqIDQ7XG4gICAgICAgIGlmIG5ld0J1ZltqXSA+IGkgKiAyXG4gICAgICAgICAgQG5ld1RleEFycmF5W2Jhc2VJbmRleF0gPSAyNTVcbiAgICAgICAgICBAbmV3VGV4QXJyYXlbYmFzZUluZGV4ICsgMV0gPSAyNTVcbiAgICAgICAgICBAbmV3VGV4QXJyYXlbYmFzZUluZGV4ICsgMl0gPSAyNTVcbiAgICAgICAgICBAbmV3VGV4QXJyYXlbYmFzZUluZGV4ICsgM10gPSAyNTVcbiAgICAgICAgZWxzZSBcbiAgICAgICAgICBAbmV3VGV4QXJyYXlbYmFzZUluZGV4XSA9IDBcbiAgICAgICAgICBAbmV3VGV4QXJyYXlbYmFzZUluZGV4ICsgMV0gPSAwXG4gICAgICAgICAgQG5ld1RleEFycmF5W2Jhc2VJbmRleCArIDJdID0gMFxuICAgICAgICAgIEBuZXdUZXhBcnJheVtiYXNlSW5kZXggKyAzXSA9IDBcblxuICAgIHRleHR1cmUgPSBuZXcgVEhSRUUuRGF0YVRleHR1cmUoQG5ld1RleEFycmF5LCBAdGFyZ2V0LCBAdGFyZ2V0LCBUSFJFRS5SR0JBRm9ybWF0LCBUSFJFRS5VbnNpZ25lZEJ5dGUpXG4gICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWVcbiAgICB0ZXh0dXJlLmZsaXBZID0gZmFsc2VcbiAgICB0ZXh0dXJlLmdlbmVyYXRlTWlwbWFwcyA9IGZhbHNlXG4gICAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5MaW5lYXJGaWx0ZXJcbiAgICB0ZXh0dXJlLm1pbkZpbHRlciA9IFRIUkVFLkxpbmVhckZpbHRlclxuICAgIHRleHR1cmUudW5wYWNrQWxpZ25tZW50ID0gMVxuICAgIHRleHR1cmUud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZ1xuICAgIHRleHR1cmUud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZ1xuICAgIHRleHR1cmUuYW5pc290cm9weSA9IDRcblxuICAgIHJldHVybiB0ZXh0dXJlIiwicmVxdWlyZSAnLi9EYW5jZXIuY29mZmVlJ1xuXG5jbGFzcyB3aW5kb3cuQ3ViZURhbmNlciBleHRlbmRzIERhbmNlclxuICBAbmFtZTogXCJDdWJlRGFuY2VyXCJcbiAgXG4gIGNvbnN0cnVjdG9yOiAoZGFuY2UsIGRhbmNlTWF0ZXJpYWwsIEBvcHRpb25zKSAtPlxuICAgIGlmIEBvcHRpb25zPyB0aGVuIHsgcG9zaXRpb24sIHNjYWxlIH0gPSBAb3B0aW9uc1xuICAgIHN1cGVyKG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSgxLCAxLCAxKSwgZGFuY2UsIGRhbmNlTWF0ZXJpYWwsIHBvc2l0aW9uLCBzY2FsZSkiLCIjIENvbnRhaW5zIGFuIE9iamVjdDNEIG9mIHNvbWUga2luZCwgd2l0aCBhIG1lc2ggZGV0ZXJtaW5lZCBieSBzdWJjbGFzc2VzLlxuIyBJdCBoYXMgYW4gRWZmZWN0IGFuZCBhIERhbmNlTWF0ZXJpYWwgd2hpY2ggb3BlcmF0ZSBvbiB0aGUgdHJhbnNmb3JtIGFuZCB0aGUgbWF0ZXJpYWwgb2YgdGhlIE9iamVjdDNEIHJlc3BlY3Rpdmx5XG5cbmNsYXNzIHdpbmRvdy5EYW5jZXJcbiAgQHR5cGUgPSBEYW5jZXJcbiAgQHBhcmFtcyA9IFtcbiAgICB7XG4gICAgICBuYW1lOiAncG9zaXRpb24nXG4gICAgICBkZWZhdWx0OiBbMCwgMCwgMF1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdzY2FsZSdcbiAgICAgIGRlZmF1bHQ6IFsxLCAxLCAxXVxuICAgIH1cbiAgXVxuXG4gIGNvbnN0cnVjdG9yOiAoZ2VvbWV0cnksIGRhbmNlLCBkYW5jZU1hdGVyaWFsLCBwb3NpdGlvbiwgc2NhbGUpIC0+XG4gICAgIyBDb25zdHJ1Y3QgYSBkZWZhdWx0IERhbmNlciB1c2luZyBAYm9keSBhcyB0aGUgT2JqZWN0M0RcbiAgICBtYXRlcmlhbCA9IGRhbmNlTWF0ZXJpYWwubWF0ZXJpYWw7XG4gICAgQGRhbmNlID0gZGFuY2VcbiAgICBAZGFuY2VNYXRlcmlhbCA9IGRhbmNlTWF0ZXJpYWw7XG4gICAgQGJvZHkgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgIGlmIHBvc2l0aW9uPyAmJiBwb3NpdGlvbi5sZW5ndGggPT0gMyB0aGVuIEBib2R5LnBvc2l0aW9uLnNldChwb3NpdGlvblswXSwgcG9zaXRpb25bMV0sIHBvc2l0aW9uWzJdKVxuICAgIGlmIHNjYWxlPyAmJiBzY2FsZS5sZW5ndGggPT0gMyB0aGVuIEBib2R5LnNjYWxlLnNldChzY2FsZVswXSwgc2NhbGVbMV0sIHNjYWxlWzJdKVxuXG4gIGdlb21ldHJ5OiAoKSAtPlxuICAgIG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDEsIDEpXG5cbiAgcmVzZXQ6ICgpIC0+XG4gICAgQGRhbmNlLnJlc2V0KEApXG5cbiAgdXBkYXRlOiAoYXVkaW9XaW5kb3cpIC0+XG4gICAgIyBSZWFjdCB0byB0aGUgYXVkaW8gZXZlbnQgYnkgcHVtcGluZyBpdCB0aHJvdWdoIEVmZmVjdCBhbmQgU2hhZGVyXG4gICAgQGRhbmNlLnVwZGF0ZShhdWRpb1dpbmRvdywgQClcbiAgICBAZGFuY2VNYXRlcmlhbC51cGRhdGUoYXVkaW9XaW5kb3csIEApIiwicmVxdWlyZSAnLi9EYW5jZXIuY29mZmVlJ1xuXG5jbGFzcyB3aW5kb3cuUG9pbnRDbG91ZERhbmNlciBleHRlbmRzIERhbmNlclxuICBAcGFyYW1zOiBcbiAgICBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdtaW5EaXN0YW5jZScsXG4gICAgICAgIGRlZmF1bHQ6IDUuMFxuICAgICAgfSwgXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdtYXhEaXN0YW5jZScsXG4gICAgICAgIGRlZmF1bHQ6IDEwLjBcbiAgICAgIH0sIFxuICAgICAge1xuICAgICAgICBuYW1lOiAnY291bnQnLFxuICAgICAgICBkZWZhdWx0OiA1MDBcbiAgICAgIH1cbiAgICBdXG5cbiAgQG5hbWU6IFwiUG9pbnRDbG91ZERhbmNlclwiXG5cbiAgY29uc3RydWN0b3I6IChAZGFuY2UsIEBkYW5jZU1hdGVyaWFsLCBAb3B0aW9ucykgLT5cbiAgICBpZiBAb3B0aW9ucz8gdGhlbiB7IEBtaW5EaXN0YW5jZSwgQG1heERpc3RhbmNlLCBAY291bnQgfSA9IEBvcHRpb25zXG4gICAgQG1pbkRpc3RhbmNlID89IDUuMFxuICAgIEBtYXhEaXN0YW5jZSA/PSAxMC4wXG4gICAgQGNvdW50ID89IDUwMFxuXG4gICAgZGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuICAgIHBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMClcblxuICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KClcbiAgICBwb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KEBjb3VudCAqIDMpXG5cbiAgICBmb3IgaSBpbiBbMC4uLkBjb3VudF1cbiAgICAgIGRpcmVjdGlvbi5zZXQoTWF0aC5yYW5kb20oKSAtIDAuNSwgTWF0aC5yYW5kb20oKSAtIDAuNSwgTWF0aC5yYW5kb20oKS0gMC41KVxuICAgICAgZGlyZWN0aW9uLm5vcm1hbGl6ZSgpXG4gICAgICBkaXJlY3Rpb24ubXVsdGlwbHlTY2FsYXIoQG1pbkRpc3RhbmNlICsgTWF0aC5yYW5kb20oKSAqIChAbWF4RGlzdGFuY2UgLSBAbWluRGlzdGFuY2UpKVxuXG4gICAgICBwb3NpdGlvbnNbMyAqIGldID0gcG9zaXRpb24ueCArIGRpcmVjdGlvbi54XG4gICAgICBwb3NpdGlvbnNbMyAqIGkgKyAxXSA9IHBvc2l0aW9uLnkgKyBkaXJlY3Rpb24ueVxuICAgICAgcG9zaXRpb25zWzMgKiBpICsgMl0gPSBwb3NpdGlvbi56ICsgZGlyZWN0aW9uLnpcblxuICAgIGdlb21ldHJ5LmFkZEF0dHJpYnV0ZSgncG9zaXRpb24nLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKHBvc2l0aW9ucywgMykpXG4gICAgZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KClcblxuICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLlBvaW50Q2xvdWRNYXRlcmlhbCh7IHNpemU6IDAuNSwgY29sb3I6IEBkYW5jZU1hdGVyaWFsLmNvbG9yIH0pXG4gICAgQGJvZHkgPSBuZXcgVEhSRUUuUG9pbnRDbG91ZCggZ2VvbWV0cnksIG1hdGVyaWFsICkiLCJyZXF1aXJlICcuL0RhbmNlci5jb2ZmZWUnXG5cbmNsYXNzIHdpbmRvdy5TcGhlcmVEYW5jZXIgZXh0ZW5kcyBEYW5jZXJcbiAgQG5hbWU6IFwiU3BoZXJlRGFuY2VyXCJcblxuICBjb25zdHJ1Y3RvcjogKGRhbmNlLCBkYW5jZU1hdGVyaWFsLCBAb3B0aW9ucykgLT5cbiAgICBpZiBAb3B0aW9ucz8gdGhlbiB7IHBvc2l0aW9uLCBzY2FsZSB9ID0gQG9wdGlvbnNcbiAgICBzdXBlcihuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMSwgMzIsIDI0KSwgZGFuY2UsIGRhbmNlTWF0ZXJpYWwsIHBvc2l0aW9uLCBzY2FsZSkiLCJjbGFzcyB3aW5kb3cuUG9zaXRpb25EYW5jZVxuICBAcGFyYW1zOiBcbiAgICBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdzbW9vdGhpbmdGYWN0b3InXG4gICAgICAgIGRlZmF1bHQ6IDAuMlxuICAgICAgfSwgXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdkaXJlY3Rpb24nXG4gICAgICAgIGRlZmF1bHQ6IFswLCAxLCAwXVxuICAgICAgfVxuICAgIF1cblxuICBAbmFtZTogXCJQb3NpdGlvbkRhbmNlXCJcblxuICBjb25zdHJ1Y3RvcjogKEBvcHRpb25zKSAtPlxuICAgIGlmIEBvcHRpb25zPyB0aGVuIHsgQHNtb290aGluZ0ZhY3RvciwgZGlyZWN0aW9uIH0gPSBAb3B0aW9uc1xuICAgIEBzbW9vdGhpbmdGYWN0b3IgPz0gMC4yXG4gICAgXG4gICAgZGlyZWN0aW9uID89IFswLCAxLCAwXVxuICAgIEBkaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMyhkaXJlY3Rpb25bMF0sIGRpcmVjdGlvblsxXSwgZGlyZWN0aW9uWzJdKVxuXG4gICAgQGRpcmVjdGlvbkNvcHkgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgIEBwb3NpdGlvbkNoYW5nZSA9IDBcblxuICB1cGRhdGU6IChhdWRpb1dpbmRvdywgZGFuY2VyKSAtPlxuICAgIGJhc2VQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgQGRpcmVjdGlvbkNvcHkuY29weShAZGlyZWN0aW9uKTtcbiAgICBiYXNlUG9zaXRpb24uc3ViVmVjdG9ycyhkYW5jZXIuYm9keS5wb3NpdGlvbiwgQGRpcmVjdGlvbkNvcHkubXVsdGlwbHlTY2FsYXIoQHBvc2l0aW9uQ2hhbmdlKSlcblxuICAgIHNtb290aGluZ0ZhY3RvciA9IGlmIGF1ZGlvV2luZG93LmF2ZXJhZ2VEYiA8IEBwb3NpdGlvbkNoYW5nZSB0aGVuIEBzbW9vdGhpbmdGYWN0b3IgZWxzZSBNYXRoLm1heCgxLCBAc21vb3RoaW5nRmFjdG9yICogNClcbiAgICBAcG9zaXRpb25DaGFuZ2UgPSBhdWRpb1dpbmRvdy5hdmVyYWdlRGIgKiBzbW9vdGhpbmdGYWN0b3IgKyAoMSAtIHNtb290aGluZ0ZhY3RvcikgKiBAcG9zaXRpb25DaGFuZ2VcblxuICAgIEBkaXJlY3Rpb25Db3B5LmNvcHkoQGRpcmVjdGlvbilcbiAgICBuZXdQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKClcbiAgICBuZXdQb3NpdGlvbi5hZGRWZWN0b3JzKGJhc2VQb3NpdGlvbiwgQGRpcmVjdGlvbkNvcHkubXVsdGlwbHlTY2FsYXIoQHBvc2l0aW9uQ2hhbmdlKSlcblxuICAgIGRhbmNlci5ib2R5LnBvc2l0aW9uLnNldChuZXdQb3NpdGlvbi54LCBuZXdQb3NpdGlvbi55LCBuZXdQb3NpdGlvbi56KVxuXG4gIHJlc2V0OiAoZGFuY2VyKSAtPlxuICAgIEBkaXJlY3Rpb25Db3B5LmNvcHkoQGRpcmVjdGlvbik7XG4gICAgYmFzZVBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICBiYXNlUG9zaXRpb24uc3ViVmVjdG9ycyhkYW5jZXIuYm9keS5wb3NpdGlvbiwgQGRpcmVjdGlvbkNvcHkubXVsdGlwbHlTY2FsYXIoQHBvc2l0aW9uQ2hhbmdlKSlcbiAgICBkYW5jZXIuYm9keS5wb3NpdGlvbi5zZXQoYmFzZVBvc2l0aW9uLngsIGJhc2VQb3NpdGlvbi55LCBiYXNlUG9zaXRpb24ueikiLCJjbGFzcyB3aW5kb3cuUm90YXRlRGFuY2VcbiAgQG5hbWU6IFwiUm90YXRlRGFuY2VcIlxuXG4gIEBwYXJhbXM6XG4gICAgW1xuICAgICAge1xuICAgICAgICBuYW1lOiAnYXhpcydcbiAgICAgICAgZGVmYXVsdDogWzAsIDEsIDBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnbWluUm90YXRpb24nXG4gICAgICAgIGRlZmF1bHQ6IDAuMDVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdzcGVlZCdcbiAgICAgICAgZGVmYXVsdDogMVxuICAgICAgfSxcbiAgICBdXG5cbiAgY29uc3RydWN0b3I6IChAb3B0aW9ucykgLT5cbiAgICBpZiBAb3B0aW9ucz8gdGhlbiB7IGF4aXMsIEBtaW5Sb3RhdGlvbiwgQHNwZWVkIH0gPSBAb3B0aW9uc1xuICAgIEBtaW5Sb3RhdGlvbiA/PSAwLjA1XG4gICAgQHNwZWVkID89IDFcblxuICAgIGF4aXMgPz0gWzAsIDEsIDBdXG4gICAgQGF4aXMgPSBuZXcgVEhSRUUuVmVjdG9yMyhheGlzWzBdLCBheGlzWzFdLCBheGlzWzJdKVxuXG4gICAgQHRpbWUgPSAwXG5cbiAgdXBkYXRlOiAoYXVkaW9XaW5kb3csIGRhbmNlcikgLT5cbiAgICBhYnNSb3RhdGlvbiA9IGF1ZGlvV2luZG93LmF2ZXJhZ2VEYiAqIEBzcGVlZFxuXG4gICAgZGFuY2VyLmJvZHkucm90YXRlT25BeGlzIEBheGlzLCAoQG1pblJvdGF0aW9uICsgYWJzUm90YXRpb24gKiAoMC45KSkgKiBNYXRoLlBJICogKChhdWRpb1dpbmRvdy50aW1lIC0gQHRpbWUpIC8gMTAwMClcblxuICAgIEB0aW1lID0gYXVkaW9XaW5kb3cudGltZVxuXG4gIHJlc2V0OiAoZGFuY2VyKSAtPlxuICAgIGRhbmNlci5ib2R5LnJvdGF0aW9uLnNldCgwLCAwLCAwKVxuIiwiIyBDb250cm9scyB0aGUgbWVzaCBvZiB0aGUgcHJvdmlkZWQgRGFuY2VyJ3MgYm9keVxuY2xhc3Mgd2luZG93LlNjYWxlRGFuY2VcbiAgQHBhcmFtczpcbiAgICBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdzbW9vdGhpbmdGYWN0b3InXG4gICAgICAgIGRlZmF1bHQ6IDAuNVxuICAgICAgfSwgXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdtaW4nXG4gICAgICAgIGRlZmF1bHQ6IFswLjUsIDAuNSwgMC41XVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ21heCdcbiAgICAgICAgZGVmYXVsdDogWzEsIDEsIDFdXG4gICAgICB9XG4gICAgXVxuXG4gIEBuYW1lOiBcIlNjYWxlRGFuY2VcIlxuXG4gIGNvbnN0cnVjdG9yOiAoQG9wdGlvbnMpIC0+XG4gICAgaWYgQG9wdGlvbnM/IHRoZW4geyBAc21vb3RoaW5nRmFjdG9yLCBtaW4sIG1heCB9ID0gQG9wdGlvbnNcbiAgICBAc21vb3RoaW5nRmFjdG9yID89IDAuNVxuICAgIEBhdmVyYWdlRGIgPSAwXG4gICAgQG1pbiA9IGlmIG1pbiB0aGVuIG5ldyBUSFJFRS5WZWN0b3IzKG1pblswXSwgbWluWzFdLCBtaW5bMl0pIGVsc2UgbmV3IFRIUkVFLlZlY3RvcjMoMC41LCAwLjUsIDAuNSlcbiAgICBAbWF4ID0gaWYgbWF4IHRoZW4gbmV3IFRIUkVFLlZlY3RvcjMobWF4WzBdLCBtYXhbMV0sIG1heFsyXSkgZWxzZSBuZXcgVEhSRUUuVmVjdG9yMygxLCAxLCAxKVxuICAgIEBzY2FsZSA9IG5ldyBUSFJFRS5WZWN0b3IzKClcblxuICB1cGRhdGU6IChhdWRpb1dpbmRvdywgZGFuY2VyKSAtPlxuICAgICMgdXBkYXRlIHRoZSBEYW5jZXIncyBib2R5IG1lc2ggdG8gcmVmbGVjdCB0aGUgYXVkaW8gZXZlbnRcbiAgICBpZiAoYXVkaW9XaW5kb3cuYXZlcmFnZURiIDwgQGF2ZXJhZ2VEYilcbiAgICBcdEBhdmVyYWdlRGIgPSBhdWRpb1dpbmRvdy5hdmVyYWdlRGIgKiBAc21vb3RoaW5nRmFjdG9yICsgKDEgLSBAc21vb3RoaW5nRmFjdG9yKSAqIEBhdmVyYWdlRGJcbiAgICBlbHNlIFxuICAgIFx0c21vb3RoaW5nRmFjdG9yID0gTWF0aC5tYXgoMSwgQHNtb290aGluZ0ZhY3RvciAqIDQpXG4gICAgXHRAYXZlcmFnZURiID0gYXVkaW9XaW5kb3cuYXZlcmFnZURiICogc21vb3RoaW5nRmFjdG9yICsgKDEgLSBzbW9vdGhpbmdGYWN0b3IpICogQGF2ZXJhZ2VEYlxuXG4gICAgQHNjYWxlLmNvcHkoQG1pbilcblxuICAgIEBzY2FsZS5sZXJwKEBtYXgsIEBhdmVyYWdlRGIpXG5cbiAgICBkYW5jZXIuYm9keS5zY2FsZS5zZXQoQHNjYWxlLngsIEBzY2FsZS55LCBAc2NhbGUueilcblx0XG4gIHJlc2V0OiAoZGFuY2VyKSAtPlxuICBcdGRhbmNlci5ib2R5LnNjYWxlLnNldCgxLCAxLCAxKVxuIiwiLyoqXG4gKiBAYXV0aG9yIHFpYW8gLyBodHRwczovL2dpdGh1Yi5jb20vcWlhb1xuICogQGF1dGhvciBtcmRvb2IgLyBodHRwOi8vbXJkb29iLmNvbVxuICogQGF1dGhvciBhbHRlcmVkcSAvIGh0dHA6Ly9hbHRlcmVkcXVhbGlhLmNvbS9cbiAqIEBhdXRob3IgV2VzdExhbmdsZXkgLyBodHRwOi8vZ2l0aHViLmNvbS9XZXN0TGFuZ2xleVxuICogQGF1dGhvciBlcmljaDY2NiAvIGh0dHA6Ly9lcmljaGFpbmVzLmNvbVxuICovXG4vKmdsb2JhbCBUSFJFRSwgY29uc29sZSAqL1xuXG4vLyBUaGlzIHNldCBvZiBjb250cm9scyBwZXJmb3JtcyBvcmJpdGluZywgZG9sbHlpbmcgKHpvb21pbmcpLCBhbmQgcGFubmluZy4gSXQgbWFpbnRhaW5zXG4vLyB0aGUgXCJ1cFwiIGRpcmVjdGlvbiBhcyArWSwgdW5saWtlIHRoZSBUcmFja2JhbGxDb250cm9scy4gVG91Y2ggb24gdGFibGV0IGFuZCBwaG9uZXMgaXNcbi8vIHN1cHBvcnRlZC5cbi8vXG4vLyAgICBPcmJpdCAtIGxlZnQgbW91c2UgLyB0b3VjaDogb25lIGZpbmdlciBtb3ZlXG4vLyAgICBab29tIC0gbWlkZGxlIG1vdXNlLCBvciBtb3VzZXdoZWVsIC8gdG91Y2g6IHR3byBmaW5nZXIgc3ByZWFkIG9yIHNxdWlzaFxuLy8gICAgUGFuIC0gcmlnaHQgbW91c2UsIG9yIGFycm93IGtleXMgLyB0b3VjaDogdGhyZWUgZmludGVyIHN3aXBlXG4vL1xuLy8gVGhpcyBpcyBhIGRyb3AtaW4gcmVwbGFjZW1lbnQgZm9yIChtb3N0KSBUcmFja2JhbGxDb250cm9scyB1c2VkIGluIGV4YW1wbGVzLlxuLy8gVGhhdCBpcywgaW5jbHVkZSB0aGlzIGpzIGZpbGUgYW5kIHdoZXJldmVyIHlvdSBzZWU6XG4vLyAgICBcdGNvbnRyb2xzID0gbmV3IFRIUkVFLlRyYWNrYmFsbENvbnRyb2xzKCBjYW1lcmEgKTtcbi8vICAgICAgY29udHJvbHMudGFyZ2V0LnogPSAxNTA7XG4vLyBTaW1wbGUgc3Vic3RpdHV0ZSBcIk9yYml0Q29udHJvbHNcIiBhbmQgdGhlIGNvbnRyb2wgc2hvdWxkIHdvcmsgYXMtaXMuXG5cblRIUkVFLk9yYml0Q29udHJvbHMgPSBmdW5jdGlvbiAob2JqZWN0LCBkb21FbGVtZW50KSB7XG5cbiAgICB0aGlzLm9iamVjdCA9IG9iamVjdDtcbiAgICB0aGlzLmRvbUVsZW1lbnQgPSAoIGRvbUVsZW1lbnQgIT09IHVuZGVmaW5lZCApID8gZG9tRWxlbWVudCA6IGRvY3VtZW50O1xuXG4gICAgLy8gQVBJXG5cbiAgICAvLyBTZXQgdG8gZmFsc2UgdG8gZGlzYWJsZSB0aGlzIGNvbnRyb2xcbiAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgLy8gXCJ0YXJnZXRcIiBzZXRzIHRoZSBsb2NhdGlvbiBvZiBmb2N1cywgd2hlcmUgdGhlIGNvbnRyb2wgb3JiaXRzIGFyb3VuZFxuICAgIC8vIGFuZCB3aGVyZSBpdCBwYW5zIHdpdGggcmVzcGVjdCB0by5cbiAgICB0aGlzLnRhcmdldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cbiAgICAvLyBjZW50ZXIgaXMgb2xkLCBkZXByZWNhdGVkOyB1c2UgXCJ0YXJnZXRcIiBpbnN0ZWFkXG4gICAgdGhpcy5jZW50ZXIgPSB0aGlzLnRhcmdldDtcblxuICAgIC8vIFRoaXMgb3B0aW9uIGFjdHVhbGx5IGVuYWJsZXMgZG9sbHlpbmcgaW4gYW5kIG91dDsgbGVmdCBhcyBcInpvb21cIiBmb3JcbiAgICAvLyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgIHRoaXMubm9ab29tID0gZmFsc2U7XG4gICAgdGhpcy56b29tU3BlZWQgPSAxLjA7XG5cbiAgICAvLyBMaW1pdHMgdG8gaG93IGZhciB5b3UgY2FuIGRvbGx5IGluIGFuZCBvdXRcbiAgICB0aGlzLm1pbkRpc3RhbmNlID0gMDtcbiAgICB0aGlzLm1heERpc3RhbmNlID0gSW5maW5pdHk7XG5cbiAgICAvLyBTZXQgdG8gdHJ1ZSB0byBkaXNhYmxlIHRoaXMgY29udHJvbFxuICAgIHRoaXMubm9Sb3RhdGUgPSBmYWxzZTtcbiAgICB0aGlzLnJvdGF0ZVNwZWVkID0gMS4wO1xuXG4gICAgLy8gU2V0IHRvIHRydWUgdG8gZGlzYWJsZSB0aGlzIGNvbnRyb2xcbiAgICB0aGlzLm5vUGFuID0gZmFsc2U7XG4gICAgdGhpcy5rZXlQYW5TcGVlZCA9IDcuMDtcdC8vIHBpeGVscyBtb3ZlZCBwZXIgYXJyb3cga2V5IHB1c2hcblxuICAgIC8vIFNldCB0byB0cnVlIHRvIGF1dG9tYXRpY2FsbHkgcm90YXRlIGFyb3VuZCB0aGUgdGFyZ2V0XG4gICAgdGhpcy5hdXRvUm90YXRlID0gZmFsc2U7XG4gICAgdGhpcy5hdXRvUm90YXRlU3BlZWQgPSAyLjA7IC8vIDMwIHNlY29uZHMgcGVyIHJvdW5kIHdoZW4gZnBzIGlzIDYwXG5cbiAgICAvLyBIb3cgZmFyIHlvdSBjYW4gb3JiaXQgdmVydGljYWxseSwgdXBwZXIgYW5kIGxvd2VyIGxpbWl0cy5cbiAgICAvLyBSYW5nZSBpcyAwIHRvIE1hdGguUEkgcmFkaWFucy5cbiAgICB0aGlzLm1pblBvbGFyQW5nbGUgPSAwOyAvLyByYWRpYW5zXG4gICAgdGhpcy5tYXhQb2xhckFuZ2xlID0gTWF0aC5QSTsgLy8gcmFkaWFuc1xuXG4gICAgLy8gU2V0IHRvIHRydWUgdG8gZGlzYWJsZSB1c2Ugb2YgdGhlIGtleXNcbiAgICB0aGlzLm5vS2V5cyA9IGZhbHNlO1xuXG4gICAgLy8gVGhlIGZvdXIgYXJyb3cga2V5c1xuICAgIHRoaXMua2V5cyA9IHsgTEVGVDogMzcsIFVQOiAzOCwgUklHSFQ6IDM5LCBCT1RUT006IDQwIH07XG5cbiAgICAvLy8vLy8vLy8vLy9cbiAgICAvLyBpbnRlcm5hbHNcblxuICAgIHZhciBzY29wZSA9IHRoaXM7XG5cbiAgICB2YXIgRVBTID0gMC4wMDAwMDE7XG5cbiAgICB2YXIgcm90YXRlU3RhcnQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuICAgIHZhciByb3RhdGVFbmQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuICAgIHZhciByb3RhdGVEZWx0YSA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cbiAgICB2YXIgcGFuU3RhcnQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuICAgIHZhciBwYW5FbmQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuICAgIHZhciBwYW5EZWx0YSA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG4gICAgdmFyIHBhbk9mZnNldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cbiAgICB2YXIgb2Zmc2V0ID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblxuICAgIHZhciBkb2xseVN0YXJ0ID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcbiAgICB2YXIgZG9sbHlFbmQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuICAgIHZhciBkb2xseURlbHRhID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcblxuICAgIHZhciBwaGlEZWx0YSA9IDA7XG4gICAgdmFyIHRoZXRhRGVsdGEgPSAwO1xuICAgIHZhciBzY2FsZSA9IDE7XG4gICAgdmFyIHBhbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cbiAgICB2YXIgbGFzdFBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICB2YXIgbGFzdFF1YXRlcm5pb24gPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpO1xuXG4gICAgdmFyIFNUQVRFID0geyBOT05FOiAtMSwgUk9UQVRFOiAwLCBET0xMWTogMSwgUEFOOiAyLCBUT1VDSF9ST1RBVEU6IDMsIFRPVUNIX0RPTExZOiA0LCBUT1VDSF9QQU46IDUgfTtcblxuICAgIHZhciBzdGF0ZSA9IFNUQVRFLk5PTkU7XG5cbiAgICAvLyBmb3IgcmVzZXRcblxuICAgIHRoaXMudGFyZ2V0MCA9IHRoaXMudGFyZ2V0LmNsb25lKCk7XG4gICAgdGhpcy5wb3NpdGlvbjAgPSB0aGlzLm9iamVjdC5wb3NpdGlvbi5jbG9uZSgpO1xuXG4gICAgLy8gc28gY2FtZXJhLnVwIGlzIHRoZSBvcmJpdCBheGlzXG5cbiAgICB2YXIgcXVhdCA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbVVuaXRWZWN0b3JzKG9iamVjdC51cCwgbmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCkpO1xuICAgIHZhciBxdWF0SW52ZXJzZSA9IHF1YXQuY2xvbmUoKS5pbnZlcnNlKCk7XG5cbiAgICAvLyBldmVudHNcblxuICAgIHZhciBjaGFuZ2VFdmVudCA9IHsgdHlwZTogJ2NoYW5nZScgfTtcbiAgICB2YXIgc3RhcnRFdmVudCA9IHsgdHlwZTogJ3N0YXJ0J307XG4gICAgdmFyIGVuZEV2ZW50ID0geyB0eXBlOiAnZW5kJ307XG5cbiAgICB0aGlzLnJvdGF0ZUxlZnQgPSBmdW5jdGlvbiAoYW5nbGUpIHtcblxuICAgICAgICBpZiAoYW5nbGUgPT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICBhbmdsZSA9IGdldEF1dG9Sb3RhdGlvbkFuZ2xlKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoZXRhRGVsdGEgLT0gYW5nbGU7XG5cbiAgICB9O1xuXG4gICAgdGhpcy5yb3RhdGVVcCA9IGZ1bmN0aW9uIChhbmdsZSkge1xuXG4gICAgICAgIGlmIChhbmdsZSA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIGFuZ2xlID0gZ2V0QXV0b1JvdGF0aW9uQW5nbGUoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcGhpRGVsdGEgLT0gYW5nbGU7XG5cbiAgICB9O1xuXG4gICAgLy8gcGFzcyBpbiBkaXN0YW5jZSBpbiB3b3JsZCBzcGFjZSB0byBtb3ZlIGxlZnRcbiAgICB0aGlzLnBhbkxlZnQgPSBmdW5jdGlvbiAoZGlzdGFuY2UpIHtcblxuICAgICAgICB2YXIgdGUgPSB0aGlzLm9iamVjdC5tYXRyaXguZWxlbWVudHM7XG5cbiAgICAgICAgLy8gZ2V0IFggY29sdW1uIG9mIG1hdHJpeFxuICAgICAgICBwYW5PZmZzZXQuc2V0KHRlWyAwIF0sIHRlWyAxIF0sIHRlWyAyIF0pO1xuICAgICAgICBwYW5PZmZzZXQubXVsdGlwbHlTY2FsYXIoLWRpc3RhbmNlKTtcblxuICAgICAgICBwYW4uYWRkKHBhbk9mZnNldCk7XG5cbiAgICB9O1xuXG4gICAgLy8gcGFzcyBpbiBkaXN0YW5jZSBpbiB3b3JsZCBzcGFjZSB0byBtb3ZlIHVwXG4gICAgdGhpcy5wYW5VcCA9IGZ1bmN0aW9uIChkaXN0YW5jZSkge1xuXG4gICAgICAgIHZhciB0ZSA9IHRoaXMub2JqZWN0Lm1hdHJpeC5lbGVtZW50cztcblxuICAgICAgICAvLyBnZXQgWSBjb2x1bW4gb2YgbWF0cml4XG4gICAgICAgIHBhbk9mZnNldC5zZXQodGVbIDQgXSwgdGVbIDUgXSwgdGVbIDYgXSk7XG4gICAgICAgIHBhbk9mZnNldC5tdWx0aXBseVNjYWxhcihkaXN0YW5jZSk7XG5cbiAgICAgICAgcGFuLmFkZChwYW5PZmZzZXQpO1xuXG4gICAgfTtcblxuICAgIC8vIHBhc3MgaW4geCx5IG9mIGNoYW5nZSBkZXNpcmVkIGluIHBpeGVsIHNwYWNlLFxuICAgIC8vIHJpZ2h0IGFuZCBkb3duIGFyZSBwb3NpdGl2ZVxuICAgIHRoaXMucGFuID0gZnVuY3Rpb24gKGRlbHRhWCwgZGVsdGFZKSB7XG5cbiAgICAgICAgdmFyIGVsZW1lbnQgPSBzY29wZS5kb21FbGVtZW50ID09PSBkb2N1bWVudCA/IHNjb3BlLmRvbUVsZW1lbnQuYm9keSA6IHNjb3BlLmRvbUVsZW1lbnQ7XG5cbiAgICAgICAgaWYgKHNjb3BlLm9iamVjdC5mb3YgIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICAvLyBwZXJzcGVjdGl2ZVxuICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0gc2NvcGUub2JqZWN0LnBvc2l0aW9uO1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHBvc2l0aW9uLmNsb25lKCkuc3ViKHNjb3BlLnRhcmdldCk7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0RGlzdGFuY2UgPSBvZmZzZXQubGVuZ3RoKCk7XG5cbiAgICAgICAgICAgIC8vIGhhbGYgb2YgdGhlIGZvdiBpcyBjZW50ZXIgdG8gdG9wIG9mIHNjcmVlblxuICAgICAgICAgICAgdGFyZ2V0RGlzdGFuY2UgKj0gTWF0aC50YW4oKCBzY29wZS5vYmplY3QuZm92IC8gMiApICogTWF0aC5QSSAvIDE4MC4wKTtcblxuICAgICAgICAgICAgLy8gd2UgYWN0dWFsbHkgZG9uJ3QgdXNlIHNjcmVlbldpZHRoLCBzaW5jZSBwZXJzcGVjdGl2ZSBjYW1lcmEgaXMgZml4ZWQgdG8gc2NyZWVuIGhlaWdodFxuICAgICAgICAgICAgc2NvcGUucGFuTGVmdCgyICogZGVsdGFYICogdGFyZ2V0RGlzdGFuY2UgLyBlbGVtZW50LmNsaWVudEhlaWdodCk7XG4gICAgICAgICAgICBzY29wZS5wYW5VcCgyICogZGVsdGFZICogdGFyZ2V0RGlzdGFuY2UgLyBlbGVtZW50LmNsaWVudEhlaWdodCk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChzY29wZS5vYmplY3QudG9wICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgLy8gb3J0aG9ncmFwaGljXG4gICAgICAgICAgICBzY29wZS5wYW5MZWZ0KGRlbHRhWCAqIChzY29wZS5vYmplY3QucmlnaHQgLSBzY29wZS5vYmplY3QubGVmdCkgLyBlbGVtZW50LmNsaWVudFdpZHRoKTtcbiAgICAgICAgICAgIHNjb3BlLnBhblVwKGRlbHRhWSAqIChzY29wZS5vYmplY3QudG9wIC0gc2NvcGUub2JqZWN0LmJvdHRvbSkgLyBlbGVtZW50LmNsaWVudEhlaWdodCk7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy8gY2FtZXJhIG5laXRoZXIgb3J0aG9ncmFwaGljIG9yIHBlcnNwZWN0aXZlXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1dBUk5JTkc6IE9yYml0Q29udHJvbHMuanMgZW5jb3VudGVyZWQgYW4gdW5rbm93biBjYW1lcmEgdHlwZSAtIHBhbiBkaXNhYmxlZC4nKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgdGhpcy5kb2xseUluID0gZnVuY3Rpb24gKGRvbGx5U2NhbGUpIHtcblxuICAgICAgICBpZiAoZG9sbHlTY2FsZSA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIGRvbGx5U2NhbGUgPSBnZXRab29tU2NhbGUoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgc2NhbGUgLz0gZG9sbHlTY2FsZTtcblxuICAgIH07XG5cbiAgICB0aGlzLmRvbGx5T3V0ID0gZnVuY3Rpb24gKGRvbGx5U2NhbGUpIHtcblxuICAgICAgICBpZiAoZG9sbHlTY2FsZSA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIGRvbGx5U2NhbGUgPSBnZXRab29tU2NhbGUoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgc2NhbGUgKj0gZG9sbHlTY2FsZTtcblxuICAgIH07XG5cbiAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgcG9zaXRpb24gPSB0aGlzLm9iamVjdC5wb3NpdGlvbjtcblxuICAgICAgICBvZmZzZXQuY29weShwb3NpdGlvbikuc3ViKHRoaXMudGFyZ2V0KTtcblxuICAgICAgICAvLyByb3RhdGUgb2Zmc2V0IHRvIFwieS1heGlzLWlzLXVwXCIgc3BhY2VcbiAgICAgICAgb2Zmc2V0LmFwcGx5UXVhdGVybmlvbihxdWF0KTtcblxuICAgICAgICAvLyBhbmdsZSBmcm9tIHotYXhpcyBhcm91bmQgeS1heGlzXG5cbiAgICAgICAgdmFyIHRoZXRhID0gTWF0aC5hdGFuMihvZmZzZXQueCwgb2Zmc2V0LnopO1xuXG4gICAgICAgIC8vIGFuZ2xlIGZyb20geS1heGlzXG5cbiAgICAgICAgdmFyIHBoaSA9IE1hdGguYXRhbjIoTWF0aC5zcXJ0KG9mZnNldC54ICogb2Zmc2V0LnggKyBvZmZzZXQueiAqIG9mZnNldC56KSwgb2Zmc2V0LnkpO1xuXG4gICAgICAgIGlmICh0aGlzLmF1dG9Sb3RhdGUpIHtcblxuICAgICAgICAgICAgdGhpcy5yb3RhdGVMZWZ0KGdldEF1dG9Sb3RhdGlvbkFuZ2xlKCkpO1xuXG4gICAgICAgIH1cblxuICAgICAgICB0aGV0YSArPSB0aGV0YURlbHRhO1xuICAgICAgICBwaGkgKz0gcGhpRGVsdGE7XG5cbiAgICAgICAgLy8gcmVzdHJpY3QgcGhpIHRvIGJlIGJldHdlZW4gZGVzaXJlZCBsaW1pdHNcbiAgICAgICAgcGhpID0gTWF0aC5tYXgodGhpcy5taW5Qb2xhckFuZ2xlLCBNYXRoLm1pbih0aGlzLm1heFBvbGFyQW5nbGUsIHBoaSkpO1xuXG4gICAgICAgIC8vIHJlc3RyaWN0IHBoaSB0byBiZSBiZXR3ZWUgRVBTIGFuZCBQSS1FUFNcbiAgICAgICAgcGhpID0gTWF0aC5tYXgoRVBTLCBNYXRoLm1pbihNYXRoLlBJIC0gRVBTLCBwaGkpKTtcblxuICAgICAgICB2YXIgcmFkaXVzID0gb2Zmc2V0Lmxlbmd0aCgpICogc2NhbGU7XG5cbiAgICAgICAgLy8gcmVzdHJpY3QgcmFkaXVzIHRvIGJlIGJldHdlZW4gZGVzaXJlZCBsaW1pdHNcbiAgICAgICAgcmFkaXVzID0gTWF0aC5tYXgodGhpcy5taW5EaXN0YW5jZSwgTWF0aC5taW4odGhpcy5tYXhEaXN0YW5jZSwgcmFkaXVzKSk7XG5cbiAgICAgICAgLy8gbW92ZSB0YXJnZXQgdG8gcGFubmVkIGxvY2F0aW9uXG4gICAgICAgIHRoaXMudGFyZ2V0LmFkZChwYW4pO1xuXG4gICAgICAgIG9mZnNldC54ID0gcmFkaXVzICogTWF0aC5zaW4ocGhpKSAqIE1hdGguc2luKHRoZXRhKTtcbiAgICAgICAgb2Zmc2V0LnkgPSByYWRpdXMgKiBNYXRoLmNvcyhwaGkpO1xuICAgICAgICBvZmZzZXQueiA9IHJhZGl1cyAqIE1hdGguc2luKHBoaSkgKiBNYXRoLmNvcyh0aGV0YSk7XG5cbiAgICAgICAgLy8gcm90YXRlIG9mZnNldCBiYWNrIHRvIFwiY2FtZXJhLXVwLXZlY3Rvci1pcy11cFwiIHNwYWNlXG4gICAgICAgIG9mZnNldC5hcHBseVF1YXRlcm5pb24ocXVhdEludmVyc2UpO1xuXG4gICAgICAgIHBvc2l0aW9uLmNvcHkodGhpcy50YXJnZXQpLmFkZChvZmZzZXQpO1xuXG4gICAgICAgIHRoaXMub2JqZWN0Lmxvb2tBdCh0aGlzLnRhcmdldCk7XG5cbiAgICAgICAgdGhldGFEZWx0YSA9IDA7XG4gICAgICAgIHBoaURlbHRhID0gMDtcbiAgICAgICAgc2NhbGUgPSAxO1xuICAgICAgICBwYW4uc2V0KDAsIDAsIDApO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBjb25kaXRpb24gaXM6XG4gICAgICAgIC8vIG1pbihjYW1lcmEgZGlzcGxhY2VtZW50LCBjYW1lcmEgcm90YXRpb24gaW4gcmFkaWFucyleMiA+IEVQU1xuICAgICAgICAvLyB1c2luZyBzbWFsbC1hbmdsZSBhcHByb3hpbWF0aW9uIGNvcyh4LzIpID0gMSAtIHheMiAvIDhcblxuICAgICAgICBpZiAobGFzdFBvc2l0aW9uLmRpc3RhbmNlVG9TcXVhcmVkKHRoaXMub2JqZWN0LnBvc2l0aW9uKSA+IEVQU1xuICAgICAgICAgICAgfHwgOCAqICgxIC0gbGFzdFF1YXRlcm5pb24uZG90KHRoaXMub2JqZWN0LnF1YXRlcm5pb24pKSA+IEVQUykge1xuXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoY2hhbmdlRXZlbnQpO1xuXG4gICAgICAgICAgICBsYXN0UG9zaXRpb24uY29weSh0aGlzLm9iamVjdC5wb3NpdGlvbik7XG4gICAgICAgICAgICBsYXN0UXVhdGVybmlvbi5jb3B5KHRoaXMub2JqZWN0LnF1YXRlcm5pb24pO1xuXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZWxlbWVudCA9IHNjb3BlLmRvbUVsZW1lbnQgPT09IGRvY3VtZW50ID8gc2NvcGUuZG9tRWxlbWVudC5ib2R5IDogc2NvcGUuZG9tRWxlbWVudDtcblxuICAgICAgICBpZiAoZWxlbWVudC5jbGllbnRXaWR0aCA+IDAgJiYgZWxlbWVudC5jbGllbnRIZWlnaHQgPiAwKSB7XG4gICAgICAgICAgICAvLyByb3RhdGluZyBhY3Jvc3Mgd2hvbGUgc2NyZWVuIGdvZXMgMzYwIGRlZ3JlZXMgYXJvdW5kXG4gICAgICAgICAgICBzY29wZS5yb3RhdGVMZWZ0KDIgKiBNYXRoLlBJICogcm90YXRlRGVsdGEueCAvIGVsZW1lbnQuY2xpZW50V2lkdGggKiBzY29wZS5yb3RhdGVTcGVlZCk7XG5cbiAgICAgICAgICAgIC8vIHJvdGF0aW5nIHVwIGFuZCBkb3duIGFsb25nIHdob2xlIHNjcmVlbiBhdHRlbXB0cyB0byBnbyAzNjAsIGJ1dCBsaW1pdGVkIHRvIDE4MFxuICAgICAgICAgICAgc2NvcGUucm90YXRlVXAoMiAqIE1hdGguUEkgKiByb3RhdGVEZWx0YS55IC8gZWxlbWVudC5jbGllbnRIZWlnaHQgKiBzY29wZS5yb3RhdGVTcGVlZCk7XG5cbiAgICAgICAgICAgIHJvdGF0ZURlbHRhLm11bHRpcGx5U2NhbGFyKDAuOTkpXG4gICAgICAgIH1cblxuICAgIH07XG5cblxuICAgIHRoaXMucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgc3RhdGUgPSBTVEFURS5OT05FO1xuXG4gICAgICAgIHRoaXMudGFyZ2V0LmNvcHkodGhpcy50YXJnZXQwKTtcbiAgICAgICAgdGhpcy5vYmplY3QucG9zaXRpb24uY29weSh0aGlzLnBvc2l0aW9uMCk7XG5cbiAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRBdXRvUm90YXRpb25BbmdsZSgpIHtcblxuICAgICAgICByZXR1cm4gMiAqIE1hdGguUEkgLyA2MCAvIDYwICogc2NvcGUuYXV0b1JvdGF0ZVNwZWVkO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Wm9vbVNjYWxlKCkge1xuXG4gICAgICAgIHJldHVybiBNYXRoLnBvdygwLjk1LCBzY29wZS56b29tU3BlZWQpO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Nb3VzZURvd24oZXZlbnQpIHtcblxuICAgICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UpIHJldHVybjtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAoZXZlbnQuYnV0dG9uID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoc2NvcGUubm9Sb3RhdGUgPT09IHRydWUpIHJldHVybjtcblxuICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5ST1RBVEU7XG5cbiAgICAgICAgICAgIHJvdGF0ZVN0YXJ0LnNldChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gMSkge1xuICAgICAgICAgICAgaWYgKHNjb3BlLm5vWm9vbSA9PT0gdHJ1ZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBzdGF0ZSA9IFNUQVRFLkRPTExZO1xuXG4gICAgICAgICAgICBkb2xseVN0YXJ0LnNldChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gMikge1xuICAgICAgICAgICAgaWYgKHNjb3BlLm5vUGFuID09PSB0cnVlKSByZXR1cm47XG5cbiAgICAgICAgICAgIHN0YXRlID0gU1RBVEUuUEFOO1xuXG4gICAgICAgICAgICBwYW5TdGFydC5zZXQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlLCBmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXAsIGZhbHNlKTtcbiAgICAgICAgc2NvcGUuZGlzcGF0Y2hFdmVudChzdGFydEV2ZW50KTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG5cbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKSByZXR1cm47XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB2YXIgZWxlbWVudCA9IHNjb3BlLmRvbUVsZW1lbnQgPT09IGRvY3VtZW50ID8gc2NvcGUuZG9tRWxlbWVudC5ib2R5IDogc2NvcGUuZG9tRWxlbWVudDtcblxuICAgICAgICBpZiAoc3RhdGUgPT09IFNUQVRFLlJPVEFURSkge1xuXG4gICAgICAgICAgICBpZiAoc2NvcGUubm9Sb3RhdGUgPT09IHRydWUpIHJldHVybjtcblxuICAgICAgICAgICAgcm90YXRlRW5kLnNldChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcbiAgICAgICAgICAgIHJvdGF0ZURlbHRhLnN1YlZlY3RvcnMocm90YXRlRW5kLCByb3RhdGVTdGFydCk7XG5cbiAgICAgICAgICAgIC8vIHJvdGF0aW5nIGFjcm9zcyB3aG9sZSBzY3JlZW4gZ29lcyAzNjAgZGVncmVlcyBhcm91bmRcbiAgICAgICAgICAgIHNjb3BlLnJvdGF0ZUxlZnQoMiAqIE1hdGguUEkgKiByb3RhdGVEZWx0YS54IC8gZWxlbWVudC5jbGllbnRXaWR0aCAqIHNjb3BlLnJvdGF0ZVNwZWVkKTtcblxuICAgICAgICAgICAgLy8gcm90YXRpbmcgdXAgYW5kIGRvd24gYWxvbmcgd2hvbGUgc2NyZWVuIGF0dGVtcHRzIHRvIGdvIDM2MCwgYnV0IGxpbWl0ZWQgdG8gMTgwXG4gICAgICAgICAgICBzY29wZS5yb3RhdGVVcCgyICogTWF0aC5QSSAqIHJvdGF0ZURlbHRhLnkgLyBlbGVtZW50LmNsaWVudEhlaWdodCAqIHNjb3BlLnJvdGF0ZVNwZWVkKTtcblxuICAgICAgICAgICAgcm90YXRlU3RhcnQuY29weShyb3RhdGVFbmQpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IFNUQVRFLkRPTExZKSB7XG5cbiAgICAgICAgICAgIGlmIChzY29wZS5ub1pvb20gPT09IHRydWUpIHJldHVybjtcblxuICAgICAgICAgICAgZG9sbHlFbmQuc2V0KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuICAgICAgICAgICAgZG9sbHlEZWx0YS5zdWJWZWN0b3JzKGRvbGx5RW5kLCBkb2xseVN0YXJ0KTtcblxuICAgICAgICAgICAgaWYgKGRvbGx5RGVsdGEueSA+IDApIHtcblxuICAgICAgICAgICAgICAgIHNjb3BlLmRvbGx5SW4oKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIHNjb3BlLmRvbGx5T3V0KCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9sbHlTdGFydC5jb3B5KGRvbGx5RW5kKTtcblxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBTVEFURS5QQU4pIHtcblxuICAgICAgICAgICAgaWYgKHNjb3BlLm5vUGFuID09PSB0cnVlKSByZXR1cm47XG5cbiAgICAgICAgICAgIHBhbkVuZC5zZXQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG4gICAgICAgICAgICBwYW5EZWx0YS5zdWJWZWN0b3JzKHBhbkVuZCwgcGFuU3RhcnQpO1xuXG4gICAgICAgICAgICBzY29wZS5wYW4ocGFuRGVsdGEueCwgcGFuRGVsdGEueSk7XG5cbiAgICAgICAgICAgIHBhblN0YXJ0LmNvcHkocGFuRW5kKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgc2NvcGUudXBkYXRlKCk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbk1vdXNlVXAoLyogZXZlbnQgKi8pIHtcblxuICAgICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwLCBmYWxzZSk7XG4gICAgICAgIHNjb3BlLmRpc3BhdGNoRXZlbnQoZW5kRXZlbnQpO1xuICAgICAgICBzdGF0ZSA9IFNUQVRFLk5PTkU7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbk1vdXNlV2hlZWwoZXZlbnQpIHtcblxuICAgICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UgfHwgc2NvcGUubm9ab29tID09PSB0cnVlKSByZXR1cm47XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgdmFyIGRlbHRhID0gMDtcblxuICAgICAgICBpZiAoZXZlbnQud2hlZWxEZWx0YSAhPT0gdW5kZWZpbmVkKSB7IC8vIFdlYktpdCAvIE9wZXJhIC8gRXhwbG9yZXIgOVxuXG4gICAgICAgICAgICBkZWx0YSA9IGV2ZW50LndoZWVsRGVsdGE7XG5cbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5kZXRhaWwgIT09IHVuZGVmaW5lZCkgeyAvLyBGaXJlZm94XG5cbiAgICAgICAgICAgIGRlbHRhID0gLWV2ZW50LmRldGFpbDtcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRlbHRhID4gMCkge1xuXG4gICAgICAgICAgICBzY29wZS5kb2xseU91dCgpO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHNjb3BlLmRvbGx5SW4oKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgc2NvcGUudXBkYXRlKCk7XG4gICAgICAgIHNjb3BlLmRpc3BhdGNoRXZlbnQoc3RhcnRFdmVudCk7XG4gICAgICAgIHNjb3BlLmRpc3BhdGNoRXZlbnQoZW5kRXZlbnQpO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25LZXlEb3duKGV2ZW50KSB7XG5cbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlIHx8IHNjb3BlLm5vS2V5cyA9PT0gdHJ1ZSB8fCBzY29wZS5ub1BhbiA9PT0gdHJ1ZSkgcmV0dXJuO1xuXG4gICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuXG4gICAgICAgICAgICBjYXNlIHNjb3BlLmtleXMuVVA6XG4gICAgICAgICAgICAgICAgc2NvcGUucGFuKDAsIHNjb3BlLmtleVBhblNwZWVkKTtcbiAgICAgICAgICAgICAgICBzY29wZS51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBzY29wZS5rZXlzLkJPVFRPTTpcbiAgICAgICAgICAgICAgICBzY29wZS5wYW4oMCwgLXNjb3BlLmtleVBhblNwZWVkKTtcbiAgICAgICAgICAgICAgICBzY29wZS51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBzY29wZS5rZXlzLkxFRlQ6XG4gICAgICAgICAgICAgICAgc2NvcGUucGFuKHNjb3BlLmtleVBhblNwZWVkLCAwKTtcbiAgICAgICAgICAgICAgICBzY29wZS51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBzY29wZS5rZXlzLlJJR0hUOlxuICAgICAgICAgICAgICAgIHNjb3BlLnBhbigtc2NvcGUua2V5UGFuU3BlZWQsIDApO1xuICAgICAgICAgICAgICAgIHNjb3BlLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvdWNoc3RhcnQoZXZlbnQpIHtcblxuICAgICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgICBzd2l0Y2ggKGV2ZW50LnRvdWNoZXMubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgIGNhc2UgMTpcdC8vIG9uZS1maW5nZXJlZCB0b3VjaDogcm90YXRlXG5cbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUubm9Sb3RhdGUgPT09IHRydWUpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHN0YXRlID0gU1RBVEUuVE9VQ0hfUk9UQVRFO1xuXG4gICAgICAgICAgICAgICAgcm90YXRlU3RhcnQuc2V0KGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCwgZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAyOlx0Ly8gdHdvLWZpbmdlcmVkIHRvdWNoOiBkb2xseVxuXG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLm5vWm9vbSA9PT0gdHJ1ZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5UT1VDSF9ET0xMWTtcblxuICAgICAgICAgICAgICAgIHZhciBkeCA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCAtIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWDtcbiAgICAgICAgICAgICAgICB2YXIgZHkgPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVk7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbiAgICAgICAgICAgICAgICBkb2xseVN0YXJ0LnNldCgwLCBkaXN0YW5jZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMzogLy8gdGhyZWUtZmluZ2VyZWQgdG91Y2g6IHBhblxuXG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLm5vUGFuID09PSB0cnVlKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICBzdGF0ZSA9IFNUQVRFLlRPVUNIX1BBTjtcblxuICAgICAgICAgICAgICAgIHBhblN0YXJ0LnNldChldmVudC50b3VjaGVzWyAwIF0ucGFnZVgsIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG5cbiAgICAgICAgICAgICAgICBzdGF0ZSA9IFNUQVRFLk5PTkU7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHNjb3BlLmRpc3BhdGNoRXZlbnQoc3RhcnRFdmVudCk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b3VjaG1vdmUoZXZlbnQpIHtcblxuICAgICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICB2YXIgZWxlbWVudCA9IHNjb3BlLmRvbUVsZW1lbnQgPT09IGRvY3VtZW50ID8gc2NvcGUuZG9tRWxlbWVudC5ib2R5IDogc2NvcGUuZG9tRWxlbWVudDtcblxuICAgICAgICBzd2l0Y2ggKGV2ZW50LnRvdWNoZXMubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgIGNhc2UgMTogLy8gb25lLWZpbmdlcmVkIHRvdWNoOiByb3RhdGVcblxuICAgICAgICAgICAgICAgIGlmIChzY29wZS5ub1JvdGF0ZSA9PT0gdHJ1ZSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSAhPT0gU1RBVEUuVE9VQ0hfUk9UQVRFKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICByb3RhdGVFbmQuc2V0KGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCwgZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZKTtcbiAgICAgICAgICAgICAgICByb3RhdGVEZWx0YS5zdWJWZWN0b3JzKHJvdGF0ZUVuZCwgcm90YXRlU3RhcnQpO1xuXG4gICAgICAgICAgICAgICAgLy8gcm90YXRpbmcgYWNyb3NzIHdob2xlIHNjcmVlbiBnb2VzIDM2MCBkZWdyZWVzIGFyb3VuZFxuICAgICAgICAgICAgICAgIHNjb3BlLnJvdGF0ZUxlZnQoMiAqIE1hdGguUEkgKiByb3RhdGVEZWx0YS54IC8gZWxlbWVudC5jbGllbnRXaWR0aCAqIHNjb3BlLnJvdGF0ZVNwZWVkKTtcbiAgICAgICAgICAgICAgICAvLyByb3RhdGluZyB1cCBhbmQgZG93biBhbG9uZyB3aG9sZSBzY3JlZW4gYXR0ZW1wdHMgdG8gZ28gMzYwLCBidXQgbGltaXRlZCB0byAxODBcbiAgICAgICAgICAgICAgICBzY29wZS5yb3RhdGVVcCgyICogTWF0aC5QSSAqIHJvdGF0ZURlbHRhLnkgLyBlbGVtZW50LmNsaWVudEhlaWdodCAqIHNjb3BlLnJvdGF0ZVNwZWVkKTtcblxuICAgICAgICAgICAgICAgIHJvdGF0ZVN0YXJ0LmNvcHkocm90YXRlRW5kKTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDI6IC8vIHR3by1maW5nZXJlZCB0b3VjaDogZG9sbHlcblxuICAgICAgICAgICAgICAgIGlmIChzY29wZS5ub1pvb20gPT09IHRydWUpIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgIT09IFNUQVRFLlRPVUNIX0RPTExZKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB2YXIgZHggPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVg7XG4gICAgICAgICAgICAgICAgdmFyIGR5ID0gZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZIC0gZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VZO1xuICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG5cbiAgICAgICAgICAgICAgICBkb2xseUVuZC5zZXQoMCwgZGlzdGFuY2UpO1xuICAgICAgICAgICAgICAgIGRvbGx5RGVsdGEuc3ViVmVjdG9ycyhkb2xseUVuZCwgZG9sbHlTdGFydCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZG9sbHlEZWx0YS55ID4gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmRvbGx5T3V0KCk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmRvbGx5SW4oKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRvbGx5U3RhcnQuY29weShkb2xseUVuZCk7XG5cbiAgICAgICAgICAgICAgICBzY29wZS51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAzOiAvLyB0aHJlZS1maW5nZXJlZCB0b3VjaDogcGFuXG5cbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUubm9QYW4gPT09IHRydWUpIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgIT09IFNUQVRFLlRPVUNIX1BBTikgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgcGFuRW5kLnNldChldmVudC50b3VjaGVzWyAwIF0ucGFnZVgsIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSk7XG4gICAgICAgICAgICAgICAgcGFuRGVsdGEuc3ViVmVjdG9ycyhwYW5FbmQsIHBhblN0YXJ0KTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLnBhbihwYW5EZWx0YS54LCBwYW5EZWx0YS55KTtcblxuICAgICAgICAgICAgICAgIHBhblN0YXJ0LmNvcHkocGFuRW5kKTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuXG4gICAgICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5OT05FO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvdWNoZW5kKC8qIGV2ZW50ICovKSB7XG5cbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKSByZXR1cm47XG5cbiAgICAgICAgc2NvcGUuZGlzcGF0Y2hFdmVudChlbmRFdmVudCk7XG4gICAgICAgIHN0YXRlID0gU1RBVEUuTk9ORTtcblxuICAgIH1cblxuICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0sIGZhbHNlKTtcbiAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Nb3VzZURvd24sIGZhbHNlKTtcbiAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V3aGVlbCcsIG9uTW91c2VXaGVlbCwgZmFsc2UpO1xuICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Nb3VzZVNjcm9sbCcsIG9uTW91c2VXaGVlbCwgZmFsc2UpOyAvLyBmaXJlZm94XG5cbiAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRvdWNoc3RhcnQsIGZhbHNlKTtcbiAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0b3VjaGVuZCwgZmFsc2UpO1xuICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0b3VjaG1vdmUsIGZhbHNlKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXlEb3duLCBmYWxzZSk7XG5cbiAgICAvLyBmb3JjZSBhbiB1cGRhdGUgYXQgc3RhcnRcbiAgICB0aGlzLnVwZGF0ZSgpO1xuXG59O1xuXG5USFJFRS5PcmJpdENvbnRyb2xzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVEhSRUUuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZSk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuUXVldWUgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBRdWV1ZSgpIHtcbiAgICAgICAgICAgIHRoaXMudGFpbCA9IFtdO1xuICAgICAgICAgICAgdGhpcy5oZWFkID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gMDtcbiAgICAgICAgICAgIC8vIExvY2sgdGhlIG9iamVjdCBkb3duXG4gICAgICAgICAgICBPYmplY3Quc2VhbCh0aGlzKTtcbiAgICAgICAgfTtcblxuICAgICAgICBRdWV1ZS5wcm90b3R5cGUuc2hpZnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vZmZzZXQgPT09IHRoaXMuaGVhZC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdG1wID0gdGhpcy5oZWFkO1xuICAgICAgICAgICAgICAgIHRtcC5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZCA9IHRoaXMudGFpbDtcbiAgICAgICAgICAgICAgICB0aGlzLnRhaWwgPSB0bXA7XG4gICAgICAgICAgICAgICAgdGhpcy5vZmZzZXQgPSAwO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhlYWQubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oZWFkW3RoaXMub2Zmc2V0KytdO1xuICAgICAgICB9O1xuXG4gICAgICAgIFF1ZXVlLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhaWwucHVzaChpdGVtKTtcbiAgICAgICAgfTtcblxuICAgICAgICBRdWV1ZS5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVhZC5sZW5ndGggLSB0aGlzLm9mZnNldCArIHRoaXMudGFpbC5sZW5ndGg7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIFF1ZXVlO1xuICAgIH0pKCk7XG59KS5jYWxsKHRoaXMpIl19
