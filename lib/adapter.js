var util = require('util');
var EventEmitter = require('events').EventEmitter;

module.exports = Adapter;

util.inherits(Adapter, EventEmitter);

function Adapter(url, opts) {
  EventEmitter.call(this);

  this.url = url;
  this.opts = opts || {};
  this.connect();
}

Adapter.prototype.connect = function() {};

Adapter.prototype.disconnect = function() {};

Adapter.prototype.send = function(data, callback) {};

Adapter.prototype.onConnect = function() {
  this.emit('connect');
};

Adapter.prototype.onDisconnect = function() {
  this.emit('disconnect');
};

Adapter.prototype.onConnectError = function(err) {
  this.emit('connect_error', err);
};

Adapter.prototype.onError = function(err) {
  this.emit('error', err);
};
