// Generated by CoffeeScript 1.8.0
(function() {
  window.SimpleFrequencyShader = (function() {
    function SimpleFrequencyShader(shaderLoader) {
      this.target = 128;
      this.size = 1024;
      this.shaderLoader = shaderLoader;
      this.newTexArray = new Uint8Array(this.target * this.target * 4);
    }

    SimpleFrequencyShader.prototype.loadShader = function(audioWindow, next) {
      return this.shaderLoader.load('simple_frequency', (function(_this) {
        return function(shader) {
          shader.uniforms = {
            freqTexture: {
              type: "t",
              value: _this.reduceArray(audioWindow.frequencyBuffer)
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

}).call(this);
