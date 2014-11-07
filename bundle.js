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

window.DatGUIInterface = (function() {
  function DatGUIInterface() {
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
    this.setupPopup();
    this.setupQueueView();
    return this.setupRoutinesView();
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

  DatGUIInterface.prototype.setupQueueView = function() {
    this.queueView = new QueueView();
    return this.queueView.createView(this.container);
  };

  DatGUIInterface.prototype.setupRoutinesView = function() {};

  DatGUIInterface.prototype.updateText = function() {
    return this.queueView.updateText(this.choreographyRoutine.routineBeat, this.choreographyRoutine.routine);
  };

  return DatGUIInterface;

})();



},{"./QueueView.coffee":"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/interface/QueueView.coffee"}],"/Users/ulyssespopple/Development/js/webgl-visualizer/coffee/interface/QueueView.coffee":[function(require,module,exports){
window.QueueView = (function() {
  function QueueView() {}

  QueueView.prototype.createView = function(target) {
    this.routineView = $("<pre>");
    this.routineView.addClass("routinesView");
    return target.append(this.routineView);
  };

  QueueView.prototype.updateText = function(currentIndex, routineQueue) {
    var html;
    html = [];
    html.push(this.stringify(routineQueue.slice(0, currentIndex)));
    html.push("<span class='bold'>");
    html.push(this.stringify(routineQueue.slice(currentIndex, currentIndex + 1)));
    html.push("</span>");
    html.push(this.stringify(routineQueue.slice(currentIndex + 1)));
    return this.routineView.html(html.join(""));
  };

  QueueView.prototype.stringify = function(json) {
    return JSON.stringify(json, void 0, 2);
  };

  return QueueView;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9BdWRpb1dpbmRvdy5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9DaG9yZW9ncmFwaHlSb3V0aW5lLmNvZmZlZSIsIi9Vc2Vycy91bHlzc2VzcG9wcGxlL0RldmVsb3BtZW50L2pzL3dlYmdsLXZpc3VhbGl6ZXIvY29mZmVlL01haW4uY29mZmVlIiwiL1VzZXJzL3VseXNzZXNwb3BwbGUvRGV2ZWxvcG1lbnQvanMvd2ViZ2wtdmlzdWFsaXplci9jb2ZmZWUvUGxheWVyLmNvZmZlZSIsIi9Vc2Vycy91bHlzc2VzcG9wcGxlL0RldmVsb3BtZW50L2pzL3dlYmdsLXZpc3VhbGl6ZXIvY29mZmVlL1NoYWRlckxvYWRlci5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9WaWV3ZXIuY29mZmVlIiwiL1VzZXJzL3VseXNzZXNwb3BwbGUvRGV2ZWxvcG1lbnQvanMvd2ViZ2wtdmlzdWFsaXplci9jb2ZmZWUvVmlzdWFsaXplci5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9kYW5jZU1hdGVyaWFscy9Db2xvckRhbmNlTWF0ZXJpYWwuY29mZmVlIiwiL1VzZXJzL3VseXNzZXNwb3BwbGUvRGV2ZWxvcG1lbnQvanMvd2ViZ2wtdmlzdWFsaXplci9jb2ZmZWUvZGFuY2VNYXRlcmlhbHMvU2ltcGxlRnJlcXVlbmN5U2hhZGVyLmNvZmZlZSIsIi9Vc2Vycy91bHlzc2VzcG9wcGxlL0RldmVsb3BtZW50L2pzL3dlYmdsLXZpc3VhbGl6ZXIvY29mZmVlL2RhbmNlcnMvQ3ViZURhbmNlci5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9kYW5jZXJzL0RhbmNlci5jb2ZmZWUiLCIvVXNlcnMvdWx5c3Nlc3BvcHBsZS9EZXZlbG9wbWVudC9qcy93ZWJnbC12aXN1YWxpemVyL2NvZmZlZS9kYW5jZXJzL1BvaW50Q2xvdWREYW5jZXIuY29mZmVlIiwiL1VzZXJzL3VseXNzZXNwb3BwbGUvRGV2ZWxvcG1lbnQvanMvd2ViZ2wtdmlzdWFsaXplci9jb2ZmZWUvZGFuY2Vycy9TcGhlcmVEYW5jZXIuY29mZmVlIiwiL1VzZXJzL3VseXNzZXNwb3BwbGUvRGV2ZWxvcG1lbnQvanMvd2ViZ2wtdmlzdWFsaXplci9jb2ZmZWUvZGFuY2VzL1Bvc2l0aW9uRGFuY2UuY29mZmVlIiwiL1VzZXJzL3VseXNzZXNwb3BwbGUvRGV2ZWxvcG1lbnQvanMvd2ViZ2wtdmlzdWFsaXplci9jb2ZmZWUvZGFuY2VzL1JvdGF0ZURhbmNlLmNvZmZlZSIsIi9Vc2Vycy91bHlzc2VzcG9wcGxlL0RldmVsb3BtZW50L2pzL3dlYmdsLXZpc3VhbGl6ZXIvY29mZmVlL2RhbmNlcy9TY2FsZURhbmNlLmNvZmZlZSIsIi9Vc2Vycy91bHlzc2VzcG9wcGxlL0RldmVsb3BtZW50L2pzL3dlYmdsLXZpc3VhbGl6ZXIvY29mZmVlL2ludGVyZmFjZS9EYXRHVUlJbnRlcmZhY2UuY29mZmVlIiwiL1VzZXJzL3VseXNzZXNwb3BwbGUvRGV2ZWxvcG1lbnQvanMvd2ViZ2wtdmlzdWFsaXplci9jb2ZmZWUvaW50ZXJmYWNlL1F1ZXVlVmlldy5jb2ZmZWUiLCJqYXZhc2NyaXB0L09yYml0Q29udHJvbHMuanMiLCJqYXZhc2NyaXB0L1F1ZXVlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQ0EsTUFB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QkFBQTs7SUFERixDQUFBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMgQ29udGFpbnMgdGhlIGZyZXF1ZW5jeVNhbXBsZXMgYW5kIGRiU2FtcGxlcyBmb3IgYXVkaW9cbmNsYXNzIHdpbmRvdy5BdWRpb1dpbmRvd1xuICBAYnVmZmVyU2l6ZTogMjA0OFxuXG4gIGNvbnN0cnVjdG9yOiAocmVzcG9uc2l2ZW5lc3MpIC0+XG4gICAgQHJlc3BvbnNpdmVuZXNzID0gcmVzcG9uc2l2ZW5lc3NcbiAgICBAZnJlcXVlbmN5QnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoQGNvbnN0cnVjdG9yLmJ1ZmZlclNpemUpXG4gICAgQGRiQnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoQGNvbnN0cnVjdG9yLmJ1ZmZlclNpemUpXG4gICAgQHRpbWUgPSAwXG4gICAgQGRlbHRhVGltZSA9IDBcblxuICB1cGRhdGU6IChhbmFseXNlciwgdGltZSkgLT5cbiAgICBpZiAhYW5hbHlzZXJcbiAgICAgIHJldHVyblxuXG4gICAgIyBLZWVwIHRyYWNrIG9mIHRoZSBhdWRpb0NvbnRleHQgdGltZSBpbiBtc1xuICAgIG5ld1RpbWUgPSB0aW1lICogMTAwMFxuICAgIEBkZWx0YVRpbWUgPSBuZXdUaW1lIC0gQHRpbWVcbiAgICBAdGltZSA9IG5ld1RpbWVcblxuICAgIGFuYWx5c2VyLmdldEJ5dGVUaW1lRG9tYWluRGF0YShAZGJCdWZmZXIpXG4gICAgYW5hbHlzZXIuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEoQGZyZXF1ZW5jeUJ1ZmZlcilcblxuICAgIHJtcyA9IDBcblxuICAgIGZvciBidWYgaW4gQGRiQnVmZmVyXG4gICAgICAgIHZhbCA9IChidWYgLSAxMjgpIC8gMTI4XG4gICAgICAgIHJtcyArPSB2YWwqdmFsXG5cbiAgICBAYXZlcmFnZURiID0gTWF0aC5zcXJ0KHJtcyAvIEBjb25zdHJ1Y3Rvci5idWZmZXJTaXplKSAqIEByZXNwb25zaXZlbmVzcyIsImNsYXNzIHdpbmRvdy5DaG9yZW9ncmFwaHlSb3V0aW5lXG4gIGNvbnN0cnVjdG9yOiAoQHZpc3VhbGl6ZXIpIC0+XG4gICAgQGlkID0gMFxuICAgIEBkYW5jZXIgPSBcIkN1YmVEYW5jZXJcIlxuICAgIEBkYW5jZSA9IFwiU2NhbGVEYW5jZVwiXG4gICAgQGRhbmNlTWF0ZXJpYWwgPSBcIkNvbG9yRGFuY2VNYXRlcmlhbFwiXG4gICAgQGRhbmNlclBhcmFtcyA9IHt9XG4gICAgQGRhbmNlUGFyYW1zID0ge31cbiAgICBAZGFuY2VNYXRlcmlhbFBhcmFtcyA9IHt9XG5cbiAgICBAcmVzZXQoKVxuICAgIEByb3V0aW5lID0gW1xuICAgICAgW1xuICAgICAgICB7IGlkOiAtMSB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6IDJcbiAgICAgICAgICBkYW5jZXI6XG4gICAgICAgICAgICB0eXBlOiAnQ3ViZURhbmNlcidcbiAgICAgICAgICBkYW5jZTpcbiAgICAgICAgICAgIHR5cGU6ICdQb3NpdGlvbkRhbmNlJ1xuICAgICAgICAgICAgcGFyYW1zOlxuICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxuICAgICAgICAgICAgICBkaXJlY3Rpb246IFswLCA0LjAsIDBdXG4gICAgICAgICAgZGFuY2VNYXRlcmlhbDpcbiAgICAgICAgICAgIHR5cGU6ICdDb2xvckRhbmNlTWF0ZXJpYWwnXG4gICAgICAgICAgICBwYXJhbXM6XG4gICAgICAgICAgICAgIHNtb290aGluZ0ZhY3RvcjogMC41XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogMFxuICAgICAgICAgIGRhbmNlcjpcbiAgICAgICAgICAgIHR5cGU6ICdQb2ludENsb3VkRGFuY2VyJ1xuICAgICAgICAgIGRhbmNlOlxuICAgICAgICAgICAgdHlwZTogJ1JvdGF0ZURhbmNlJ1xuICAgICAgICAgICAgcGFyYW1zOlxuICAgICAgICAgICAgICBheGlzOiBbLTEsIC0xLCAwXVxuICAgICAgICAgIGRhbmNlTWF0ZXJpYWw6XG4gICAgICAgICAgICB0eXBlOiAnQ29sb3JEYW5jZU1hdGVyaWFsJ1xuICAgICAgICAgICAgcGFyYW1zOlxuICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxuICAgICAgICAgICAgICBtaW5MOiAwLjBcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAxXG4gICAgICAgICAgZGFuY2VyOlxuICAgICAgICAgICAgdHlwZTogJ1BvaW50Q2xvdWREYW5jZXInXG4gICAgICAgICAgZGFuY2U6XG4gICAgICAgICAgICB0eXBlOiAnUm90YXRlRGFuY2UnXG4gICAgICAgICAgICBwYXJhbXM6XG4gICAgICAgICAgICAgIGF4aXM6IFswLCAxLCAxXVxuICAgICAgICAgICAgICBzcGVlZDogMC41XG4gICAgICAgICAgZGFuY2VNYXRlcmlhbDpcbiAgICAgICAgICAgIHR5cGU6ICdDb2xvckRhbmNlTWF0ZXJpYWwnXG4gICAgICAgICAgICBwYXJhbXM6XG4gICAgICAgICAgICAgIHNtb290aGluZ0ZhY3RvcjogMC41XG4gICAgICAgICAgICAgIG1pbkw6IDAuMFxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6IDJcbiAgICAgICAgICBkYW5jZXI6XG4gICAgICAgICAgICB0eXBlOiAnU3BoZXJlRGFuY2VyJ1xuICAgICAgICAgICAgcGFyYW1zOlxuICAgICAgICAgICAgICBwb3NpdGlvbjogWzAuNSwgMCwgMC41XVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6IDNcbiAgICAgICAgICBkYW5jZXI6XG4gICAgICAgICAgICB0eXBlOiAnU3BoZXJlRGFuY2VyJ1xuICAgICAgICAgICAgcGFyYW1zOlxuICAgICAgICAgICAgICBwb3NpdGlvbjogWzAuNSwgMCwgLTAuNV1cbiAgICAgICAgICBkYW5jZTpcbiAgICAgICAgICAgIHR5cGU6ICdTY2FsZURhbmNlJ1xuICAgICAgICAgICAgcGFyYW1zOlxuICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxuICAgICAgICAgIGRhbmNlTWF0ZXJpYWw6XG4gICAgICAgICAgICB0eXBlOiAnQ29sb3JEYW5jZU1hdGVyaWFsJ1xuICAgICAgICAgICAgcGFyYW1zOlxuICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxuICAgICAgICAgICAgICB3aXJlZnJhbWU6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiA0XG4gICAgICAgICAgZGFuY2VyOlxuICAgICAgICAgICAgdHlwZTogJ1NwaGVyZURhbmNlcidcbiAgICAgICAgICAgIHBhcmFtczpcbiAgICAgICAgICAgICAgcG9zaXRpb246IFstMC41LCAwLCAwLjVdXG4gICAgICAgICAgZGFuY2U6XG4gICAgICAgICAgICB0eXBlOiAnU2NhbGVEYW5jZSdcbiAgICAgICAgICAgIHBhcmFtczpcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcbiAgICAgICAgICBkYW5jZU1hdGVyaWFsOlxuICAgICAgICAgICAgdHlwZTogJ0NvbG9yRGFuY2VNYXRlcmlhbCdcbiAgICAgICAgICAgIHBhcmFtczpcbiAgICAgICAgICAgICAgc21vb3RoaW5nRmFjdG9yOiAwLjVcbiAgICAgICAgICAgICAgd2lyZWZyYW1lOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogNVxuICAgICAgICAgIGRhbmNlcjpcbiAgICAgICAgICAgIHR5cGU6ICdTcGhlcmVEYW5jZXInXG4gICAgICAgICAgICBwYXJhbXM6XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBbLTAuNSwgMCwgLTAuNV1cbiAgICAgICAgICBkYW5jZTpcbiAgICAgICAgICAgIHR5cGU6ICdQb3NpdGlvbkRhbmNlJ1xuICAgICAgICAgICAgcGFyYW1zOlxuICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxuICAgICAgICAgIGRhbmNlTWF0ZXJpYWw6XG4gICAgICAgICAgICB0eXBlOiAnQ29sb3JEYW5jZU1hdGVyaWFsJ1xuICAgICAgICAgICAgcGFyYW1zOlxuICAgICAgICAgICAgICBzbW9vdGhpbmdGYWN0b3I6IDAuNVxuICAgICAgICAgICAgICB3aXJlZnJhbWU6IHRydWVcbiAgICAgICAgfSxcbiAgICAgIF1cbiAgICBdXG5cbiMgICAgQHVwZGF0ZVRleHQoKVxuXG4gICMgSW5kaXZpZHVhbCBtb21lbnQgbWV0aG9kc1xuXG4gIHByZXZpZXc6ICgpIC0+XG4gICAgQHZpc3VhbGl6ZXIucmVjZWl2ZUNob3Jlb2dyYXBoeVxuICAgICAgaWQ6IEBpZFxuICAgICAgZGFuY2VyOlxuICAgICAgICB0eXBlOiBAZGFuY2VyXG4gICAgICAgIHBhcmFtczogQGRhbmNlclBhcmFtc1xuICAgICAgZGFuY2U6XG4gICAgICAgIHR5cGU6IEBkYW5jZVxuICAgICAgICBwYXJhbXM6IEBkYW5jZVBhcmFtc1xuICAgICAgZGFuY2VNYXRlcmlhbDpcbiAgICAgICAgdHlwZTogQGRhbmNlTWF0ZXJpYWxcbiAgICAgICAgcGFyYW1zOiBAZGFuY2VNYXRlcmlhbFBhcmFtc1xuXG4gIGFkZDogKCkgLT5cbiAgICBAcm91dGluZU1vbWVudC5wdXNoXG4gICAgICBpZDogQGlkXG4gICAgICBkYW5jZXI6XG4gICAgICAgIHR5cGU6IEBkYW5jZXJcbiAgICAgICAgcGFyYW1zOiBAZGFuY2VyUGFyYW1zXG4gICAgICBkYW5jZTpcbiAgICAgICAgdHlwZTogQGRhbmNlXG4gICAgICAgIHBhcmFtczogQGRhbmNlUGFyYW1zXG4gICAgICBkYW5jZU1hdGVyaWFsOlxuICAgICAgICB0eXBlOiBAZGFuY2VNYXRlcmlhbFxuICAgICAgICBwYXJhbXM6IEBkYW5jZU1hdGVyaWFsUGFyYW1zXG5cbiAgICBAdXBkYXRlVGV4dCgpXG5cbiAgaW5zZXJ0QmVhdDogKCkgLT5cbiAgICBAcm91dGluZU1vbWVudCA9IFtdXG4gICAgQHJvdXRpbmUuc3BsaWNlKCsrQHJvdXRpbmVCZWF0LCAwLCBAcm91dGluZU1vbWVudClcbiAgICBAdXBkYXRlVGV4dCgpXG5cbiAgcGxheU5leHQ6ICgpIC0+XG4gICAgaWYgQHJvdXRpbmVCZWF0ID09IEByb3V0aW5lLmxlbmd0aCAtIDFcbiAgICAgIEByb3V0aW5lQmVhdCA9IC0xXG5cbiAgICBAcm91dGluZU1vbWVudCA9IEByb3V0aW5lWysrQHJvdXRpbmVCZWF0XVxuICAgIGZvciBjaGFuZ2UgaW4gQHJvdXRpbmVNb21lbnRcbiAgICAgIEB2aXN1YWxpemVyLnJlY2VpdmVDaG9yZW9ncmFwaHkgY2hhbmdlXG5cbiAgICBAdXBkYXRlVGV4dCgpXG5cbiAgdXBkYXRlRGFuY2VyOiAoZGFuY2VyKSAtPlxuICAgIEBkYW5jZXIgPSBkYW5jZXIuY29uc3RydWN0b3IubmFtZVxuICAgIEBkYW5jZU1hdGVyaWFsID0gZGFuY2VyLmRhbmNlTWF0ZXJpYWwuY29uc3RydWN0b3IubmFtZVxuICAgIEBkYW5jZSA9IGRhbmNlci5kYW5jZS5jb25zdHJ1Y3Rvci5uYW1lXG5cblxuICAjIEVudGlyZSByb3V0aW5lIG1ldGhvZHNcblxuICBxdWV1ZVJvdXRpbmU6IChyb3V0aW5lRGF0YSkgLT5cbiAgICBBcnJheTo6cHVzaC5hcHBseSBAcm91dGluZSwgcm91dGluZURhdGFcblxuICBjcmVhdGVSb3V0aW5lOiAobmFtZSwgbmV4dCkgLT5cbiAgICAjIFVzZSB0aGUgcm91dGluZSBzZXJ2aWNlIHRvIGNyZWF0ZSBhIHJvdXRpbmVcblxuICByZXNldDogKCkgLT5cbiAgICBAcm91dGluZSA9IFtdXG4gICAgQHJvdXRpbmVNb21lbnQgPSBbXVxuICAgIEByb3V0aW5lQmVhdCA9IC0xXG5cbiAgdXBkYXRlVGV4dDogKCkgLT5cbiAgICBAdmlzdWFsaXplci5pbnRlcmZhY2UudXBkYXRlVGV4dCgpXG5cblxuXG5cblxuXG4iLCIjIFJlcXVpcmUgYWxsIHRoZSBzaGl0XG5yZXF1aXJlICcuL1Zpc3VhbGl6ZXIuY29mZmVlJ1xucmVxdWlyZSAnLi4vamF2YXNjcmlwdC9PcmJpdENvbnRyb2xzJ1xucmVxdWlyZSAnLi9WaWV3ZXIuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnRlcmZhY2UvRGF0R1VJSW50ZXJmYWNlLmNvZmZlZSdcblxuY2xhc3Mgd2luZG93Lk1haW5cbiAgIyBDb25zdHJ1Y3QgdGhlIHNjZW5lXG4gIGNvbnN0cnVjdG9yOiAoaXNWaXN1YWxpemVyKSAtPlxuICAgIEBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpXG4gICAgQHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoIHsgYW50aWFsaWFzOiB0cnVlLCBhbHBoYTogZmFsc2UgfSApXG4gICAgQHJlbmRlcmVyLnNldFNpemUoIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKVxuICAgIEByZW5kZXJlci5hdXRvQ2xlYXIgPSBmYWxzZVxuXG4gICAgQGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSggNzUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAwLjEsIDEwMDAgKVxuICAgIEBjb250cm9scyA9IG5ldyBUSFJFRS5PcmJpdENvbnRyb2xzKCBAY2FtZXJhLCBAcmVuZGVyZXIuZG9tRWxlbWVudCApXG4gICAgQGNvbnRyb2xzLmRhbXBpbmcgPSAwLjJcblxuICAgIGNvbnRyb2xDaGFuZ2UgPSAoKSA9PlxuICAgICAgQHJlbmRlcigpXG5cbiAgICBAY29udHJvbHMuYWRkRXZlbnRMaXN0ZW5lciggJ2NoYW5nZScsIGNvbnRyb2xDaGFuZ2UgKVxuXG4gICAgQGNhbWVyYS5wb3NpdGlvbi56ID0gLTRcbiAgICBAY2FtZXJhLnBvc2l0aW9uLnkgPSAzXG4gICAgQGNvbnRyb2xzLnRhcmdldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCAwLCAwLCAwIClcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAncmVzaXplJywgQG9uV2luZG93UmVzaXplLCBmYWxzZSApXG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKEByZW5kZXJlci5kb21FbGVtZW50KVxuXG4gICAgQHZpZXdlciA9IG5ldyBWaWV3ZXIoQHNjZW5lLCBAY2FtZXJhKVxuICAgIGlmIGlzVmlzdWFsaXplclxuICAgICAgQHZpc3VhbGl6ZXIgPSBuZXcgVmlzdWFsaXplcihAdmlld2VyLCBuZXcgRGF0R1VJSW50ZXJmYWNlKCkpXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIEB2aXN1YWxpemVyLm9uS2V5RG93bi5iaW5kKEB2aXN1YWxpemVyKSwgZmFsc2UpXG4gICAgZWxzZVxuICAgICAgQGRvbWFpbiA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdFxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ21lc3NhZ2UnLCAoZXZlbnQpID0+XG4gICAgICAgIGlmIGV2ZW50Lm9yaWdpbiAhPSBAZG9tYWluIHRoZW4gcmV0dXJuXG4gICAgICAgIHNlbnRPYmogPSBldmVudC5kYXRhXG4gICAgICAgIGlmIHNlbnRPYmoudHlwZSA9PSAncmVuZGVyJ1xuICAgICAgICAgIEB2aWV3ZXIucmVuZGVyIHNlbnRPYmouZGF0YVxuICAgICAgICBpZiBzZW50T2JqLnR5cGUgPT0gJ2Nob3Jlb2dyYXBoeSdcbiAgICAgICAgICBAdmlld2VyLnJlY2VpdmVDaG9yZW9ncmFwaHkgc2VudE9iai5kYXRhXG5cbiAgYW5pbWF0ZTogKCkgLT5cbiAgICBAcmVuZGVyKClcbiAgICBAY29udHJvbHMudXBkYXRlKClcblxuICByZW5kZXI6ICgpIC0+XG4gICAgQHZpc3VhbGl6ZXI/LnJlbmRlcigpICBcblxuICAgIEBzY2VuZS51cGRhdGVNYXRyaXhXb3JsZCgpXG4gICAgQGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KClcbiAgICBAcmVuZGVyZXIuY2xlYXIoKVxuICAgIEByZW5kZXJlci5yZW5kZXIoQHNjZW5lLCBAY2FtZXJhKVxuICAgIHJldHVyblxuXG4gIG9uV2luZG93UmVzaXplOiAoKSA9PlxuICAgIEBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICBAY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKVxuICAgIEByZW5kZXJlci5zZXRTaXplKCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0IClcblxud2luZG93LmFuaW1hdGUgPSAoKSAtPlxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUod2luZG93LmFuaW1hdGUpXG4gIHdpbmRvdy5hcHAuYW5pbWF0ZSgpXG5cbiQgLT5cbiAgZGF0LkdVSS5wcm90b3R5cGUucmVtb3ZlRm9sZGVyID0gKG5hbWUpIC0+XG4gICAgZm9sZGVyID0gIHRoaXMuX19mb2xkZXJzW25hbWVdXG4gICAgaWYgIWZvbGRlclxuICAgICAgcmV0dXJuXG4gICAgZm9sZGVyLmNsb3NlKClcbiAgICB0aGlzLl9fdWwucmVtb3ZlQ2hpbGQoZm9sZGVyLmRvbUVsZW1lbnQucGFyZW50Tm9kZSlcbiAgICBkZWxldGUgdGhpcy5fX2ZvbGRlcnNbbmFtZV1cbiAgICB0aGlzLm9uUmVzaXplKCkiLCJyZXF1aXJlICcuL0F1ZGlvV2luZG93LmNvZmZlZSdcblxuIyBQbGF5cyB0aGUgYXVkaW8gYW5kIGNyZWF0ZXMgYW4gYW5hbHlzZXJcbmNsYXNzIHdpbmRvdy5QbGF5ZXJcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgQGF1ZGlvV2luZG93ID0gbmV3IEF1ZGlvV2luZG93KDEpO1xuICAgIEBsb2FkZWRBdWRpbyA9IG5ldyBBcnJheSgpXG4gICAgQHN0YXJ0T2Zmc2V0ID0gMFxuICAgIEBzZXR1cEFuYWx5c2VyKClcblxuICBzZXR1cEFuYWx5c2VyOiAoKSAtPlxuICAgIHdpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHRcbiAgICBAYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpXG4gICAgQGFuYWx5c2VyID0gQGF1ZGlvQ29udGV4dC5jcmVhdGVBbmFseXNlcigpXG4gICAgQGFuYWx5c2VyLmZmdFNpemUgPSBBdWRpb1dpbmRvdy5idWZmZXJTaXplXG5cbiAgdXBkYXRlOiAoKSAtPlxuICAgIEBhdWRpb1dpbmRvdy51cGRhdGUoQGFuYWx5c2VyLCBAYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKVxuXG4gIHBhdXNlOiAoKSAtPlxuICAgIEBzb3VyY2Uuc3RvcCgpXG4gICAgQHBsYXlpbmcgPSBmYWxzZVxuICAgIEBzdGFydE9mZnNldCArPSBAYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lIC0gQHN0YXJ0VGltZVxuXG4gIGNyZWF0ZUxpdmVJbnB1dDogKCkgLT5cbiAgICBnb3RTdHJlYW0gPSAoc3RyZWFtKSA9PlxuICAgICAgQHBsYXlpbmcgPSB0cnVlXG4gICAgICBAc291cmNlID0gQGF1ZGlvQ29udGV4dC5jcmVhdGVNZWRpYVN0cmVhbVNvdXJjZSBzdHJlYW1cbiAgICAgIEBzb3VyY2UuY29ubmVjdCBAYW5hbHlzZXJcblxuICAgIEBkYlNhbXBsZUJ1ZiA9IG5ldyBVaW50OEFycmF5KDIwNDgpXG5cbiAgICBpZiAoIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgKVxuICAgICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSh7IGF1ZGlvOiB0cnVlIH0sIGdvdFN0cmVhbSwgKGVycikgLT5cbiAgICAgICAgY29uc29sZS5sb2coZXJyKSlcbiAgICBlbHNlIGlmIChuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhIClcbiAgICAgIG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSB9LCBnb3RTdHJlYW0sIChlcnIpIC0+XG4gICAgICAgIGNvbnNvbGUubG9nKGVycikpXG4gICAgZWxzZSBpZiAobmF2aWdhdG9yLm1vekdldFVzZXJNZWRpYSApXG4gICAgICBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSwgZ290U3RyZWFtLCAoZXJyKSAtPlxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybihhbGVydChcIkVycm9yOiBnZXRVc2VyTWVkaWEgbm90IHN1cHBvcnRlZCFcIikpO1xuXG4gIHBsYXk6ICh1cmwpIC0+XG4gICAgQGN1cnJlbnRseVBsYXlpbmcgPSB1cmxcblxuICAgIGlmIEBsb2FkZWRBdWRpb1t1cmxdP1xuICAgICAgQGxvYWRGcm9tQnVmZmVyKEBsb2FkZWRBdWRpb1t1cmxdKVxuICAgICAgcmV0dXJuXG5cbiAgICByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICByZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKVxuICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJ1xuICAgIHJlcXVlc3Qub25sb2FkID0gKCkgPT5cbiAgICAgIEBhdWRpb0NvbnRleHQuZGVjb2RlQXVkaW9EYXRhIHJlcXVlc3QucmVzcG9uc2VcbiAgICAgICwgKGJ1ZmZlcikgPT5cbiAgICAgICAgQGxvYWRlZEF1ZGlvW3VybF0gPSBidWZmZXJcbiAgICAgICAgQGxvYWRGcm9tQnVmZmVyKGJ1ZmZlcilcbiAgICAgICwgKGVycikgLT5cbiAgICAgICAgY29uc29sZS5sb2coZXJyKVxuICAgICAgcmV0dXJuXG5cbiAgICByZXF1ZXN0LnNlbmQoKVxuICAgIHJldHVyblxuXG4gIGxvYWRGcm9tQnVmZmVyOiAoYnVmZmVyKSAtPlxuICAgIEBzdGFydFRpbWUgPSBAYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lXG4gICAgQHNvdXJjZSA9IEBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKClcbiAgICBAc291cmNlLmJ1ZmZlciA9IGJ1ZmZlclxuICAgIEBzb3VyY2UuY29ubmVjdChAYW5hbHlzZXIpXG4gICAgQHNvdXJjZS5jb25uZWN0KEBhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pXG4gICAgQHBsYXlpbmcgPSB0cnVlXG4gICAgQHNvdXJjZS5zdGFydCgwLCBAc3RhcnRPZmZzZXQpXG5cbiAgcGF1c2U6ICgpIC0+XG4gICAgaWYgQHBsYXllci5wbGF5aW5nIHRoZW4gQHBhdXNlKCkgZWxzZSBAcGxheShAY3VycmVudGx5UGxheWluZykiLCJjbGFzcyB3aW5kb3cuU2hhZGVyTG9hZGVyXG4gICMgQ29uc3RydWN0IHRoZSBzaGFkZXIgY2FjaGVcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgQHNoYWRlcnMgPSBuZXcgQXJyYXkoKVxuXG4gICMgVGFrZXMgYSBuYW1lIGFuZCBhIGNhbGxiYWNrLCBsb2FkcyB0aGF0IHNoYWRlciBmcm9tIC9zaGFkZXJzLCBjYWNoZXMgdGhlIHJlc3VsdFxuICBsb2FkOiAobmFtZSwgbmV4dCkgLT5cbiAgICBpZiBAc2hhZGVyc1tuYW1lXT9cbiAgICAgIG5leHQoQHNoYWRlcnNbbmFtZV0pXG4gICAgZWxzZVxuICAgICAgQHNoYWRlcnNbbmFtZV0gPSB7dmVydGV4U2hhZGVyOiAnJywgZnJhZ21lbnRTaGFkZXI6ICcnfVxuICAgICAgQGxvYWRGcm9tVXJsKG5hbWUsICdzaGFkZXJzLycgKyBuYW1lLCBuZXh0KVxuXG4gICMgTG9hZHMgdGhlIHNoYWRlcmZyb20gYSBVUkxcbiAgbG9hZEZyb21Vcmw6IChuYW1lLCB1cmwsIG5leHQpIC0+XG5cbiAgICBsb2FkZWRTaGFkZXIgPSAoanFYSFIsIHRleHRTdGF0dXMpIC0+XG4gICAgICBAc2hhZGVyc1tAbmFtZV1bQHR5cGVdID0ganFYSFIucmVzcG9uc2VUZXh0XG4gICAgICBpZiAoQHNoYWRlcnNbQG5hbWVdLnZlcnRleFNoYWRlcj8gJiYgQHNoYWRlcnNbQG5hbWVdLmZyYWdtZW50U2hhZGVyKVxuICAgICAgICBuZXh0KEBzaGFkZXJzW0BuYW1lXSlcblxuICAgICQuYWpheFxuICAgICAgdXJsOiB1cmwgKyAnLnZlcnQnXG4gICAgICBkYXRhVHlwZTogJ3RleHQnXG4gICAgICBjb250ZXh0OiB7XG4gICAgICAgIG5hbWU6IG5hbWVcbiAgICAgICAgdHlwZTogJ3ZlcnRleFNoYWRlcidcbiAgICAgICAgbmV4dDogbmV4dFxuICAgICAgICBzaGFkZXJzOiBAc2hhZGVyc1xuICAgICAgfVxuICAgICAgY29tcGxldGU6IGxvYWRlZFNoYWRlciBcblxuICAgICQuYWpheFxuICAgICAgdXJsOiB1cmwgKyAnLmZyYWcnXG4gICAgICBkYXRhVHlwZTogJ3RleHQnXG4gICAgICBjb250ZXh0OiB7XG4gICAgICAgIG5hbWU6IG5hbWVcbiAgICAgICAgdHlwZTogJ2ZyYWdtZW50U2hhZGVyJ1xuICAgICAgICBuZXh0OiBuZXh0XG4gICAgICAgIHNoYWRlcnM6IEBzaGFkZXJzXG4gICAgICB9XG4gICAgICBjb21wbGV0ZTogbG9hZGVkU2hhZGVyIFxuXG4gICAgcmV0dXJuIiwicmVxdWlyZSAnLi9TaGFkZXJMb2FkZXIuY29mZmVlJ1xucmVxdWlyZSAnLi4vamF2YXNjcmlwdC9RdWV1ZS5qcydcblxuY2xhc3Mgd2luZG93LlZpZXdlclxuICBjb25zdHJ1Y3RvcjogKHNjZW5lLCBjYW1lcmEpIC0+XG4gICAgQHNjZW5lID0gc2NlbmVcbiAgICBAZGFuY2VycyA9IG5ldyBBcnJheSgpXG4gICAgQHNoYWRlckxvYWRlciA9IG5ldyBTaGFkZXJMb2FkZXIoKVxuXG4gICAgQGNob3Jlb2dyYXBoeVF1ZXVlID0gbmV3IFF1ZXVlKClcblxuICByZWNlaXZlQ2hvcmVvZ3JhcGh5OiAobW92ZSkgLT5cbiAgICBAY2hvcmVvZ3JhcGh5UXVldWUucHVzaChtb3ZlKVxuXG4gIGV4ZWN1dGVDaG9yZW9ncmFwaHk6ICh7aWQsIGRhbmNlciwgZGFuY2UsIGRhbmNlTWF0ZXJpYWwgfSkgLT5cbiAgICBpZiBpZCA9PSAtMVxuICAgICAgZm9yIGRhbmNlciBpbiBAZGFuY2Vyc1xuICAgICAgICBAc2NlbmUucmVtb3ZlKGRhbmNlci5ib2R5KVxuICAgICAgQGRhbmNlcnMgPSBbXVxuICAgICAgcmV0dXJuXG4gICAgaWYgQGRhbmNlcnNbaWRdP1xuICAgICAgIyBUZXN0IGV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgY3VycmVudERhbmNlciA9IEBkYW5jZXJzW2lkXVxuXG4gICAgICAjIElmIG5vIHBhcmFtZXRlcnMgYXJlIHNldCwgYnV0IGFuIGlkIGlzLCB0aGVuIHJlbW92ZSB0aGUgb2JqZWN0XG4gICAgICBpZiAhZGFuY2VyPyAmJiAhZGFuY2UgJiYgIWRhbmNlTWF0ZXJpYWxcbiAgICAgICAgQHNjZW5lLnJlbW92ZShjdXJyZW50RGFuY2VyLmJvZHkpXG4gICAgICAgIEBkYW5jZXJzLnNwbGljZShAZGFuY2Vycy5pbmRleE9mKGlkKSwgMSlcblxuICAgICAgaWYgZGFuY2U/IFxuICAgICAgICBpZiAhZGFuY2VyPyAmJiAhZGFuY2VNYXRlcmlhbD9cbiAgICAgICAgICBjdXJyZW50RGFuY2VyLnJlc2V0KClcbiAgICAgICAgICBjdXJyZW50RGFuY2VyLmRhbmNlID0gbmV3IFZpc3VhbGl6ZXIuZGFuY2VUeXBlc1tkYW5jZS50eXBlXShkYW5jZS5wYXJhbXMpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBuZXdEYW5jZSA9IG5ldyBWaXN1YWxpemVyLmRhbmNlVHlwZXNbZGFuY2UudHlwZV0oZGFuY2UucGFyYW1zKVxuICAgICAgZWxzZVxuICAgICAgICBuZXdEYW5jZSA9IGN1cnJlbnREYW5jZXIuZGFuY2VcblxuICAgICAgYWRkRGFuY2VyID0gKG5ld0RhbmNlLCBuZXdNYXRlcmlhbCkgPT5cbiAgICAgICAgaWYgZGFuY2VyP1xuICAgICAgICAgIG5ld0RhbmNlciA9IG5ldyBWaXN1YWxpemVyLmRhbmNlclR5cGVzW2RhbmNlci50eXBlXShuZXdEYW5jZSwgbmV3TWF0ZXJpYWwsIGRhbmNlci5wYXJhbXMpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBuZXdEYW5jZXIgPSBuZXcgY3VycmVudERhbmNlci5jb25zdHJ1Y3RvcihuZXdEYW5jZSwgbmV3TWF0ZXJpYWwpXG5cbiAgICAgICAgY3VycmVudERhbmNlci5yZXNldCgpXG4gICAgICAgIEBzY2VuZS5yZW1vdmUoY3VycmVudERhbmNlci5ib2R5KVxuICAgICAgICBAZGFuY2Vyc1tpZF0gPSBuZXdEYW5jZXJcbiAgICAgICAgQHNjZW5lLmFkZChuZXdEYW5jZXIuYm9keSlcblxuICAgICAgaWYgZGFuY2VNYXRlcmlhbD9cbiAgICAgICAgIyBTcGVjaWFsIGNhc2UgZm9yIHNoYWRlcnMgYmVjYXVzZSBpdCBoYXMgdG8gbG9hZCB0aGUgc2hhZGVyIGZpbGVcbiAgICAgICAgIyBUaGlzIGlzIGEgcmVhbGx5IGhhY2t5IHdheSBvZiBjaGVja2luZyBpZiBpdCdzIGEgc2hhZGVyLiBTaG91bGQgY2hhbmdlLlxuICAgICAgICBpZiBkYW5jZU1hdGVyaWFsLnR5cGUuaW5kZXhPZignU2hhZGVyJykgPiAtMVxuICAgICAgICAgIG5ld01hdGVyaWFsID0gbmV3IFZpc3VhbGl6ZXIuZGFuY2VNYXRlcmlhbFR5cGVzW2RhbmNlTWF0ZXJpYWwudHlwZV0oQHNoYWRlckxvYWRlcilcbiAgICAgICAgICBuZXdNYXRlcmlhbC5sb2FkU2hhZGVyIChzaGFkZXJNYXRlcmlhbCkgPT5cbiAgICAgICAgICAgIGFkZERhbmNlciBuZXdEYW5jZSwgc2hhZGVyTWF0ZXJpYWxcbiAgICAgICAgICByZXR1cm5cblxuICAgICAgICBuZXdNYXRlcmlhbCA9IG5ldyBWaXN1YWxpemVyLmRhbmNlTWF0ZXJpYWxUeXBlc1tkYW5jZU1hdGVyaWFsLnR5cGVdKGRhbmNlTWF0ZXJpYWwucGFyYW1zKVxuICAgICAgZWxzZVxuICAgICAgICBuZXdNYXRlcmlhbCA9IGN1cnJlbnREYW5jZXIuZGFuY2VNYXRlcmlhbFxuXG4gICAgICBhZGREYW5jZXIobmV3RGFuY2UsIG5ld01hdGVyaWFsKVxuXG4gICAgICByZXR1cm5cbiAgICBlbHNlIGlmIGlkP1xuICAgICAgQGRhbmNlcnNbaWRdID0gbmV3IFZpc3VhbGl6ZXIuZGFuY2VyVHlwZXNbZGFuY2VyLnR5cGVdKG5ldyBWaXN1YWxpemVyLmRhbmNlVHlwZXNbZGFuY2UudHlwZV0oZGFuY2UucGFyYW1zKSwgbmV3IFZpc3VhbGl6ZXIuZGFuY2VNYXRlcmlhbFR5cGVzW2RhbmNlTWF0ZXJpYWwudHlwZV0oZGFuY2VNYXRlcmlhbC5wYXJhbXMpLCBkYW5jZXIucGFyYW1zKVxuICAgICAgQHNjZW5lLmFkZCBAZGFuY2Vyc1tpZF0uYm9keVxuICAgICAgcmV0dXJuXG4gICAgZWxzZVxuICAgICAgcmV0dXJuXG5cbiAgZ2V0RGFuY2VyOiAoaWQpIC0+XG4gICAgQGRhbmNlcnNbaWRdXG5cblxuICAjIFJlbmRlciB0aGUgc2NlbmUgYnkgZ29pbmcgdGhyb3VnaCB0aGUgQXVkaW9PYmplY3QgYXJyYXkgYW5kIGNhbGxpbmcgdXBkYXRlKGF1ZGlvRXZlbnQpIG9uIGVhY2ggb25lXG4gIHJlbmRlcjogKGF1ZGlvV2luZG93KSAtPlxuICAgIHdoaWxlIEBjaG9yZW9ncmFwaHlRdWV1ZS5sZW5ndGgoKSA+IDBcbiAgICAgIEBleGVjdXRlQ2hvcmVvZ3JhcGh5IEBjaG9yZW9ncmFwaHlRdWV1ZS5zaGlmdCgpXG4gICAgIyBDcmVhdGUgZXZlbnRcbiAgICBmb3IgaWQgaW4gT2JqZWN0LmtleXMoQGRhbmNlcnMpXG4gICAgICBAZGFuY2Vyc1tpZF0udXBkYXRlKGF1ZGlvV2luZG93KVxuXG4gICMgUmVtb3ZlcyB0aGUgbGFzdCBkYW5jZXIsIHJldHVybnMgdGhlIGRhbmNlcidzIGRhbmNlXG4gIHJlbW92ZUxhc3REYW5jZXI6ICgpIC0+XG4gICAgcHJldkRhbmNlciA9IEBkYW5jZXJzLnBvcCgpXG4gICAgQHNjZW5lLnJlbW92ZShwcmV2RGFuY2VyLmJvZHkpIFxuICAgIHJldHVybiBwcmV2RGFuY2VyLmRhbmNlIiwicmVxdWlyZSAnLi9QbGF5ZXIuY29mZmVlJ1xucmVxdWlyZSAnLi9DaG9yZW9ncmFwaHlSb3V0aW5lLmNvZmZlZSdcbnJlcXVpcmUgJy4vZGFuY2Vycy9DdWJlRGFuY2VyLmNvZmZlZSdcbnJlcXVpcmUgJy4vZGFuY2Vycy9TcGhlcmVEYW5jZXIuY29mZmVlJ1xucmVxdWlyZSAnLi9kYW5jZXJzL1BvaW50Q2xvdWREYW5jZXIuY29mZmVlJ1xucmVxdWlyZSAnLi9kYW5jZXMvU2NhbGVEYW5jZS5jb2ZmZWUnXG5yZXF1aXJlICcuL2RhbmNlcy9Qb3NpdGlvbkRhbmNlLmNvZmZlZSdcbnJlcXVpcmUgJy4vZGFuY2VzL1JvdGF0ZURhbmNlLmNvZmZlZSdcbnJlcXVpcmUgJy4vZGFuY2VNYXRlcmlhbHMvQ29sb3JEYW5jZU1hdGVyaWFsLmNvZmZlZSdcbnJlcXVpcmUgJy4vZGFuY2VNYXRlcmlhbHMvU2ltcGxlRnJlcXVlbmN5U2hhZGVyLmNvZmZlZSdcblxuY2xhc3Mgd2luZG93LlZpc3VhbGl6ZXJcbiAgIyBHZXQgdGhvc2Uga2V5cyBzZXQgdXBcbiAga2V5czogeyBQQVVTRTogMzIsIE5FWFQ6IDc4IH1cblxuICAjIFNldCB1cCB0aGUgc2NlbmUgYmFzZWQgb24gYSBNYWluIG9iamVjdCB3aGljaCBjb250YWlucyB0aGUgc2NlbmUuXG4gIGNvbnN0cnVjdG9yOiAoQHZpZXdlciwgQGludGVyZmFjZSkgLT5cbiAgICBAcGxheWVyID0gbmV3IFBsYXllcigpXG5cbiAgICAjIExvYWQgdGhlIHNhbXBsZSBhdWRpb1xuICAgICMgQHBsYXkoJ2F1ZGlvL0dvLm1wMycpXG4gICAgIyBAcGxheSgnYXVkaW8vR2xhc3Nlci5tcDMnKVxuICAgICMgQHBsYXkoJ2F1ZGlvL09uTXlNaW5kLm1wMycpXG5cbiAgICBAcGxheWVyLmNyZWF0ZUxpdmVJbnB1dCgpXG5cbiAgICBAY2hvcmVvZ3JhcGh5Um91dGluZSA9IG5ldyBDaG9yZW9ncmFwaHlSb3V0aW5lKEApXG5cbiAgICBAaW50ZXJmYWNlLnNldHVwUG9wdXAoKVxuICAgIEBpbnRlcmZhY2Uuc2V0dXAoQHBsYXllciwgQGNob3Jlb2dyYXBoeVJvdXRpbmUsIEB2aWV3ZXIpXG5cbiAgICBAY2hvcmVvZ3JhcGh5Um91dGluZS5wbGF5TmV4dCgpXG5cbiAgcmVjZWl2ZUNob3Jlb2dyYXBoeTogKG1vdmUpIC0+XG4gICAgQHZpZXdlci5yZWNlaXZlQ2hvcmVvZ3JhcGh5IG1vdmVcbiAgICBpZiBAcG9wdXA/IHRoZW4gQHBvcHVwLnBvc3RNZXNzYWdlKEB3cmFwTWVzc2FnZSgnY2hvcmVvZ3JhcGh5JywgbW92ZSksIEBkb21haW4pXG5cbiAgcmVuZGVyOiAoKSAtPlxuICAgIGlmICFAcGxheWVyLnBsYXlpbmdcbiAgICAgIHJldHVyblxuXG4gICAgQHBsYXllci51cGRhdGUoKVxuXG4gICAgQHZpZXdlci5yZW5kZXIoQHBsYXllci5hdWRpb1dpbmRvdylcbiAgICBpZiBAcG9wdXA/IHRoZW4gQHBvcHVwLnBvc3RNZXNzYWdlKEB3cmFwTWVzc2FnZSgncmVuZGVyJywgQHBsYXllci5hdWRpb1dpbmRvdyksIEBkb21haW4pXG5cbiAgd3JhcE1lc3NhZ2U6ICh0eXBlLCBkYXRhKSAtPlxuICAgIHR5cGU6IHR5cGVcbiAgICBkYXRhOiBkYXRhXG5cbiAgI0V2ZW50IG1ldGhvZHNcbiAgb25LZXlEb3duOiAoZXZlbnQpIC0+XG4gICAgc3dpdGNoIGV2ZW50LmtleUNvZGVcbiAgICAgIHdoZW4gQGtleXMuUEFVU0VcbiAgICAgICAgQHBsYXllci5wYXVzZSgpXG4gICAgICB3aGVuIEBrZXlzLk5FWFRcbiAgICAgICAgQGNob3Jlb2dyYXBoeVJvdXRpbmUucGxheU5leHQoKVxuXG4gIEBkYW5jZXJUeXBlczpcbiAgICBDdWJlRGFuY2VyOiBDdWJlRGFuY2VyXG4gICAgU3BoZXJlRGFuY2VyOiBTcGhlcmVEYW5jZXJcbiAgICBQb2ludENsb3VkRGFuY2VyOiBQb2ludENsb3VkRGFuY2VyXG5cbiAgQGRhbmNlVHlwZXM6XG4gICAgU2NhbGVEYW5jZTogU2NhbGVEYW5jZVxuICAgIFBvc2l0aW9uRGFuY2U6IFBvc2l0aW9uRGFuY2VcbiAgICBSb3RhdGVEYW5jZTogUm90YXRlRGFuY2VcblxuICBAZGFuY2VNYXRlcmlhbFR5cGVzOlxuICAgIENvbG9yRGFuY2VNYXRlcmlhbDogQ29sb3JEYW5jZU1hdGVyaWFsXG4gICAgU2ltcGxlRnJlcXVlbmN5U2hhZGVyOiBTaW1wbGVGcmVxdWVuY3lTaGFkZXJcbiIsImNsYXNzIHdpbmRvdy5Db2xvckRhbmNlTWF0ZXJpYWxcbiAgQHBhcmFtczogXG4gICAgW1xuICAgICAge1xuICAgICAgICBuYW1lOiAnc21vb3RoaW5nRmFjdG9yJyxcbiAgICAgICAgZGVmYXVsdDogMC41XG4gICAgICB9LCBcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ21pbkwnLFxuICAgICAgICBkZWZhdWx0OiAwLjFcbiAgICAgIH0sIFxuICAgICAge1xuICAgICAgICBuYW1lOiAnbWluUycsXG4gICAgICAgIGRlZmF1bHQ6IDAuM1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3dpcmVmcmFtZSdcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIH1cbiAgICBdXG5cbiAgQG5hbWU6IFwiQ29sb3JEYW5jZU1hdGVyaWFsXCJcblxuICBjb25zdHJ1Y3RvcjogKEBvcHRpb25zKSAtPlxuICAgIGlmIEBvcHRpb25zPyB0aGVuIHsgQHNtb290aGluZ0ZhY3RvciwgQG1pbkwsIEBtaW5TLCBAd2lyZWZyYW1lIH0gPSBAb3B0aW9uc1xuICAgIEBzbW9vdGhpbmdGYWN0b3IgPz0gMC41XG4gICAgQG1pbkwgPz0gMC4xXG4gICAgQG1pblMgPz0gMC4zXG4gICAgQHdpcmVmcmFtZSA/PSBmYWxzZVxuICAgIEBjb2xvciA9IG5ldyBUSFJFRS5Db2xvcigxLjAsIDAsIDApXG4gICAgQG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoeyBjb2xvcjogMHgwMDAwMCwgd2lyZWZyYW1lOiBAd2lyZWZyYW1lIH0pXG4gICAgQGFwcGxpZWRDb2xvciA9IEBjb2xvci5jbG9uZSgpXG5cbiAgdXBkYXRlOiAoYXVkaW9XaW5kb3csIGRhbmNlcikgLT5cblxuICAgIG1heFZhbHVlID0gMFxuICAgIG1heEluZGV4ID0gLTFcbiAgICBtYXhJbXBvcnRhbnRJbmRleCA9IDFcbiAgICBmb3IgaSBpbiBbMS4uQXVkaW9XaW5kb3cuYnVmZmVyU2l6ZV1cbiAgICAgIGZyZXEgPSBhdWRpb1dpbmRvdy5mcmVxdWVuY3lCdWZmZXJbaV1cbiAgICAgIHZhbHVlID0gZnJlcSAqIGlcbiAgICAgIGlmICh2YWx1ZSA+IG1heFZhbHVlKVxuICAgICAgICBtYXhWYWx1ZSA9IHZhbHVlXG4gICAgICAgIG1heEluZGV4ID0gaVxuXG4gICAgb2xkQ29sb3JIU0wgPSBAYXBwbGllZENvbG9yLmdldEhTTCgpXG5cbiAgICBuZXdDb2xvclMgPSBtYXhJbmRleCAvIEF1ZGlvV2luZG93LmJ1ZmZlclNpemU7XG4gICAgbmV3Q29sb3JTID0gQHNtb290aGluZ0ZhY3RvciAqIG5ld0NvbG9yUyArICgxIC0gQHNtb290aGluZ0ZhY3RvcikgKiBvbGRDb2xvckhTTC5zXG5cbiAgICBuZXdDb2xvckwgPSBhdWRpb1dpbmRvdy5hdmVyYWdlRGJcbiAgICBuZXdDb2xvckwgPSBAc21vb3RoaW5nRmFjdG9yICogbmV3Q29sb3JMICsgKDEgLSBAc21vb3RoaW5nRmFjdG9yKSAqIG9sZENvbG9ySFNMLmxcblxuICAgIGwgPSBAbWluTCArIG5ld0NvbG9yTCAqICgxLjAgLSBAbWluTClcbiAgICBzID0gQG1pblMgKyBuZXdDb2xvclMgKiAoMS4wIC0gQG1pblMpXG5cbiAgICBuZXdDb2xvckggPSAoMzYwICogKGF1ZGlvV2luZG93LnRpbWUgLyAxMDAwMCkgJSAzNjApIC8gMzYwXG5cbiAgICBoc2wgPSBAY29sb3IuZ2V0SFNMKClcbiAgICBAYXBwbGllZENvbG9yLnNldEhTTChuZXdDb2xvckgsIHMsIGwpXG5cbiAgICBpZiBkYW5jZXI/XG4gICAgICBpZiBkYW5jZXIuYm9keS5tYXRlcmlhbC5lbWlzc2l2ZT9cbiAgICAgICAgZGFuY2VyLmJvZHkubWF0ZXJpYWwuZW1pc3NpdmUuY29weShAYXBwbGllZENvbG9yKVxuXG4gICAgICBkYW5jZXIuYm9keS5tYXRlcmlhbC5jb2xvci5jb3B5KEBhcHBsaWVkQ29sb3IpXG4iLCJjbGFzcyB3aW5kb3cuU2ltcGxlRnJlcXVlbmN5U2hhZGVyXG4gIEBwYXJhbXM6IFtdXG5cbiAgQG5hbWU6IFwiU2ltcGxlRnJlcXVlbmN5U2hhZGVyXCJcbiAgXG4gIGNvbnN0cnVjdG9yOiAoc2hhZGVyTG9hZGVyKSAtPlxuICAgIEB0YXJnZXQgPSAxMjhcbiAgICBAc2l6ZSA9IDEwMjRcbiAgICBAc2hhZGVyTG9hZGVyID0gc2hhZGVyTG9hZGVyXG4gICAgQG5ld1RleEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoQHRhcmdldCAqIEB0YXJnZXQgKiA0KVxuXG4gIGxvYWRTaGFkZXI6IChuZXh0KSAtPlxuICAgIEBzaGFkZXJMb2FkZXIubG9hZCAnc2ltcGxlX2ZyZXF1ZW5jeScsIChzaGFkZXIpID0+XG4gICAgICBzaGFkZXIudW5pZm9ybXMgPSB7XG4gICAgICAgIGZyZXFUZXh0dXJlOiB7dHlwZTogXCJ0XCIsIHZhbHVlOiBBdWRpb1dpbmRvdy5idWZmZXJTaXplfVxuICAgICAgICByZXNvbHV0aW9uOiB7IHR5cGU6IFwidjJcIiwgdmFsdWU6IG5ldyBUSFJFRS5WZWN0b3IyKDEyOCwgMTI4KX1cbiAgICAgIH1cblxuICAgICAgQG1hdGVyaWFsID0gbmV3IFRIUkVFLlNoYWRlck1hdGVyaWFsKHNoYWRlcilcbiAgICAgIEBtYXRlcmlhbC5zaWRlID0gVEhSRUUuRG91YmxlU2lkZVxuICAgICAgQG1hdGVyaWFsLnRyYW5zcGFyZW50ID0gdHJ1ZVxuICAgICAgbmV4dChAKVxuXG5cbiAgdXBkYXRlOiAoYXVkaW9XaW5kb3csIGRhbmNlcikgLT5cbiAgICBkYW5jZXIuYm9keS5tYXRlcmlhbC51bmlmb3Jtcy5mcmVxVGV4dHVyZS52YWx1ZSA9IEByZWR1Y2VBcnJheShhdWRpb1dpbmRvdy5mcmVxdWVuY3lCdWZmZXIpXG5cbiAgcmVkdWNlQXJyYXk6IChmcmVxQnVmKSAtPlxuXG4gICAgbmV3QnVmID0gbmV3IEFycmF5KEB0YXJnZXQpXG5cbiAgICBtb3ZpbmdTdW0gPSAwXG4gICAgZmxvb3JlZFJhdGlvID0gTWF0aC5mbG9vcihAc2l6ZSAvIEB0YXJnZXQpXG4gICAgZm9yIGkgaW4gWzEuLi5Ac2l6ZV1cbiAgICAgIG1vdmluZ1N1bSArPSBmcmVxQnVmW2ldXG5cbiAgICAgIGlmICgoaSArIDEpICUgZmxvb3JlZFJhdGlvKSA9PSAwXG4gICAgICAgIG5ld0J1ZltNYXRoLmZsb29yKGkgIC8gZmxvb3JlZFJhdGlvKV0gPSBtb3ZpbmdTdW0gLyBmbG9vcmVkUmF0aW9cbiAgICAgICAgbW92aW5nU3VtID0gMFxuXG5cbiAgICBmb3IgaSBpbiBbMC4uLkB0YXJnZXRdXG4gICAgICBmb3IgaiBpbiBbMC4uLkB0YXJnZXRdXG4gICAgICAgIGJhc2VJbmRleCA9IGkgKiBAdGFyZ2V0ICogNCArIGogKiA0O1xuICAgICAgICBpZiBuZXdCdWZbal0gPiBpICogMlxuICAgICAgICAgIEBuZXdUZXhBcnJheVtiYXNlSW5kZXhdID0gMjU1XG4gICAgICAgICAgQG5ld1RleEFycmF5W2Jhc2VJbmRleCArIDFdID0gMjU1XG4gICAgICAgICAgQG5ld1RleEFycmF5W2Jhc2VJbmRleCArIDJdID0gMjU1XG4gICAgICAgICAgQG5ld1RleEFycmF5W2Jhc2VJbmRleCArIDNdID0gMjU1XG4gICAgICAgIGVsc2UgXG4gICAgICAgICAgQG5ld1RleEFycmF5W2Jhc2VJbmRleF0gPSAwXG4gICAgICAgICAgQG5ld1RleEFycmF5W2Jhc2VJbmRleCArIDFdID0gMFxuICAgICAgICAgIEBuZXdUZXhBcnJheVtiYXNlSW5kZXggKyAyXSA9IDBcbiAgICAgICAgICBAbmV3VGV4QXJyYXlbYmFzZUluZGV4ICsgM10gPSAwXG5cbiAgICB0ZXh0dXJlID0gbmV3IFRIUkVFLkRhdGFUZXh0dXJlKEBuZXdUZXhBcnJheSwgQHRhcmdldCwgQHRhcmdldCwgVEhSRUUuUkdCQUZvcm1hdCwgVEhSRUUuVW5zaWduZWRCeXRlKVxuICAgIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlXG4gICAgdGV4dHVyZS5mbGlwWSA9IGZhbHNlXG4gICAgdGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgPSBmYWxzZVxuICAgIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTGluZWFyRmlsdGVyXG4gICAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5MaW5lYXJGaWx0ZXJcbiAgICB0ZXh0dXJlLnVucGFja0FsaWdubWVudCA9IDFcbiAgICB0ZXh0dXJlLndyYXBTID0gVEhSRUUuUmVwZWF0V3JhcHBpbmdcbiAgICB0ZXh0dXJlLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmdcbiAgICB0ZXh0dXJlLmFuaXNvdHJvcHkgPSA0XG5cbiAgICByZXR1cm4gdGV4dHVyZSIsInJlcXVpcmUgJy4vRGFuY2VyLmNvZmZlZSdcblxuY2xhc3Mgd2luZG93LkN1YmVEYW5jZXIgZXh0ZW5kcyBEYW5jZXJcbiAgQG5hbWU6IFwiQ3ViZURhbmNlclwiXG4gIFxuICBjb25zdHJ1Y3RvcjogKGRhbmNlLCBkYW5jZU1hdGVyaWFsLCBAb3B0aW9ucykgLT5cbiAgICBpZiBAb3B0aW9ucz8gdGhlbiB7IHBvc2l0aW9uLCBzY2FsZSB9ID0gQG9wdGlvbnNcbiAgICBzdXBlcihuZXcgVEhSRUUuQm94R2VvbWV0cnkoMSwgMSwgMSksIGRhbmNlLCBkYW5jZU1hdGVyaWFsLCBwb3NpdGlvbiwgc2NhbGUpIiwiIyBDb250YWlucyBhbiBPYmplY3QzRCBvZiBzb21lIGtpbmQsIHdpdGggYSBtZXNoIGRldGVybWluZWQgYnkgc3ViY2xhc3Nlcy5cbiMgSXQgaGFzIGFuIEVmZmVjdCBhbmQgYSBEYW5jZU1hdGVyaWFsIHdoaWNoIG9wZXJhdGUgb24gdGhlIHRyYW5zZm9ybSBhbmQgdGhlIG1hdGVyaWFsIG9mIHRoZSBPYmplY3QzRCByZXNwZWN0aXZseVxuXG5jbGFzcyB3aW5kb3cuRGFuY2VyXG4gIEB0eXBlID0gRGFuY2VyXG4gIEBwYXJhbXMgPSBbXG4gICAge1xuICAgICAgbmFtZTogJ3Bvc2l0aW9uJ1xuICAgICAgZGVmYXVsdDogWzAsIDAsIDBdXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnc2NhbGUnXG4gICAgICBkZWZhdWx0OiBbMSwgMSwgMV1cbiAgICB9XG4gIF1cblxuICBjb25zdHJ1Y3RvcjogKGdlb21ldHJ5LCBkYW5jZSwgZGFuY2VNYXRlcmlhbCwgcG9zaXRpb24sIHNjYWxlKSAtPlxuICAgICMgQ29uc3RydWN0IGEgZGVmYXVsdCBEYW5jZXIgdXNpbmcgQGJvZHkgYXMgdGhlIE9iamVjdDNEXG4gICAgbWF0ZXJpYWwgPSBkYW5jZU1hdGVyaWFsLm1hdGVyaWFsO1xuICAgIEBkYW5jZSA9IGRhbmNlXG4gICAgQGRhbmNlTWF0ZXJpYWwgPSBkYW5jZU1hdGVyaWFsO1xuICAgIEBib2R5ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICBpZiBwb3NpdGlvbj8gJiYgcG9zaXRpb24ubGVuZ3RoID09IDMgdGhlbiBAYm9keS5wb3NpdGlvbi5zZXQocG9zaXRpb25bMF0sIHBvc2l0aW9uWzFdLCBwb3NpdGlvblsyXSlcbiAgICBpZiBzY2FsZT8gJiYgc2NhbGUubGVuZ3RoID09IDMgdGhlbiBAYm9keS5zY2FsZS5zZXQoc2NhbGVbMF0sIHNjYWxlWzFdLCBzY2FsZVsyXSlcblxuICBnZW9tZXRyeTogKCkgLT5cbiAgICBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgxLCAxKVxuXG4gIHJlc2V0OiAoKSAtPlxuICAgIEBkYW5jZS5yZXNldChAKVxuXG4gIHVwZGF0ZTogKGF1ZGlvV2luZG93KSAtPlxuICAgICMgUmVhY3QgdG8gdGhlIGF1ZGlvIGV2ZW50IGJ5IHB1bXBpbmcgaXQgdGhyb3VnaCBFZmZlY3QgYW5kIFNoYWRlclxuICAgIEBkYW5jZS51cGRhdGUoYXVkaW9XaW5kb3csIEApXG4gICAgQGRhbmNlTWF0ZXJpYWwudXBkYXRlKGF1ZGlvV2luZG93LCBAKSIsInJlcXVpcmUgJy4vRGFuY2VyLmNvZmZlZSdcblxuY2xhc3Mgd2luZG93LlBvaW50Q2xvdWREYW5jZXIgZXh0ZW5kcyBEYW5jZXJcbiAgQHBhcmFtczogXG4gICAgW1xuICAgICAge1xuICAgICAgICBuYW1lOiAnbWluRGlzdGFuY2UnLFxuICAgICAgICBkZWZhdWx0OiA1LjBcbiAgICAgIH0sIFxuICAgICAge1xuICAgICAgICBuYW1lOiAnbWF4RGlzdGFuY2UnLFxuICAgICAgICBkZWZhdWx0OiAxMC4wXG4gICAgICB9LCBcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2NvdW50JyxcbiAgICAgICAgZGVmYXVsdDogNTAwXG4gICAgICB9XG4gICAgXVxuXG4gIEBuYW1lOiBcIlBvaW50Q2xvdWREYW5jZXJcIlxuXG4gIGNvbnN0cnVjdG9yOiAoQGRhbmNlLCBAZGFuY2VNYXRlcmlhbCwgQG9wdGlvbnMpIC0+XG4gICAgaWYgQG9wdGlvbnM/IHRoZW4geyBAbWluRGlzdGFuY2UsIEBtYXhEaXN0YW5jZSwgQGNvdW50IH0gPSBAb3B0aW9uc1xuICAgIEBtaW5EaXN0YW5jZSA/PSA1LjBcbiAgICBAbWF4RGlzdGFuY2UgPz0gMTAuMFxuICAgIEBjb3VudCA/PSA1MDBcblxuICAgIGRpcmVjdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKClcbiAgICBwb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApXG5cbiAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpXG4gICAgcG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheShAY291bnQgKiAzKVxuXG4gICAgZm9yIGkgaW4gWzAuLi5AY291bnRdXG4gICAgICBkaXJlY3Rpb24uc2V0KE1hdGgucmFuZG9tKCkgLSAwLjUsIE1hdGgucmFuZG9tKCkgLSAwLjUsIE1hdGgucmFuZG9tKCktIDAuNSlcbiAgICAgIGRpcmVjdGlvbi5ub3JtYWxpemUoKVxuICAgICAgZGlyZWN0aW9uLm11bHRpcGx5U2NhbGFyKEBtaW5EaXN0YW5jZSArIE1hdGgucmFuZG9tKCkgKiAoQG1heERpc3RhbmNlIC0gQG1pbkRpc3RhbmNlKSlcblxuICAgICAgcG9zaXRpb25zWzMgKiBpXSA9IHBvc2l0aW9uLnggKyBkaXJlY3Rpb24ueFxuICAgICAgcG9zaXRpb25zWzMgKiBpICsgMV0gPSBwb3NpdGlvbi55ICsgZGlyZWN0aW9uLnlcbiAgICAgIHBvc2l0aW9uc1szICogaSArIDJdID0gcG9zaXRpb24ueiArIGRpcmVjdGlvbi56XG5cbiAgICBnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShwb3NpdGlvbnMsIDMpKVxuICAgIGdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpXG5cbiAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5Qb2ludENsb3VkTWF0ZXJpYWwoeyBzaXplOiAwLjUsIGNvbG9yOiBAZGFuY2VNYXRlcmlhbC5jb2xvciB9KVxuICAgIEBib2R5ID0gbmV3IFRIUkVFLlBvaW50Q2xvdWQoIGdlb21ldHJ5LCBtYXRlcmlhbCApIiwicmVxdWlyZSAnLi9EYW5jZXIuY29mZmVlJ1xuXG5jbGFzcyB3aW5kb3cuU3BoZXJlRGFuY2VyIGV4dGVuZHMgRGFuY2VyXG4gIEBuYW1lOiBcIlNwaGVyZURhbmNlclwiXG5cbiAgY29uc3RydWN0b3I6IChkYW5jZSwgZGFuY2VNYXRlcmlhbCwgQG9wdGlvbnMpIC0+XG4gICAgaWYgQG9wdGlvbnM/IHRoZW4geyBwb3NpdGlvbiwgc2NhbGUgfSA9IEBvcHRpb25zXG4gICAgc3VwZXIobmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDEsIDMyLCAyNCksIGRhbmNlLCBkYW5jZU1hdGVyaWFsLCBwb3NpdGlvbiwgc2NhbGUpIiwiY2xhc3Mgd2luZG93LlBvc2l0aW9uRGFuY2VcbiAgQHBhcmFtczogXG4gICAgW1xuICAgICAge1xuICAgICAgICBuYW1lOiAnc21vb3RoaW5nRmFjdG9yJ1xuICAgICAgICBkZWZhdWx0OiAwLjJcbiAgICAgIH0sIFxuICAgICAge1xuICAgICAgICBuYW1lOiAnZGlyZWN0aW9uJ1xuICAgICAgICBkZWZhdWx0OiBbMCwgMSwgMF1cbiAgICAgIH1cbiAgICBdXG5cbiAgQG5hbWU6IFwiUG9zaXRpb25EYW5jZVwiXG5cbiAgY29uc3RydWN0b3I6IChAb3B0aW9ucykgLT5cbiAgICBpZiBAb3B0aW9ucz8gdGhlbiB7IEBzbW9vdGhpbmdGYWN0b3IsIGRpcmVjdGlvbiB9ID0gQG9wdGlvbnNcbiAgICBAc21vb3RoaW5nRmFjdG9yID89IDAuMlxuICAgIFxuICAgIGRpcmVjdGlvbiA/PSBbMCwgMSwgMF1cbiAgICBAZGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoZGlyZWN0aW9uWzBdLCBkaXJlY3Rpb25bMV0sIGRpcmVjdGlvblsyXSlcblxuICAgIEBkaXJlY3Rpb25Db3B5ID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICBAcG9zaXRpb25DaGFuZ2UgPSAwXG5cbiAgdXBkYXRlOiAoYXVkaW9XaW5kb3csIGRhbmNlcikgLT5cbiAgICBiYXNlUG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgIEBkaXJlY3Rpb25Db3B5LmNvcHkoQGRpcmVjdGlvbik7XG4gICAgYmFzZVBvc2l0aW9uLnN1YlZlY3RvcnMoZGFuY2VyLmJvZHkucG9zaXRpb24sIEBkaXJlY3Rpb25Db3B5Lm11bHRpcGx5U2NhbGFyKEBwb3NpdGlvbkNoYW5nZSkpXG5cbiAgICBzbW9vdGhpbmdGYWN0b3IgPSBpZiBhdWRpb1dpbmRvdy5hdmVyYWdlRGIgPCBAcG9zaXRpb25DaGFuZ2UgdGhlbiBAc21vb3RoaW5nRmFjdG9yIGVsc2UgTWF0aC5tYXgoMSwgQHNtb290aGluZ0ZhY3RvciAqIDQpXG4gICAgQHBvc2l0aW9uQ2hhbmdlID0gYXVkaW9XaW5kb3cuYXZlcmFnZURiICogc21vb3RoaW5nRmFjdG9yICsgKDEgLSBzbW9vdGhpbmdGYWN0b3IpICogQHBvc2l0aW9uQ2hhbmdlXG5cbiAgICBAZGlyZWN0aW9uQ29weS5jb3B5KEBkaXJlY3Rpb24pXG4gICAgbmV3UG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpXG4gICAgbmV3UG9zaXRpb24uYWRkVmVjdG9ycyhiYXNlUG9zaXRpb24sIEBkaXJlY3Rpb25Db3B5Lm11bHRpcGx5U2NhbGFyKEBwb3NpdGlvbkNoYW5nZSkpXG5cbiAgICBkYW5jZXIuYm9keS5wb3NpdGlvbi5zZXQobmV3UG9zaXRpb24ueCwgbmV3UG9zaXRpb24ueSwgbmV3UG9zaXRpb24ueilcblxuICByZXNldDogKGRhbmNlcikgLT5cbiAgICBAZGlyZWN0aW9uQ29weS5jb3B5KEBkaXJlY3Rpb24pO1xuICAgIGJhc2VQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgYmFzZVBvc2l0aW9uLnN1YlZlY3RvcnMoZGFuY2VyLmJvZHkucG9zaXRpb24sIEBkaXJlY3Rpb25Db3B5Lm11bHRpcGx5U2NhbGFyKEBwb3NpdGlvbkNoYW5nZSkpXG4gICAgZGFuY2VyLmJvZHkucG9zaXRpb24uc2V0KGJhc2VQb3NpdGlvbi54LCBiYXNlUG9zaXRpb24ueSwgYmFzZVBvc2l0aW9uLnopIiwiY2xhc3Mgd2luZG93LlJvdGF0ZURhbmNlXG4gIEBuYW1lOiBcIlJvdGF0ZURhbmNlXCJcblxuICBAcGFyYW1zOlxuICAgIFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2F4aXMnXG4gICAgICAgIGRlZmF1bHQ6IFswLCAxLCAwXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ21pblJvdGF0aW9uJ1xuICAgICAgICBkZWZhdWx0OiAwLjA1XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnc3BlZWQnXG4gICAgICAgIGRlZmF1bHQ6IDFcbiAgICAgIH0sXG4gICAgXVxuXG4gIGNvbnN0cnVjdG9yOiAoQG9wdGlvbnMpIC0+XG4gICAgaWYgQG9wdGlvbnM/IHRoZW4geyBheGlzLCBAbWluUm90YXRpb24sIEBzcGVlZCB9ID0gQG9wdGlvbnNcbiAgICBAbWluUm90YXRpb24gPz0gMC4wNVxuICAgIEBzcGVlZCA/PSAxXG5cbiAgICBheGlzID89IFswLCAxLCAwXVxuICAgIEBheGlzID0gbmV3IFRIUkVFLlZlY3RvcjMoYXhpc1swXSwgYXhpc1sxXSwgYXhpc1syXSlcblxuICAgIEB0aW1lID0gMFxuXG4gIHVwZGF0ZTogKGF1ZGlvV2luZG93LCBkYW5jZXIpIC0+XG4gICAgYWJzUm90YXRpb24gPSBhdWRpb1dpbmRvdy5hdmVyYWdlRGIgKiBAc3BlZWRcblxuICAgIGRhbmNlci5ib2R5LnJvdGF0ZU9uQXhpcyBAYXhpcywgKEBtaW5Sb3RhdGlvbiArIGFic1JvdGF0aW9uICogKDAuOSkpICogTWF0aC5QSSAqICgoYXVkaW9XaW5kb3cudGltZSAtIEB0aW1lKSAvIDEwMDApXG5cbiAgICBAdGltZSA9IGF1ZGlvV2luZG93LnRpbWVcblxuICByZXNldDogKGRhbmNlcikgLT5cbiAgICBkYW5jZXIuYm9keS5yb3RhdGlvbi5zZXQoMCwgMCwgMClcbiIsIiMgQ29udHJvbHMgdGhlIG1lc2ggb2YgdGhlIHByb3ZpZGVkIERhbmNlcidzIGJvZHlcbmNsYXNzIHdpbmRvdy5TY2FsZURhbmNlXG4gIEBwYXJhbXM6XG4gICAgW1xuICAgICAge1xuICAgICAgICBuYW1lOiAnc21vb3RoaW5nRmFjdG9yJ1xuICAgICAgICBkZWZhdWx0OiAwLjVcbiAgICAgIH0sIFxuICAgICAge1xuICAgICAgICBuYW1lOiAnbWluJ1xuICAgICAgICBkZWZhdWx0OiBbMC41LCAwLjUsIDAuNV1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdtYXgnXG4gICAgICAgIGRlZmF1bHQ6IFsxLCAxLCAxXVxuICAgICAgfVxuICAgIF1cblxuICBAbmFtZTogXCJTY2FsZURhbmNlXCJcblxuICBjb25zdHJ1Y3RvcjogKEBvcHRpb25zKSAtPlxuICAgIGlmIEBvcHRpb25zPyB0aGVuIHsgQHNtb290aGluZ0ZhY3RvciwgbWluLCBtYXggfSA9IEBvcHRpb25zXG4gICAgQHNtb290aGluZ0ZhY3RvciA/PSAwLjVcbiAgICBAYXZlcmFnZURiID0gMFxuICAgIEBtaW4gPSBpZiBtaW4gdGhlbiBuZXcgVEhSRUUuVmVjdG9yMyhtaW5bMF0sIG1pblsxXSwgbWluWzJdKSBlbHNlIG5ldyBUSFJFRS5WZWN0b3IzKDAuNSwgMC41LCAwLjUpXG4gICAgQG1heCA9IGlmIG1heCB0aGVuIG5ldyBUSFJFRS5WZWN0b3IzKG1heFswXSwgbWF4WzFdLCBtYXhbMl0pIGVsc2UgbmV3IFRIUkVFLlZlY3RvcjMoMSwgMSwgMSlcbiAgICBAc2NhbGUgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG5cbiAgdXBkYXRlOiAoYXVkaW9XaW5kb3csIGRhbmNlcikgLT5cbiAgICAjIHVwZGF0ZSB0aGUgRGFuY2VyJ3MgYm9keSBtZXNoIHRvIHJlZmxlY3QgdGhlIGF1ZGlvIGV2ZW50XG4gICAgaWYgKGF1ZGlvV2luZG93LmF2ZXJhZ2VEYiA8IEBhdmVyYWdlRGIpXG4gICAgXHRAYXZlcmFnZURiID0gYXVkaW9XaW5kb3cuYXZlcmFnZURiICogQHNtb290aGluZ0ZhY3RvciArICgxIC0gQHNtb290aGluZ0ZhY3RvcikgKiBAYXZlcmFnZURiXG4gICAgZWxzZSBcbiAgICBcdHNtb290aGluZ0ZhY3RvciA9IE1hdGgubWF4KDEsIEBzbW9vdGhpbmdGYWN0b3IgKiA0KVxuICAgIFx0QGF2ZXJhZ2VEYiA9IGF1ZGlvV2luZG93LmF2ZXJhZ2VEYiAqIHNtb290aGluZ0ZhY3RvciArICgxIC0gc21vb3RoaW5nRmFjdG9yKSAqIEBhdmVyYWdlRGJcblxuICAgIEBzY2FsZS5jb3B5KEBtaW4pXG5cbiAgICBAc2NhbGUubGVycChAbWF4LCBAYXZlcmFnZURiKVxuXG4gICAgZGFuY2VyLmJvZHkuc2NhbGUuc2V0KEBzY2FsZS54LCBAc2NhbGUueSwgQHNjYWxlLnopXG5cdFxuICByZXNldDogKGRhbmNlcikgLT5cbiAgXHRkYW5jZXIuYm9keS5zY2FsZS5zZXQoMSwgMSwgMSlcbiIsInJlcXVpcmUgJy4vUXVldWVWaWV3LmNvZmZlZSdcblxuY2xhc3Mgd2luZG93LkRhdEdVSUludGVyZmFjZVxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICBAY29udGFpbmVyID0gJCgnI2ludGVyZmFjZScpXG5cbiAgc2V0dXA6IChAcGxheWVyLCBAY2hvcmVvZ3JhcGh5Um91dGluZSwgQHZpZXdlcikgLT5cbiAgICBndWkgPSBuZXcgZGF0LkdVSSgpXG5cbiAgICBndWkuYWRkKEBwbGF5ZXIuYXVkaW9XaW5kb3csICdyZXNwb25zaXZlbmVzcycsIDAuMCwgNS4wKVxuICAgIGlkQ29udHJvbGxlciA9IGd1aS5hZGQoQGNob3Jlb2dyYXBoeVJvdXRpbmUsICdpZCcpXG5cbiAgICBzZXR1cEZvbGRlciA9IChuYW1lLCB2YXJOYW1lLCBrZXlzKSA9PlxuICAgICAgY29udHJvbGxlciA9IGd1aS5hZGQoQGNob3Jlb2dyYXBoeVJvdXRpbmUsIHZhck5hbWUsIGtleXMpXG4gICAgICBmb2xkZXIgPSBndWkuYWRkRm9sZGVyKG5hbWUpXG4gICAgICBmb2xkZXIub3BlbigpXG4gICAgICByZXR1cm4gWyBjb250cm9sbGVyLCBmb2xkZXIgXVxuXG4gICAgdXBkYXRlRm9sZGVyID0gKHR5cGVzLCBmb2xkZXIsIHBhcmFtcywgdmFsdWUsIG9iaikgLT5cbiAgICAgIGlmICF0eXBlc1t2YWx1ZV0/XG4gICAgICAgIHJldHVyblxuXG4gICAgICB3aGlsZSBmb2xkZXIuX19jb250cm9sbGVyc1swXT9cbiAgICAgICAgZm9sZGVyLnJlbW92ZShmb2xkZXIuX19jb250cm9sbGVyc1swXSlcblxuICAgICAgZm9yIHBhcmFtIGluIHR5cGVzW3ZhbHVlXS5wYXJhbXNcbiAgICAgICAgcGFyYW1zW3BhcmFtLm5hbWVdID1cbiAgICAgICAgICBpZiBvYmo/Lm9wdGlvbnM/W3BhcmFtLm5hbWVdXG4gICAgICAgICAgICBvYmoub3B0aW9uc1twYXJhbS5uYW1lXVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHBhcmFtLmRlZmF1bHRcblxuICAgICAgICBmb2xkZXIuYWRkKHBhcmFtcywgcGFyYW0ubmFtZSlcblxuICAgIFtkYW5jZXJDb250cm9sbGVyLCBkYW5jZXJGb2xkZXJdID0gc2V0dXBGb2xkZXIoJ0RhbmNlciBwYXJhbWV0ZXJzJywgJ2RhbmNlcicsIE9iamVjdC5rZXlzKFZpc3VhbGl6ZXIuZGFuY2VyVHlwZXMpKVxuXG4gICAgdXBkYXRlRGFuY2VyRm9sZGVyID0gKHZhbHVlLCBvYmopID0+XG4gICAgICB1cGRhdGVGb2xkZXIoVmlzdWFsaXplci5kYW5jZXJUeXBlcywgZGFuY2VyRm9sZGVyLCBAY2hvcmVvZ3JhcGh5Um91dGluZS5kYW5jZXJQYXJhbXMsIHZhbHVlLCBvYmopXG4gICAgZGFuY2VyQ29udHJvbGxlci5vbkNoYW5nZSB1cGRhdGVEYW5jZXJGb2xkZXJcblxuICAgIFtkYW5jZUNvbnRyb2xsZXIsIGRhbmNlRm9sZGVyXSA9IHNldHVwRm9sZGVyKCdEYW5jZSBwYXJhbWV0ZXJzJywgJ2RhbmNlJywgT2JqZWN0LmtleXMoVmlzdWFsaXplci5kYW5jZVR5cGVzKSlcblxuICAgIHVwZGF0ZURhbmNlRm9sZGVyID0gKHZhbHVlLCBvYmopID0+XG4gICAgICB1cGRhdGVGb2xkZXIoVmlzdWFsaXplci5kYW5jZVR5cGVzLCBkYW5jZUZvbGRlciwgQGNob3Jlb2dyYXBoeVJvdXRpbmUuZGFuY2VQYXJhbXMsIHZhbHVlLCBvYmopXG4gICAgZGFuY2VDb250cm9sbGVyLm9uQ2hhbmdlIHVwZGF0ZURhbmNlRm9sZGVyXG5cbiAgICBbZGFuY2VNYXRlcmlhbENvbnRyb2xsZXIsIGRhbmNlTWF0ZXJpYWxGb2xkZXJdID0gc2V0dXBGb2xkZXIoJ0RhbmNlIG1hdGVyaWFsIHBhcmFtYXRlcnMnLCAnZGFuY2VNYXRlcmlhbCcsXG4gICAgICBPYmplY3Qua2V5cyhWaXN1YWxpemVyLmRhbmNlTWF0ZXJpYWxUeXBlcykpXG5cbiAgICB1cGRhdGVEYW5jZU1hdGVyaWFsRm9sZGVyID0gKHZhbHVlLCBvYmopID0+XG4gICAgICB1cGRhdGVGb2xkZXIoVmlzdWFsaXplci5kYW5jZU1hdGVyaWFsVHlwZXMsIGRhbmNlTWF0ZXJpYWxGb2xkZXIsIEBjaG9yZW9ncmFwaHlSb3V0aW5lLmRhbmNlTWF0ZXJpYWxQYXJhbXMsIHZhbHVlLFxuICAgICAgICBvYmopXG4gICAgZGFuY2VNYXRlcmlhbENvbnRyb2xsZXIub25DaGFuZ2UgdXBkYXRlRGFuY2VNYXRlcmlhbEZvbGRlclxuXG4gICAgaWRDb250cm9sbGVyLm9uQ2hhbmdlICh2YWx1ZSkgPT5cbiAgICAgIGlkRGFuY2VyID0gQHZpZXdlci5nZXREYW5jZXIodmFsdWUpXG4gICAgICBpZiBpZERhbmNlcj9cbiAgICAgICAgQGNob3Jlb2dyYXBoeVJvdXRpbmUudXBkYXRlRGFuY2VyIGlkRGFuY2VyXG4gICAgICAgIGZvciBjb250cm9sbGVyIGluIGd1aS5fX2NvbnRyb2xsZXJzXG4gICAgICAgICAgY29udHJvbGxlci51cGRhdGVEaXNwbGF5KClcblxuICAgICAgICB1cGRhdGVEYW5jZXJGb2xkZXIoQGNob3Jlb2dyYXBoeVJvdXRpbmUuZGFuY2VyLCBpZERhbmNlcilcbiAgICAgICAgdXBkYXRlRGFuY2VNYXRlcmlhbEZvbGRlcihAY2hvcmVvZ3JhcGh5Um91dGluZS5kYW5jZU1hdGVyaWFsLCBpZERhbmNlci5kYW5jZU1hdGVyaWFsKVxuICAgICAgICB1cGRhdGVEYW5jZUZvbGRlcihAY2hvcmVvZ3JhcGh5Um91dGluZS5kYW5jZSwgaWREYW5jZXIuZGFuY2UpXG5cbiAgICBndWkuYWRkKEBjaG9yZW9ncmFwaHlSb3V0aW5lLCAncHJldmlldycpXG4gICAgZ3VpLmFkZChAY2hvcmVvZ3JhcGh5Um91dGluZSwgJ2FkZCcpXG4gICAgZ3VpLmFkZChAY2hvcmVvZ3JhcGh5Um91dGluZSwgJ2luc2VydEJlYXQnKVxuICAgIGd1aS5hZGQoQGNob3Jlb2dyYXBoeVJvdXRpbmUsICdwbGF5TmV4dCcpXG4gICAgZ3VpLmFkZChAY2hvcmVvZ3JhcGh5Um91dGluZSwgJ3Jlc2V0JylcblxuICAgIEBzZXR1cFBvcHVwKClcbiAgICBAc2V0dXBRdWV1ZVZpZXcoKVxuICAgIEBzZXR1cFJvdXRpbmVzVmlldygpXG5cblxuICBzZXR1cFBvcHVwOiAoKSAtPlxuICAgICQoJyN2aWV3ZXJCdXR0b24nKS5jbGljayAoZSkgPT5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgQGRvbWFpbiA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdFxuICAgICAgcG9wdXBVUkwgPSBAZG9tYWluICsgbG9jYXRpb24ucGF0aG5hbWUgKyAndmlld2VyLmh0bWwnXG4gICAgICBAcG9wdXAgPSB3aW5kb3cub3Blbihwb3B1cFVSTCwgJ215V2luZG93JylcblxuICAgICAgIyBXZSBoYXZlIHRvIGRlbGF5IGNhdGNoaW5nIHRoZSB3aW5kb3cgdXAgYmVjYXVzZSBpdCBoYXMgdG8gbG9hZCBmaXJzdC5cbiAgICAgIHNlbmRCZWF0cyA9ICgpID0+XG4gICAgICAgIHJvdXRpbmVCZWF0ID0gQGNob3Jlb2dyYXBoeVJvdXRpbmUucm91dGluZUJlYXRcbiAgICAgICAgQGNob3Jlb2dyYXBoeVJvdXRpbmUucm91dGluZUJlYXQgPSAtMVxuICAgICAgICB3aGlsZSBAY2hvcmVvZ3JhcGh5Um91dGluZS5yb3V0aW5lQmVhdCA8IHJvdXRpbmVCZWF0XG4gICAgICAgICAgQGNob3Jlb2dyYXBoeVJvdXRpbmUucGxheU5leHQoKVxuICAgICAgc2V0VGltZW91dCBzZW5kQmVhdHMsIDEwMFxuXG4gIHNldHVwUXVldWVWaWV3OiAoKSAtPlxuICAgIEBxdWV1ZVZpZXcgPSBuZXcgUXVldWVWaWV3KClcbiAgICBAcXVldWVWaWV3LmNyZWF0ZVZpZXcoQGNvbnRhaW5lcilcblxuICBzZXR1cFJvdXRpbmVzVmlldzogKCkgLT5cbiAgICAjIHNldCB1cCByb3V0aW5lcyB2aWV3XG5cbiAgdXBkYXRlVGV4dDogKCkgLT5cbiAgICBAcXVldWVWaWV3LnVwZGF0ZVRleHQoQGNob3Jlb2dyYXBoeVJvdXRpbmUucm91dGluZUJlYXQsIEBjaG9yZW9ncmFwaHlSb3V0aW5lLnJvdXRpbmUpXG4iLCJjbGFzcyB3aW5kb3cuUXVldWVWaWV3XG4gIGNyZWF0ZVZpZXc6ICh0YXJnZXQpIC0+XG4gICAgIyBBZGQgcXVldWUgdmlldyB0byB0YXJnZXRcbiAgICBAcm91dGluZVZpZXcgPSAkIFwiPHByZT5cIlxuICAgIEByb3V0aW5lVmlldy5hZGRDbGFzcyBcInJvdXRpbmVzVmlld1wiXG4gICAgdGFyZ2V0LmFwcGVuZCBAcm91dGluZVZpZXdcblxuICB1cGRhdGVUZXh0OiAoY3VycmVudEluZGV4LCByb3V0aW5lUXVldWUpIC0+XG4gICAgIyBEaXNwbGF5IHJvdXRpbmVRdWV1ZSB3aXRoIGN1cnJlbnQgaW5kZXggaGlnaGxpZ2h0ZWRcbiAgICBodG1sID0gW11cblxuICAgIGh0bWwucHVzaChAc3RyaW5naWZ5KHJvdXRpbmVRdWV1ZS5zbGljZSgwLCBjdXJyZW50SW5kZXgpKSlcbiAgICBodG1sLnB1c2goXCI8c3BhbiBjbGFzcz0nYm9sZCc+XCIpXG4gICAgaHRtbC5wdXNoKEBzdHJpbmdpZnkocm91dGluZVF1ZXVlLnNsaWNlKGN1cnJlbnRJbmRleCwgY3VycmVudEluZGV4ICsgMSkpKVxuICAgIGh0bWwucHVzaChcIjwvc3Bhbj5cIilcbiAgICBodG1sLnB1c2goQHN0cmluZ2lmeShyb3V0aW5lUXVldWUuc2xpY2UoY3VycmVudEluZGV4ICsgMSkpKVxuXG4gICAgQHJvdXRpbmVWaWV3Lmh0bWwoaHRtbC5qb2luKFwiXCIpKVxuXG4gIHN0cmluZ2lmeTogKGpzb24pIC0+XG4gICAgSlNPTi5zdHJpbmdpZnkoanNvbiwgdW5kZWZpbmVkLCAyKSIsIi8qKlxuICogQGF1dGhvciBxaWFvIC8gaHR0cHM6Ly9naXRodWIuY29tL3FpYW9cbiAqIEBhdXRob3IgbXJkb29iIC8gaHR0cDovL21yZG9vYi5jb21cbiAqIEBhdXRob3IgYWx0ZXJlZHEgLyBodHRwOi8vYWx0ZXJlZHF1YWxpYS5jb20vXG4gKiBAYXV0aG9yIFdlc3RMYW5nbGV5IC8gaHR0cDovL2dpdGh1Yi5jb20vV2VzdExhbmdsZXlcbiAqIEBhdXRob3IgZXJpY2g2NjYgLyBodHRwOi8vZXJpY2hhaW5lcy5jb21cbiAqL1xuLypnbG9iYWwgVEhSRUUsIGNvbnNvbGUgKi9cblxuLy8gVGhpcyBzZXQgb2YgY29udHJvbHMgcGVyZm9ybXMgb3JiaXRpbmcsIGRvbGx5aW5nICh6b29taW5nKSwgYW5kIHBhbm5pbmcuIEl0IG1haW50YWluc1xuLy8gdGhlIFwidXBcIiBkaXJlY3Rpb24gYXMgK1ksIHVubGlrZSB0aGUgVHJhY2tiYWxsQ29udHJvbHMuIFRvdWNoIG9uIHRhYmxldCBhbmQgcGhvbmVzIGlzXG4vLyBzdXBwb3J0ZWQuXG4vL1xuLy8gICAgT3JiaXQgLSBsZWZ0IG1vdXNlIC8gdG91Y2g6IG9uZSBmaW5nZXIgbW92ZVxuLy8gICAgWm9vbSAtIG1pZGRsZSBtb3VzZSwgb3IgbW91c2V3aGVlbCAvIHRvdWNoOiB0d28gZmluZ2VyIHNwcmVhZCBvciBzcXVpc2hcbi8vICAgIFBhbiAtIHJpZ2h0IG1vdXNlLCBvciBhcnJvdyBrZXlzIC8gdG91Y2g6IHRocmVlIGZpbnRlciBzd2lwZVxuLy9cbi8vIFRoaXMgaXMgYSBkcm9wLWluIHJlcGxhY2VtZW50IGZvciAobW9zdCkgVHJhY2tiYWxsQ29udHJvbHMgdXNlZCBpbiBleGFtcGxlcy5cbi8vIFRoYXQgaXMsIGluY2x1ZGUgdGhpcyBqcyBmaWxlIGFuZCB3aGVyZXZlciB5b3Ugc2VlOlxuLy8gICAgXHRjb250cm9scyA9IG5ldyBUSFJFRS5UcmFja2JhbGxDb250cm9scyggY2FtZXJhICk7XG4vLyAgICAgIGNvbnRyb2xzLnRhcmdldC56ID0gMTUwO1xuLy8gU2ltcGxlIHN1YnN0aXR1dGUgXCJPcmJpdENvbnRyb2xzXCIgYW5kIHRoZSBjb250cm9sIHNob3VsZCB3b3JrIGFzLWlzLlxuXG5USFJFRS5PcmJpdENvbnRyb2xzID0gZnVuY3Rpb24gKG9iamVjdCwgZG9tRWxlbWVudCkge1xuXG4gICAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XG4gICAgdGhpcy5kb21FbGVtZW50ID0gKCBkb21FbGVtZW50ICE9PSB1bmRlZmluZWQgKSA/IGRvbUVsZW1lbnQgOiBkb2N1bWVudDtcblxuICAgIC8vIEFQSVxuXG4gICAgLy8gU2V0IHRvIGZhbHNlIHRvIGRpc2FibGUgdGhpcyBjb250cm9sXG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcblxuICAgIC8vIFwidGFyZ2V0XCIgc2V0cyB0aGUgbG9jYXRpb24gb2YgZm9jdXMsIHdoZXJlIHRoZSBjb250cm9sIG9yYml0cyBhcm91bmRcbiAgICAvLyBhbmQgd2hlcmUgaXQgcGFucyB3aXRoIHJlc3BlY3QgdG8uXG4gICAgdGhpcy50YXJnZXQgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXG4gICAgLy8gY2VudGVyIGlzIG9sZCwgZGVwcmVjYXRlZDsgdXNlIFwidGFyZ2V0XCIgaW5zdGVhZFxuICAgIHRoaXMuY2VudGVyID0gdGhpcy50YXJnZXQ7XG5cbiAgICAvLyBUaGlzIG9wdGlvbiBhY3R1YWxseSBlbmFibGVzIGRvbGx5aW5nIGluIGFuZCBvdXQ7IGxlZnQgYXMgXCJ6b29tXCIgZm9yXG4gICAgLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgICB0aGlzLm5vWm9vbSA9IGZhbHNlO1xuICAgIHRoaXMuem9vbVNwZWVkID0gMS4wO1xuXG4gICAgLy8gTGltaXRzIHRvIGhvdyBmYXIgeW91IGNhbiBkb2xseSBpbiBhbmQgb3V0XG4gICAgdGhpcy5taW5EaXN0YW5jZSA9IDA7XG4gICAgdGhpcy5tYXhEaXN0YW5jZSA9IEluZmluaXR5O1xuXG4gICAgLy8gU2V0IHRvIHRydWUgdG8gZGlzYWJsZSB0aGlzIGNvbnRyb2xcbiAgICB0aGlzLm5vUm90YXRlID0gZmFsc2U7XG4gICAgdGhpcy5yb3RhdGVTcGVlZCA9IDEuMDtcblxuICAgIC8vIFNldCB0byB0cnVlIHRvIGRpc2FibGUgdGhpcyBjb250cm9sXG4gICAgdGhpcy5ub1BhbiA9IGZhbHNlO1xuICAgIHRoaXMua2V5UGFuU3BlZWQgPSA3LjA7XHQvLyBwaXhlbHMgbW92ZWQgcGVyIGFycm93IGtleSBwdXNoXG5cbiAgICAvLyBTZXQgdG8gdHJ1ZSB0byBhdXRvbWF0aWNhbGx5IHJvdGF0ZSBhcm91bmQgdGhlIHRhcmdldFxuICAgIHRoaXMuYXV0b1JvdGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMuYXV0b1JvdGF0ZVNwZWVkID0gMi4wOyAvLyAzMCBzZWNvbmRzIHBlciByb3VuZCB3aGVuIGZwcyBpcyA2MFxuXG4gICAgLy8gSG93IGZhciB5b3UgY2FuIG9yYml0IHZlcnRpY2FsbHksIHVwcGVyIGFuZCBsb3dlciBsaW1pdHMuXG4gICAgLy8gUmFuZ2UgaXMgMCB0byBNYXRoLlBJIHJhZGlhbnMuXG4gICAgdGhpcy5taW5Qb2xhckFuZ2xlID0gMDsgLy8gcmFkaWFuc1xuICAgIHRoaXMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEk7IC8vIHJhZGlhbnNcblxuICAgIC8vIFNldCB0byB0cnVlIHRvIGRpc2FibGUgdXNlIG9mIHRoZSBrZXlzXG4gICAgdGhpcy5ub0tleXMgPSBmYWxzZTtcblxuICAgIC8vIFRoZSBmb3VyIGFycm93IGtleXNcbiAgICB0aGlzLmtleXMgPSB7IExFRlQ6IDM3LCBVUDogMzgsIFJJR0hUOiAzOSwgQk9UVE9NOiA0MCB9O1xuXG4gICAgLy8vLy8vLy8vLy8vXG4gICAgLy8gaW50ZXJuYWxzXG5cbiAgICB2YXIgc2NvcGUgPSB0aGlzO1xuXG4gICAgdmFyIEVQUyA9IDAuMDAwMDAxO1xuXG4gICAgdmFyIHJvdGF0ZVN0YXJ0ID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcbiAgICB2YXIgcm90YXRlRW5kID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcbiAgICB2YXIgcm90YXRlRGVsdGEgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuXG4gICAgdmFyIHBhblN0YXJ0ID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcbiAgICB2YXIgcGFuRW5kID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcbiAgICB2YXIgcGFuRGVsdGEgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuICAgIHZhciBwYW5PZmZzZXQgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXG4gICAgdmFyIG9mZnNldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cbiAgICB2YXIgZG9sbHlTdGFydCA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG4gICAgdmFyIGRvbGx5RW5kID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcbiAgICB2YXIgZG9sbHlEZWx0YSA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cbiAgICB2YXIgcGhpRGVsdGEgPSAwO1xuICAgIHZhciB0aGV0YURlbHRhID0gMDtcbiAgICB2YXIgc2NhbGUgPSAxO1xuICAgIHZhciBwYW4gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXG4gICAgdmFyIGxhc3RQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgdmFyIGxhc3RRdWF0ZXJuaW9uID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKTtcblxuICAgIHZhciBTVEFURSA9IHsgTk9ORTogLTEsIFJPVEFURTogMCwgRE9MTFk6IDEsIFBBTjogMiwgVE9VQ0hfUk9UQVRFOiAzLCBUT1VDSF9ET0xMWTogNCwgVE9VQ0hfUEFOOiA1IH07XG5cbiAgICB2YXIgc3RhdGUgPSBTVEFURS5OT05FO1xuXG4gICAgLy8gZm9yIHJlc2V0XG5cbiAgICB0aGlzLnRhcmdldDAgPSB0aGlzLnRhcmdldC5jbG9uZSgpO1xuICAgIHRoaXMucG9zaXRpb24wID0gdGhpcy5vYmplY3QucG9zaXRpb24uY2xvbmUoKTtcblxuICAgIC8vIHNvIGNhbWVyYS51cCBpcyB0aGUgb3JiaXQgYXhpc1xuXG4gICAgdmFyIHF1YXQgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21Vbml0VmVjdG9ycyhvYmplY3QudXAsIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEsIDApKTtcbiAgICB2YXIgcXVhdEludmVyc2UgPSBxdWF0LmNsb25lKCkuaW52ZXJzZSgpO1xuXG4gICAgLy8gZXZlbnRzXG5cbiAgICB2YXIgY2hhbmdlRXZlbnQgPSB7IHR5cGU6ICdjaGFuZ2UnIH07XG4gICAgdmFyIHN0YXJ0RXZlbnQgPSB7IHR5cGU6ICdzdGFydCd9O1xuICAgIHZhciBlbmRFdmVudCA9IHsgdHlwZTogJ2VuZCd9O1xuXG4gICAgdGhpcy5yb3RhdGVMZWZ0ID0gZnVuY3Rpb24gKGFuZ2xlKSB7XG5cbiAgICAgICAgaWYgKGFuZ2xlID09PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgYW5nbGUgPSBnZXRBdXRvUm90YXRpb25BbmdsZSgpO1xuXG4gICAgICAgIH1cblxuICAgICAgICB0aGV0YURlbHRhIC09IGFuZ2xlO1xuXG4gICAgfTtcblxuICAgIHRoaXMucm90YXRlVXAgPSBmdW5jdGlvbiAoYW5nbGUpIHtcblxuICAgICAgICBpZiAoYW5nbGUgPT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICBhbmdsZSA9IGdldEF1dG9Sb3RhdGlvbkFuZ2xlKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHBoaURlbHRhIC09IGFuZ2xlO1xuXG4gICAgfTtcblxuICAgIC8vIHBhc3MgaW4gZGlzdGFuY2UgaW4gd29ybGQgc3BhY2UgdG8gbW92ZSBsZWZ0XG4gICAgdGhpcy5wYW5MZWZ0ID0gZnVuY3Rpb24gKGRpc3RhbmNlKSB7XG5cbiAgICAgICAgdmFyIHRlID0gdGhpcy5vYmplY3QubWF0cml4LmVsZW1lbnRzO1xuXG4gICAgICAgIC8vIGdldCBYIGNvbHVtbiBvZiBtYXRyaXhcbiAgICAgICAgcGFuT2Zmc2V0LnNldCh0ZVsgMCBdLCB0ZVsgMSBdLCB0ZVsgMiBdKTtcbiAgICAgICAgcGFuT2Zmc2V0Lm11bHRpcGx5U2NhbGFyKC1kaXN0YW5jZSk7XG5cbiAgICAgICAgcGFuLmFkZChwYW5PZmZzZXQpO1xuXG4gICAgfTtcblxuICAgIC8vIHBhc3MgaW4gZGlzdGFuY2UgaW4gd29ybGQgc3BhY2UgdG8gbW92ZSB1cFxuICAgIHRoaXMucGFuVXAgPSBmdW5jdGlvbiAoZGlzdGFuY2UpIHtcblxuICAgICAgICB2YXIgdGUgPSB0aGlzLm9iamVjdC5tYXRyaXguZWxlbWVudHM7XG5cbiAgICAgICAgLy8gZ2V0IFkgY29sdW1uIG9mIG1hdHJpeFxuICAgICAgICBwYW5PZmZzZXQuc2V0KHRlWyA0IF0sIHRlWyA1IF0sIHRlWyA2IF0pO1xuICAgICAgICBwYW5PZmZzZXQubXVsdGlwbHlTY2FsYXIoZGlzdGFuY2UpO1xuXG4gICAgICAgIHBhbi5hZGQocGFuT2Zmc2V0KTtcblxuICAgIH07XG5cbiAgICAvLyBwYXNzIGluIHgseSBvZiBjaGFuZ2UgZGVzaXJlZCBpbiBwaXhlbCBzcGFjZSxcbiAgICAvLyByaWdodCBhbmQgZG93biBhcmUgcG9zaXRpdmVcbiAgICB0aGlzLnBhbiA9IGZ1bmN0aW9uIChkZWx0YVgsIGRlbHRhWSkge1xuXG4gICAgICAgIHZhciBlbGVtZW50ID0gc2NvcGUuZG9tRWxlbWVudCA9PT0gZG9jdW1lbnQgPyBzY29wZS5kb21FbGVtZW50LmJvZHkgOiBzY29wZS5kb21FbGVtZW50O1xuXG4gICAgICAgIGlmIChzY29wZS5vYmplY3QuZm92ICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgLy8gcGVyc3BlY3RpdmVcbiAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IHNjb3BlLm9iamVjdC5wb3NpdGlvbjtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBwb3NpdGlvbi5jbG9uZSgpLnN1YihzY29wZS50YXJnZXQpO1xuICAgICAgICAgICAgdmFyIHRhcmdldERpc3RhbmNlID0gb2Zmc2V0Lmxlbmd0aCgpO1xuXG4gICAgICAgICAgICAvLyBoYWxmIG9mIHRoZSBmb3YgaXMgY2VudGVyIHRvIHRvcCBvZiBzY3JlZW5cbiAgICAgICAgICAgIHRhcmdldERpc3RhbmNlICo9IE1hdGgudGFuKCggc2NvcGUub2JqZWN0LmZvdiAvIDIgKSAqIE1hdGguUEkgLyAxODAuMCk7XG5cbiAgICAgICAgICAgIC8vIHdlIGFjdHVhbGx5IGRvbid0IHVzZSBzY3JlZW5XaWR0aCwgc2luY2UgcGVyc3BlY3RpdmUgY2FtZXJhIGlzIGZpeGVkIHRvIHNjcmVlbiBoZWlnaHRcbiAgICAgICAgICAgIHNjb3BlLnBhbkxlZnQoMiAqIGRlbHRhWCAqIHRhcmdldERpc3RhbmNlIC8gZWxlbWVudC5jbGllbnRIZWlnaHQpO1xuICAgICAgICAgICAgc2NvcGUucGFuVXAoMiAqIGRlbHRhWSAqIHRhcmdldERpc3RhbmNlIC8gZWxlbWVudC5jbGllbnRIZWlnaHQpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoc2NvcGUub2JqZWN0LnRvcCAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIC8vIG9ydGhvZ3JhcGhpY1xuICAgICAgICAgICAgc2NvcGUucGFuTGVmdChkZWx0YVggKiAoc2NvcGUub2JqZWN0LnJpZ2h0IC0gc2NvcGUub2JqZWN0LmxlZnQpIC8gZWxlbWVudC5jbGllbnRXaWR0aCk7XG4gICAgICAgICAgICBzY29wZS5wYW5VcChkZWx0YVkgKiAoc2NvcGUub2JqZWN0LnRvcCAtIHNjb3BlLm9iamVjdC5ib3R0b20pIC8gZWxlbWVudC5jbGllbnRIZWlnaHQpO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIGNhbWVyYSBuZWl0aGVyIG9ydGhvZ3JhcGhpYyBvciBwZXJzcGVjdGl2ZVxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdXQVJOSU5HOiBPcmJpdENvbnRyb2xzLmpzIGVuY291bnRlcmVkIGFuIHVua25vd24gY2FtZXJhIHR5cGUgLSBwYW4gZGlzYWJsZWQuJyk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIHRoaXMuZG9sbHlJbiA9IGZ1bmN0aW9uIChkb2xseVNjYWxlKSB7XG5cbiAgICAgICAgaWYgKGRvbGx5U2NhbGUgPT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICBkb2xseVNjYWxlID0gZ2V0Wm9vbVNjYWxlKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHNjYWxlIC89IGRvbGx5U2NhbGU7XG5cbiAgICB9O1xuXG4gICAgdGhpcy5kb2xseU91dCA9IGZ1bmN0aW9uIChkb2xseVNjYWxlKSB7XG5cbiAgICAgICAgaWYgKGRvbGx5U2NhbGUgPT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICBkb2xseVNjYWxlID0gZ2V0Wm9vbVNjYWxlKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHNjYWxlICo9IGRvbGx5U2NhbGU7XG5cbiAgICB9O1xuXG4gICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIHBvc2l0aW9uID0gdGhpcy5vYmplY3QucG9zaXRpb247XG5cbiAgICAgICAgb2Zmc2V0LmNvcHkocG9zaXRpb24pLnN1Yih0aGlzLnRhcmdldCk7XG5cbiAgICAgICAgLy8gcm90YXRlIG9mZnNldCB0byBcInktYXhpcy1pcy11cFwiIHNwYWNlXG4gICAgICAgIG9mZnNldC5hcHBseVF1YXRlcm5pb24ocXVhdCk7XG5cbiAgICAgICAgLy8gYW5nbGUgZnJvbSB6LWF4aXMgYXJvdW5kIHktYXhpc1xuXG4gICAgICAgIHZhciB0aGV0YSA9IE1hdGguYXRhbjIob2Zmc2V0LngsIG9mZnNldC56KTtcblxuICAgICAgICAvLyBhbmdsZSBmcm9tIHktYXhpc1xuXG4gICAgICAgIHZhciBwaGkgPSBNYXRoLmF0YW4yKE1hdGguc3FydChvZmZzZXQueCAqIG9mZnNldC54ICsgb2Zmc2V0LnogKiBvZmZzZXQueiksIG9mZnNldC55KTtcblxuICAgICAgICBpZiAodGhpcy5hdXRvUm90YXRlKSB7XG5cbiAgICAgICAgICAgIHRoaXMucm90YXRlTGVmdChnZXRBdXRvUm90YXRpb25BbmdsZSgpKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgdGhldGEgKz0gdGhldGFEZWx0YTtcbiAgICAgICAgcGhpICs9IHBoaURlbHRhO1xuXG4gICAgICAgIC8vIHJlc3RyaWN0IHBoaSB0byBiZSBiZXR3ZWVuIGRlc2lyZWQgbGltaXRzXG4gICAgICAgIHBoaSA9IE1hdGgubWF4KHRoaXMubWluUG9sYXJBbmdsZSwgTWF0aC5taW4odGhpcy5tYXhQb2xhckFuZ2xlLCBwaGkpKTtcblxuICAgICAgICAvLyByZXN0cmljdCBwaGkgdG8gYmUgYmV0d2VlIEVQUyBhbmQgUEktRVBTXG4gICAgICAgIHBoaSA9IE1hdGgubWF4KEVQUywgTWF0aC5taW4oTWF0aC5QSSAtIEVQUywgcGhpKSk7XG5cbiAgICAgICAgdmFyIHJhZGl1cyA9IG9mZnNldC5sZW5ndGgoKSAqIHNjYWxlO1xuXG4gICAgICAgIC8vIHJlc3RyaWN0IHJhZGl1cyB0byBiZSBiZXR3ZWVuIGRlc2lyZWQgbGltaXRzXG4gICAgICAgIHJhZGl1cyA9IE1hdGgubWF4KHRoaXMubWluRGlzdGFuY2UsIE1hdGgubWluKHRoaXMubWF4RGlzdGFuY2UsIHJhZGl1cykpO1xuXG4gICAgICAgIC8vIG1vdmUgdGFyZ2V0IHRvIHBhbm5lZCBsb2NhdGlvblxuICAgICAgICB0aGlzLnRhcmdldC5hZGQocGFuKTtcblxuICAgICAgICBvZmZzZXQueCA9IHJhZGl1cyAqIE1hdGguc2luKHBoaSkgKiBNYXRoLnNpbih0aGV0YSk7XG4gICAgICAgIG9mZnNldC55ID0gcmFkaXVzICogTWF0aC5jb3MocGhpKTtcbiAgICAgICAgb2Zmc2V0LnogPSByYWRpdXMgKiBNYXRoLnNpbihwaGkpICogTWF0aC5jb3ModGhldGEpO1xuXG4gICAgICAgIC8vIHJvdGF0ZSBvZmZzZXQgYmFjayB0byBcImNhbWVyYS11cC12ZWN0b3ItaXMtdXBcIiBzcGFjZVxuICAgICAgICBvZmZzZXQuYXBwbHlRdWF0ZXJuaW9uKHF1YXRJbnZlcnNlKTtcblxuICAgICAgICBwb3NpdGlvbi5jb3B5KHRoaXMudGFyZ2V0KS5hZGQob2Zmc2V0KTtcblxuICAgICAgICB0aGlzLm9iamVjdC5sb29rQXQodGhpcy50YXJnZXQpO1xuXG4gICAgICAgIHRoZXRhRGVsdGEgPSAwO1xuICAgICAgICBwaGlEZWx0YSA9IDA7XG4gICAgICAgIHNjYWxlID0gMTtcbiAgICAgICAgcGFuLnNldCgwLCAwLCAwKTtcblxuICAgICAgICAvLyB1cGRhdGUgY29uZGl0aW9uIGlzOlxuICAgICAgICAvLyBtaW4oY2FtZXJhIGRpc3BsYWNlbWVudCwgY2FtZXJhIHJvdGF0aW9uIGluIHJhZGlhbnMpXjIgPiBFUFNcbiAgICAgICAgLy8gdXNpbmcgc21hbGwtYW5nbGUgYXBwcm94aW1hdGlvbiBjb3MoeC8yKSA9IDEgLSB4XjIgLyA4XG5cbiAgICAgICAgaWYgKGxhc3RQb3NpdGlvbi5kaXN0YW5jZVRvU3F1YXJlZCh0aGlzLm9iamVjdC5wb3NpdGlvbikgPiBFUFNcbiAgICAgICAgICAgIHx8IDggKiAoMSAtIGxhc3RRdWF0ZXJuaW9uLmRvdCh0aGlzLm9iamVjdC5xdWF0ZXJuaW9uKSkgPiBFUFMpIHtcblxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGNoYW5nZUV2ZW50KTtcblxuICAgICAgICAgICAgbGFzdFBvc2l0aW9uLmNvcHkodGhpcy5vYmplY3QucG9zaXRpb24pO1xuICAgICAgICAgICAgbGFzdFF1YXRlcm5pb24uY29weSh0aGlzLm9iamVjdC5xdWF0ZXJuaW9uKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGVsZW1lbnQgPSBzY29wZS5kb21FbGVtZW50ID09PSBkb2N1bWVudCA/IHNjb3BlLmRvbUVsZW1lbnQuYm9keSA6IHNjb3BlLmRvbUVsZW1lbnQ7XG5cbiAgICAgICAgaWYgKGVsZW1lbnQuY2xpZW50V2lkdGggPiAwICYmIGVsZW1lbnQuY2xpZW50SGVpZ2h0ID4gMCkge1xuICAgICAgICAgICAgLy8gcm90YXRpbmcgYWNyb3NzIHdob2xlIHNjcmVlbiBnb2VzIDM2MCBkZWdyZWVzIGFyb3VuZFxuICAgICAgICAgICAgc2NvcGUucm90YXRlTGVmdCgyICogTWF0aC5QSSAqIHJvdGF0ZURlbHRhLnggLyBlbGVtZW50LmNsaWVudFdpZHRoICogc2NvcGUucm90YXRlU3BlZWQpO1xuXG4gICAgICAgICAgICAvLyByb3RhdGluZyB1cCBhbmQgZG93biBhbG9uZyB3aG9sZSBzY3JlZW4gYXR0ZW1wdHMgdG8gZ28gMzYwLCBidXQgbGltaXRlZCB0byAxODBcbiAgICAgICAgICAgIHNjb3BlLnJvdGF0ZVVwKDIgKiBNYXRoLlBJICogcm90YXRlRGVsdGEueSAvIGVsZW1lbnQuY2xpZW50SGVpZ2h0ICogc2NvcGUucm90YXRlU3BlZWQpO1xuXG4gICAgICAgICAgICByb3RhdGVEZWx0YS5tdWx0aXBseVNjYWxhcigwLjk5KVxuICAgICAgICB9XG5cbiAgICB9O1xuXG5cbiAgICB0aGlzLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHN0YXRlID0gU1RBVEUuTk9ORTtcblxuICAgICAgICB0aGlzLnRhcmdldC5jb3B5KHRoaXMudGFyZ2V0MCk7XG4gICAgICAgIHRoaXMub2JqZWN0LnBvc2l0aW9uLmNvcHkodGhpcy5wb3NpdGlvbjApO1xuXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0QXV0b1JvdGF0aW9uQW5nbGUoKSB7XG5cbiAgICAgICAgcmV0dXJuIDIgKiBNYXRoLlBJIC8gNjAgLyA2MCAqIHNjb3BlLmF1dG9Sb3RhdGVTcGVlZDtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFpvb21TY2FsZSgpIHtcblxuICAgICAgICByZXR1cm4gTWF0aC5wb3coMC45NSwgc2NvcGUuem9vbVNwZWVkKTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uTW91c2VEb3duKGV2ZW50KSB7XG5cbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKSByZXR1cm47XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKHNjb3BlLm5vUm90YXRlID09PSB0cnVlKSByZXR1cm47XG5cbiAgICAgICAgICAgIHN0YXRlID0gU1RBVEUuUk9UQVRFO1xuXG4gICAgICAgICAgICByb3RhdGVTdGFydC5zZXQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5idXR0b24gPT09IDEpIHtcbiAgICAgICAgICAgIGlmIChzY29wZS5ub1pvb20gPT09IHRydWUpIHJldHVybjtcblxuICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5ET0xMWTtcblxuICAgICAgICAgICAgZG9sbHlTdGFydC5zZXQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5idXR0b24gPT09IDIpIHtcbiAgICAgICAgICAgIGlmIChzY29wZS5ub1BhbiA9PT0gdHJ1ZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBzdGF0ZSA9IFNUQVRFLlBBTjtcblxuICAgICAgICAgICAgcGFuU3RhcnQuc2V0KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwLCBmYWxzZSk7XG4gICAgICAgIHNjb3BlLmRpc3BhdGNoRXZlbnQoc3RhcnRFdmVudCk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuXG4gICAgICAgIGlmIChzY29wZS5lbmFibGVkID09PSBmYWxzZSkgcmV0dXJuO1xuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdmFyIGVsZW1lbnQgPSBzY29wZS5kb21FbGVtZW50ID09PSBkb2N1bWVudCA/IHNjb3BlLmRvbUVsZW1lbnQuYm9keSA6IHNjb3BlLmRvbUVsZW1lbnQ7XG5cbiAgICAgICAgaWYgKHN0YXRlID09PSBTVEFURS5ST1RBVEUpIHtcblxuICAgICAgICAgICAgaWYgKHNjb3BlLm5vUm90YXRlID09PSB0cnVlKSByZXR1cm47XG5cbiAgICAgICAgICAgIHJvdGF0ZUVuZC5zZXQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG4gICAgICAgICAgICByb3RhdGVEZWx0YS5zdWJWZWN0b3JzKHJvdGF0ZUVuZCwgcm90YXRlU3RhcnQpO1xuXG4gICAgICAgICAgICAvLyByb3RhdGluZyBhY3Jvc3Mgd2hvbGUgc2NyZWVuIGdvZXMgMzYwIGRlZ3JlZXMgYXJvdW5kXG4gICAgICAgICAgICBzY29wZS5yb3RhdGVMZWZ0KDIgKiBNYXRoLlBJICogcm90YXRlRGVsdGEueCAvIGVsZW1lbnQuY2xpZW50V2lkdGggKiBzY29wZS5yb3RhdGVTcGVlZCk7XG5cbiAgICAgICAgICAgIC8vIHJvdGF0aW5nIHVwIGFuZCBkb3duIGFsb25nIHdob2xlIHNjcmVlbiBhdHRlbXB0cyB0byBnbyAzNjAsIGJ1dCBsaW1pdGVkIHRvIDE4MFxuICAgICAgICAgICAgc2NvcGUucm90YXRlVXAoMiAqIE1hdGguUEkgKiByb3RhdGVEZWx0YS55IC8gZWxlbWVudC5jbGllbnRIZWlnaHQgKiBzY29wZS5yb3RhdGVTcGVlZCk7XG5cbiAgICAgICAgICAgIHJvdGF0ZVN0YXJ0LmNvcHkocm90YXRlRW5kKTtcblxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBTVEFURS5ET0xMWSkge1xuXG4gICAgICAgICAgICBpZiAoc2NvcGUubm9ab29tID09PSB0cnVlKSByZXR1cm47XG5cbiAgICAgICAgICAgIGRvbGx5RW5kLnNldChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcbiAgICAgICAgICAgIGRvbGx5RGVsdGEuc3ViVmVjdG9ycyhkb2xseUVuZCwgZG9sbHlTdGFydCk7XG5cbiAgICAgICAgICAgIGlmIChkb2xseURlbHRhLnkgPiAwKSB7XG5cbiAgICAgICAgICAgICAgICBzY29wZS5kb2xseUluKCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBzY29wZS5kb2xseU91dCgpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvbGx5U3RhcnQuY29weShkb2xseUVuZCk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gU1RBVEUuUEFOKSB7XG5cbiAgICAgICAgICAgIGlmIChzY29wZS5ub1BhbiA9PT0gdHJ1ZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBwYW5FbmQuc2V0KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuICAgICAgICAgICAgcGFuRGVsdGEuc3ViVmVjdG9ycyhwYW5FbmQsIHBhblN0YXJ0KTtcblxuICAgICAgICAgICAgc2NvcGUucGFuKHBhbkRlbHRhLngsIHBhbkRlbHRhLnkpO1xuXG4gICAgICAgICAgICBwYW5TdGFydC5jb3B5KHBhbkVuZCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHNjb3BlLnVwZGF0ZSgpO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Nb3VzZVVwKC8qIGV2ZW50ICovKSB7XG5cbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKSByZXR1cm47XG5cbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUsIGZhbHNlKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCwgZmFsc2UpO1xuICAgICAgICBzY29wZS5kaXNwYXRjaEV2ZW50KGVuZEV2ZW50KTtcbiAgICAgICAgc3RhdGUgPSBTVEFURS5OT05FO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Nb3VzZVdoZWVsKGV2ZW50KSB7XG5cbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlIHx8IHNjb3BlLm5vWm9vbSA9PT0gdHJ1ZSkgcmV0dXJuO1xuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHZhciBkZWx0YSA9IDA7XG5cbiAgICAgICAgaWYgKGV2ZW50LndoZWVsRGVsdGEgIT09IHVuZGVmaW5lZCkgeyAvLyBXZWJLaXQgLyBPcGVyYSAvIEV4cGxvcmVyIDlcblxuICAgICAgICAgICAgZGVsdGEgPSBldmVudC53aGVlbERlbHRhO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuZGV0YWlsICE9PSB1bmRlZmluZWQpIHsgLy8gRmlyZWZveFxuXG4gICAgICAgICAgICBkZWx0YSA9IC1ldmVudC5kZXRhaWw7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkZWx0YSA+IDApIHtcblxuICAgICAgICAgICAgc2NvcGUuZG9sbHlPdXQoKTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBzY29wZS5kb2xseUluKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHNjb3BlLnVwZGF0ZSgpO1xuICAgICAgICBzY29wZS5kaXNwYXRjaEV2ZW50KHN0YXJ0RXZlbnQpO1xuICAgICAgICBzY29wZS5kaXNwYXRjaEV2ZW50KGVuZEV2ZW50KTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uS2V5RG93bihldmVudCkge1xuXG4gICAgICAgIGlmIChzY29wZS5lbmFibGVkID09PSBmYWxzZSB8fCBzY29wZS5ub0tleXMgPT09IHRydWUgfHwgc2NvcGUubm9QYW4gPT09IHRydWUpIHJldHVybjtcblxuICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcblxuICAgICAgICAgICAgY2FzZSBzY29wZS5rZXlzLlVQOlxuICAgICAgICAgICAgICAgIHNjb3BlLnBhbigwLCBzY29wZS5rZXlQYW5TcGVlZCk7XG4gICAgICAgICAgICAgICAgc2NvcGUudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2Ugc2NvcGUua2V5cy5CT1RUT006XG4gICAgICAgICAgICAgICAgc2NvcGUucGFuKDAsIC1zY29wZS5rZXlQYW5TcGVlZCk7XG4gICAgICAgICAgICAgICAgc2NvcGUudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2Ugc2NvcGUua2V5cy5MRUZUOlxuICAgICAgICAgICAgICAgIHNjb3BlLnBhbihzY29wZS5rZXlQYW5TcGVlZCwgMCk7XG4gICAgICAgICAgICAgICAgc2NvcGUudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2Ugc2NvcGUua2V5cy5SSUdIVDpcbiAgICAgICAgICAgICAgICBzY29wZS5wYW4oLXNjb3BlLmtleVBhblNwZWVkLCAwKTtcbiAgICAgICAgICAgICAgICBzY29wZS51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b3VjaHN0YXJ0KGV2ZW50KSB7XG5cbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKSByZXR1cm47XG5cbiAgICAgICAgc3dpdGNoIChldmVudC50b3VjaGVzLmxlbmd0aCkge1xuXG4gICAgICAgICAgICBjYXNlIDE6XHQvLyBvbmUtZmluZ2VyZWQgdG91Y2g6IHJvdGF0ZVxuXG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLm5vUm90YXRlID09PSB0cnVlKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICBzdGF0ZSA9IFNUQVRFLlRPVUNIX1JPVEFURTtcblxuICAgICAgICAgICAgICAgIHJvdGF0ZVN0YXJ0LnNldChldmVudC50b3VjaGVzWyAwIF0ucGFnZVgsIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMjpcdC8vIHR3by1maW5nZXJlZCB0b3VjaDogZG9sbHlcblxuICAgICAgICAgICAgICAgIGlmIChzY29wZS5ub1pvb20gPT09IHRydWUpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHN0YXRlID0gU1RBVEUuVE9VQ0hfRE9MTFk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZHggPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggLSBldmVudC50b3VjaGVzWyAxIF0ucGFnZVg7XG4gICAgICAgICAgICAgICAgdmFyIGR5ID0gZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VZIC0gZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VZO1xuICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gICAgICAgICAgICAgICAgZG9sbHlTdGFydC5zZXQoMCwgZGlzdGFuY2UpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDM6IC8vIHRocmVlLWZpbmdlcmVkIHRvdWNoOiBwYW5cblxuICAgICAgICAgICAgICAgIGlmIChzY29wZS5ub1BhbiA9PT0gdHJ1ZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5UT1VDSF9QQU47XG5cbiAgICAgICAgICAgICAgICBwYW5TdGFydC5zZXQoZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYLCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuXG4gICAgICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5OT05FO1xuXG4gICAgICAgIH1cblxuICAgICAgICBzY29wZS5kaXNwYXRjaEV2ZW50KHN0YXJ0RXZlbnQpO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG91Y2htb3ZlKGV2ZW50KSB7XG5cbiAgICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKSByZXR1cm47XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgdmFyIGVsZW1lbnQgPSBzY29wZS5kb21FbGVtZW50ID09PSBkb2N1bWVudCA/IHNjb3BlLmRvbUVsZW1lbnQuYm9keSA6IHNjb3BlLmRvbUVsZW1lbnQ7XG5cbiAgICAgICAgc3dpdGNoIChldmVudC50b3VjaGVzLmxlbmd0aCkge1xuXG4gICAgICAgICAgICBjYXNlIDE6IC8vIG9uZS1maW5nZXJlZCB0b3VjaDogcm90YXRlXG5cbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUubm9Sb3RhdGUgPT09IHRydWUpIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgIT09IFNUQVRFLlRPVUNIX1JPVEFURSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgcm90YXRlRW5kLnNldChldmVudC50b3VjaGVzWyAwIF0ucGFnZVgsIGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSk7XG4gICAgICAgICAgICAgICAgcm90YXRlRGVsdGEuc3ViVmVjdG9ycyhyb3RhdGVFbmQsIHJvdGF0ZVN0YXJ0KTtcblxuICAgICAgICAgICAgICAgIC8vIHJvdGF0aW5nIGFjcm9zcyB3aG9sZSBzY3JlZW4gZ29lcyAzNjAgZGVncmVlcyBhcm91bmRcbiAgICAgICAgICAgICAgICBzY29wZS5yb3RhdGVMZWZ0KDIgKiBNYXRoLlBJICogcm90YXRlRGVsdGEueCAvIGVsZW1lbnQuY2xpZW50V2lkdGggKiBzY29wZS5yb3RhdGVTcGVlZCk7XG4gICAgICAgICAgICAgICAgLy8gcm90YXRpbmcgdXAgYW5kIGRvd24gYWxvbmcgd2hvbGUgc2NyZWVuIGF0dGVtcHRzIHRvIGdvIDM2MCwgYnV0IGxpbWl0ZWQgdG8gMTgwXG4gICAgICAgICAgICAgICAgc2NvcGUucm90YXRlVXAoMiAqIE1hdGguUEkgKiByb3RhdGVEZWx0YS55IC8gZWxlbWVudC5jbGllbnRIZWlnaHQgKiBzY29wZS5yb3RhdGVTcGVlZCk7XG5cbiAgICAgICAgICAgICAgICByb3RhdGVTdGFydC5jb3B5KHJvdGF0ZUVuZCk7XG5cbiAgICAgICAgICAgICAgICBzY29wZS51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAyOiAvLyB0d28tZmluZ2VyZWQgdG91Y2g6IGRvbGx5XG5cbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUubm9ab29tID09PSB0cnVlKSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlICE9PSBTVEFURS5UT1VDSF9ET0xMWSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgdmFyIGR4ID0gZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYIC0gZXZlbnQudG91Y2hlc1sgMSBdLnBhZ2VYO1xuICAgICAgICAgICAgICAgIHZhciBkeSA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSAtIGV2ZW50LnRvdWNoZXNbIDEgXS5wYWdlWTtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuXG4gICAgICAgICAgICAgICAgZG9sbHlFbmQuc2V0KDAsIGRpc3RhbmNlKTtcbiAgICAgICAgICAgICAgICBkb2xseURlbHRhLnN1YlZlY3RvcnMoZG9sbHlFbmQsIGRvbGx5U3RhcnQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRvbGx5RGVsdGEueSA+IDApIHtcblxuICAgICAgICAgICAgICAgICAgICBzY29wZS5kb2xseU91dCgpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICBzY29wZS5kb2xseUluKCk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkb2xseVN0YXJ0LmNvcHkoZG9sbHlFbmQpO1xuXG4gICAgICAgICAgICAgICAgc2NvcGUudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMzogLy8gdGhyZWUtZmluZ2VyZWQgdG91Y2g6IHBhblxuXG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLm5vUGFuID09PSB0cnVlKSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlICE9PSBTVEFURS5UT1VDSF9QQU4pIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHBhbkVuZC5zZXQoZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYLCBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkpO1xuICAgICAgICAgICAgICAgIHBhbkRlbHRhLnN1YlZlY3RvcnMocGFuRW5kLCBwYW5TdGFydCk7XG5cbiAgICAgICAgICAgICAgICBzY29wZS5wYW4ocGFuRGVsdGEueCwgcGFuRGVsdGEueSk7XG5cbiAgICAgICAgICAgICAgICBwYW5TdGFydC5jb3B5KHBhbkVuZCk7XG5cbiAgICAgICAgICAgICAgICBzY29wZS51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcblxuICAgICAgICAgICAgICAgIHN0YXRlID0gU1RBVEUuTk9ORTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b3VjaGVuZCgvKiBldmVudCAqLykge1xuXG4gICAgICAgIGlmIChzY29wZS5lbmFibGVkID09PSBmYWxzZSkgcmV0dXJuO1xuXG4gICAgICAgIHNjb3BlLmRpc3BhdGNoRXZlbnQoZW5kRXZlbnQpO1xuICAgICAgICBzdGF0ZSA9IFNUQVRFLk5PTkU7XG5cbiAgICB9XG5cbiAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duLCBmYWxzZSk7XG4gICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNld2hlZWwnLCBvbk1vdXNlV2hlZWwsIGZhbHNlKTtcbiAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLCBvbk1vdXNlV2hlZWwsIGZhbHNlKTsgLy8gZmlyZWZveFxuXG4gICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0b3VjaHN0YXJ0LCBmYWxzZSk7XG4gICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdG91Y2hlbmQsIGZhbHNlKTtcbiAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdG91Y2htb3ZlLCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5RG93biwgZmFsc2UpO1xuXG4gICAgLy8gZm9yY2UgYW4gdXBkYXRlIGF0IHN0YXJ0XG4gICAgdGhpcy51cGRhdGUoKTtcblxufTtcblxuVEhSRUUuT3JiaXRDb250cm9scy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFRIUkVFLkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgd2luZG93LlF1ZXVlID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gUXVldWUoKSB7XG4gICAgICAgICAgICB0aGlzLnRhaWwgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuaGVhZCA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB0aGlzLm9mZnNldCA9IDA7XG4gICAgICAgICAgICAvLyBMb2NrIHRoZSBvYmplY3QgZG93blxuICAgICAgICAgICAgT2JqZWN0LnNlYWwodGhpcyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgUXVldWUucHJvdG90eXBlLnNoaWZ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMub2Zmc2V0ID09PSB0aGlzLmhlYWQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRtcCA9IHRoaXMuaGVhZDtcbiAgICAgICAgICAgICAgICB0bXAubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWQgPSB0aGlzLnRhaWw7XG4gICAgICAgICAgICAgICAgdGhpcy50YWlsID0gdG1wO1xuICAgICAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gMDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWFkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVhZFt0aGlzLm9mZnNldCsrXTtcbiAgICAgICAgfTtcblxuICAgICAgICBRdWV1ZS5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50YWlsLnB1c2goaXRlbSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgUXVldWUucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhlYWQubGVuZ3RoIC0gdGhpcy5vZmZzZXQgKyB0aGlzLnRhaWwubGVuZ3RoO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBRdWV1ZTtcbiAgICB9KSgpO1xufSkuY2FsbCh0aGlzKSJdfQ==
