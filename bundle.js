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
    this.routine = [[]];
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



},{}],3:[function(require,module,exports){
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



},{"../javascript/OrbitControls":24,"./Viewer.coffee":9,"./Visualizer.coffee":10,"./interface/DatGUIInterface.coffee":21}],4:[function(require,module,exports){
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
    if ((this.player != null) && this.playing) {
      this.source.disconnect();
      this.player[0].pause();
      this.playing = false;
      this.startOffset += this.audioContext.currentTime - this.startTime;
      return this.player.bind("play", (function(_this) {
        return function() {
          _this.source.connect(_this.analyser);
          _this.playing = true;
          if (_this.miked) {
            return _this.pauseMic();
          }
        };
      })(this));
    } else if (this.player != null) {
      this.source.connect(this.analyser);
      this.player[0].play();
      this.playing = true;
      if (this.miked) {
        return this.pauseMic();
      }
    }
  };

  Player.prototype.createLiveInput = function() {
    var gotStream;
    if (this.playing) {
      this.pause();
    }
    if (this.micSource != null) {
      this.micSource.connect(this.analyser);
      this.miked = true;
      return;
    }
    gotStream = (function(_this) {
      return function(stream) {
        _this.miked = true;
        _this.micSource = _this.audioContext.createMediaStreamSource(stream);
        return _this.micSource.connect(_this.analyser);
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

  Player.prototype.pauseMic = function() {
    if (this.miked) {
      this.micSource.disconnect();
      return this.miked = false;
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

  Player.prototype.setPlayer = function(player) {
    this.player = player;
    this.source = this.audioContext.createMediaElementSource(this.player[0]);
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    this.playing = true;
    return this.pauseMic();
  };

  return Player;

})();



},{"./AudioWindow.coffee":1}],5:[function(require,module,exports){
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



},{"./RoutinesService.coffee":6}],6:[function(require,module,exports){
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



},{}],7:[function(require,module,exports){
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



},{}],8:[function(require,module,exports){
window.SoundCloudLoader = (function() {
  var directStream;

  SoundCloudLoader.client_id = "384835fc6e109a2533f83591ae3713e9";

  function SoundCloudLoader(audioView) {
    this.audioView = audioView;
    this.player = this.audioView.player;
    return;
  }

  SoundCloudLoader.prototype.loadStream = function(url, successCallback, errorCallback) {
    SC.initialize({
      client_id: this.constructor.client_id
    });
    return SC.get('/resolve', {
      url: url
    }, (function(_this) {
      return function(sound) {
        if (sound.errors) {
          console.log("error: ", sound.errors);
          return errorCallback();
        } else {
          console.log(sound);
          if (sound.kind === 'playlist') {
            _this.sound = sound;
            _this.streamPlaylistIndex = 0;
            _this.streamUrl = function() {};
            successCallback();
            return _this.playStream();
          } else {
            _this.sound = sound;
            successCallback();
            return _this.playStream();
          }
        }
      };
    })(this));
  };

  SoundCloudLoader.prototype.playStream = function() {
    return this.audioView.playStream(this.streamUrl(), (function(_this) {
      return function() {
        return _this.directStream('coasting');
      };
    })(this));
  };

  SoundCloudLoader.prototype.streamUrl = function() {
    if (this.sound.kind === 'playlist') {
      return this.sound.tracks[this.streamPlaylistIndex].stream_url + '?client_id=' + this.constructor.client_id;
    } else {
      return this.sound.stream_url + '?client_id=' + this.constructor.client_id;
    }
  };

  directStream = function(direction) {
    if (direction === 'toggle') {
      if (SoundCloudLoader.player.paused) {
        return SoundCloudLoader.player.play();
      } else {
        return SoundCloudLoader.player.pause();
      }
    } else if (SoundCloudLoader.sound.kind === 'playlist') {
      if (direction === 'coasting') {
        SoundCloudLoader.streamPlaylistIndex++;
      } else if (direction = 'forward') {
        if (SoundCloudLoader.streamPlaylistIndex >= SoundCloudLoader.sound.track_count - 1) {
          SoundCloudLoader.streamPlaylistIndex++;
        } else {
          SoundCloudLoader.streamPlaylistIndex--;
        }
      } else {
        if (SoundCloudLoader.streamPlaylistIndex <= 0) {
          SoundCloudLoader.streamPlaylistIndex = SoundCloudLoader.sound.track_count - 1;
        } else {
          SoundCloudLoader.streamPlaylistIndex--;
        }
      }
      if (SoundCloudLoader.streamPlaylistIndex >= 0 && SoundCloudLoader.streamPlaylistIndex <= SoundCloudLoader.sound.track_count - 1) {
        SoundCloudLoader.player.setAttribute(SoundCloudLoader.streamUrl());
        return SoundCloudLoader.player.play();
      }
    }
  };

  return SoundCloudLoader;

})();



},{}],9:[function(require,module,exports){
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
        if (danceMaterial.type === "ShaderMaterial") {
          danceMaterial.params.shaderLoader = this.shaderLoader;
          newMaterial = new Visualizer.danceMaterialTypes[danceMaterial.type](this.shaderLoader, danceMaterial.params);
          newMaterial.loadTexture((function(_this) {
            return function(shaderMaterial) {
              return addDancer(newDance, shaderMaterial);
            };
          })(this));
        }
        newMaterial = new Visualizer.danceMaterialTypes[danceMaterial.type](danceMaterial.params);
      } else {
        newMaterial = currentDancer.danceMaterial;
      }
      addDancer(newDance, newMaterial);
    } else if (id != null) {
      addDancer = (function(_this) {
        return function(newMaterial) {
          _this.dancers[id] = new Visualizer.dancerTypes[dancer.type](new Visualizer.danceTypes[dance.type](dance.params), newMaterial, dancer.params);
          return _this.scene.add(_this.dancers[id].body);
        };
      })(this);
      if (danceMaterial.type === "ShaderMaterial") {
        newMaterial = new Visualizer.danceMaterialTypes[danceMaterial.type](this.shaderLoader, danceMaterial.params);
        newMaterial.loadTexture(addDancer);
      } else {
        addDancer(new Visualizer.danceMaterialTypes[danceMaterial.type](danceMaterial.params));
      }
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



},{"../javascript/Queue.js":25,"./ShaderLoader.coffee":7}],10:[function(require,module,exports){
require('./Player.coffee');

require('./SoundCloudLoader.coffee');

require('./ChoreographyRoutine.coffee');

require('./dancers/CubeDancer.coffee');

require('./dancers/SphereDancer.coffee');

require('./dancers/PointCloudDancer.coffee');

require('./dances/ScaleDance.coffee');

require('./dances/PositionDance.coffee');

require('./dances/RotateDance.coffee');

require('./danceMaterials/ColorDanceMaterial.coffee');

require('./danceMaterials/ShaderMaterial.coffee');

window.Visualizer = (function() {
  Visualizer.prototype.keys = {
    PAUSE: 32,
    NEXT: 78
  };

  function Visualizer(viewer, _interface, routinesController) {
    var url;
    this.viewer = viewer;
    this["interface"] = _interface;
    this.routinesController = routinesController;
    this.player = new Player();
    this.choreographyRoutine = new ChoreographyRoutine(this);
    this["interface"].setup(this.player, this.choreographyRoutine, this.viewer, (function(_this) {
      return function(url) {
        return _this.soundCloudLoader.loadStream(url, function() {
          return console.log("playing " + url);
        });
      };
    })(this));
    this.soundCloudLoader = new SoundCloudLoader(this["interface"].audioView);
    url = window.location.hash === ("" != null) ? "https://soundcloud.com/" + window.location.hash.substring(1) : "https://soundcloud.com/redviolin/swing-tape-3";
    this.soundCloudLoader.loadStream(url, (function(_this) {
      return function() {
        return console.log("Playing some music");
      };
    })(this));
    this.choreographyRoutine.playNext();
  }

  Visualizer.prototype.receiveChoreography = function(move) {
    this.viewer.receiveChoreography(move);
    if (this["interface"].popup != null) {
      return this["interface"].popup.postMessage(this.wrapMessage('choreography', move), this["interface"].domain);
    }
  };

  Visualizer.prototype.render = function() {
    if (!this.player.playing && !this.player.miked) {
      return;
    }
    this.player.update();
    this.viewer.render(this.player.audioWindow);
    if (this["interface"].popup != null) {
      return this["interface"].popup.postMessage(this.wrapMessage('render', this.player.audioWindow), this["interface"].domain);
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
    ShaderMaterial: ShaderMaterial
  };

  Visualizer.prototype.pause = function() {
    if (this.player.playing) {
      return this.pause();
    } else {
      return this.play(this.currentlyPlaying);
    }
  };

  return Visualizer;

})();



},{"./ChoreographyRoutine.coffee":2,"./Player.coffee":4,"./SoundCloudLoader.coffee":8,"./danceMaterials/ColorDanceMaterial.coffee":11,"./danceMaterials/ShaderMaterial.coffee":12,"./dancers/CubeDancer.coffee":13,"./dancers/PointCloudDancer.coffee":15,"./dancers/SphereDancer.coffee":16,"./dances/PositionDance.coffee":17,"./dances/RotateDance.coffee":18,"./dances/ScaleDance.coffee":19}],11:[function(require,module,exports){
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



},{}],12:[function(require,module,exports){
window.ShaderMaterial = (function() {
  ShaderMaterial.params = [
    {
      name: "shaderName",
      "default": "simple_frequency"
    }
  ];

  ShaderMaterial.name = "ShaderMaterial";

  function ShaderMaterial(shaderLoader, options) {
    this.shaderLoader = shaderLoader;
    if (options != null) {
      this.shaderName = options.shaderName;
    }
    this.target = 256;
    this.size = AudioWindow.bufferSize;
    this.newTexArray = new Uint8Array(this.target * 2);
    this.buffer = new Uint8Array(this.target);
  }

  ShaderMaterial.prototype.loadTexture = function(next) {
    return this.shaderLoader.load(this.shaderName, (function(_this) {
      return function(shader) {
        shader.uniforms = {
          audioResolution: {
            type: "1i",
            value: _this.target
          },
          freqTexture: {
            type: "t",
            value: AudioWindow.bufferSize
          },
          time: {
            type: "1f",
            value: 0.0
          }
        };
        _this.material = new THREE.ShaderMaterial(shader);
        _this.material.side = THREE.DoubleSide;
        _this.material.transparent = true;
        return next(_this);
      };
    })(this));
  };

  ShaderMaterial.prototype.update = function(audioWindow, dancer) {
    var i, texture, _i, _ref;
    if (dancer.body.material == null) {
      return;
    }
    this.reduceArrayToBuffer(audioWindow.frequencyBuffer);
    for (i = _i = 0, _ref = this.target * 2; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      this.newTexArray[i] = this.buffer[i % this.target];
    }
    texture = new THREE.DataTexture(this.newTexArray, this.target, 2, THREE.LuminanceFormat, THREE.UnsignedByte);
    texture.needsUpdate = true;
    texture.flipY = false;
    texture.generateMipmaps = false;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;
    texture.unpackAlignment = 1;
    texture.anisotropy = 4;
    dancer.body.material.uniforms.freqTexture.value = texture;
    return dancer.body.material.uniforms.time.value = audioWindow.bufferSize;
  };

  ShaderMaterial.prototype.reduceArrayToBuffer = function(freqBuf) {
    var flooredRatio, i, movingSum, _i, _ref, _results;
    this.buffer = new Array(this.target);
    movingSum = 0;
    flooredRatio = Math.floor(this.size / this.target);
    _results = [];
    for (i = _i = 1, _ref = this.size; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
      movingSum += freqBuf[i];
      if (((i + 1) % flooredRatio) === 0) {
        this.buffer[Math.floor(i / flooredRatio)] = movingSum / flooredRatio;
        _results.push(movingSum = 0);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  return ShaderMaterial;

})();



},{}],13:[function(require,module,exports){
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



},{"./Dancer.coffee":14}],14:[function(require,module,exports){
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



},{}],15:[function(require,module,exports){
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



},{"./Dancer.coffee":14}],16:[function(require,module,exports){
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



},{"./Dancer.coffee":14}],17:[function(require,module,exports){
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



},{}],18:[function(require,module,exports){
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



},{}],19:[function(require,module,exports){
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



},{}],20:[function(require,module,exports){
window.AudioView = (function() {
  function AudioView() {}

  AudioView.prototype.createView = function(target, onMic, onUrl) {
    var micIcon;
    this.audioPlayer = $("<audio />", {
      controls: true
    });
    this.controls = $("<div>");
    this.mic = $("<a>", {
      href: '#'
    });
    micIcon = $("<img/>", {
      "class": "icon",
      src: "./resources/ic_mic_none_white_48dp.png"
    });
    this.mic.append(micIcon);
    this.controls.append(this.mic);
    this.mic.click((function(_this) {
      return function(e) {
        e.preventDefault();
        return onMic();
      };
    })(this));
    this.input = $("<input>", {
      type: "text"
    });
    this.controls.append(this.input);
    this.input.change((function(_this) {
      return function(e) {
        return onUrl(_this.input.val());
      };
    })(this));
    target.append(this.controls);
    return target.append(this.audioPlayer);
  };

  AudioView.prototype.playStream = function(url, onEnd) {
    this.audioPlayer.bind('ended', onEnd);
    return this.audioPlayer.attr('src', url);
  };

  return AudioView;

})();



},{}],21:[function(require,module,exports){
require('./QueueView.coffee');

require('./RoutinesView.coffee');

require('./AudioView.coffee');

require('../RoutinesController.coffee');

window.DatGUIInterface = (function() {
  function DatGUIInterface(routinesController) {
    this.routinesController = routinesController;
    this.container = $('#interface');
  }

  DatGUIInterface.prototype.setup = function(player, choreographyRoutine, viewer, onUrl) {
    var danceController, danceFolder, danceMaterialController, danceMaterialFolder, dancerController, dancerFolder, gui, idController, setupFolder, updateDanceFolder, updateDanceMaterialFolder, updateDancerFolder, updateFolder, _ref, _ref1, _ref2;
    this.player = player;
    this.choreographyRoutine = choreographyRoutine;
    this.viewer = viewer;
    this.onUrl = onUrl;
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
    this.setupRoutinesView();
    return this.setupAudioPlayer();
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

  DatGUIInterface.prototype.setupAudioPlayer = function() {
    var bottomBar, onMic;
    bottomBar = $("<div>", {
      "class": "bottom-bar"
    });
    this.audioView = new AudioView();
    onMic = (function(_this) {
      return function() {
        return _this.player.createLiveInput();
      };
    })(this);
    this.audioView.createView(bottomBar, onMic, this.onUrl);
    $('body').append(bottomBar);
    return this.player.setPlayer(this.audioView.audioPlayer);
  };

  DatGUIInterface.prototype.updateText = function() {
    if (this.queueView != null) {
      return this.queueView.updateText(this.choreographyRoutine.routineBeat, this.choreographyRoutine.routine);
    }
  };

  return DatGUIInterface;

})();



},{"../RoutinesController.coffee":5,"./AudioView.coffee":20,"./QueueView.coffee":22,"./RoutinesView.coffee":23}],22:[function(require,module,exports){
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



},{}],23:[function(require,module,exports){
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



},{}],24:[function(require,module,exports){
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
},{}],25:[function(require,module,exports){
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
},{}]},{},[3]);
