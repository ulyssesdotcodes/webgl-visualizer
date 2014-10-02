// Generated by CoffeeScript 1.8.0
(function() {
  window.CubeDancer = (function() {
    function CubeDancer(dance, danceMaterial) {
      var geometry, material;
      geometry = new THREE.BoxGeometry(1, 1, 1);
      material = danceMaterial.material;
      this.body = new THREE.Mesh(geometry, material);
      this.body.position = new THREE.Vector3(0, 0, 0);
      this.dance = dance;
      this.danceMaterial = danceMaterial;
    }

    CubeDancer.prototype.update = function(audioWindow) {
      this.dance.update(audioWindow, this);
      return this.danceMaterial.update(audioWindow, this);
    };

    return CubeDancer;

  })();

}).call(this);