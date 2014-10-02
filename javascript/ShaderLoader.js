// Generated by CoffeeScript 1.8.0
(function() {
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
        return this.loadFromUrl(name, '/shaders/' + name, next);
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

}).call(this);