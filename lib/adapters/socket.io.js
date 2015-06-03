var util = require('util');
var io = require('socket.io-client');
var Adapter = require('../adapter');

module.exports = SocketIO;

util.inherits(SocketIO, Adapter);

function SocketIO(url, opts) {
  this.socket = null;
  Adapter.call(this, url, opts);
}

SocketIO.prototype.connect = function() {
  var self = this;
  var upgrade = Math.random() > this.opts.pollingRate;
  var socket = this.socket = io(this.url, {
    forceNew: true,
    reconnect: false,
    upgrade: upgrade
  });

  socket.on('connect', onConnect);
  socket.on('connect_error', onError);
  socket.on('connect_timeout', onError);

  function onConnect() {
    cleanup();

    if (upgrade) {
      socket.io.engine
        .on('upgrade', onUpgrade)
        .on('upgradeError', onError);
    } else {
      self.onConnect();
    }
  }

  function onUpgrade() {
    cleanup();
    self.onConnect();
  }

  function onError(err) {
    cleanup();
    socket.disconnect();
    self.onConnectError(err);
  }

  function cleanup() {
    socket
      .off('connect', onConnect)
      .off('connect_error', onError)
      .off('connect_timeout', onError);

    socket.io.engine
      .off('upgrade', onUpgrade)
      .off('upgradeError', onError);
  }
};

SocketIO.prototype.disconnect = function() {
  this.socket.disconnect();
};

SocketIO.prototype.send = function(data, callback) {
  if (!callback) {
    data = Buffer.concat([new Buffer(2), data], data.length + 2);
    data.writeUInt16BE(0, 0);
    this.socket.send(data);
    return;
  }

  var socket = this.socket;
  socket.ackId = socket.ackId || 0;
  if (socket.ackId >= 0xffff) {
    socket.ackId = 0;
  }

  socket.ackId++;
  var ackId = socket.ackId;

  data = Buffer.concat([new Buffer(2), data], data.length + 2);
  data.writeUInt16BE(ackId, 0);
  socket.send(data);
  socket.on('message', onAck);

  function onAck(data) {
    if (data.readUInt16BE(0) !== ackId) return;

    socket.off('message', onAck);
    callback();
  }
};

SocketIO.prototype.onConnect = function() {
  this.socket.on('disconnect', this.onDisconnect.bind(this));
  this.socket.on('error', this.onError.bind(this));

  Adapter.prototype.onConnect.call(this);
};
