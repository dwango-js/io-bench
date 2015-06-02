var util = require('util');
var WS = require('ws');
var Adapter = require('../adapter');

module.exports = WebSocket;

util.inherits(WebSocket, Adapter);

function WebSocket(url, opts) {
  this.socket = null;
  Adapter.call(this, url, opts);
}

WebSocket.prototype.connect = function() {
  var self = this;
  var socket = this.socket = new WS(this.url);

  socket.on('open', onConnect);
  socket.on('error', onError);

  function onConnect() {
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
      .removeListener('open', onConnect)
      .removeListener('error', onError);
  }
};

WebSocket.prototype.disconnect = function() {
  this.socket.close();
};

WebSocket.prototype.send = function(data, callback) {
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

WebSocket.prototype.onConnect = function() {
  this.socket.on('close', this.onDisconnect.bind(this));
  this.socket.on('error', this.onError.bind(this));

  Adapter.prototype.onConnect.call(this);
};
