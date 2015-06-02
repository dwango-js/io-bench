var util = require('util');
var eio = require('engine.io-client');
var Adapter = require('../adapter');

module.exports = EngineIO;

util.inherits(EngineIO, Adapter);

function EngineIO(url, opts) {
  this.socket = null;
  Adapter.call(this, url, opts);
}

EngineIO.prototype.connect = function() {
  var self = this;
  var upgrade = Math.random() > this.opts.pollingRate;
  var socket = this.socket = eio(this.url, { upgrade: upgrade });

  socket.on('open', onConnect);
  socket.on('error', onError);

  function onConnect() {
    cleanup();

    if (upgrade) {
      socket
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
    socket.close();
    self.onConnectError(err);
  }

  function cleanup() {
    socket
      .off('open', onConnect)
      .off('error', onError)
      .off('upgrade', onUpgrade)
      .off('upgradeError', onError);
  }
};

EngineIO.prototype.disconnect = function() {
  this.socket.close();
};

EngineIO.prototype.send = function(data, callback) {
  if (!callback) {
    data = Buffer.concat([new Buffer(2), data], data.length + 2);
    data.writeUInt16BE(0, 0);
    this.socket.send(data);
    return;
  }

  var socket = this.socket;
  socket.ack = socket.ack || 0;
  if (socket.ack >= 0xffff) {
    socket.ack = 0;
  }

  socket.ack++;
  var ack = socket.ack;

  data = Buffer.concat([new Buffer(2), data], data.length + 2);
  data.writeUInt16BE(ack, 0);
  socket.send(data);
  socket.on('message', onAck);

  function onAck(data) {
    if (data.readUInt16BE(0) !== ack) return;

    socket.removeListener('message', onAck);
    callback();
  }
};

EngineIO.prototype.onConnect = function() {
  this.socket.on('close', this.onDisconnect.bind(this));
  this.socket.on('error', this.onError.bind(this));

  Adapter.prototype.onConnect.call(this);
};
