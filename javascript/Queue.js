(function() {
window.Queue = (function() {
  function Queue() {
    this.tail = [];
    this.head = Array.prototype.slice.call(arguments);
    this.offset = 0;
    // Lock the object down
    Object.seal(this);
  };

  Queue.prototype.shift = function() {
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

  Queue.prototype.push = function(item) {
    return this.tail.push(item);
  };

  Queue.prototype.length = function() {
    return this.head.length - this.offset + this.tail.length;
  };

  return Queue;
})();
}).call(this)