
// adopted from chrisdickinson/raf

module.exports = AnimationFrame

function AnimationFrame(frameRate) {
  this._frameRate = frameRate;
  this._frameDuration = 1000 / frameRate;
  this._last = 0;
  this._id = 0;
  this._queue = [];
}

AnimationFrame.prototype.request = function request(callback) {
  if (this._queue.length === 0) {
    var now = Date.now();
    var next = this._frameDuration - (now - this._last);
    next = next > 0 ? next : 0;
    this._last = now + next;
    var self = this;

    setTimeout(function() {
      var cp = self._queue.slice(0);
      self._queue.length = 0;
      for (var i = 0, len = cp.length; i < len; i++) {
        var request = cp[i];
        if (request.cancelled) continue;

        try {
          cp[i].callback(self._last);
        } catch (e) {
          process.nextTick(function() {
            throw e;
          });
        }
      }
    }, Math.round(next));
  }

  this._queue.push({
    handle: ++this._id,
    callback: callback,
    cancelled: false
  });

  return this._id;
};

AnimationFrame.prototype.cancel = function cancel(handle) {
  var queue = this._queue;
  for (var i = 0, len = queue.length; i < len; i++) {
    var request = queue[i];
    if (request.handle === handle) {
      request.cancelled = true;
    }
  }
};
